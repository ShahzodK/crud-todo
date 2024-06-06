import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutePathes } from './shared/enums/ERoutes';
import { authGuard } from './auth/guards/auth.guard';

const routes: Routes = [
  {
    path: AppRoutePathes.AUTH,
    loadChildren: () => import('./auth/auth.module')
      .then((mod) => mod.AuthModule),
  },
  {
    path: AppRoutePathes.HOME,
    loadChildren: () => import('./home/home.module')
      .then((mod) => mod.HomeModule),
    canMatch: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
