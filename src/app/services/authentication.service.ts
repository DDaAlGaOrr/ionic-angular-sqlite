import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

import { HttpService } from './http.service';
import { ToastService } from './toast.service';
import { Auth } from '../models/auth';

const TOKEN_KEY = 'userData';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  authenticationState = new BehaviorSubject(false);

  constructor(private storage: Storage, private plt: Platform, private httpService: HttpService, private toastService: ToastService, private router: Router) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
    this.init()
  }

  private async init() {
    await this.storage.create();
  }

  checkToken() {
    this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        this.authenticationState.next(true);
      }
    })
  }

  async login(postData: Auth) {
    (await this.httpService.post('login/auth', postData, true)).subscribe(
      async (response: any) => {
        if (response.status) {
          this.toastService.presentToast('Bienvenido')
          await this.storage.set(TOKEN_KEY, response.result.data);
          this.authenticationState.next(true);
          this.router.navigate(['members', 'projects']);
        }else{
          this.toastService.presentToast('Usuario o contraseña incorrectos')
        }
      },
      (error) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

  async logout() {
    await this.storage.remove(TOKEN_KEY);
    this.authenticationState.next(false);
    this.router.navigate(['login']);
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

}
