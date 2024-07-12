import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FullCalendarModule } from '@fullcalendar/angular';

import { ProjectsPageRoutingModule } from './projects-routing.module';

import { ProjectsPage } from './projects.page';
import { HeaderModule } from './../../components/header/header.module';
import { LoaderModule } from 'src/app/components/loader/loader.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectsPageRoutingModule,
    HeaderModule,
    LoaderModule,
    FullCalendarModule
  ],
  declarations: [ProjectsPage]
})
export class ProjectsPageModule { }
