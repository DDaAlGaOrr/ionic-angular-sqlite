import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEsMX from '@angular/common/locales/es-MX';
import { FullCalendarModule } from '@fullcalendar/angular';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';


import { firebaseConfig } from './environments/firebase.config';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage-angular';
import { LoaderComponent } from './components/loader/loader.component';

registerLocaleData(localeEsMX, 'es-MX');

@NgModule({
  declarations: [AppComponent, LoaderComponent],
  imports: [
    BrowserModule,
    IonicStorageModule.forRoot({
      driverOrder: ['sqlite', 'indexeddb', 'localstorage', 'websql']
    }),
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FullCalendarModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  provideFirebaseApp(() => initializeApp(firebaseConfig)),
  provideStorage(() => getStorage()),

  ],
  bootstrap: [AppComponent],
})
export class AppModule { }


// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { RouteReuseStrategy } from '@angular/router';
// import { HttpClientModule } from '@angular/common/http';
// import { registerLocaleData } from '@angular/common';
// import localeEsMX from '@angular/common/locales/es-MX';
// import { AngularFireModule } from '@angular/fire/compat';
// import { FullCalendarModule } from '@fullcalendar/angular';
// import { AngularFireStorageModule } from '@angular/fire/compat/storage';
// import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
// import { provideStorage, getStorage } from '@angular/fire/storage';


// import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

// import { firebaseConfig } from './environments/firebase.config';
// import { AppComponent } from './app.component';
// import { AppRoutingModule } from './app-routing.module';
// import { IonicStorageModule } from '@ionic/storage-angular';
// import { LoaderComponent } from './components/loader/loader.component';

// registerLocaleData(localeEsMX, 'es-MX');

// @NgModule({
//   declarations: [AppComponent, LoaderComponent,],
//   imports: [
//     BrowserModule,
//     // AngularFireModule.initializeApp(firebaseConfig),
//     // AngularFireStorageModule,
//     IonicModule.forRoot(),
//     AppRoutingModule,
//     IonicStorageModule.forRoot({
//       driverOrder: ['sqlite', 'indexeddb', 'localstorage', 'websql']
//     }),
//     HttpClientModule,
//     FullCalendarModule,
//     provideFirebaseApp(() => initializeApp(firebaseConfig)),
//     provideStorage(() => getStorage()),
//   ],
//   providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
//   bootstrap: [AppComponent],
// })
// export class AppModule { }


