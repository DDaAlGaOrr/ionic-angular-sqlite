import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SignatureService } from './../../services/signature.service';
import SignaturePad from 'signature_pad';


@Component({
  selector: 'app-signature-pad',
  templateUrl: './signature-pad.component.html',
  styleUrls: ['./signature-pad.component.scss'],
})
export class SignaturePadComponent implements OnInit {

  signatureNeeded!: boolean;
  signaturePad!: SignaturePad;
  @ViewChild('canvas') canvasEl!: ElementRef;
  signatureImg!: string;

  constructor(private signatureService: SignatureService) { }

  ngOnInit() { }

  clearPad() {
    this.signaturePad.clear();
  }

  ngAfterViewInit() {
    this.signaturePad = new SignaturePad(this.canvasEl.nativeElement);
  }

  startDrawing(event: Event) {
    // works in device not in browser
  }

  moved(event: Event) {
    // works in device not in browser
  }

  savePad() {
    const base64Data = this.signaturePad.toDataURL();
    this.signatureService.updateSignature(base64Data);
    this.signatureNeeded = this.signaturePad.isEmpty();
    if (!this.signatureNeeded) {
      this.signatureNeeded = false;
    }
  }

}
