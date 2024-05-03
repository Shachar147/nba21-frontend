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
    conference: string;
    division: string;
    players: Player[];
    _2k_rating?: number;
    // todo complete
}

export interface Player {
    name: string;
    picture: string;
    position: string;
    rate?: number | "N/A";
    _2k_rating?: number;
}

export interface SeasonGameTeam {
    name: string;
    teamId: number;
}