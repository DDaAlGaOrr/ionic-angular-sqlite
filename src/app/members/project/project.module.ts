import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';


import { IonicModule } from '@ionic/angular';

import { NzProgressModule } from 'ng-zorro-antd/progress';

import { ProjectPageRoutingModule } from './project-routing.module';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { ProjectPage } from './project.page';
import { LoaderModule } from 'src/app/components/loader/loader.module';
import { HeaderModule } from './../../components/header/header.module';
import { BottomTabsModule } from '../../components/bottom-tabs/bottom-tabs.module';
import { DocumentalModalModule } from '../../components/documental-modal/documental-modal.module';
import { TaskModalModule } from '../../components/task-modal/task-modal.module';
import { SignatureModalModule } from '../../components/signature-modal/signature-modal.module';
import { TicketModalComponent } from '../../components/ticket-modal/ticket-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProjectPageRoutingModule,
    LoaderModule,
    HeaderModule,
    NzProgressModule,
    NzPaginationModule,
    NzSpaceModule,
    NzTagModule,
    BottomTabsModule,
    DocumentalModalModule,
    TaskModalModule,
    SignatureModalModule,
  ],
  declarations: [ProjectPage,TicketModalComponent],
  providers: [AndroidPermissions]
})
export class ProjectPageModule { }
