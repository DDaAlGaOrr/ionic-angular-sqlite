import { MbscModule } from '@mobiscroll/angular';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { NzSpinModule } from 'ng-zorro-antd/spin';

import { BottomTabsComponent } from './bottom-tabs.component';

@NgModule({
    declarations: [BottomTabsComponent],
    imports: [
        MbscModule,
        IonicModule,
        CommonModule,
        FormsModule,
        NzDatePickerModule,
        NzSelectModule,
        NzUploadModule,
        NzModalModule,
        NzSpaceModule,
        NzTagModule,
        DatePipe,
        NzSpinModule,
    ],
    exports: [BottomTabsComponent]
})

export class BottomTabsModule { }