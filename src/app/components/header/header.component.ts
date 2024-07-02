import { Component, OnInit } from '@angular/core';

import { LoggedData } from './../../interfaces/Auth';
import { AuthenticationService } from './../../services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  userdata: LoggedData = { email: '', firstname: '', lastname: '', staffid: 0 }
  fechaActual: Date = new Date();

  constructor(private authenticationService: AuthenticationService) { }

  async ngOnInit() {
    this.userdata = await this.authenticationService.getLoggedData()
  }

  logout() { 
    this.authenticationService.logout();
  }
}
