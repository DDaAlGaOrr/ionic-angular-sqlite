import { Injectable } from '@angular/core';
import { NgModel } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { submitProject } from '../interfaces/Project';
import { HttpService } from './http.service';
import { ToastService } from './toast.service';


@Injectable({
  providedIn: 'root'
})
export class SubmitService {
  private _showModal = new BehaviorSubject<boolean>(false);
  showModal = this._showModal.asObservable();
  private _evidenceType = new BehaviorSubject<string>('');
  evidenceType = this._evidenceType.asObservable();

  constructor(
    private httpService: HttpService,
    private toastService: ToastService
  ) { }

  show(evidenceType: string) {
    this._showModal.next(true);
    this._evidenceType.next(evidenceType)
  }

  hide() {
    this._showModal.next(false);
  }

  async submitActivity(data: submitProject): Promise<any> {
    try {
      const observableResult = await this.httpService.post(`staffs/${data.staff_id}/save_checklist`, JSON.stringify(data), true)
      return new Promise((resolve, reject) => {
        observableResult.subscribe((response: any) => {
          console.log(response)
          resolve(response);
        },
          (error: any) => {
            this.toastService.presentToast('Algo salió mal, vuleve a intentarlo', 'danger')
            console.error('Error al enviar datos:', error);
            reject(error);
          }
        )
      })
    } catch (error) {
      this.toastService.presentToast('Algo salió mal, vuleve a intentarlo', 'danger')
      console.error('Error al enviar datos:', error);
      throw error;
    }
  }
}
