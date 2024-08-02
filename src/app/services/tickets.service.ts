import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { HttpService } from './http.service';
import { ToastService } from './toast.service';
import { NetworkService } from './network.service';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  private rnpData_ = new BehaviorSubject<any>({});
  rnpData = this.rnpData_.asObservable();
  private _showModal = new BehaviorSubject<boolean>(false);
  showModal = this._showModal.asObservable();

  constructor(
    private httpService: HttpService,
    private toastService: ToastService,
    private networkService: NetworkService,
  ) { }

  async show(taskId: number, staffId: number, projectId: number, currentTaskChecklistItem: string, checklistId: string) {
    console.log(checklistId)
    const rnpData = await this.getRnpData(taskId, staffId, projectId)
    this._showModal.next(true);
    this.rnpData_.next([...rnpData, staffId, projectId, currentTaskChecklistItem, taskId, checklistId])
  }

  hide() {
    this.rnpData_.next(0)
    this._showModal.next(false);
  }

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

  async getClientsOperator(subsidiaryId: string): Promise<any> {
    const observableResult = await this.httpService.get(`staffs/${subsidiaryId}/get_clients_operator`, true)
    try {
      return new Promise((resolve, reject) => {
        observableResult.subscribe((response: any) => {
          const data = {
            cliente_select_id: response.userid,
            cliente_select: response.company
          }
          resolve(data);
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

  async getSubsidiariesForStaff(staffId: number): Promise<any> {
    const observableResult = await this.httpService.get(`staffs/${staffId}/get_subsidiaries_for_staff`, true)
    try {
      return new Promise((resolve, reject) => {
        observableResult.subscribe((response: any) => {
          const subsidiaries: any[] = [];
          response.forEach((element: any) => {
            subsidiaries.push({
              text: `${element.id_subsidiary} - ${element.client_name}`,
              value: element.id_subsidiary,
            });
          });
          resolve(subsidiaries);
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

  async getRnp(subsidiaryId: string): Promise<any> {
    const observableResult = await this.httpService.get(`staffs/${subsidiaryId}/getRnp`, true)
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

  async createTicket(data: any): Promise<any> {
    if (this.networkService.getNetworkStatus()) {
      const observableResult = await this.httpService.post(`tickets`, JSON.stringify(data), true)
      try {
        return new Promise((resolve, reject) => {
          observableResult.subscribe((response: any) => {
            resolve(response);
          },
            (error: any) => {
              this.toastService.presentToast('Error al crear el ticket', 'danger')
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

  async getRnpData(taskId: number, staffId: number, projectId: number): Promise<any> {
    const data = {
      project_id: projectId,
      task_id: taskId,
      user_id: staffId,
    };
    if (this.networkService.getNetworkStatus()) {
      const observableResult = await this.httpService.post(`staffs/${staffId}/get_ticket_data`, JSON.stringify(data), true)
      try {
        return new Promise((resolve, reject) => {
          observableResult.subscribe((response: any) => {
            resolve(response);
          },
            (error: any) => {
              this.toastService.presentToast('Error al obtener los datos', 'danger')
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
}

