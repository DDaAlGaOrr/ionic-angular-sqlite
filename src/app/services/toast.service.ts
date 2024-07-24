import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(public toastController: ToastController) { }
  async presentToast(infoMessage: string, color: string) {
    const toast = await this.toastController.create({
      message: infoMessage,
      duration: 2000,
      color: color,
      translucent: true
    });
    toast.present();
  }
}
