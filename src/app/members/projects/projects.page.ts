import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

import { ProjectsService } from './../../services/projects.service';
import { AuthenticationService } from './../../services/authentication.service';
import { LoggedData } from './../../interfaces/Auth';
import { Event } from 'src/app/interfaces/Projects';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
})
export class ProjectsPage implements OnInit {
  userdata: LoggedData = { email: '', firstname: '', lastname: '', staffid: 0 }
  myEvents: Event[] = [];
  currentEvent: any[] = [];

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
        this.handleEventClick(this.currentEvent);
      },
    },
  ];
  calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, listPlugin],
    initialView: 'listMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,listMonth'
    },
    eventClick: this.presentAlert.bind(this),
    events: [] as Event[]
  };
  constructor(private projectsService: ProjectsService, private authenticationService: AuthenticationService, private alertController: AlertController,) { }

  async ngOnInit() {
    this.userdata = await this.authenticationService.getLoggedData()
    this.myEvents = await this.projectsService.getProjects(this.userdata.staffid)
    this.calendarOptions.events = this.myEvents;
  }

  async presentAlert(event: any) {
    const alert = await this.alertController.create({
      header: `Desea iniciar el plan de trabajo?`,
      buttons: this.alertButtons,
    });
    this.currentEvent = event.event;

    await alert.present();
  }

  async handleEventClick(event: any) {
    await this.projectsService.verifyIfActivityIsEnable(event.extendedProps.rel_type, event.extendedProps.project_id)
  }

}
