import { Team } from '../models/team.interface';

export const DEFAULT_TEAMS: Team[] = [
  // Premier League Teams (league_id: 1)
  {
    id: 1,
    league_id: 1,
    name: 'Manchester United',
  },
  {
    id: 2,
    league_id: 1,
    name: 'Manchester City',
  },
  {
    id: 3,
    league_id: 1,
    name: 'Liverpool',
  },
  {
    id: 4,
    league_id: 1,
    name: 'Chelsea',
  },
  {
    id: 5,
    league_id: 1,
    name: 'Arsenal',
  },
  {
    id: 18,
    league_id: 1,
    name: 'Tottenham Hotspur',
  },

  // La Liga Teams (league_id: 2)
  {
    id: 6,
    league_id: 2,
    name: 'Real Madrid',
  },
  {
    id: 7,
    league_id: 2,
    name: 'Barcelona',
  },
  {
    id: 8,
    league_id: 2,
    name: 'Atletico Madrid',
  },
  {
    id: 9,
    league_id: 2,
    name: 'Sevilla',
  },

  // Serie A Teams (league_id: 3)
  {
    id: 10,
    league_id: 3,
    name: 'Juventus',
  },
  {
    id: 11,
    league_id: 3,
    name: 'Inter Milan',
  },
  {
    id: 12,
    league_id: 3,
    name: 'AC Milan',
  },
  {
    id: 13,
    league_id: 3,
    name: 'Napoli',
  },

  // Bundesliga Teams (league_id: 4)
  {
    id: 14,
    league_id: 4,
    name: 'Bayern Munich',
  },
  {
    id: 15,
    league_id: 4,
    name: 'Borussia Dortmund',
  },
  // {
  //   id: 16,
  //   league_id: 4,
  //   name: 'RB Leipzig'
  // },

  // Ligue 1 Teams (league_id: 5)
  {
    id: 17,
    league_id: 5,
    name: 'Paris Saint-Germain',
  },
  // {
  //   id: 18,
  //   league_id: 5,
  //   name: 'Marseille'
  // },
  // {
  //   id: 19,
  //   league_id: 5,
  //   name: 'Lyon'
  // },

  // Eredivisie Teams (league_id: 6)
  // {
  //   id: 20,
  //   league_id: 6,
  //   name: 'Ajax'
  // },
  // {
  //   id: 21,
  //   league_id: 6,
  //   name: 'PSV Eindhoven'
  // },
  // {
  //   id: 22,
  //   league_id: 6,
  //   name: 'Feyenoord'
  // },

  // Portuguese Primeira Liga Teams (league_id: 7)
  // {
  //   id: 23,
  //   league_id: 7,
  //   name: 'Porto'
  // },
  // {
  //   id: 24,
  //   league_id: 7,
  //   name: 'Benfica'
  // },
  // {
  //   id: 25,
  //   league_id: 7,
  //   name: 'Sporting CP'
  // },

  // Brazilian Série A Teams (league_id: 8)
  // {
  //   id: 26,
  //   league_id: 8,
  //   name: 'Flamengo'
  // },
  // {
  //   id: 27,
  //   league_id: 8,
  //   name: 'Palmeiras'
  // },
  // {
  //   id: 28,
  //   league_id: 8,
  //   name: 'Santos'
  // }
];
