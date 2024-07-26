import { Injectable } from '@angular/core';
import { TaskChecklist, ProjectAnswers } from '../interfaces/Checklist';

@Injectable({
  providedIn: 'root'
})
export class TaskChecklistService {

  constructor() { }
  selectedItems: { [itemId: string]: TaskChecklist } = {};
  taskChecklist: { [rel_id: string]: ProjectAnswers } = {};

  setSelectedItem(
    itemId: string,
    answer: string,
    description: string = '',
    urlImage: string = '',
    customer_responsibility: boolean = false,
    correctiveTaskAction: string = ''
  ) {
    const existingItem = this.selectedItems[itemId];
    if (existingItem) {
      existingItem.answer = answer;
      existingItem.description = description;
      existingItem.urlImage = urlImage;
      existingItem.customer_responsibility = customer_responsibility;
      existingItem.correctiveTaskAction = correctiveTaskAction;
    } else {
      this.selectedItems[itemId] = {
        id: itemId,
        answer: answer,
        description: description,
        urlImage: urlImage,
        customer_responsibility: customer_responsibility,
        correctiveTaskAction: correctiveTaskAction,
      };
    }
  }

  getSelectedItem(itemId: string): TaskChecklist | undefined {
    return this.selectedItems[itemId];
  }

  getAllItems() {
    return this.selectedItems;
  }

  clearItems() {
    this.selectedItems = {};
  }

  getLength() {
    return Object.keys(this.selectedItems).length;
  }

  setGeneralChecklist(
    rel_id: number,
    rel_type: string,
    id_checklist: string,
    checklist_answers: any,
    taskStatus: any = '',
    description: any = ''
  ) {
    if (!this.taskChecklist) {
      this.taskChecklist = {};
    }
    const existingItem = this.taskChecklist[rel_id];
    if (existingItem) {
      existingItem.rel_id = rel_id;
      existingItem.checklist_answers = checklist_answers;
      existingItem.rel_type = rel_type;
      existingItem.id_checklist = id_checklist;
      existingItem.taskStatus = taskStatus;
      existingItem.description = description;
    } else {
      this.taskChecklist[rel_id] = {
        rel_id: rel_id,
        checklist_answers: checklist_answers,
        rel_type: rel_type,
        id_checklist: id_checklist,
        taskStatus: taskStatus,
        description: description,
      };
    }
    console.log(this.taskChecklist)
  }

  getGeneralTaskAnswers() {
    return this.taskChecklist;
  }
  getTaskItemById(id: number) {
    return this.taskChecklist[id];
  }

}

