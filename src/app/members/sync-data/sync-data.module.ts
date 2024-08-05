import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SyncDataPageRoutingModule } from './sync-data-routing.module';

import { SyncDataPage } from './sync-data.page';

import { HeaderModule } from '../../components/header/header.module';
import { BottomTabsModule } from '../../components/bottom-tabs/bottom-tabs.module';
import { LoaderModule } from '../../components/loader/loader.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SyncDataPageRoutingModule,
    HeaderModule,
    BottomTabsModule,
    LoaderModule
  ],
  declarations: [SyncDataPage]
})
export class SyncDataPageModule { }
