import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdditionalAccountsComponent} from './additional-accounts.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material-module/material-module.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TermsOfUseComponent } from '../terms-of-use/terms-of-use.component';
import { ContinueSessionComponent } from '../continue-session/continue-session.component';

const routes: Routes = [{
  path: '',
  component: AdditionalAccountsComponent
}]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MaterialModule
  ],
  exports: [],
  declarations: [AdditionalAccountsComponent, TermsOfUseComponent,
  ContinueSessionComponent], 
  providers: []
})
export class AdditionalAccountsModule { }
