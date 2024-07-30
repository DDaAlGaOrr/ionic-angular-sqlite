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

  submitActivity(data: submitProject) {
    this.httpService
      .post(`staffs/${data.staff_id}/save_checklist`, JSON.stringify(data), true)
      .then((observableResult: any) => {
        observableResult.subscribe(
          async (res: any) => {
            console.log(res)
          },
          (error: any) => {
            console.log(error)
            this.toastService.presentToast('Error en la red, comuníquese con un administrador.','danger');
          }
        )
      })
    console.log(data)
  }
}
