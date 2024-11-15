// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SavedDataGuard } from './guards/saved-data.guard';

const routes: Routes = [
  { path: '', redirectTo: '/setup', pathMatch: 'full' },
  {
    path: 'setup',
    canActivate: [SavedDataGuard],
    loadComponent: () =>
      import('./components/player-setup/player-setup.component').then(
        (m) => m.PlayerSetupComponent
      ),
  },
  {
    path: 'team-assignment',
    loadComponent: () =>
      import('./components/team-assignment/team-assignment.component').then(
        (m) => m.TeamAssignmentComponent
      ),
  },
  {
    path: 'league-bracket',
    loadComponent: () =>
      import('./components/league-bracket/league-bracket.component').then(
        (m) => m.LeagueBracketComponent
      ),
  },
  { path: '**', redirectTo: '/setup' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
