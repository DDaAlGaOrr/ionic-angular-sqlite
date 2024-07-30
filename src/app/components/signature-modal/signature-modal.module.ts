import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SignatureModalComponent } from './signature-modal.component';
import { SignaturePadComponent } from '../signature-pad/signature-pad.component';


@NgModule({
  declarations: [SignaturePadComponent,SignatureModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[SignatureModalComponent]
})
export class SignatureModalModule { }
