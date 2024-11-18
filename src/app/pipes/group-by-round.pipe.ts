import { Pipe, PipeTransform } from '@angular/core';
import { Match } from '../models/match.interface';

interface RoundGroup {
  roundNumber: number;
  matches: Match[];
}

@Pipe({
  name: 'groupByRound'
})
export class GroupByRoundPipe implements PipeTransform {
  transform(matches: Match[]): RoundGroup[] {
    if (!matches || !matches.length) {
      return [];
    }

    // Get unique round numbers
    const rounds = [...new Set(matches.map(match => match.round))];

    // Group matches by round
    return rounds.map(roundNumber => ({
      roundNumber,
      matches: matches.filter(match => match.round === roundNumber)
    })).sort((a, b) => a.roundNumber - b.roundNumber);
  }
}
