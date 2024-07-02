import { Injectable } from '@angular/core';
import {
  setOptions,
  MbscEventcalendarView,
  MbscCalendarEvent,
  localeEs,
  MbscEventcalendarOptions,
} from '@mobiscroll/angular';

import { HttpService } from './http.service';
import { AuthenticationService } from './authentication.service';
import {
  ApiCalendarEvent,
  DataJsonEvents,
  TopLevel,
} from '../interfaces/Calendar';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  myEvents: TopLevel[] = [];
  view = 'month';
  calView: MbscEventcalendarView = {
    calendar: {
      type: 'month',
      labels: false,
      popover: true,
      popoverClass: 'custom-event-popover',
    },
    agenda: { type: 'month' },
  };

  constructor(private httpService: HttpService, private authenticationService: AuthenticationService,private toastService:ToastService) { }

  async getProjects(userid: number): Promise<any[]> {
    const observableResult = await this.httpService.get(`tasks/${userid}/tasks`, true);
    return new Promise((resolve, reject) => {
      observableResult.subscribe(
        (response: any) => {
          let tasksEvents = [];
          if (response.tasks) {
            tasksEvents = response.tasks.map((apiEvent: any) => {
              const localDate = new Date(apiEvent.start_date);
              localDate.setDate(localDate.getDate() + 1);
              return {
                start: localDate,
                end: localDate,
                title: `${apiEvent.company} - ${apiEvent.subsidiary_id}`,
                description: `Trampa: ${apiEvent.name}`,
                id: apiEvent.userid,
                project_id: apiEvent.id,
                rel_type: 'project',
                color: 'green',
              };
            });
          }

          if (response.tasks_uv) {
            const tasksUv = response.tasks_uv.map((apiEvent: any) => {
              const localDate = new Date(apiEvent.startdate);
              localDate.setDate(localDate.getDate() + 1);
              return {
                start: localDate,
                end: localDate,
                title: `${apiEvent.name} - ${apiEvent.subsidiary_id}`,
                description: `${apiEvent.name}`,
                id: apiEvent.rel_id,
                project_id: apiEvent.id,
                rel_type: 'task_uv',
                color: 'purple',
              };
            });
            tasksEvents = tasksEvents.concat(tasksUv);
          }

          if (response.tasks_sup) {
            const tasksSup = response.tasks_sup.map((apiEvent: any) => {
              const localDate = new Date(apiEvent.startdate);
              localDate.setDate(localDate.getDate() + 1);
              return {
                start: localDate,
                end: localDate,
                title: `${apiEvent.name} - ${apiEvent.subsidiary_id}`,
                description: `${apiEvent.name}`,
                id: apiEvent.rel_id,
                project_id: apiEvent.id,
                rel_type: 'task_sup',
                color: 'red',
              };
            });
            tasksEvents = tasksEvents.concat(tasksSup);
          }

          this.myEvents = tasksEvents;
          resolve(this.myEvents);
        },
        (error: any) => {
          this.toastService.presentToast('No se pudieron obtener los planes')
          console.error('Error al enviar datos:', error);
          reject(error);
        }
      );
    });
  } catch(error:any) {
    this.toastService.presentToast('Error al realizar la solicitud de calendar')
    console.error('Error al realizar la solicitud de calendar:', error);
    throw error;
  }
}
