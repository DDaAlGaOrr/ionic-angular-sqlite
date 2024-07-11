import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';


import { HttpService } from './http.service';
import { AuthenticationService } from './authentication.service';
import { Event } from '../interfaces/Projects';


import { ToastService } from './toast.service';
import { ProjectProgressService } from './project-progress.service';
import { LoaderService } from './loader.service';
import { NetworkService } from './network.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  view = 'month';


  constructor(
    private httpService: HttpService,
    private authenticationService: AuthenticationService,
    private toastService: ToastService,
    private projectProgressService: ProjectProgressService,
    private router: Router,
    private loaderService: LoaderService,
    private networkService: NetworkService,
    private storage: Storage
  ) { }

  async getProjects(userid: number): Promise<Event[]> {
    if (this.networkService.getNetworkStatus()) {
      return await this.getNetworkProjects(userid)
    } else {
      return await this.getOfflineProjects(userid)
    }
  }

  async getNetworkProjects(userid: number): Promise<Event[]> {
    try {
      this.loaderService.show();
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
            resolve(tasksEvents);
          },
          (error: any) => {
            this.toastService.presentToast('No se pudieron obtener los planes')
            console.error('Error al enviar datos:', error);
            reject(error);
          }
        );
      });
    } catch (error: any) {
      this.toastService.presentToast('Error al realizar la solicitud de calendar')
      console.error('Error al realizar la solicitud de calendar:', error);
      throw error;
    }
    finally {
      this.loaderService.hide();  // Ocultamos el loader al finalizar
    }
  }

  async getOfflineProjects(userid: number) {
    const response = await this.storage.get('projects')
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
    return tasksEvents;
  }

  async verifyIfActivityIsEnable(type: string, project_id: number): Promise<any> {
    if (type === 'project') {
      try {
        const observableResult = await this.httpService.get(`staffs/${project_id}/documentalChecklist`, true);
        return new Promise((resolve, reject) => {
          observableResult.subscribe(
            (response: any) => {
              if (response.items) {
                this.router.navigate(['/members', 'project'], {
                  queryParams: {
                    project_id: project_id,
                    type: type,
                    is_active: false,
                  },
                });
                resolve(true)
              } else {
                this.toastService.presentToast('Plan de trabajo ya finalizado')
                resolve(false)
              }
            },
            (error: any) => {
              this.toastService.presentToast('Algo salió mal')
              console.error('Error al enviar datos:', error);
              reject(error);
            })
        })
      } catch (error) {
        this.toastService.presentToast('Algo salió mal')
        console.error('Error al enviar datos:', error);
        throw error;
      }
    } else {
      try {
        const observableResult = await this.httpService.get(`staffs/${project_id}/taskCompleted`, true)
        return new Promise((resolve, reject) => {
          observableResult.subscribe(
            (response: any) => {
              if (response) {
                this.router.navigate(['/members', 'project'], {
                  queryParams: {
                    project_id: project_id,
                    type: type,
                    is_active: false,
                  },
                });
              } else {
                this.toastService.presentToast('tarea ya finalizada');
              }
            },
            (error: any) => {
              this.toastService.presentToast('Algo salió mal')
              console.error('Error al enviar datos:', error);
              reject(error);
            }
          )
        })
      } catch (error) {
        this.toastService.presentToast('Algo salió mal')
        console.error('Error al enviar datos:', error);
        throw error;
      }
    }
  }



}

