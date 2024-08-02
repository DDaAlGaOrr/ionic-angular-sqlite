import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { TaskModalService } from '../../services/task-modal.service';
import { TaskChecklistService } from '../../services/task-checklist.service';
import { ProjectService } from '../../services/project.service';
import { LoaderService } from '../../services/loader.service';
import { NetworkService } from '../../services/network.service';
import { ToastService } from '../../services/toast.service';
import { ProgressService } from '../../services/progress.service';
import { TicketsService } from '../../services/tickets.service';
import { LoggedData } from '../../interfaces/Auth';
import { AuthenticationService } from '../../services/authentication.service';

interface modalData {
  taskId: number
  taskControl: string
  taskNumber: string
}

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss'],
})
export class TaskModalComponent implements OnInit {
  checklistItems: any;
  taskStatus: any = '';
  taskControl: string = '';
  task_number: string = '';
  taskId: number = 0
  openTaskModal: boolean = false;
  evidenceImageTask: string = ''
  taskChecked: boolean = false;
  correctiveTaskAction: string = '';
  taskReason: string = '';
  modalTaskAnswerNo = false;
  currentTaskChecklistItem: string = ''
  userdata: LoggedData = { staffid: 0, firstname: '', lastname: '', email: '', role: 0 }
  projectId: number = 0
  checklistId: string = ''

  private subscription: Subscription = new Subscription;
  constructor(
    private taskModalService: TaskModalService,
    private taskChecklistService: TaskChecklistService,
    private projectService: ProjectService,
    private loaderService: LoaderService,
    private networkService: NetworkService,
    private toastService: ToastService,
    private progressService: ProgressService,
    private ticketsService: TicketsService,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
  ) { }

  async ngOnInit() {
    this.subscription = this.taskModalService.showModal.subscribe(
      (showModal: boolean) => {
        this.openTaskModal = showModal
      }
    );
    this.subscription = this.taskModalService.checklistItems.subscribe(
      (checklistItems: any) => {
        this.checklistItems = checklistItems.items
        this.taskStatus = checklistItems.status_task.content
        this.currentTaskChecklistItem = checklistItems.checklist[0].id;
        this.currentTaskChecklistItem = checklistItems.checklist[0].id;
        this.checklistId = checklistItems.checklist[0].id;
      }
    );
    this.subscription = this.taskModalService.modalData.subscribe((modalData: modalData) => {
      this.taskId = modalData.taskId
      this.taskControl = modalData.taskControl
      this.task_number = modalData.taskNumber
    })
    this.activatedRoute.queryParams.subscribe((params) => {
      this.projectId = params['project_id'];
    })
    this.userdata = await this.authenticationService.getLoggedData()
  }

  closeTaskModal() {
    // this.openTaskModal = false;
    this.taskModalService.hide()
  }

  async confirm() {
    this.checklistItems.forEach((item: any) => {
      if (item.id != 258 && item.id != 99 && item.id != 105) {
        this.taskChecklistService.setSelectedItem(item.id, 'yes');
      }
    });
    const items = this.taskChecklistService.getAllItems();
    this.taskChecklistService.setGeneralChecklist(this.taskId, 'task', this.currentTaskChecklistItem, items, this.taskStatus);
    this.taskId = 0;
    this.currentTaskChecklistItem = '';
    this.openTaskModal = false;
    this.taskStatus = '';
    this.toastService.presentToast('Tarea completada.', 'secondary');
    this.taskChecklistService.clearItems();
    await this.progressService.setData('taskProgress', this.taskChecklistService.getGeneralTaskAnswers());
  }

  handleTaskStatus(event: any) {
    this.taskStatus = event.detail.value;
    if (this.taskStatus == '10' || this.taskStatus == '13') {
      this.checklistItems.forEach((item: any) => {
        if (item.id == 258 || item.id == 99 || item.id == 105) {
          this.openModalTaskAnswerNo(true, item.id, 1, false);
        }
        this.taskChecklistService.setSelectedItem(
          item.id,
          'no',
          this.taskStatus == '10' ? ' Equipo Extraviado' : 'Equipo Oculto',
          '',
          false,
          ''
        );
      });
    }
    this.taskStatus = '';
  }

  getSelectedTaskItem(itemId: string) {
    const answer = this.taskChecklistService.getSelectedItem(itemId);
    return answer ? answer.answer : undefined;
  }

  answerTaskYes(idItemChecklist: string) {
    this.taskChecklistService.setSelectedItem(idItemChecklist, 'yes');
    this.toastService.presentToast('Respuesta guardada', 'secondary')
  }

  async setNoTaskAnswer(open: boolean) {
    this.loaderService.show()
    let urlImage = this.evidenceImageTask.length > 0 ? await this.setUrlImage(this.evidenceImageTask, 'taskEvidence') || "" : ''
    this.taskChecklistService.setSelectedItem(this.currentTaskChecklistItem, 'no', this.taskReason, urlImage, this.taskChecked, this.correctiveTaskAction);
    setTimeout(async () => {
      this.currentTaskChecklistItem = ''
      this.taskReason = '';
      this.evidenceImageTask = '';
      this.taskChecked = false;
    }, 5);
    this.modalTaskAnswerNo = open;
    this.loaderService.hide()
    this.toastService.presentToast('Respuesta guardada', 'secondary')
  }

  async openModalTaskAnswerNo(
    open: boolean,
    item_id: any,
    index: any,
    isRnp: any = false
  ) {
    this.currentTaskChecklistItem = item_id;
    if (isRnp) {
      console.log(this.checklistId)
      await this.ticketsService.show(this.taskId, this.userdata.staffid, this.projectId, this.currentTaskChecklistItem, this.checklistId)
    } else {
      this.modalTaskAnswerNo = open;
    }
  }

  async takePicture() {
    this.evidenceImageTask = await this.projectService.takePictureDocumental() as string
  }

  setTaskResponsiveValue(event: any) {
    this.taskChecked = !this.taskChecked;
  }

  handleCorrectiveAction(event: any) {
    this.correctiveTaskAction = event.detail.value;
  }
  cancel() {
    this.modalTaskAnswerNo = false;
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
