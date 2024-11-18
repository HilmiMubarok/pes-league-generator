import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlayerSetupComponent } from './player-setup.component';

const routes: Routes = [
  {
    path: '',
    component: PlayerSetupComponent
  }
];

@NgModule({
  declarations: [
    PlayerSetupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class PlayerSetupModule { }
