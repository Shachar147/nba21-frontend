export interface Season {
    id: number;
    userId: number;
    name: string;
    addedAt: string;
    playedGamesCount?: number;
    teamsCount?: number;
    teams?: SeasonGameTeam[];
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

export enum SeasonMode {
    'Regular Season' = 'Regular Season',
    'Playoff' = 'Playoff',
    'SemiFinals' = 'SemiFinals',
    'Finals' = 'Finals',
}

export interface NextGameDataResponse {
    mode: SeasonMode;
    isSeasonOver: boolean;
    winner?: string;
    team1: SeasonGameTeam;
    team2: SeasonGameTeam;
    totals: {
        totalTeams: number;
        totalGames: number;
        totalPlayedGames: number;
        remainingGames: number;
    };
    playedGamesByTeam?: Record<number, Record<number, number>>;
    series: {
        active: string[];
        finals: string[];
        semiFinals: string[];
        playoff: string[];
    };
    advancedTo: {
        nextRound: string[];
        finals?: string[];
        semiFinals?: string[];
        playoff?: string[];
    };
    kickedOut: {
        playoff: string[];
        semiFinals: string[];
        swept: string[];
        finals: string[];
    };
    stats?: any;
}
