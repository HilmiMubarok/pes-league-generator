import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Standing {
  player: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

@Component({
  selector: 'app-standing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './standing.component.html',
  styleUrls: ['./standing.component.css'],
})
export class StandingComponent {
  @Input() standings: Standing[] = [];
}
