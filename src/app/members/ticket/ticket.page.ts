import { Component, OnInit } from '@angular/core';

import { HttpService } from '../../services/http.service';
import { LoggedData } from '../../interfaces/Auth';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.page.html',
  styleUrls: ['./ticket.page.scss'],
})
export class TicketPage implements OnInit {

  commentForm: string = ''
  inputValue: string = '';
  evidenceImageTicket: string = ''
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

  constructor(
    private httpService: HttpService
  ) { }

  ngOnInit() {
  }

  async onSubmit() {
    //   const blob = this.dataUrlToBlob(this.evidenceImageTicket);
    //   const url = await this.uploadImage(blob, 'ticketEvidenceResponse');
    //   const data = {
    //     description: this.inputValue,
    //     image_url: url,
    //     ticket_id: this.ticket_id,
    //   };
    //   this.httpService
    //     .post(
    //       `staffs/${this.userdata.staffid}/save_ticket_response`,
    //       JSON.stringify(data),
    //       true
    //     )
    //     .then((observableResult) => {
    //       observableResult.subscribe(
    //         (res: any) => {
    //           this.evidenceImageTicket = '';
    //           this.commentForm.patchValue({
    //             comment: '',
    //           });
    //           console.log(res);
    //           this.load_ticket_data();
    //         },
    //         (error: any) => {
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
  }

  async takePictureTicket() {
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
    //         (err: any) =>
    //           this.androidPermissions.requestPermission(
    //             this.androidPermissions.PERMISSION.CAMERA
    //           )
    //       );
    //   }
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
