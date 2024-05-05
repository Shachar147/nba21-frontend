import {ISeasonGame, NextGameDataResponse, Season, SeasonMode, SeasonStats} from "../utils/interfaces";
import {apiDelete, apiGet, apiPost, apiPut} from "../../../helpers/apiV2";

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

    getSeasonStats = async (seasonId: number, mode?: SeasonMode): Promise<SeasonStats> => {
        const axiosResponse = await apiGet(`/records/season/${seasonId}/stats${mode ? `?mode=${mode}` : ''}`);
        return axiosResponse.data.data;
    }

    saveGame = async (seasonId: number, payload: SaveGamePayload): Promise<ISeasonGame> => {
        const axiosResponse = await apiPost(`/records/season/${seasonId}`, payload);
        return axiosResponse.data;
    }

    updateGame = async (seasonId: number, gameId: number, payload: SaveGamePayload): Promise<ISeasonGame> => {
        const axiosResponse = await apiPut(`/records/season/${seasonId}/${gameId}`, payload);
        return axiosResponse.data.data;
    }

    deleteSeason = async (seasonId: number): Promise<void> => {
        const axiosResponse = await apiDelete(`/season/${seasonId}`);
        return axiosResponse.data;
    }
}

const SeasonApiService = new Service();
export default SeasonApiService;
