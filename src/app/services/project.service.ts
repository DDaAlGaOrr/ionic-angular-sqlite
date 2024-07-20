import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { ProjectsService } from './offline/projects.service';
// import { Storage as IonicStorage  } from '@ionic/storage-angular';


import { NetworkService } from './network.service';
import { HttpService } from './http.service';
import { PlanDetail, DocumentalData } from '../interfaces/Checklist';
import { ToastService } from './toast.service';
// import {
//   Storage as FirebaseStorage,
//   getDownloadURL,
//   ref,
//   uploadBytes,
// } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(
    private networkService: NetworkService,
    private httpService: HttpService,
    private toastService: ToastService,
    private offlineProjectsService: ProjectsService,
    // private firebaseStorage: FirebaseStorage,
    // private androidPermissions: AndroidPermissions,
    // private ionicStorage: IonicStorage
  ) {
    this.init()
  }

  private async init() {
    // await this.ionicStorage.create();
  }

  dataUrlToBlob(dataUrl: string) {
    const arr = dataUrl.split(',');
    if (arr.length !== 2) {
      throw new Error('Invalid data URL format');
    }
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  async uploadImage(blob: Blob, route: string) {
    //   try {
    //     const currentDate = Date.now();
    //     const filePath = `${route}/${currentDate}.jpg`;
    //     const fileRef = ref(this.firebaseStorage, filePath);
    //     const task = await uploadBytes(fileRef, blob);
    //     const url = getDownloadURL(fileRef);
    //     return url;
    //   } catch (error) {
    //     console.error('Error al cargar la imagen:', error);
    //     throw error;
    //   }
  }

  async getProjectTasks(projectId: number, projectType: string) {
    if (this.networkService.getNetworkStatus()) {
      console.log("online")
      return await this.getOnlineProjectTasks(projectId, projectType)
    } else {
      console.log('offline')
      return await this.getOfflineProjectTasks(projectId, projectType)
    }
  }

  async getOnlineProjectTasks(projectId: number, projectType: string): Promise<PlanDetail> {
    const data: PlanDetail = {
      tasksData: [],
      clientName: '',
      subsdiaryName: '',
      planName: '',
      checklistItems: '',
      formattedTask: { formattedTasks: [], tasksBelts: [] },
      projectType: projectType,
      uvChecklistItems: {}
    }
    const observableResult = await this.httpService.get(`staffs/${projectId}/tasks`, true)
    return new Promise((resolve, reject) => {
      observableResult.subscribe(
        (response: any) => {
          data.tasksData = response.tasks;
          data.clientName = `${response.plan_detail[0].client} - ${response.plan_detail[0].id_subsidiary}`;
          data.subsdiaryName = response.plan_detail[0].subsidiary;
          data.planName = response.plan_detail[0].folio;
          data.checklistItems = response.items;
          data.formattedTask = this.formatTasksObject(
            response.tasks,
            response.service_area,
            response.cinturones.split(', ')
          );
          resolve(data);
        },
        (error: any) => {
          this.toastService.presentToast('Algo salio mal')
          console.error('Error al enviar datos:', error);
        }
      );
    })
  }

  async getOfflineProjectTasks(projectId: number, projectType: string) {
    const data: PlanDetail = {
      tasksData: [],
      clientName: '',
      subsdiaryName: '',
      planName: '',
      checklistItems: '',
      formattedTask: { formattedTasks: [], tasksBelts: [] },
      projectType: projectType,
      uvChecklistItems: {}
    }
    const result = await this.offlineProjectsService.getPlanDetail(projectId, projectType)
    data.tasksData = result.projectTasks
    data.clientName = `${result.planDetail[0].client} - ${result.planDetail[0].id_subsidiary}`
    data.subsdiaryName = result.planDetail[0].subsidiary
    data.planName = result.planDetail[0].folio
    data.formattedTask = this.formatTasksObject(
      result.projectTasks,
      result.serviceArea,
      result.cinturones.split(', ')
    );
    return data
  }

  async getTaskItems(projectId: number, projectType: string) {
    const data = {
      clientName: '',
      subsdiaryName: '',
      uvChecklistItems: ''
    }
    this.httpService
      .get(`staffs/${projectId}/tasks_uv`, true)
      .then((observableResult) => {
        observableResult.subscribe(
          (response: any) => {
            console.log(response);
            const groupedTasks = response.tasks.reduce(
              (acc: any, task: any) => {
                const { cinturon } = task;
                if (!acc[cinturon]) {
                  acc[cinturon] = [];
                }
                acc[cinturon].push(task);
                return acc;
              },
              {}
            );
            data.clientName = response.plan_detail[0].name_client;
            data.subsdiaryName = response.plan_detail[0].client_name;
            data.uvChecklistItems = groupedTasks;
          },
          (error: any) => {
            console.error('Error al enviar datos:', error);
          }
        );
      })
      .catch((error) => {
        console.error('Error al realizar la solicitud de calendar:', error);
      });
  }

  async getProjectDocumentalChecklist(projectId: number, projectType: string): Promise<DocumentalData> {
    if (this.networkService.getNetworkStatus()) {
      return await this.getOnlineProjectDocumentalChecklist(projectId, projectType)
    } else {
      return await this.getOfflineProjectDocumentalChecklist(projectId, projectType)
    }
  }

  async getOnlineProjectDocumentalChecklist(projectId: number, projectType: string): Promise<DocumentalData> {
    const data: DocumentalData = {
      totalPages: 0,
      evaluationAnswers: {},
      sectionListItems: [],
      productsDocumntalChecklist: [],
      productsDocumntalChecklistAnswers: {},
      sectionList: [],
      selectedTexts: [],
      selectedTextsTechnicians: [],
      techniciansDocumntalChecklist: {},
      techniciansDocumntalChecklistAnswers: {}
    }
    const observableResult = await this.httpService.get(`staffs/${projectId}/documentalChecklist`, true)
    return new Promise((resolve, reject) => {
      observableResult.subscribe(
        (response: any) => {
          const checklistItemsBySection: any = {};
          data.totalPages = response.checklist_sections.length;
          for (const sectionId in response.items) {
            if (response.items.hasOwnProperty(sectionId)) {
              const sectionItems = response.items[sectionId];
              if (Array.isArray(sectionItems)) {
                checklistItemsBySection[sectionId] = sectionItems;
              } else {
                const indexName = Object.keys(sectionItems)[0];
                checklistItemsBySection[sectionId] = {
                  subsection: true,
                  name: indexName,
                  items: sectionItems[indexName],
                };
                data.evaluationAnswers[sectionId] = {
                  items: sectionItems[indexName],
                };
              }
            }
          }
          data.sectionListItems = response.checklist_sections.map(
            (section: any) => {
              let extraAnswerDescription = '';
              let sections = [19, 16, 8, 9];
              if (sections.includes(parseInt(section.id))) {
                switch (parseInt(section.id)) {
                  case 19:
                    extraAnswerDescription =
                      'TECNICO NO SE ENCUENTRA EN PISO/NA';
                    break;
                  case 16:
                    extraAnswerDescription =
                      'CUMPLE POR ARRANQUE DE SERVICIO / NA';
                    break;
                  case 8:
                    extraAnswerDescription =
                      'CUMPLE POR ARRANQUE DE SERVICIO / NA';
                    break;
                  case 9:
                    extraAnswerDescription =
                      'CUMPLE EN REVISIÓN POR EL CLIENTE';
                    break;
                }
              }
              return {
                extraAnswer: sections.includes(parseInt(section.id)),
                extraAnswerDescription,
                ...section,
                items: checklistItemsBySection[section.id] || [],
              };
            }
          );
          data.sectionList = response.checklist_sections;
          data.productsDocumntalChecklist = response.products.products;
          data.techniciansDocumntalChecklist =
            response.products.technicians_name;
          data.selectedTexts = Array(
            response.products.products.length
          ).fill('Seleccionado');
          data.selectedTextsTechnicians = Array(
            response.products.technicians_name.length
          ).fill('Seleccionado');
          data.evaluationAnswers[7].items.forEach((item: any) => {
            data.techniciansDocumntalChecklistAnswers[item.question_id] =
            {
              question_id: item.question_id,
              answer: true,
            };
          });
          data.evaluationAnswers[15].items.forEach((item: any) => {
            data.productsDocumntalChecklistAnswers[item.question_id] = {
              question_id: item.question_id,
              answer: true,
            };
          });
          resolve(data)
        },
        (error: any) => {
          reject('Algo salio mal')
          this.toastService.presentToast('Algo salio mal')
          console.error('Error al enviar datos:', error);
        }
      );
    })
  }

  async getOfflineProjectDocumentalChecklist(projectId: number, projectType: string): Promise<DocumentalData> {
    const data: DocumentalData = {
      totalPages: 0,
      evaluationAnswers: {},
      sectionListItems: [],
      productsDocumntalChecklist: [],
      productsDocumntalChecklistAnswers: {},
      sectionList: [],
      selectedTexts: [],
      selectedTextsTechnicians: [],
      techniciansDocumntalChecklist: {},
      techniciansDocumntalChecklistAnswers: {}
    }
    const response = await this.offlineProjectsService.getDocumentalChecklist(projectId, projectType)
    const checklistItemsBySection: any = {};
    data.totalPages = response.checklist_sections.length;
    for (const sectionId in response.items) {
      if (response.items.hasOwnProperty(sectionId)) {
        const sectionItems = response.items[sectionId];
        if (Array.isArray(sectionItems)) {
          checklistItemsBySection[sectionId] = sectionItems;
        } else {
          const indexName = Object.keys(sectionItems)[0];
          checklistItemsBySection[sectionId] = {
            subsection: true,
            name: indexName,
            items: sectionItems[indexName],
          };
          data.evaluationAnswers[sectionId] = {
            items: sectionItems[indexName],
          };
        }
      }
    }

    data.sectionListItems = response.checklist_sections.map(
      (section: any) => {
        let extraAnswerDescription = '';
        let sections = [19, 16, 8, 9];
        if (sections.includes(parseInt(section.id))) {
          switch (parseInt(section.id)) {
            case 19:
              extraAnswerDescription =
                'TECNICO NO SE ENCUENTRA EN PISO/NA';
              break;
            case 16:
              extraAnswerDescription =
                'CUMPLE POR ARRANQUE DE SERVICIO / NA';
              break;
            case 8:
              extraAnswerDescription =
                'CUMPLE POR ARRANQUE DE SERVICIO / NA';
              break;
            case 9:
              extraAnswerDescription =
                'CUMPLE EN REVISIÓN POR EL CLIENTE';
              break;
          }
        }
        return {
          extraAnswer: sections.includes(parseInt(section.id)),
          extraAnswerDescription,
          ...section,
          items: checklistItemsBySection[section.id] || [],
        };
      }
    );
    data.sectionList = response.checklist_sections;
    data.productsDocumntalChecklist = response.products.products;
    data.techniciansDocumntalChecklist =
      response.products.technicians_name;
    data.selectedTexts = Array(
      response.products.products.length
    ).fill('Seleccionado');
    data.selectedTextsTechnicians = Array(
      response.products.technicians_name.length
    ).fill('Seleccionado');
    // data.evaluationAnswers[7].items.forEach((item: any) => {
    //   data.techniciansDocumntalChecklistAnswers[item.question_id] =
    //   {
    //     question_id: item.question_id,
    //     answer: true,
    //   };
    // });
    // data.evaluationAnswers[15].items.forEach((item: any) => {
    //   data.productsDocumntalChecklistAnswers[item.question_id] = {
    //     question_id: item.question_id,
    //     answer: true,
    //   };
    // });
    return data
  }

  formatTasksObject(tasks: any[], services: any[], cinturones: any[]) {
    const tasksBelts = cinturones;
    const formattedTasks: any[] = [];
    const edc: any = {
      area_service: {},
      cinturones: [],
      total_tasks: 0,
    };
    const edcm: any = {
      area_service: {},
      cinturones: [],
      total_tasks: 0,
    };
    const lln: any = {
      area_service: {},
      cinturones: [],
      total_tasks: 0,
    };
    const rnp: any = {
      area_service: {},
      cinturones: [],
      total_tasks: 0,
    };

    // Agrupar tareas por tipo de control y ubicación
    tasks.forEach((task) => {

      const controlType = parseInt(task.group_control);
      let cinturon = task.cinturon;
      switch (controlType) {
        case 1:
          if (!edc.area_service[cinturon]) {
            edc.area_service[cinturon] = [];
          }
          edc.area_service[cinturon].push(task);
          edc.total_tasks++;
          break;
        case 2:
          if (!edcm.area_service[cinturon]) {
            edcm.area_service[cinturon] = [];
          }
          edcm.area_service[cinturon].push(task);
          edcm.total_tasks++;
          break;
        case 3:
          if (!lln.area_service[cinturon]) {
            lln.area_service[cinturon] = [];
          }
          lln.area_service[cinturon].push(task);
          lln.total_tasks++;
          break;
        case 4:
          if (cinturon != 'areas') {
            cinturon = 'areas';
          }
          if (!rnp.area_service[cinturon]) {
            rnp.area_service[cinturon] = [];
          }
          rnp.area_service[cinturon].push(task);
          rnp.total_tasks++;
          break;
      }
    });

    // Agrupar servicios por tipo de control
    services.forEach((service) => {
      switch (service.name) {
        case 'EDC':
          edc.service = service;
          edc.cinturones.push(service.cinturon.trim());
          break;
        case 'EDCM':
          edcm.service = service;
          edcm.cinturones.push(service.cinturon.trim());
          break;
        case 'LLN':
          lln.service = service;
          lln.cinturones.push(service.cinturon.trim());
          break;
        case 'RNP':
          rnp.service = service;
          rnp.cinturones.push(service.cinturon.trim());
          break;
      }
    });

    formattedTasks.push({
      edc,
      edcm,
      lln,
      rnp,
    });

    return {
      tasksBelts: tasksBelts,
      formattedTasks: formattedTasks
    }
  }

  async takePictureDocumental() {
    // try {
    //   if (Capacitor.getPlatform() !== 'web') {
    //     this.androidPermissions
    //       .checkPermission(this.androidPermissions.PERMISSION.CAMERA)
    //       .then(
    //         (result: any) => {
    //           if (result.hasPermission) {
    //             // Acceder a la cámara
    //           } else {
    //             this.androidPermissions.requestPermission(
    //               this.androidPermissions.PERMISSION.CAMERA
    //             );
    //           }
    //         },
    //         () =>
    //           this.androidPermissions.requestPermission(
    //             this.androidPermissions.PERMISSION.CAMERA
    //           )
    //       );
    //   }
    //   const evidenceImageDocumental = await Camera.getPhoto({
    //     quality: 90,
    //     source: CameraSource.Prompt,
    //     width: 600,
    //     resultType: CameraResultType.DataUrl,
    //   });
    //   if (evidenceImageDocumental.dataUrl) {
    //     const base64Data = evidenceImageDocumental.dataUrl.split(',')[1];
    //     const fileName = `IMG_${new Date().getTime()}.jpeg`;
    //     await Filesystem.writeFile({
    //       path: fileName,
    //       data: base64Data,
    //       directory: Directory.External, // Guardar en almacenamiento externo
    //     });
    //   }
    //   return evidenceImageDocumental.dataUrl;
    // } catch (error) {
    //   return false
    //   console.log(error);
    // }
  }
}
