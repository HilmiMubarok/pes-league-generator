import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TeamSetupComponent } from './team-setup.component';

const routes: Routes = [
  {
    path: '',
    component: TeamSetupComponent
  }
];

@NgModule({
  declarations: [
    TeamSetupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class TeamSetupModule { }
