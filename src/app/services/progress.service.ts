import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  constructor(
    private storage: Storage
  ) { this.init }

  async init() {
    await this.storage.create();
  }

  async setData(key: string, data: any) {
    await this.storage.set(key, data)
  }

  async getByKey(key: string) {
    return await this.storage.get(key)
  }

  async removeData(key: string) {
    await this.storage.remove(key)
  }

  async clearAll() {
    await this.storage.clear()
  }

  async loadProgress() {
    const savedProgress = await this.storage.get('taskProgress');
    const project_data = await this.storage.get('currentProject');
    const documentalProgress = await this.storage.get('documentalProgress');
    const evidenceType = await this.storage.get('evidenceType');
    if (savedProgress || documentalProgress) {
      return { savedProgress, project_data, documentalProgress, evidenceType };
    } else {
      return [];
    }
  }
}
