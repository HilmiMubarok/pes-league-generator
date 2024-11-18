import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Match } from '../models/match.interface';
import { Player } from '../models/player.interface';
import { Store } from '@ngrx/store';
import { MatchActions } from '../store/match/match.actions';

interface MatchState {
  matches: Match[];
  currentMatchId: string;
}

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private readonly STORAGE_KEY = 'matches';
  private state: MatchState = {
    matches: [],
    currentMatchId: '1'
  };

  constructor(
    private http: HttpClient,
    private store: Store
  ) {
    this.loadFromLocalStorage();
  }

  public loadFromLocalStorage(): void {
    try {
      const storedData = localStorage.getItem(this.STORAGE_KEY);
      if (storedData) {
        this.state = JSON.parse(storedData);
        // Update store with loaded matches
        this.store.dispatch(MatchActions.loadMatchesSuccess({ matches: this.state.matches }));
      }
    } catch (error) {
      console.error('Error loading matches from localStorage:', error);
    }
  }

  public saveToLocalStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    } catch (error) {
      console.error('Error saving matches to localStorage:', error);
      throw error;
    }
  }

  generateMatches(players: Player[], isHomeAndAway: boolean): Observable<Match[]> {
    try {
      // Generate all possible combinations
      const matches: Match[] = [];
      for (let i = 0; i < players.length; i++) {
        for (let j = 0; j < players.length; j++) {
          if (i !== j) { // Avoid self matches
            matches.push({
              id: this.state.currentMatchId,
              player1: { ...players[i] },
              player2: { ...players[j] },
              round: 0, // Will be assigned later
              completed: false,
              player1Score: 0,
              player2Score: 0
            });
            this.state.currentMatchId = (parseInt(this.state.currentMatchId) + 1).toString();
          }
        }
      }

      // If not home and away, keep only half of the matches
      const finalMatches = isHomeAndAway ? matches : matches.filter((match, index) => {
        const reverseMatch = matches.find(m => 
          m.player1.id === match.player2.id && 
          m.player2.id === match.player1.id
        );
        return matches.indexOf(reverseMatch!) > index;
      });

      // Organize matches into rounds
      const organizedMatches = this.organizeIntoRounds(finalMatches);
      
      // Update state and save
      this.state = {
        matches: organizedMatches,
        currentMatchId: this.state.currentMatchId
      };
      this.saveToLocalStorage();
      
      return of(organizedMatches);
    } catch (error) {
      console.error('Error generating matches:', error);
      return of([]);
    }
  }

  updateMatches(matches: Match[]): Observable<Match[]> {
    try {
      // Keep the current match ID but update matches
      this.state = {
        matches,
        currentMatchId: this.state.currentMatchId
      };
      this.saveToLocalStorage();
      return of(matches);
    } catch (error) {
      console.error('Error updating matches:', error);
      return of([]);
    }
  }

  private organizeIntoRounds(matches: Match[]): Match[] {
    const organizedMatches = [...matches];
    const playersPerRound = new Map<number, Set<number>>();
    let currentRound = 1;

    for (let i = 0; i < organizedMatches.length; i++) {
      const match = organizedMatches[i];
      if (match.round === 0) { // Not yet assigned to a round
        // Initialize set for new round if needed
        if (!playersPerRound.has(currentRound)) {
          playersPerRound.set(currentRound, new Set());
        }

        const roundPlayers = playersPerRound.get(currentRound)!;
        
        // Check if both players are available for this round
        if (!roundPlayers.has(match.player1.id) && !roundPlayers.has(match.player2.id)) {
          match.round = currentRound;
          roundPlayers.add(match.player1.id);
          roundPlayers.add(match.player2.id);
        } else {
          // Try to find a suitable round for this match
          let roundFound = false;
          let tryRound = 1;
          while (!roundFound && tryRound <= matches.length) {
            if (!playersPerRound.has(tryRound)) {
              playersPerRound.set(tryRound, new Set());
            }
            const tryRoundPlayers = playersPerRound.get(tryRound)!;
            
            if (!tryRoundPlayers.has(match.player1.id) && !tryRoundPlayers.has(match.player2.id)) {
              match.round = tryRound;
              tryRoundPlayers.add(match.player1.id);
              tryRoundPlayers.add(match.player2.id);
              roundFound = true;
            }
            tryRound++;
          }
        }

        // Move to next round if current round is full
        const maxMatchesPerRound = Math.floor(matches.length / (matches.length / 2));
        const matchesInCurrentRound = organizedMatches.filter(m => m.round === currentRound).length;
        if (matchesInCurrentRound >= maxMatchesPerRound) {
          currentRound++;
        }
      }
    }

    return organizedMatches.sort((a, b) => a.round - b.round);
  }

  getMatches(): Observable<Match[]> {
    return of(this.state.matches);
  }

  updateMatchScore(match: Match): Observable<Match> {
    const index = this.state.matches.findIndex(m => m.id === match.id);
    if (index !== -1) {
      const updatedMatch = { ...match, completed: true };
      this.state.matches[index] = updatedMatch;
      this.saveToLocalStorage();
      return of(updatedMatch);
    }
    return of(match);
  }

  clearMatches(): Observable<void> {
    this.state = {
      matches: [],
      currentMatchId: '1'
    };
    this.saveToLocalStorage();
    return of(void 0);
  }
}
