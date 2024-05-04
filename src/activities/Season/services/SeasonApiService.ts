import {ISeasonGame, NextGameDataResponse, Season, SeasonMode, SeasonStats} from "../utils/interfaces";
import {apiGet, apiPost} from "../../../helpers/apiV2";

const seasons_route = '/season';

export interface SaveGamePayload {
    team1: string;
    team2: string;
    score1: number;
    score2: number;
    is_comeback: boolean;
    mvp_player?: string;
    total_overtimes: number;
    mode: SeasonMode;
}

class Service {
    getAllSeasons = async(): Promise<Season[]> => {
        const axiosResponse = await apiGet(seasons_route);
        return axiosResponse.data.data;
    }

    createSeason = async (name: string, teams: number[]): Promise<Season> => {
        const axiosResponse = await apiPost(seasons_route, { name, teams });
        return axiosResponse.data.data;
    }

    getNextGameData = async (seasonId: number): Promise<NextGameDataResponse> => {
        const axiosResponse = await apiGet(`/records/season/${seasonId}/next-game`);
        return axiosResponse.data;
    }

    getSeasonStats = async (seasonId: number): Promise<SeasonStats> => {
        const axiosResponse = await apiGet(`/records/season/${seasonId}/stats`);
        return axiosResponse.data.data;
    }

    saveGame = async (seasonId: number, payload: SaveGamePayload): Promise<ISeasonGame> => {
        const axiosResponse = await apiPost(`/records/season/${seasonId}`, payload);
        return axiosResponse.data.data;
    }
}

const SeasonApiService = new Service();
export default SeasonApiService;
