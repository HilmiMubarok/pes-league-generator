import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatchSetupComponent } from './match-setup.component';

const routes: Routes = [
  {
    path: '',
    component: MatchSetupComponent
  }
];

@NgModule({
  declarations: [
    MatchSetupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class MatchSetupModule { }
