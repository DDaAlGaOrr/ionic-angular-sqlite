import { Component, OnInit } from '@angular/core';
import { MbscSelectOptions, setOptions, localeEs } from '@mobiscroll/angular';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

import { TicketsService } from '../../services/tickets.service';
import { LoggedData } from '../../interfaces/Auth';
import { AuthenticationService } from '../../services/authentication.service';
import { HttpService } from '../../services/http.service';
import { ProjectService } from '../../services/project.service';
import { NetworkService } from '../../services/network.service';
import { ToastService } from '../../services/toast.service';
import { LoaderService } from '../../services/loader.service';



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
  subsidiarySelect: string = ''
  ticketType: string = ""
  userdata: LoggedData = { email: '', firstname: '', lastname: '', staffid: 0, role: 0 }
  areaSelect: string = '';
  startDate: string = ''
  endDate: string = ''
  prioritySelect: string = ''
  ResponsibleSelect: string = ''
  selected_task: any = 0;

  selectSettings: MbscSelectOptions = {
    context: '#tickets_modal',
  };

  constructor(
    private router: Router,
    private ticketsService: TicketsService,
    private authenticationService: AuthenticationService,
    private httpService: HttpService,
    private projectService: ProjectService,
    private networkService: NetworkService,
    private toastService: ToastService,
    private loaderService: LoaderService,
  ) { }

  async ngOnInit() {
    this.userdata = await this.authenticationService.getLoggedData()
  }

  handleChangeRoute(route: string) {
    this.router.navigate([route]);
  }

  showTicketsModal(open: boolean): void {
    this.isOpenTicketsModal = open;
    this.get_subsidiary_tickets();
  }

  async get_subsidiary_tickets() {
    this.subsidiaries = await this.ticketsService.getSubsidiariesForStaff(this.userdata.staffid)
  }
  loader(){
    this.loaderService.show()
  }

  async confirm() {
    this.loaderService.show()
    let validate = true;
    if (this.titleTicket == '') {
      this.toastService.presentToast('Debes agregar un titulo', 'danger');
      validate = false;
      return;
    }

    if (this.titleTicket == '') {
      this.toastService.presentToast('Debes agregar un titulo', 'danger');
      validate = false;
      return;
    }

    if (this.prioritySelect == '') {
      this.toastService.presentToast('Debes seleccionar una prioridad', 'danger');
      validate = false;
      return;
    }

    if (this.ResponsibleSelect == '') {
      this.toastService.presentToast('Debes seleccionar a un responsable', 'danger');
      validate = false;
      return;
    }

    if (this.ticketComment == '') {
      this.toastService.presentToast('Debes agregar un comentario', 'danger');
      validate = false;
      return;
    }

    if (this.startDate == '') {
      this.startDate = formatDate(new Date(), 'd/M/yyyy', 'en-US');
    }
    if (this.ResponsibleSelect == '1') {
      if (this.endDate == '') {
        this.endDate = formatDate(new Date(), 'd/M/yyyy', 'en-US');
      }
    }

    if (validate) {
      let urlImage = this.evidenceImageTicket.length > 0 ? await this.setUrlImage(this.evidenceImageTicket, 'ticketEvidence') || "" : ''

      const data = {
        client_id: this.selectedCustomerId,
        subsidiary_id: this.subsidiarySelect,
        area_select: this.areaSelect,
        start_date: this.startDate,
        end_date: this.endDate,
        priority: this.prioritySelect,
        responsible: this.ResponsibleSelect,
        userid: 1,
        department: 16,
        contactid: 1,
        subject: this.titleTicket,
        type: this.ticketType,
        description: this.ticketComment,
        url_image: urlImage,
        create_for: 'incidencia',
        trampa: this.selected_task,
        staff_id: this.userdata.staffid,
        correctiveAction: this.correctiveAction,
      };
      const response = await this.ticketsService.createTicket(data)
      console.log(data)
      if (response.status) {
        this.toastService.presentToast('Incidencia creada', 'secondary');
        this.titleTicket = '';
        this.selectedCustomer = '';
        this.selectedCustomerId = '';
        this.subsidiarySelect = '';
        this.areaSelect = '';
        this.startDate = '';
        this.endDate = '';
        this.prioritySelect = '';
        this.ResponsibleSelect = '';
        this.startDate = formatDate(new Date(), 'd/M/yyyy', 'en-US');
        this.endDate = formatDate(new Date(), 'd/M/yyyy', 'en-US');
        this.correctiveAction = '';
        this.isOpenTicketsModal = false;
      } else {
        this.toastService.presentToast('Error al crear incidencia', 'danger');
      }
      this.loaderService.hide()

    }
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

  async handleSubsidiarySelect(event: any) {
    this.subsidiarySelect = event.value;
    this.ticketType = 'subsidiary';
    const clienteSelected = await this.ticketsService.getClientsOperator(this.subsidiarySelect)
    console.log(clienteSelected)
    this.selectedCustomerId = clienteSelected.cliente_select_id;
    this.selectedCustomer = clienteSelected.cliente_select;
  }

  async handleType(event: any) {
    const type = event.detail.value;

    if (type == 'areas') {
      this.trampas = [];
      this.ticketType = 'area';
      this.servicesRnp = await this.ticketsService.getRnp(this.subsidiarySelect)
    } else if (type == 'trampas') {
      this.ticketType = 'task';
    }
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
    this.areaSelect = event.detail.value;
  }
  onStartDateChange(event: any) {
    this.startDate = new Date(event.detail.value).toLocaleDateString();
  }

  onEndDateChange(event: any) {
    this.endDate = new Date(event.detail.value).toLocaleDateString();
  }

  handlePriority(event: any) {
    this.prioritySelect = event.detail.value;
  }

  handleResponsible(event: any) {
    this.ResponsibleSelect = event.detail.value;
  }

  async takePicture() {
    this.evidenceImageTicket = await this.projectService.takePictureDocumental() as string
  }

  async setUrlImage(evidenceImage: string, folder: string) {
    if (this.networkService.getNetworkStatus()) {
      const blob = this.projectService.dataUrlToBlob(evidenceImage);
      return await this.projectService.uploadImage(blob, folder);
    } else {
      return evidenceImage
    }
  }
}
