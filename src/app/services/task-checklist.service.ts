import { Injectable } from '@angular/core';
import { TaskChecklist } from '../interfaces/Checklist';

@Injectable({
  providedIn: 'root'
})
export class TaskChecklistService {

  constructor() { }
  selectedItems: { [itemId: string]: TaskChecklist } = {};

  setSelectedItem(
    itemId: string,
    answer: string,
    description: string,
    urlImage: string = '',
    customer_responsibility: boolean,
    correctiveTaskAction: string
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
    console.log(this.selectedItems);
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
}

