import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ProjectService } from '../../services/project.service';
import { DocumentalChecklistService } from '../../services/documental-checklist.service';
import { NetworkService } from '../../services/network.service';
import { DocumentalModalService } from '../../services/documental-modal.service';
import { openNoAnswerDocumentModal } from '../../interfaces/Project';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { ProgressService } from '../../services/progress.service';


@Component({
  selector: 'app-documental-modal',
  templateUrl: './documental-modal.component.html',
  styleUrls: ['./documental-modal.component.scss'],
})
export class DocumentalModalComponent implements OnInit {

  openNoAnswerDocumentModal: boolean = false
  documentalAnswerDescription: string = ''
  evidenceImageDocumental: string = "";
  documentChecklistItemId: number = 0

  private subscription: Subscription = new Subscription;

  constructor(
    private projectService: ProjectService,
    private documentalChecklistService: DocumentalChecklistService,
    private networkService: NetworkService,
    private documentalModalService: DocumentalModalService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private progressService: ProgressService,
  ) { }

  ngOnInit() {
    console.log('Si se inicia')
    this.subscription = this.documentalModalService.modalData.subscribe(
      (data: number) => {
        this.documentChecklistItemId = data;
      }
    );
    this.subscription = this.documentalModalService.showModal.subscribe(
      (showModal: boolean) => {
        this.openNoAnswerDocumentModal = showModal
      }
    );
  }

  closeDocumentalModal(isOpen: boolean) {
    this.openNoAnswerDocumentModal = isOpen;
  }

  async setDocumentalAnswerNo(isOpen: boolean) {
    this.loaderService.show()
    let url = this.evidenceImageDocumental.length > 0 ? await this.setUrlImage(this.evidenceImageDocumental, 'documentalEvidence') || "" : ''
    this.documentalChecklistService.setSelectedItem(this.documentChecklistItemId, 'no', this.documentalAnswerDescription, url);
    this.documentalAnswerDescription = '';
    this.evidenceImageDocumental = '';
    this.openNoAnswerDocumentModal = isOpen;
    this.loaderService.hide()
    this.toastService.presentToast('Respuesta guardada', 'secondary')
    await this.progressService.setData('documentalProgress', this.documentalChecklistService.getAllItems());
  }

  async takePictureDocumental() {
    this.evidenceImageDocumental = await this.projectService.takePictureDocumental() as string
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
