import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SavedDataGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const savedMatches = localStorage.getItem('leagueBracketMatches');
    const savedStandings = localStorage.getItem('leagueBracketStandings');

    if (savedMatches && savedStandings) {
      this.router.navigate(['/league-bracket']);
      return false;
    }
    return true;
  }
}
