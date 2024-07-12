import { Injectable } from '@angular/core';
import { ChecklistAnswer } from '../interfaces/Checklist';

@Injectable({
  providedIn: 'root'
})
export class DocumentalChecklistService {

  constructor() { }

  selectedItems: { [itemId: string]: ChecklistAnswer } = {};

  setSelectedItem(
    itemId: number,
    answer: string,
    description: string = '',
    urlImage: string = ''
  ) {
    if (!this.selectedItems) {
      this.selectedItems = {};
    }
    const existingItem = this.selectedItems[itemId];

    if (existingItem) {
      existingItem.answer = answer;
      existingItem.description = description;
      existingItem.urlImage = urlImage;
    } else {
      this.selectedItems[itemId] = {
        id: itemId,
        answer: answer,
        description: description,
        urlImage: urlImage,
      };
    }
  }

  getSelectedItem(itemId: string) {
    if (!this.selectedItems) {
      return false;
    }
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

  setCurrentProgress(progress: any) {
    this.selectedItems = progress;
  }
}
