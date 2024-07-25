import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TaskModalComponent } from './task-modal.component';
import { LoaderModule } from '../loader/loader.module';


@NgModule({
    declarations: [TaskModalComponent],
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
        NzDividerModule
    ],
    exports: [TaskModalComponent]
})
export class TaskModalModule { }