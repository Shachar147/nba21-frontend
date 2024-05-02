import {Season} from "../utils/interfaces";
import {apiGet} from "../../../helpers/apiV2";

const seasons_route = '/season';

class Service {
    getAllSeasons = async(): Promise<Season[]> => {
        const axiosResponse = await apiGet(seasons_route);
        return axiosResponse.data.data;
    }
}

const SeasonApiService = new Service();
export default SeasonApiService;
