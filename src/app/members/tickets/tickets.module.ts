import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FullCalendarModule } from '@fullcalendar/angular';

import { TicketsPageRoutingModule } from './tickets-routing.module';
import { TicketsPage } from './tickets.page';
import { HeaderModule } from '../../components/header/header.module';
import { LoaderModule } from '../../components/loader/loader.module';
import { BottomTabsModule } from '../../components/bottom-tabs/bottom-tabs.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TicketsPageRoutingModule,
    HeaderModule,
    LoaderModule,
    BottomTabsModule,
    FullCalendarModule
  ],
  declarations: [TicketsPage]
})
export class TicketsPageModule { }
