import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  NonNullableFormBuilder,
  FormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { SubmitService } from '../../services/submit.service';
import { SignatureService } from '../../services/signature.service';
import { NetworkService } from '../../services/network.service';
import { ProjectService } from '../../services/project.service';
import { LoggedData } from '../../interfaces/Auth';
import { AuthenticationService } from '../../services/authentication.service';
import { DocumentalChecklistService } from '../../services/documental-checklist.service';
import { TaskChecklistService } from '../../services/task-checklist.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';


@Component({
  selector: 'app-signature-modal',
  templateUrl: './signature-modal.component.html',
  styleUrls: ['./signature-modal.component.scss'],
})
export class SignatureModalComponent implements OnInit {

  emailSignatureValue: string = '';
  lastNameSignatureValue: string = '';
  nameSignatureValue: string = '';
  openSignatureModal: boolean = false;
  activityId: number = 0
  activityType: string = ""
  userdata: LoggedData = { email: '', firstname: '', lastname: '', staffid: 0, role: 0 }
  evidenceType: string = ""


  validateSignForm: FormGroup<{
    namesignature: FormControl<string>;
    lastnamesignature: FormControl<string>;
    emailsignature: FormControl<string>;
    /* signature: FormControl<string>; */
  }> = this.fb.group({
    namesignature: ['', [Validators.required]],
    lastnamesignature: ['', [Validators.required]],
    emailsignature: ['', [Validators.required, Validators.email]],
    /* signature: ['', [this.signatureValidator]] */
  });
  private subscription: Subscription = new Subscription;


  constructor(
    private fb: NonNullableFormBuilder,
    private submitService: SubmitService,
    private signatureService: SignatureService,
    private networkService: NetworkService,
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private documentalChecklistService: DocumentalChecklistService,
    private taskChecklistService: TaskChecklistService,
    private loaderService: LoaderService,
    private toastService: ToastService,
  ) { }

  async ngOnInit() {
    this.subscription = this.submitService.showModal.subscribe(
      (data: boolean) => {
        this.openSignatureModal = data;
      }
    );
    this.subscription = this.submitService.evidenceType.subscribe(
      (data: string) => {
        this.evidenceType = data;
      }
    );
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.activityId = params['project_id']
      this.activityType = params['type']
    })
    this.userdata = await this.authenticationService.getLoggedData()
  }

  closeModal() {
    this.submitService.hide()
  }

  async submitSignatureForm() {
    this.loaderService.show()
    let signaturebase64
    this.signatureService.currentSignature.subscribe(async (signature: any) => {
      signaturebase64 = signature
    })
    const signatureImage = await this.getSignatureImage(signaturebase64, 'singatureEvidence')
    const data = {
      rel_id: this.activityId,
      rel_type: this.activityType,
      id_checklist: 31,
      checklist_answers: this.documentalChecklistService.getAllItems(),
      signaturePicture: signatureImage,
      tasksAnswers: this.taskChecklistService.getGeneralTaskAnswers(),
      evidenceType: this.evidenceType == 'fisica' ? 1 : 2,
      namesignature: this.nameSignatureValue,
      lastnamesignature: this.lastNameSignatureValue,
      emailsignature: this.emailSignatureValue,
      staff_id: this.userdata.staffid,
    };
    const isSubmit = await this.submitService.submitActivity(data)
    if (isSubmit) {
      this.activityId = 0
      this.activityType = ''
      this.documentalChecklistService.clearItems()
      this.taskChecklistService.clearGeneralItems()
      this.evidenceType = ''
      this.nameSignatureValue = ''
      this.lastNameSignatureValue = ''
      this.emailSignatureValue = ''
      this.toastService.presentToast('Plan de trabajo enviado', 'secondary')
    }
    this.loaderService.hide()

    // this.signatureService.currentSignature.subscribe(async (signature) => {
    //   let type = '';
    //   this.activatedRoute.queryParams.subscribe((params) => {
    //     type = params['type'];
    //   });
    //   const blob = this.dataUrlToBlob(signature);
    //   const url = await this.uploadImage(blob, 'singatureEvidence');
    //   this.signaturePicture = url;
    //   if (type == 'task_sup') {
    //     this.saveMinuteTask(this.project_id);
    //   } else {
    //     this.validateTaskChecklists(this.project_id);
    //   }

    //   this.isSpinning = true;
    // });
  }

  async getSignatureImage(signature: any, folder: string) {
    if (this.networkService.getNetworkStatus()) {
      const blob = this.projectService.dataUrlToBlob(signature);
      return await this.projectService.uploadImage(blob, folder);
    } else {
      return signature
    }
  }

}
