import { Injectable } from '@angular/core';

import { HttpService } from './http.service';
import { AuthenticationService } from './authentication.service';


import { ToastService } from './toast.service';
import { ProjectProgressService } from './project-progress.service';
import { ChecklistSections, ChecklistTaskForm, ChecklistQuestions, ChecklistTasks } from '../interfaces/Checklist';
import { Client, SubsidiaryClient, Project, Task, ContractsTypes, ProjectsItems, serviceAll } from '../interfaces/General';

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
    ) { }

  async getUsersTable(staffid: number): Promise<LoggedData[]> {
    try {
      const observableResult = await this.httpService.get(`staffs/${staffid}/getSyncUserData`, true)
      return new Promise((resolve, reject) => {
        observableResult.subscribe((response: any) => {
          resolve(response);
        },
          (error: any) => {
            this.toastService.presentToast('No se pudieron obtener los planes', 'danger')
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
            this.toastService.presentToast('No se pudieron obtener los planes', 'danger')
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
  async getSyncChecklistSubSections(staffid: number): Promise<ChecklistSections[]> {
    const observableResult = await this.httpService.get(`staffs/${staffid}/getSyncChecklistSubSections`, true)
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

  async getsyncChecklisTaskForm(staffid: number): Promise<ChecklistTaskForm[]> {
    const observableResult = await this.httpService.get(`staffs/${staffid}/getSyncChecklistTaskForm`, true)
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

  async getSyncChecklisQuestions(staffid: number): Promise<ChecklistQuestions[]> {
    const observableResult = await this.httpService.get(`staffs/${staffid}/getSyncChecklistQuestions`, true)
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

  async getSyncSubsidiaryClient(staffid: number): Promise<SubsidiaryClient[]> {
    const observableResult = await this.httpService.get(`staffs/${staffid}/getSyncSubsidiaryClient`, true)
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

  async getSyncClient(staffid: number): Promise<Client[]> {
    const observableResult = await this.httpService.get(`staffs/${staffid}/getSyncClient`, true)
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

  async getSyncprojects(staffid: number): Promise<Project[]> {
    const observableResult = await this.httpService.get(`staffs/${staffid}/getSyncprojects`, true)
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

  async getSyncTasks(staffid: number, endpoint: string): Promise<Task[]> {
    const observableResult = await this.httpService.get(`staffs/${staffid}/${endpoint}`, true)
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

  async getSyncContractsType(staffid: number): Promise<ContractsTypes[]> {
    const observableResult = await this.httpService.get(`staffs/${staffid}/getSyncContractsTypes`, true)
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

  async getSyncProjectsItems(staffid: number): Promise<ProjectsItems[]> {
    const observableResult = await this.httpService.get(`staffs/${staffid}/getSyncProjectsItems`, true)
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

  async getSyncChecklistTasks(staffid: number): Promise<ChecklistTasks[]> {
    const observableResult = await this.httpService.get(`staffs/${staffid}/getSyncChecklistTasks`, true)
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

  async getSyncServiceAll(staffid: number): Promise<serviceAll[]> {
    const observableResult = await this.httpService.get(`staffs/${staffid}/getSyncServiceAll`, true)
    try {
      return new Promise((resolve, reject) => {
        observableResult.subscribe((response: any) => {
          console.log(response)
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
