import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeagueBracketComponent } from './league-bracket.component';

const routes: Routes = [
  {
    path: '',
    component: LeagueBracketComponent
  }
];

@NgModule({
  declarations: [
    LeagueBracketComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class LeagueBracketModule { }
