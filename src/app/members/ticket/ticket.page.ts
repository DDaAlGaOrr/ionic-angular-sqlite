import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HttpService } from '../../services/http.service';
import { LoggedData } from '../../interfaces/Auth';
import { TicketsService } from '../../services/tickets.service';
import { ProjectService } from '../../services/project.service';
import { NetworkService } from '../../services/network.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.page.html',
  styleUrls: ['./ticket.page.scss'],
})
export class TicketPage implements OnInit {

  commentForm: string = ''
  inputValue: string = '';
  evidenceImageTicket: any = ''
  userdata: LoggedData = { email: '', firstname: '', lastname: '', staffid: 0, role: 0 }
  tickets_responses: any[] = [];
  description: string = '';
  priority: string = '';
  start_date: string = '';
  status: string = '';
  responsible: string = '';
  subject: string = '';
  subsidiary_id: string = '';
  client_name: string = '';
  ticketId: number = 0

  constructor(
    private httpService: HttpService,
    private activatedRoute: ActivatedRoute,
    private ticketsService: TicketsService,
    private projectService: ProjectService,
    private networkService: NetworkService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private authenticationService: AuthenticationService,
  ) { }

  async ngOnInit() {
    this.userdata = await this.authenticationService.getLoggedData()
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.ticketId = params['ticketId'];
    })
    const response = await this.getTicketdata(this.ticketId)
    this.client_name = response.tickets.client_name;
    this.subsidiary_id = response.tickets.subsidiary_id;
    this.responsible = response.tickets.responsible;
    this.status = response.tickets.status;
    this.priority = response.tickets.priority;
    this.description = response.tickets.description;
    this.start_date = response.tickets.start_date;
    this.subject = response.tickets.subject;
    this.tickets_responses = response.tickets_responses;
  }

  async getTicketdata(ticketId: number) {
    return await this.ticketsService.getTicketdata(ticketId)
  }

  async onSubmit() {
    this.loaderService.show()
    let validate = true
    if (this.inputValue == '') {
      validate = false
      this.toastService.presentToast('Debes agregar un comentario', 'danger')
      this.loaderService.hide()
      return
    }
    if (this.evidenceImageTicket == '') {
      validate = false
      this.toastService.presentToast('Debes agregar una imagen', 'danger')
      this.loaderService.hide()
      return
    }
    const urlImage = await this.setUrlImage(this.evidenceImageTicket, 'ticketEvidenceResponse')
    const data = {
      description: this.inputValue,
      image_url: urlImage,
      ticket_id: this.ticketId,
    };
    const submit = await this.ticketsService.sendEvidenceTicket(data, this.userdata.staffid)
    if (submit) {
      this.toastService.presentToast('Respuesta Guardada', 'secondary')
      this.evidenceImageTicket = ''
      this.inputValue = ''
      this.ngOnInit()
    } else {
      this.toastService.presentToast('Algo salio mal', 'danger')
    }
    this.loaderService.hide()
  }

  async takePictureTicket() {
    this.evidenceImageTicket = await this.projectService.takePictureDocumental()
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
