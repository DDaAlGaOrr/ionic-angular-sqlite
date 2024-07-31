import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SignatureModalComponent } from './signature-modal.component';
import { SignaturePadComponent } from '../signature-pad/signature-pad.component';
import { LoaderModule } from '../loader/loader.module';


@NgModule({
  declarations: [SignaturePadComponent,SignatureModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ],
  exports:[SignatureModalComponent]
})
export class SignatureModalModule { }
