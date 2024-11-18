# TeamDraw - Random Team Selection for Pro Evolution Soccer Game Nights

A sophisticated web application developed using Angular 16, designed to streamline team selection and tournament organization for Pro Evolution Soccer (PES) game nights. This innovative solution addresses the common issue of player disputes over team choices by implementing a fair, random team assignment system. Beyond team allocation, the application offers a robust league management platform, complete with features like automatic bracket generation, real-time score tracking, and comprehensive standings tables. Whether you're organizing a casual gaming session or a full-fledged tournament, this tool ensures a smooth, conflict-free experience while providing all the necessary management capabilities to run successful PES competitions.

> This project was fully generated with [Codeium Windsurf](https://codeium.com/windsurf)

## Features

- **Team Management**

  - Maintain a list of popular football teams
  - Add and remove teams from different leagues
  - Organized team structure with league categorization

- **Player Management**

  - Support for 3-24 players
  - Individual player name registration
  - Fair team assignment system

- **League Management**
  - Automatic league bracket generation
  - Real-time score tracking
  - Live standings table with:
    - Points
    - Goals For (GF)
    - Goals Against (GA)
    - Goal Difference (GD)
  - Xlsx export functionality for brackets and standings

## Technology Stack

- **Frontend:** Angular 16
- **State Management:** NgRx
- **Styling:** TailwindCSS
- **Storage:** Browser Local Storage
- **Build Tool:** Angular CLI 16.2.16

## Prerequisites

- Node.js (LTS version recommended)
- npm (comes with Node.js)
- Angular CLI v16.2.16

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Development Server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Building for Production

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Usage Flow

1. **Team Setup**

   This section allows you to manage teams and leagues that can be used for player assignments.

   - Add teams to the system
     - Enter team name
     - Select league affiliation
   - Manage existing team list
     - Remove teams from the system

2. **Player Registration**

   - Register individual player names
     - Input names manually
   - Proceed to team assignment
     - Initiate random team allocation
     - View and confirm assignments

3. **Tournament Management**
   - View generated league brackets
   - Enter match scores
     - Input goals for each team
   - Track standings in real-time
     - View points, GF, GA, and GD
   - Export results to Xlsx

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Further Help

To get more help on the Angular CLI use `ng help` or check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
