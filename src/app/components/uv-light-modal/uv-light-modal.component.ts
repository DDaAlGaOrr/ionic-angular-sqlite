import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { UvLightModalService } from '../../services/uv-light-modal.service';
import { TaskChecklistService } from '../../services/task-checklist.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-uv-light-modal',
  templateUrl: './uv-light-modal.component.html',
  styleUrls: ['./uv-light-modal.component.scss'],
})
export class UvLightModalComponent implements OnInit {

  uvDescription: string = '';
  uv_question_id: string = '';
  currentUvChecklist: any = [];
  uv_checklist_name: string = '';
  checklistMeasureSelected: any = '';
  taskStatus: any = '';
  openModal: boolean = false;
  taskId: number = 0
  checklistId: number = 0
  generalUvChecklist = [
    { question: 'BAJO', value: 1 },
    { question: 'MODERADO', value: 2 },
    { question: 'ALTA', value: 3 },
    { question: 'MUY ALTA', value: 4 },
    { question: 'EXTREMO', value: 5 },
  ];

  pestUvChecklist = [
    { question: 'VERDE', value: 1 },
    { question: 'AMARILLO', value: 2 },
    { question: 'ROJO', value: 3 },
  ];
  private subscription: Subscription = new Subscription;

  constructor(
    private uvLightModalService: UvLightModalService,
    private taskChecklistService: TaskChecklistService,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
    this.subscription = this.uvLightModalService.showModal.subscribe(
      (showModal: boolean) => {
        this.openModal = showModal
        console.log(showModal)
      }
    );
    this.subscription = this.uvLightModalService.taskId.subscribe(
      (taskId: number) => {
        this.taskId = taskId
      }
    );
  }

  answerTaskUvChecklist(value: string, question_id: string) {
    this.taskChecklistService.setSelectedItem(question_id, value);
  }

  async getSelectedUvChecklist(event: any) {
    this.checklistId = event.detail.value;
    if (this.checklistId == 36) {
      this.currentUvChecklist = this.pestUvChecklist;
    } else {
      this.currentUvChecklist = this.generalUvChecklist;
    }
    console.log(this.taskId)
    const res = await this.uvLightModalService.getSelectedUvChecklist(this.checklistId, this.taskId)
    this.uv_checklist_name = res[0].description;
    this.uv_question_id = res[0].id;
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

  setUvChecklist() {
    const items = this.taskChecklistService.getAllItems();
    this.taskChecklistService.setGeneralChecklist(this.taskId, 'uv_task_item', this.checklistId.toString(), items, this.taskStatus, this.uvDescription);
    this.taskId = 0;
    this.checklistId = 0;
    this.currentUvChecklist = [];
    this.uv_checklist_name = '';
    this.uvLightModalService.hide()
    this.toastService.presentToast('Tarea completada.', 'secondary');
    this.taskChecklistService.clearItems();
    this.uvDescription = '';
  }

  openSelectUvMeasure(isOpen: any, indexTask: any) {
    this.uvLightModalService.hide()
  }

}
