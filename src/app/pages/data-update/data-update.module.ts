import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataUpdateComponent } from './data-update.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material-module/material-module.module';
import { ContinueSessionComponent } from '../continue-session/continue-session.component';
import { TermsOfUseComponent } from '../terms-of-use/terms-of-use.component';

const routes: Routes = [{
  path: '',
  component: DataUpdateComponent
}]

@NgModule({
  declarations: [
    DataUpdateComponent,
    TermsOfUseComponent,
    ContinueSessionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MaterialModule
  ]
})
export class DataUpdateModule { }
