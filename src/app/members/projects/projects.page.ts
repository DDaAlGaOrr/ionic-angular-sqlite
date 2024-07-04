import { Component, OnInit } from '@angular/core';
import {
  setOptions,
  MbscEventcalendarView,
  MbscCalendarEvent,
  localeEs,
  MbscEventcalendarOptions,
} from '@mobiscroll/angular';
import { AlertController } from '@ionic/angular';

import { ProjectsService } from './../../services/projects.service';
import { AuthenticationService } from './../../services/authentication.service';
import { LoggedData } from './../../interfaces/Auth';
import { TopLevel } from './../../interfaces/Calendar';

setOptions({
  locale: localeEs,
  theme: 'ios',
  themeVariant: 'light',
  clickToCreate: false,
  dragToCreate: false,
  dragToMove: false,
  dragToResize: false,
  eventDelete: false,
});

@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
  
})
export class ProjectsPage implements OnInit {
  userdata: LoggedData = { email: '', firstname: '', lastname: '', staffid: 0 }
  selectedSegment: 'agenda' | 'incidencia' = 'agenda';
  myEvents: TopLevel[] = [];
  currentEvent: any[] = [];
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
  public alertButtons = [
    {
      text: 'Cancelar',
      cssClass: 'alert-button-cancel',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'Iniciar',
      cssClass: 'alert-button-confirm',
      role: 'confirm',
      handler: () => {
        this.linkIncident(this.currentEvent);
      },
    },
  ];

  constructor(private projectsService: ProjectsService, private authenticationService: AuthenticationService, private alertController: AlertController,) { }

  async ngOnInit() {
    this.userdata = await this.authenticationService.getLoggedData()
    this.myEvents = await this.projectsService.getProjects(this.userdata.staffid)
  }

  async presentAlert(event: any) {
    const alert = await this.alertController.create({
      header: `Desea iniciar el plan de trabajo ?`,
      buttons: this.alertButtons,
    });
    this.currentEvent = event;

    await alert.present();
  }

  changeView(): void {
    setTimeout(() => {
      switch (this.view) {
        case 'month':
          this.calView = {
            calendar: { type: 'month' },
            agenda: { type: 'month' },
          };
          break;
        case 'week':
          this.calView = {
            calendar: { type: 'week' },
            agenda: { type: 'week' },
          };
          break;
      }
    });
  }

  async linkIncident(event: any) {
    await this.projectsService.verifyIfActivityIsEnable(event, event.event.rel_type, event.event.project_id)
  }

}
