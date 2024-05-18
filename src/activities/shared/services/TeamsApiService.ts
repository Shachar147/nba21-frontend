import {apiGet} from "../../../helpers/apiV2";
import {Team} from "../../Season/utils/interfaces";

const teams_route = '/team';

class Service {
    getAllTeams = async(): Promise<Team[]> => {
        const axiosResponse = await apiGet(teams_route);
        return axiosResponse.data.data;
    }
}

const TeamsApiService = new Service();
export default TeamsApiService;
