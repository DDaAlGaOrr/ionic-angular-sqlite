import { Component, OnInit } from '@angular/core';
import { MbscSelectOptions, setOptions, localeEs } from '@mobiscroll/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-bottom-tabs',
  templateUrl: './bottom-tabs.component.html',
  styleUrls: ['./bottom-tabs.component.scss'],
})
export class BottomTabsComponent implements OnInit {

  selectedTab: any = 'login';
  selectedTabModal: string = 'modalTab';
  isOpenTicketsModal: boolean = false;
  titleTicket: string = '';
  selectedCustomer: string = ''
  selectedCustomerId: string = ''
  subsidiaries: any[] = [];
  servicesRnp: any[] = [];
  selectedType: string = ""
  belts: any[] = []
  trampas: any[] = [];
  evidenceImageTicket: string = "";
  correctiveAction: string = "";
  ticketComment: string = "";

  selectSettings: MbscSelectOptions = {
    context: '#tickets_modal',
  };

  constructor(private router: Router) { }

  ngOnInit() {
  }

  handleChangeRoute(route: string) {
    this.router.navigate([route]);
  }
  setCurrentTab() {
    // this.selectedTab = this.tabs.getSelected();
    // console.log('Selected tab:', this.selectedTab);
  }

  async confirm() {
    // this.isTicketSpinning = true;
    // let validate = true;
    // if (this.titleTicket == '') {
    //   this.toastService.presentToast('Debes agregar un titulo');
    //   validate = false;
    //   return;
    // }

    // if (this.titleTicket == '') {
    //   this.toastService.presentToast('Debes agregar un titulo');
    //   validate = false;
    //   return;
    // }

    // if (this.prioritySelect == '') {
    //   this.toastService.presentToast('Debes seleccionar una prioridad');
    //   validate = false;
    //   return;
    // }

    // if (this.ResponsibleSelect == '') {
    //   this.toastService.presentToast('Debes seleccionar a un responsable');
    //   validate = false;
    //   return;
    // }

    // if (this.inputValue == '') {
    //   this.toastService.presentToast('Debes agregar un comentario');
    //   validate = false;
    //   return;
    // }

    // // if (!this.evidenceImageTicket) {
    // //   this.toastService.presentToast('Debes agregar una imagen');
    // //   validate = false;
    // //   return;
    // // }

    // if (this.startDate == '') {
    //   this.startDate = formatDate(new Date(), 'd/M/yyyy', 'en-US');
    // }
    // if (this.ResponsibleSelect == '1') {
    //   if (this.endDate == '') {
    //     this.endDate = formatDate(new Date(), 'd/M/yyyy', 'en-US');
    //   }
    // }
    // console.log(validate);

    // if (validate) {
    //   let url = '';
    //   if (this.evidenceImageTicket) {
    //     const blob = this.dataUrlToBlob(this.evidenceImageTicket);
    //     url = await this.uploadImage(blob, 'ticketEvidence');
    //     this.evidenceImageTicket = '';
    //   }

    //   const data = {
    //     client_id: this.cliente_select_id,
    //     subsidiary_id: this.subsidiarySelect,
    //     area_select: this.areaSelect,
    //     start_date: this.startDate,
    //     end_date: this.endDate,
    //     priority: this.prioritySelect,
    //     responsible: this.ResponsibleSelect,
    //     userid: 1,
    //     department: 16,
    //     contactid: 1,
    //     subject: this.titleTicket,
    //     type: this.ticketType,
    //     description: this.inputValue,
    //     url_image: url,
    //     create_for: 'incidencia',
    //     trampa: this.selected_task,
    //     staff_id: this.userdata_.staffid,
    //     correctiveAction: this.correctiveAction,
    //   };
    //   console.log(this.userdata_);
    //   console.log(data);
    //   this.httpService
    //     .post(`tickets`, JSON.stringify(data), true)
    //     .then((observableResult) => {
    //       observableResult.subscribe(
    //         (res: any) => {
    //           if (res.status) {
    //             this.toastService.presentToast('Incidencia creada');
    //             this.clientSelect = '';
    //             this.titleTicket = '';
    //             this.cliente_select = '';
    //             this.selectedOption = '';
    //             this.cliente_select_id = '';
    //             this.subsidiarySelect = '';
    //             this.areaSelect = '';
    //             this.startDate = '';
    //             this.endDate = '';
    //             this.prioritySelect = '';
    //             this.ResponsibleSelect = '';
    //             this.inputValue = '';
    //             this.startDate = formatDate(new Date(), 'd/M/yyyy', 'en-US');
    //             this.endDate = formatDate(new Date(), 'd/M/yyyy', 'en-US');
    //             this.correctiveAction = '';
    //             this.isTicketSpinning = false;
    //             this.isOpenTicketsModal = false;
    //           } else {
    //             this.toastService.presentToast('Error al crear incidencia');
    //           }
    //         },
    //         (error: any) => {
    //           console.log(error);
    //           this.toastService.presentToast(
    //             'Error en la red, comuníquese con un administrador.'
    //           );
    //         }
    //       );
    //     })
    //     .catch((error) => {
    //       // Manejar errores relacionados con la promesa
    //       console.error('Error al realizar la solicitud de login:', error);
    //     });
    // }
  }


  handleClientSelect(event: any) {
    // const selectClient = event.detail.value;
    // this.clientSelect = selectClient;
    // this.httpService
    //   .get(`staffs/${selectClient}/subsidary`, true)
    //   .then((observableResult) => {
    //     observableResult.subscribe(
    //       (response: any) => {
    //         this.subsidiaries = response;
    //       },
    //       (error: any) => {
    //         console.error('Error al enviar datos:', error);
    //         // Puedes manejar el error aquí
    //       }
    //     );
    //   })
    //   .catch((error) => {
    //     console.error('Error al realizar la solicitud de calendar:', error);
    //     // Puedes manejar el error aquí
    //   });
  }

  handleSubsidiarySelect(event: any) {
    // this.subsidiarySelect = event.value;
    // this.ticketType = 'subsidiary';
    // // $this->clients_model->get_clients_operator($subsidiary_id);
    // this.httpService
    //   .get(`staffs/${this.subsidiarySelect}/get_clients_operator`, true)
    //   .then((observableResult) => {
    //     observableResult.subscribe(
    //       (response: any) => {
    //         console.log(response);
    //         this.cliente_select_id = response.userid;
    //         this.cliente_select = response.company;
    //       },
    //       (error: any) => {
    //         console.error('Error al enviar datos:', error);
    //         // Puedes manejar el error aquí
    //       }
    //     );
    //   })
    //   .catch((error) => {
    //     console.error('Error al realizar la solicitud de calendar:', error);
    //     // Puedes manejar el error aquí
    //   });
  }

  handleType(event: any) {
    // const type = event.detail.value;

    // if (type == 'areas') {
    //   this.trampas = [];
    //   this.ticketType = 'area';
    //   this.httpService
    //     .get(`staffs/${this.subsidiarySelect}/getRnp`, true)
    //     .then((observableResult) => {
    //       observableResult.subscribe(
    //         (response: any) => {
    //           this.servicesRnp = response;
    //         },
    //         (error: any) => {
    //           console.error('Error al enviar datos:', error);
    //           // Puedes manejar el error aquí
    //         }
    //       );
    //     })
    //     .catch((error) => {
    //       console.error('Error al realizar la solicitud de calendar:', error);
    //       // Puedes manejar el error aquí
    //     });
    // } else if (type == 'trampas') {
    //   this.ticketType = 'task';
    // }
  }

  handleControlType(event: any) {
    // const control = event.detail.value;
    // this.subsidiarySelect;
    // const data = {
    //   control: control,
    //   subsidiary_id: this.subsidiarySelect,
    // };
    // this.httpService
    //   .post(
    //     `staffs/${this.userdata_.staffid}/getTasks`,
    //     JSON.stringify(data),
    //     true
    //   )
    //   .then((observableResult) => {
    //     observableResult.subscribe(
    //       (response: any) => {
    //         this.cinturones = response;
    //       },
    //       (error: any) => {
    //         console.error('Error al enviar datos:', error);
    //         // Puedes manejar el error aquí
    //       }
    //     );
    //   })
    //   .catch((error) => {
    //     console.error('Error al realizar la solicitud de calendar:', error);
    //     // Puedes manejar el error aquí
    //   });
  }

  handleBelts(event: any) {
    // const cinturon = event.detail.value;
    // const data = {
    //   cinturon: cinturon,
    //   subsidiary_id: this.subsidiarySelect,
    // };
    // this.httpService
    //   .post(
    //     `staffs/${this.userdata_.staffid}/get_trampas`,
    //     JSON.stringify(data),
    //     true
    //   )
    //   .then((observableResult) => {
    //     observableResult.subscribe(
    //       (response: any) => {
    //         this.trampas = response;
    //         // this.cinturones = response;
    //       },
    //       (error: any) => {
    //         console.error('Error al enviar datos:', error);
    //         // Puedes manejar el error aquí
    //       }
    //     );
    //   })
    //   .catch((error) => {
    //     console.error('Error al realizar la solicitud de calendar:', error);
    //     // Puedes manejar el error aquí
    //   });
  }

  getSelectedtask(task_id: any) {
    // return this.selected_task == task_id;
    return true
  }

  setSelectedTask(task_id: any) {
    // this.selected_task = task_id;
  }

  handleArea(event: any) {
    // this.areaSelect = event.detail.value;
  }
  onStartDateChange(event: any) {
    // this.startDate = new Date(event.detail.value).toLocaleDateString();
  }

  onEndDateChange(event: any) {
    // this.endDate = new Date(event.detail.value).toLocaleDateString();
  }

  handlePriority(event: any) {
    // this.prioritySelect = event.detail.value;
  }

  handleResponsible(event: any) {
    // this.ResponsibleSelect = event.detail.value;
  }

  showTicketsModal(open: boolean): void {
    this.isOpenTicketsModal = open;
    // this.get_subsidiary_tieckets();
  }

  async takePicture() {
    // try {
    //   if (Capacitor.getPlatform() !== 'web') await Camera.requestPermissions();
    //   const evidenceImageTicket = await Camera.getPhoto({
    //     quality: 90,
    //     source: CameraSource.Prompt,
    //     width: 600,
    //     resultType: CameraResultType.DataUrl,
    //   });
    //   this.evidenceImageTicket = evidenceImageTicket.dataUrl;
    // } catch (error) {
    //   console.log(error);
    // }
  }

}
