import axios from "axios";
import {getServerAddress} from "../config/config";

export async function apiGet(url: string){
    return await axios.get(getServerAddress() + url)
}

export function apiPost(url: string, data: Record<any, any>){
    return axios.post(getServerAddress() + url, data,{
        headers: {
            'Access-Control-Allow-Origin': '*',
        }})
}