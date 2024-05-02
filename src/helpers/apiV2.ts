import axios from "axios";
import {getServerAddress} from "../config/config";

export async function apiGet(url: string){
    return await axios.get(getServerAddress() + url)
}