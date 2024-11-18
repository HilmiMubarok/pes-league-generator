import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  { 
    path: '', 
    component: WelcomeComponent,
    data: { title: 'Welcome' }
  },
  { 
    path: 'team-setup', 
    loadChildren: () => import('./components/team-setup/team-setup.module').then(m => m.TeamSetupModule),
    data: { title: 'Team Setup' }
  },
  { 
    path: 'player-setup', 
    loadChildren: () => import('./components/player-setup/player-setup.module').then(m => m.PlayerSetupModule),
    data: { title: 'Player Setup' }
  },
  { 
    path: 'match-setup', 
    loadChildren: () => import('./components/match-setup/match-setup.module').then(m => m.MatchSetupModule),
    data: { title: 'Match Setup' }
  },
  { 
    path: 'league-bracket', 
    loadChildren: () => import('./components/league-bracket/league-bracket.module').then(m => m.LeagueBracketModule),
    data: { title: 'League Bracket' }
  },
  { 
    path: '**', 
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 64] // [x, y] - adjust for header height
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
