import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { LoaderComponent } from './loader.component';

@NgModule({
    declarations: [
        LoaderComponent,
    ],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule,
        // HeaderComponent
    ],
    exports: [LoaderComponent]
})
export class LoaderModule { }