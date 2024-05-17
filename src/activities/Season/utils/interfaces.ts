export interface ISeasonGame {
    id: number;
    userId: number;
    team1Id: number;
    team2Id: number;
    score1: number;
    score2: number;
    addedAt: string;
    mvpPlayerId?: number;
    is_comeback: boolean;
    total_overtimes: number;
    seasonId: number;
    mode: SeasonMode;
    team1_name: string;
    team2_name: string;
    mvp_player_name?: string;
}
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
    teamName: string;
    teamId: number;
}

export type SeasonMode = 'Regular Season' | 'Playoff' | 'SemiFinals' | 'Finals'

export interface NextGameDataResponse {
    mode: SeasonMode;
    seasonId: number;
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
    playoffStats?: any;
    semiFinalsStats?: any;
    finalsStats: any;
}

export interface MatchupsStats {
    total: number;
    win: number;
    lose: number;
}
export interface SeasonTeamStats {
    total_games: number;
    total_wins: number;
    total_lost: number;
    total_win_percents: string;
    total_scored: number;
    total_suffered: number;
    win_streak: number;
    lose_streak: number;
    total_home_games: number;
    total_away_games: number;
    total_diff: number;
    total_diff_per_game: string;
    total_knockouts: number;
    total_suffered_knockouts: number;
    total_2k_ratings: number;
    total_won_comebacks: number;
    total_lost_comebacks: number;
    total_overtimes: number;
    total_home_wins: number;
    total_home_lost: number;
    total_road_wins: number;
    total_road_lost: number;
    total_comebacks: number;
    total_suffered_comebacks: number;
    days_since_last_knockout: number;
    games_since_last_knockout: number;
    total_ot_wins: number;
    total_ot_lost: number;
    last_knockout_by: string;
    last_knockout_on: string;
    matchups: Record<string, MatchupsStats>;
    records: ISeasonGame[];
    avg_2k_rating: number;
    max_win_streak: number;
    max_lose_streak: number;
    streaks: {
        wins: number[],
        lose: number[]
    };

    teamName?: string;
}
export type SeasonStats = Record<string, SeasonTeamStats>