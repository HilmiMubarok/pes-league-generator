import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { MatchActions } from './store/match/match.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'TeamDraw';
  isWelcomePage = false;

  constructor(
    private router: Router,
    private store: Store
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isWelcomePage = event.url === '/';
    });
  }

  ngOnInit(): void {
    // Subscribe to router events
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Load matches from localStorage on every navigation
      const storedMatches = localStorage.getItem('matches');
      if (storedMatches) {
        try {
          const matches = JSON.parse(storedMatches);
          if (matches?.length > 0) {
            console.log('Loading matches from localStorage:', matches.length);
            this.store.dispatch(MatchActions.loadMatchesSuccess({ matches }));
          }
        } catch (error) {
          console.error('Error parsing matches from localStorage:', error);
        }
      }
    });
  }
}
