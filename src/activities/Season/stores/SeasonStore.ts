import {observable, action, runInAction, makeObservable} from 'mobx';
import {Season} from "../utils/interfaces";
import SeasonApiService from "../services/SeasonApiService";

export default class SeasonStore {
    @observable isLoading: boolean = false;
    @observable seasons: Season[] = [];

    constructor() {
        makeObservable(this);
        this.loadSeasons();
    }

    @action
    setLoading(loading: boolean) {
        this.isLoading = loading;
    }

    async loadSeasons(){
        this.setLoading(true);
        const allSeasons = await SeasonApiService.getAllSeasons();
        runInAction(() => {
            this.seasons = allSeasons;
            this.setLoading(false);
        })
    }
}
