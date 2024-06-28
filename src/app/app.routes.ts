import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    // { path: 'login', 
    //   loadChildren:()=>import('./public/login/login.module.LoginPageModule').then(m=>m.)  
    // },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadChildren: () => import('./public/login/login.module').then(m => m.LoginPageModule)
    },
    {
        path: 'members',
        canActivate: [AuthGuard],
        loadChildren: () => import('./members/member-routing.module').then(m => m.MemberRoutingModule)
    },
];