import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { formatDate } from '@angular/common';

import { TicketsService } from '../../services/tickets.service';
import { ToastService } from '../../services/toast.service';
import { ProjectService } from '../../services/project.service';
import { NetworkService } from '../../services/network.service';
import { LoaderService } from '../../services/loader.service';
import { TaskChecklistService } from '../../services/task-checklist.service';
import { TaskModalService } from '../../services/task-modal.service';

@Component({
  selector: 'app-ticket-modal',
  templateUrl: './ticket-modal.component.html',
  styleUrls: ['./ticket-modal.component.scss'],
})
export class TicketModalComponent implements OnInit {
  private subscription: Subscription = new Subscription;

  constructor(
    private ticketsService: TicketsService,
    private toastService: ToastService,
    private projectService: ProjectService,
    private networkService: NetworkService,
    private loaderService: LoaderService,
    private taskChecklistService: TaskChecklistService,
    private taskModalService: TaskModalService,
  ) { }
  evidenceImageTicket: string = '';
  correctiveAction: string = '';
  descriptionTicket: string = '';
  responsibleSelect: string = '';
  prioritySelect: string = '';
  ticketAreaSelect: string = '';
  ticketAreaSelectid: string = '';
  ticketSubsidiarySelect: string = '';
  ticketSubsidiarySelectid: string = '';
  ticketClientSelectId: string = '';
  ticketClientSelect: string = '';
  titleTicket: string = '';
  isOpenTicketsModal: boolean = false;
  endDate: string = '';
  startDate: string = '';
  projectId: string = ''
  staffId: string = ''
  currentTaskChecklistItem: string = ''
  taskId: number = 0
  checklistId: string = ''

  ngOnInit() {
    this.subscription = this.ticketsService.showModal.subscribe(
      (showModal: boolean) => {
        this.isOpenTicketsModal = showModal
      }
    );
    this.subscription = this.ticketsService.rnpData.subscribe(
      (rnpData: any) => {
        console.log(rnpData)
        this.ticketClientSelectId = rnpData[0].userid;
        this.ticketClientSelect = rnpData[0].client_name;

        this.ticketSubsidiarySelectid = rnpData[0].id_subsidiary;
        this.ticketSubsidiarySelect = rnpData[0].company;

        this.ticketAreaSelect = rnpData[0].name;
        this.ticketAreaSelectid = rnpData[0].id;
        this.staffId = rnpData[1]
        this.projectId = rnpData[2]
        this.currentTaskChecklistItem = rnpData[3]
        this.taskId = rnpData[4]
        this.checklistId = rnpData[5]
      }
    );
  }

  async takePictureTicket() {
    this.evidenceImageTicket = await this.projectService.takePictureDocumental() as string
  }

  onEndDateChange(event: any) {
    this.endDate = new Date(event.detail.value).toLocaleDateString();
  }

  onStartDateChange(event: any) {
    this.startDate = new Date(event.detail.value).toLocaleDateString();
  }

  async createTicket() {
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

    if (this.responsibleSelect == '') {
      this.toastService.presentToast('Debes seleccionar a un responsable', 'danger');
      validate = false;
      return;
    }

    if (this.descriptionTicket == '') {
      this.toastService.presentToast('Debes agregar un comentario', 'danger');
      validate = false;
      return;
    }

    if (this.evidenceImageTicket == '') {
      this.toastService.presentToast('Debes agregar una imagen', 'danger');
      validate = false;
      return;
    }

    if (this.startDate == '') {
      this.startDate = formatDate(new Date(), 'd/M/yyyy', 'en-US');
    }

    if (this.responsibleSelect == '1') {
      if (this.endDate == '') {
        this.endDate = formatDate(new Date(), 'd/M/yyyy', 'en-US');
      }
    }



    if (validate) {
      this.ticketsService.hide()
      this.taskModalService.hide()
      this.loaderService.show()
      let urlImage = this.evidenceImageTicket.length > 0 ? await this.setUrlImage(this.evidenceImageTicket, 'ticketEvidence') || "" : ''

      const data = {
        client_id: this.ticketClientSelectId,
        subsidiary_id: this.ticketSubsidiarySelectid,
        area_select: this.ticketAreaSelectid,
        start_date: this.startDate,
        end_date: this.endDate,
        priority: this.prioritySelect,
        responsible: this.responsibleSelect,
        userid: 1,
        department: 16,
        contactid: 1,
        subject: this.titleTicket,
        type: 'area',
        description: this.descriptionTicket,
        url_image: urlImage,
        create_for: 'project',
        project_id: this.projectId,
        staff_id: this.staffId,
        correctiveAction: this.correctiveAction,
      };
      const response = await this.ticketsService.createTicket(data)
      if (response.status) {
        this.toastService.presentToast('Incidencia creada', 'secondary');
        this.ticketClientSelectId = '';
        this.ticketSubsidiarySelectid = '';
        this.ticketClientSelect = '';
        this.ticketAreaSelectid = '';
        this.ticketSubsidiarySelect = '';
        this.startDate = '';
        this.ticketAreaSelect = '';
        this.endDate = '';
        this.prioritySelect = '';
        this.responsibleSelect = '';
        this.isOpenTicketsModal = false;
        this.titleTicket = '';
        this.descriptionTicket = '';
        this.evidenceImageTicket = '';
        this.correctiveAction = '';
        this.startDate = formatDate(new Date(), 'd/M/yyyy', 'en-US');
        this.endDate = formatDate(new Date(), 'd/M/yyyy', 'en-US');
        this.taskChecklistService.setSelectedItem(this.currentTaskChecklistItem, 'no', 'servicio con incidencia', urlImage, false, '');
        const items = this.taskChecklistService.getAllItems();
        this.taskChecklistService.setGeneralChecklist(this.taskId, 'task', this.checklistId, items);
      } else {
        this.toastService.presentToast('Error al crear incidencia', 'danger');
      }
      this.loaderService.hide()
    }
  }

  closeTicketsModal() {
    this.ticketsService.hide()
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
