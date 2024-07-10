import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

import { LoggedData } from './../../interfaces/Auth';
import { Activities } from 'src/app/interfaces/Projects';
import { AuthenticationService } from './../../services/authentication.service';
import { StorageService } from './../../services/storage.service';
import { GeneralService } from './../../services/general.service';
import { LoaderService } from './../../services/loader.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  userdata: LoggedData = { email: '', firstname: '', lastname: '', staffid: 0 }
  fechaActual: Date = new Date();

  constructor(
    private authenticationService: AuthenticationService,
    private storageService: StorageService,
    private generalService: GeneralService,
    private loaderService: LoaderService,
    private storage: Storage,
  ) { this.init() }

  private async init() {
    await this.storage.create();
  }

  async ngOnInit() {
    this.userdata = await this.authenticationService.getLoggedData()
    
  }

  logout() {
    this.authenticationService.logout();
  }

  async syncDataUser() {
    this.loaderService.show();
    await this.syncUserTable()
    await this.syncActivities()
    this.loaderService.hide();
  }
  async syncUserTable() {
    const users = await this.generalService.getUsersTable(this.userdata.staffid)
    await this.storageService.clearUserTable()
    for (const user of users) {
      await this.storageService.addUser(user.staffid, user.email, user.firstname, user.lastname, 'sipoc');
    }
  }
  async syncActivities() {
    const activities: Activities = await this.generalService.getSipocAcitivities(this.userdata.staffid)
    await this.storage.set('projects', activities.projects)
    await this.storage.set('projectData', activities.projectData)
    await this.storage.set('taskData', activities.taskData)
  }
}
