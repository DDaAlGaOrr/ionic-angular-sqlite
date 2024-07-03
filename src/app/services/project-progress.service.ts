import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';


@Injectable({
  providedIn: 'root'
})
export class ProjectProgressService {

  constructor(private storage:Storage) { 
    this.init()
  }

  private async init() {
    await this.storage.create();
  }
}
