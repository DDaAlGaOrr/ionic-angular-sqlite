import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { HttpService } from './http.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class UvLightModalService {

  private _showModal = new BehaviorSubject<boolean>(false);
  showModal = this._showModal.asObservable();
  private _taskId = new BehaviorSubject<number>(0);
  taskId = this._taskId.asObservable();

  constructor(
    private httpService: HttpService,
    private toastService: ToastService,
  ) { }

  show(itemId: number) {
    this._taskId.next(itemId);
    this._showModal.next(true);
  }

  hide() {
    this._taskId.next(0);
    this._showModal.next(false);
  }

  async getSelectedUvChecklist(checklistId: number, taskId: number): Promise<any> {
    const data = {
      checklistid: checklistId,
      taskid: taskId,
    };
    try {
      const observableResult = await this.httpService.post(`staffs/${taskId}/assign_uv_checklist`, JSON.stringify(data), true)
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
