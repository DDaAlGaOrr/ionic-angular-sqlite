import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DocumentalModalService {
  private itemId = new BehaviorSubject<number>(0);
  modalData = this.itemId.asObservable();
  private _showModal = new BehaviorSubject<boolean>(false);
  showModal = this._showModal.asObservable();

  constructor() { }

  show(itemId: number) {
    this.itemId.next(itemId);
    this._showModal.next(true);
  }

  hide() {
    this.itemId.next(0)
    this._showModal.next(false);
  }
}
