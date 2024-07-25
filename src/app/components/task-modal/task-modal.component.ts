import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { TaskModalService } from 'src/app/services/task-modal.service';

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
  checklistItems: any ;
  taskStatus: any = '';
  taskControl: string = '';
  task_number: string = '';
  taskId: number = 0
  openTaskModal: boolean = false;

  private subscription: Subscription = new Subscription;
  constructor(private taskModalService: TaskModalService) { }

  ngOnInit() {
    this.subscription = this.taskModalService.showModal.subscribe(
      (showModal: boolean) => {
        this.openTaskModal = showModal
      }
    );
    this.subscription = this.taskModalService.checklistItems.subscribe(
      (checklistItems: any) => {
        this.checklistItems = checklistItems.items
        this.taskStatus = checklistItems.status_task.content
      }
    );
    this.subscription = this.taskModalService.modalData.subscribe((modalData: modalData) => {
      this.taskId = modalData.taskId
      this.taskControl = modalData.taskControl
      this.task_number = modalData.taskNumber
    })
  }

  closeTaskModal() {
    // this.openTaskModal = false;
    this.taskModalService.hide()
  }

  async confirm() {
    // this.checklist.forEach((item) => {
    //   if (item.id != 258 && item.id != 99 && item.id != 105) {
    //     this.checklistTaskService.setSelectedItem(
    //       item.id,
    //       'yes',
    //       '',
    //       '',
    //       false,
    //       ''
    //     );
    //   }
    // });
    // const items = this.checklistTaskService.getAllItems();
    // this.projectService.setGeneralChecklist(
    //   this.id_task,
    //   'task',
    //   this.checklist_id,
    //   items,
    //   this.taskStatus
    // );
    // this.id_task = '';
    // this.checklist_id = '';
    // this.checklist_answers = [];
    // this.openTaskModal = false;
    // this.taskStatus = '';
    // this.toastService.presentToast('Tarea completada.');
    // this.checklistTaskService.clearItems();
    // await this.storageProjectService.saveProgress(
    //   this.projectService.getAllItems(),
    //   'checklistProgress'
    // );
  }

  handleTaskStatus(event: any) {
    // this.taskStatus = event.detail.value;
    // if (this.taskStatus == '10' || this.taskStatus == '13') {
    //   this.checklist.forEach((item) => {
    //     if (item.id == 258 || item.id == 99 || item.id == 105) {
    //       this.showModalTaskAnswerNo(true, item.id, 1, false);
    //     }
    //     this.checklistTaskService.setSelectedItem(
    //       item.id,
    //       'no',
    //       this.taskStatus == '10' ? ' Equipo Extraviado' : 'Equipo Oculto',
    //       '',
    //       false,
    //       ''
    //     );
    //   });
    // }
    // this.taskStatus = '';
  }

  getSelectedTaskItem(itemId: string) {
    // const answer = this.checklistTaskService.getSelectedItem(itemId);
    // return answer ? answer.answer : undefined;
  }

  answerTaskYes(idItemChecklist: string) {
    // this.checklistTaskService.setSelectedItem(
    //   idItemChecklist,
    //   'yes',
    //   '',
    //   '',
    //   false,
    //   ''
    // );
    // // if (isRnp) {
    // //   this.showTicketsModal(true);
    // // }
  }

  showModalTaskAnswerNo(
    open: boolean,
    item_id: any,
    index: any,
    isRnp: any = false
  ) {
    // this.currentTaskChecklistItem = item_id;
    // if (isRnp) {
    //   this.showTicketsModal(true);
    // } else {
    //   this.modalTaskAnswerNo = open;
    // }
  }

}
