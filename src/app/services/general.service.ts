import { Injectable } from '@angular/core';

import { HttpService } from './http.service';
import { AuthenticationService } from './authentication.service';


import { ToastService } from './toast.service';
import { ProjectProgressService } from './project-progress.service';
import { LoaderService } from './loader.service';

import { LoggedData } from '../interfaces/Auth';
import { Activities } from '../interfaces/Projects';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private httpService: HttpService,
    private authenticationService: AuthenticationService,
    private toastService: ToastService,
    private projectProgressService: ProjectProgressService,
    private loaderService: LoaderService) { }

  async getUsersTable(staffid: number): Promise<LoggedData[]> {
    try {
      const observableResult = await this.httpService.get(`staffs/${staffid}/getSyncUserData`, true)
      return new Promise((resolve, reject) => {
        observableResult.subscribe((response: any) => {
          resolve(response);
        },
          (error: any) => {
            this.toastService.presentToast('No se pudieron obtener los planes')
            console.error('Error al enviar datos:', error);
            reject(error);
          }
        )
      })
    } catch (error) {
      throw error;
    }
  }

  async getSipocAcitivities(staffid: number): Promise<Activities> {
    const observableResult = await this.httpService.get(`staffs/${staffid}/getSyncProjectData`, true)
    try {
      return new Promise((resolve, reject) => {
        observableResult.subscribe((response: any) => {
          resolve(response);
        },
          (error: any) => {
            this.toastService.presentToast('No se pudieron obtener los planes')
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
