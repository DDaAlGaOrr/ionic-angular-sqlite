import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { HttpService } from './http.service';
import { ToastService } from './toast.service';
import { LoaderService } from './loader.service';
import { TaskChecklistService } from './task-checklist.service';

interface modalData {
  taskId: number
  taskControl: string
  taskNumber: string
}
@Injectable({
  providedIn: 'root'
})


export class TaskModalService {
  private taskData = new BehaviorSubject<modalData>({ taskId: 0, taskControl: '', taskNumber: '' });
  modalData = this.taskData.asObservable();
  private _showModal = new BehaviorSubject<boolean>(false);
  showModal = this._showModal.asObservable();
  private checklist = new BehaviorSubject<any>({});
  checklistItems = this.checklist.asObservable();

  constructor(
    private httpService: HttpService,
    private toastService: ToastService,
    private loaderService: LoaderService,
    private taskChecklistService: TaskChecklistService,
  ) { }

  async show(data: modalData) {
    this.taskData.next(data)
    this._showModal.next(true);
    const checklistItems = await this.getChecklist(data.taskId)
    this.checklist.next(checklistItems)
  }

  hide() {
    this._showModal.next(false);
    this.taskData.next({ taskId: 0, taskControl: '', taskNumber: '' })
  }

  async getChecklist(taskId: number) {
    try {
      const observableResult = await this.httpService.get(`staffs/${taskId}/checklist`, true)
      return new Promise((resolve, reject) => {
        observableResult.subscribe((response: any) => {
          resolve(response);
          response.items.forEach((item: any) => {
            this.taskChecklistService.setSelectedItem(item.id, 'yes');
          });
        },
          (error: any) => {
            this.toastService.presentToast('No se pudieron obtener los datos', 'danger')
            console.error('Error al enviar datos:', error);
            reject(error);
          }
        )
      })
    } catch (error) {
      throw error;
    }
  }
}
