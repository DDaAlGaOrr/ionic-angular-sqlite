import { MbscModule } from '@mobiscroll/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Filesystem } from '@capacitor/filesystem';
import { Plugins } from '@capacitor/core';

const { Permissions } = Plugins;
// import { Permissions, PermissionType } from '@capacitor/permissions';


import { LoaderService } from './services/loader.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    standalone: true,
    imports: [MbscModule, FormsModule, IonicModule, CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
    public environmentInjector = inject(EnvironmentInjector);
    constructor(private platform: Platform,
        private authenticationService: AuthenticationService,
        private router: Router) {
    }
    async checkPermissions() {
        if (Capacitor.isNativePlatform()) {
            const storagePermissions = await Permissions['query']({ name: 'files' });

            if (storagePermissions.state !== 'granted') {
                const permissionRequestResult = await Permissions['request']({ name: 'files' });
                if (permissionRequestResult.state !== 'granted') {
                    throw new Error('Permission to access storage is required');
                }
            }
        }
    } catch(err: any) {
        console.error('Unable to initialize database', err);
    }
}

