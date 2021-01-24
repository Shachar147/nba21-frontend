import axios from "axios";
import {getServerAddress} from "../config/config";

export function apiGet(self, url, onSuccess, onError, onFinish){
    axios.get(getServerAddress() + url,{
        headers: {
            'Access-Control-Allow-Origin': '*',
        }})
        .then(res => {
            onSuccess(res);
        }).catch(function (error) {
            onError(error);
        })
        .then(function () {
            onFinish();
        });
}