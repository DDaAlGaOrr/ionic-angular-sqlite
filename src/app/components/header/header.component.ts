import { Component, OnInit } from '@angular/core';

import { LoggedData } from './../../interfaces/Auth';
import { AuthenticationService } from './../../services/authentication.service';
import { StorageService } from './../../services/storage.service';
import { GeneralService } from './../../services/general.service';
import { LoaderService } from 'src/app/services/loader.service';

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
  ) { }

  async ngOnInit() {
    this.userdata = await this.authenticationService.getLoggedData()
  }

  logout() {
    this.authenticationService.logout();
  }

  async syncDataUser() {
    const users = await this.generalService.getUsersTable(this.userdata.staffid)
    for (const user of users) {
      await this.storageService.addUser(user.staffid, user.email, user.firstname, user.lastname, 'sipoc');
    }
    this.loaderService.hide();
    // await this.storageService.deleteUserById(7)
  }
}
