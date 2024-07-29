import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  constructor(
    private httpService: HttpService,
    private toastService: ToastService
  ) { }

  async HaveIncidents(subsidiaryId: string): Promise<any> {
    const observableResult = await this.httpService.get(`staffs/${subsidiaryId}/getIncidents`, true)
    try {
      return new Promise((resolve, reject) => {
        observableResult.subscribe((response: any) => {
          resolve(response);
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
