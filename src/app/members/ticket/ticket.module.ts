import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TicketPageRoutingModule } from './ticket-routing.module';

import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzCardModule } from 'ng-zorro-antd/card';

import { TicketPage } from './ticket.page';
import { HeaderModule } from '../../components/header/header.module';
import { BottomTabsModule } from '../../components/bottom-tabs/bottom-tabs.module';
import { LoaderModule } from '../../components/loader/loader.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderModule,
    BottomTabsModule,
    TicketPageRoutingModule,
    NzDescriptionsModule,
    NzCollapseModule,
    NzCommentModule,
    NzButtonModule,
    NzUploadModule,
    NzImageModule,
    NzCardModule,
    ReactiveFormsModule,
    LoaderModule
  ],
  declarations: [TicketPage]
})
export class TicketPageModule { }
