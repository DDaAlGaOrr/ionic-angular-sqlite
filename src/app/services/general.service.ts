import { Injectable } from '@angular/core';

import { HttpService } from './http.service';
import { AuthenticationService } from './authentication.service';


import { ToastService } from './toast.service';
import { ProjectProgressService } from './project-progress.service';
import { LoaderService } from './loader.service';
import { ChecklistSections, ChecklistTaskForm, ChecklistQuestions } from '../interfaces/Checklist';

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

  async getSyncChecklistSections(staffid: number): Promise<ChecklistSections[]> {
    const observableResult = await this.httpService.get(`staffs/${staffid}/getSyncChecklistSections`, true)
    try {
      return new Promise((resolve, reject) => {
        observableResult.subscribe((response: any) => {
          resolve(response);
        },
          (error: any) => {
            this.toastService.presentToast('No se pudieron obtener los datos')
            console.error('Error al enviar datos:', error);
            reject(error);
          }
        )
      })
    } catch (error) {
      throw error;
    }
  }
  async getSyncChecklistSubSections(staffid: number): Promise<ChecklistSections[]> {
    const observableResult = await this.httpService.get(`staffs/${staffid}/getSyncChecklistSubSections`, true)
    try {
      return new Promise((resolve, reject) => {
        observableResult.subscribe((response: any) => {
          resolve(response);
        },
          (error: any) => {
            this.toastService.presentToast('No se pudieron obtener los datos')
            console.error('Error al enviar datos:', error);
            reject(error);
          }
        )
      })
    } catch (error) {
      throw error;
    }
  }

  async getsyncChecklisTaskForm(staffid: number): Promise<ChecklistTaskForm[]> {
    const observableResult = await this.httpService.get(`staffs/${staffid}/getSyncChecklistTaskForm`, true)
    try {
      return new Promise((resolve, reject) => {
        observableResult.subscribe((response: any) => {
          resolve(response);
        },
          (error: any) => {
            this.toastService.presentToast('No se pudieron obtener los datos')
            console.error('Error al enviar datos:', error);
            reject(error);
          }
        )
      })
    } catch (error) {
      throw error;
    }
  }

  async getSyncChecklisQuestions(staffid: number): Promise<ChecklistQuestions[]> {
    const observableResult = await this.httpService.get(`staffs/${staffid}/getSyncChecklistQuestions`, true)
    try {
      return new Promise((resolve, reject) => {
        observableResult.subscribe((response: any) => {
          resolve(response);
        },
          (error: any) => {
            this.toastService.presentToast('No se pudieron obtener los datos')
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
