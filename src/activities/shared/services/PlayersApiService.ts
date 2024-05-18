import {apiGet, apiPost} from "../../../helpers/apiV2";
import {Player} from "../../Season/utils/interfaces";

const players_route = '/player';

class Service {
    getAllPlayers = async(): Promise<Player[]> => {
        const axiosResponse = await apiGet(players_route);
        return axiosResponse.data.data;
    }

    movePlayerToDifferentTeam = async(playerName: string, teamName: string): Promise<Player[]> => {
        const axiosResponse = await apiPost(`${players_route}/upsert`, {
            name: playerName,
            team_name: teamName
        });
        return axiosResponse.data.data;
    }
}

const PlayersApiService = new Service();
export default PlayersApiService;
