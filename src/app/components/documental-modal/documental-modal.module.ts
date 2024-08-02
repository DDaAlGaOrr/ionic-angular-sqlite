import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DocumentalModalComponent } from './documental-modal.component';
import { LoaderModule } from '../loader/loader.module';


@NgModule({
    declarations: [DocumentalModalComponent],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        LoaderModule,
        NzProgressModule,
        NzPaginationModule,
        NzSpaceModule,
        NzTagModule,
    ],
    exports: [DocumentalModalComponent],
    providers:[AndroidPermissions]
})
export class DocumentalModalModule { }