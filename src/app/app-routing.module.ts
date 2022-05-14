import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'data-update',
    loadChildren: () => import('./pages/data-update/data-update.module').then(m => m.DataUpdateModule),
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: 'data-update',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
