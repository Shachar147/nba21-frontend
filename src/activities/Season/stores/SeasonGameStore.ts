import {observable, action, runInAction, makeObservable, computed} from 'mobx';
import {Player, Team} from "../utils/interfaces";
import SeasonApiService from "../services/SeasonApiService";
import {apiGet} from "../../../helpers/apiV2";

export default class SeasonGameStore {

    seasonId: number;
    settings: Record<string, any> = {};

    @observable isLoading = false;
    @observable isSaving = false;
    @observable isSaved = false;
    @observable showStats = true;

    @observable allTeamsById: Record<number, Team> = {};
    @observable teamsData: any = undefined;

    @observable scores:Record<string, number> = {};
    @observable totalOvertimes: number = 0;
    @observable mvpPlayer: string | undefined = undefined;
    @observable isComeback: boolean = false;

    constructor(seasonId: number) {
        makeObservable(this);
        this.seasonId = seasonId;

        this.loadStuff();
    }

    // -- init ------------------------------------------------------------
    async loadStuff() {
        this.setLoading(true);
        await Promise.all([this.loadNextTeams(), this.loadAllTeams(), this.loadUserSettings()]);
        runInAction(() => {
            this.setLoading(false);
        })
    }

    @action
    async loadAllTeams() {
        const teamsResponse = await apiGet("/team");
        const _teams: Team[] = teamsResponse.data.data;
        const allTeamsById: Record<number, Team> = {};
        _teams.forEach((team: Team) => {
            allTeamsById[team.id] = team;
        })
        runInAction(() => {
            this.allTeamsById = allTeamsById;
        })
    }

    @action
    async loadNextTeams() {
        const teamsData = await SeasonApiService.getNextGameData(this.seasonId);
        runInAction(() => {
            this.teamsData = teamsData;

            const team1Name = teamsData.team1.teamName;
            const team2Name = teamsData.team2.teamName;
            const newScores = {...this.scores};
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

    @action
    async saveGame(): Promise<void>{
        this.isSaving = true;
        // todo complete - api call.

        runInAction(() => {
            this.isSaving = false;
            this.isSaved = true;
        });
    }

    // -- computed values -------------------------------------------------
    @computed
    get team1Name(): string {
        return this.teamsData?.team1.teamName;
    }

    @computed
    get team2Name(): string {
        return this.teamsData?.team2.teamName;
    }

    @computed
    get score1(): number {
        return this.scores[this.team1Name];
    }

    @computed
    get score2(): number {
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
    get team1(): Team {
        return this.allTeamsById[this.teamsData.team1.teamId];
    }

    @computed
    get team2(): Team {
        return this.allTeamsById[this.teamsData.team2.teamId];
    }

    @computed
    get mvpPlayerOptions(): Player[]{
        const winner = this.winnerName;
        if (winner == this.team1Name) {
            return this.team1.players;
        } else if (winner == this.team2Name) {
            return this.team2.players;
        }
        return [];
    }
}
