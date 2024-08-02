import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

import { HttpService } from './http.service';
import { ToastService } from './toast.service';
import { Auth } from '../interfaces/Auth';
import { NetworkService } from './../services/network.service';
import { StorageService } from './../services/storage.service';


const TOKEN_KEY = 'userData';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  authenticationState = new BehaviorSubject(false);

  constructor(
    private storage: Storage,
    private plt: Platform,
    private httpService: HttpService,
    private toastService: ToastService,
    private router: Router,
    private networkService: NetworkService,
    private storageService: StorageService,
  ) {
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
    if (this.networkService.getNetworkStatus()) {
      (await this.httpService.post('login/auth', JSON.stringify(postData), true)).subscribe(
        async (response: any) => {
          console.log(response)
          if (response.status) {
            this.toastService.presentToast('Bienvenido', 'secondary')
            await this.storage.set(TOKEN_KEY, response.result.data);
            this.authenticationState.next(true);
            this.router.navigate(['members', 'projects']);
          } else {
            this.toastService.presentToast('Usuario o contraseña incorrectos', 'danger')
          }
        },
        (error) => {
          console.error('Error en la solicitud:', JSON.stringify(error, null, 2));
          console.dir(error);
          if (error.status === 0) {
            console.error('Posibles problemas de conexión o configuración CORS.');
          } else {
            console.error('Detalles del error:', error);
          }

        }
      );
    } else {
      const auth = await this.storageService.authUser(postData)
      if (auth) {
        this.toastService.presentToast('Bienvenido', 'secondary')
        await this.storage.set(TOKEN_KEY, auth);
        this.authenticationState.next(true);
        this.router.navigate(['members', 'projects']);
      } else {
        this.toastService.presentToast('Usuario o contraseña incorrectos', 'danger')
      }
    }
  }

  async logout() {
    await this.storage.remove(TOKEN_KEY);
    this.authenticationState.next(false);
    this.router.navigate(['login']);
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

  async getLoggedData() {
    return await this.storage.get(TOKEN_KEY)
  }


}
