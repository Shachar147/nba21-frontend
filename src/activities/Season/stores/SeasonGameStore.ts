import {observable, action, runInAction, makeObservable, computed} from 'mobx';
import {NextGameDataResponse, Player, SeasonStats, Team} from "../utils/interfaces";
import SeasonApiService, {SaveGamePayload} from "../services/SeasonApiService";
import {apiGet} from "../../../helpers/apiV2";
import {buildStatsInformation} from "../../shared/OneOnOneHelper";
import {percents, what} from "../utils/consts";
import {winsAndMatchupsSort} from "../../../helpers/sort";

export default class SeasonGameStore {

    seasonId: number;
    settings: Record<string, any> = {};

    @observable isLoading = false;
    @observable isSaving = false;
    @observable isSaved = false;
    @observable isUpdated = false;
    @observable savedGameId: number | undefined = undefined;
    @observable showStats = true;

    @observable viewStatsPage = false;
    @observable selectedTeam: string | undefined = undefined;

    @observable allTeams: Team[] = [];
    @observable teamsData: NextGameDataResponse | undefined  = undefined;

    @observable seasonStats: SeasonStats | undefined = undefined;
    @observable regularSeasonStats: SeasonStats | undefined = undefined;
    @observable statsInfo: Record<any, any> | undefined = undefined; // todo complete: typing

    @observable scores:Record<string, number> = {};
    @observable totalOvertimes: number = 0;
    @observable mvpPlayer: string | undefined = undefined;
    @observable isComeback: boolean = false;

    constructor(seasonId: number) {
        makeObservable(this);
        this.seasonId = seasonId;
        this.viewStatsPage = window.location.href.includes("/stats");

        this.loadStuff();
    }

    // -- init ------------------------------------------------------------
    async loadStuff() {
        this.setLoading(true);
        await Promise.all([this.loadNextTeams(), this.loadAllTeams(), this.loadUserSettings()]);
        await this.initStats(); // must be after all teams loaded.
        runInAction(() => {
            this.setLoading(false);
        });
    }

    @action
    resetSettings(){
        this.isSaved = false;
        this.savedGameId = undefined;
        this.isSaving = false;
        this.isComeback = false;
        this.mvpPlayer = undefined;
        this.totalOvertimes = 0;
        this.isUpdated = false;
    }

    async nextGame(){
        this.setLoading(true);
        this.resetSettings();
        await Promise.all([this.loadNextTeams(), this.initStats()]);
        runInAction(() => {
            this.setLoading(false);
        });
    }

    @action
    async loadAllTeams() {
        const teamsResponse = await apiGet("/team");
        const _teams: Team[] = teamsResponse.data.data;
        this.allTeams = _teams;
    }

    @computed
    get allTeamsById(): Record<number, Team> {
        const _allTeamsById: Record<number, Team> = {};
        this.allTeams.forEach((team: Team) => {
            _allTeamsById[team.id] = team;
        })
        return _allTeamsById;
    }

    @computed
    get allTeamsByName(): Record<string, Team> {
        const _allTeamsById: Record<string, Team> = {};
        this.allTeams.forEach((team: Team) => {
            _allTeamsById[team.name] = team;
        })
        return _allTeamsById;
    }

    @action
    async loadNextTeams() {
        const teamsData = await SeasonApiService.getNextGameData(this.seasonId);
        runInAction(() => {
            this.teamsData = teamsData;

            const team1Name = teamsData.team1?.teamName;
            const team2Name = teamsData.team2?.teamName;
            const newScores: Record<string, number> = {};
            newScores[team1Name] = 0;
            newScores[team2Name] = 0;
            this.scores = newScores;
        })
    }

    @action
    async loadUserSettings(){
        const res = await apiGet('/user/settings');
        const data: any[] = res.data.data;
        const loadedSettings: Record<string, any> = {};
        data.forEach((setting) => {
            loadedSettings[setting.name.toLowerCase()] = setting.value;
        });
        runInAction(() => {
            this.settings = loadedSettings;
        })
    }

    @action
    async initStats(){

        const allStats = await SeasonApiService.getSeasonStats(this.seasonId)

        const rStats = await SeasonApiService.getSeasonStats(this.seasonId, 'Regular Season')
        runInAction(() => {
            this.regularSeasonStats = rStats;
            this.seasonStats = rStats;
        })

        if (this.teamsData && this.teamsData?.mode != 'Regular Season') {
            const stats = await SeasonApiService.getSeasonStats(this.seasonId, this.teamsData.mode)
            runInAction(() => {
                this.seasonStats = stats;
            })
        }

        const player_stats_values = {
            'Total Played Games': [],
            'Standing': [],
            'Current Win Streak': [],
            'Current Lose Streak': [],
            'Best Win Streak': [],
            'Worst Lose Streak': [],
            'Total Knockouts': [],
            'Total Diff': [],
            'Total Diff Per Game': [],
        };
        const matchups_values = {
            'Total Previous Matchups': [],
            'Wins': [],
            'Total Scored': [],
            'Total Diff': [],
            'Knockouts': [],
        }
        const statsInfo =
            buildStatsInformation(
                this.team1,
                this.team2,
                allStats,
                player_stats_values,
                matchups_values,
                what,
                percents
            );
        runInAction(() => {
            this.statsInfo = { ... statsInfo };
        })
    }

    @action
    setLoading(loading: boolean) {
        this.isLoading = loading;
    }

    // -- actions ---------------------------------------------------------
    @action
    setShowStats(showStats: boolean) {
        this.showStats = showStats;
    }

    @action
    setMvpPlayer(mvpPlayer?: string) {
        this.mvpPlayer = mvpPlayer;
    }

    @action
    setTotalOvertimes(totalOvertimes: number) {
        this.totalOvertimes = totalOvertimes;
    }

    @action
    setScores(scores: Record<string, number>) {
        this.scores = {...scores};
    }

    @action
    setIsComeback(isComeback: boolean) {
        this.isComeback = isComeback;
    }

    @computed get payload(): SaveGamePayload | undefined {
        if (!this.team1Name || !this.team2Name || !this.teamsData) {
            return;
        }

        return {
            team1: this.team1Name,
            team2: this.team2Name,
            score1: this.score1,
            score2: this.score2,
            is_comeback: this.isComeback,
            mvp_player: this.mvpPlayer,
            total_overtimes: this.totalOvertimes,
            mode: this.teamsData.mode
        };
    }

    @action
    async saveGame(): Promise<void>{
        const payload = this.payload;
        if (!this.team1Name || !this.team2Name || !this.teamsData || !payload) {
            return;
        }

        this.isSaving = true;

        const createdGame = await SeasonApiService.saveGame(this.seasonId, payload);
        runInAction(() => {
            this.isSaving = false;
            this.isSaved = true;
            this.savedGameId = createdGame.id;
        });

        // setTimeout(() => {
        //     window.location.reload();
        // }, 1);
    }

    @action
    async updateGame(gameId: number): Promise<void> {
        const payload = this.payload;
        if (!this.team1Name || !this.team2Name || !this.teamsData || !payload) {
            return;
        }

        this.isUpdated = false;
        this.isSaving = true;

        await SeasonApiService.updateGame(this.seasonId, gameId, payload);
        runInAction(() => {
            this.isSaving = false;
            this.isSaved = true;
            this.isUpdated = true;
            this.savedGameId = gameId;
        });
    }

    @action
    setViewStatsPage(viewStatsPage: boolean, specificTeam?: string) {
        this.viewStatsPage = viewStatsPage;

        if (!viewStatsPage) {
            this.selectedTeam = undefined;
        } else if (specificTeam){
            this.selectedTeam = specificTeam;
        }
    }

    // -- computed values -------------------------------------------------
    @computed
    get team1Name(): string | undefined {
        return this.teamsData?.team1?.teamName;
    }

    @computed
    get team2Name(): string | undefined {
        return this.teamsData?.team2?.teamName;
    }

    @computed
    get score1(): number {
        if (!this.team1Name){
            return 0;
        }
        return this.scores[this.team1Name];
    }

    @computed
    get score2(): number {
        if (!this.team2Name){
            return 0;
        }
        return this.scores[this.team2Name];
    }

    @computed
    get winnerName(): string | undefined {
        if (this.score1 > this.score2) {
            return this.team1Name;
        } else if (this.score2 > this.score1) {
            return this.team2Name;
        } else {
            return undefined;
        }
    }

    @computed
    get team1(): Team | undefined {
        const teamId = this.teamsData?.team1?.teamId;
        if (!teamId) {
            return undefined;
        }
        return this.allTeamsById[teamId];
    }

    @computed
    get team2(): Team | undefined {
        const teamId = this.teamsData?.team2?.teamId;
        if (!teamId) {
            return undefined;
        }
        return this.allTeamsById[teamId];
    }

    @computed
    get mvpPlayerOptions(): Player[]{
        const winner = this.winnerName;
        if (winner == this.team1Name) {
            return this.team1?.players ?? [];
        } else if (winner == this.team2Name) {
            return this.team2?.players ?? [];
        }
        return [];
    }

    getTeamPlace(teamName: string): number {
        const teamStats = {...this.regularSeasonStats};
        Object.keys(teamStats).forEach((teamName) => {
            teamStats[teamName]["teamName"] = teamName;
        });
        const teamsByStanding = Object.values(teamStats).sort(winsAndMatchupsSort);
        return teamsByStanding.findIndex((t) => t.teamName == teamName) + 1;
    }
}
