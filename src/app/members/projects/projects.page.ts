import { Component, OnInit } from '@angular/core';

import { ProjectsService } from './../../services/projects.service';
import { AuthenticationService } from './../../services/authentication.service';
import { LoggedData } from './../../interfaces/Auth';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
})
export class ProjectsPage implements OnInit {
  userdata: LoggedData = { email: '', firstname: '', lastname: '', staffid: 0 }


  constructor(private projectsService:ProjectsService,private authenticationService:AuthenticationService) { }

  async ngOnInit() {
    this.userdata = await this.authenticationService.getLoggedData()
    console.log(await this.projectsService.getProjects(this.userdata.staffid))
  }

}
