import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutePathes } from './shared/enums/ERoutes';

const routes: Routes = [
  {
    path: AppRoutePathes.AUTH,
    loadChildren: () => import('./auth/auth.module')
      .then((mod) => mod.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
