export interface Season {
    id: number;
    userId: number;
    name: string;
    addedAt: string;
    playedGamesCount: number;
    teamsCount: number;
}

export interface ExtendedSeason extends Season {
    games: any[]; // todo complete
    teams: any[]; // todo complete
}

export interface Team {
    id: number;
    name: string;
    logo: string;
    // todo complete
}