import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class SignatureService {

  private signatureSource = new BehaviorSubject<string>(''); // Inicializa con una cadena vacía
  currentSignature = this.signatureSource.asObservable();

  constructor(private toastService: ToastService) { }

  updateSignature(signature: string) {
    this.signatureSource.next(signature);
    this.toastService.presentToast('Firma guardada con éxito', 'secondary');
  }
}
