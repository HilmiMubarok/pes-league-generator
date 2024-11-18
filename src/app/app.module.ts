import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { teamReducer } from './store/team/team.reducer';
import { playerReducer } from './store/player/player.reducer';
import { matchReducer } from './store/match/match.reducer';
import { TeamEffects } from './store/team/team.effects';
import { PlayerEffects } from './store/player/player.effects';
import { MatchEffects } from './store/match/match.effects';
import { GroupByRoundPipe } from './pipes/group-by-round.pipe';

import { environment } from '../environments/environment';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  declarations: [
    AppComponent,
    GroupByRoundPipe,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    StoreModule.forRoot({
      teams: teamReducer,
      players: playerReducer,
      matches: matchReducer
    }),
    EffectsModule.forRoot([
      TeamEffects,
      PlayerEffects,
      MatchEffects
    ]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
