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

export function apiPost(self, url, data, onSuccess, onError, onFinish){
    axios.post(getServerAddress() + url, data)
        .then(res => {
            onSuccess(res);
        }).catch(function (error) {
        onError(error);
    })
        .then(function () {
            onFinish();
        });
}

export function apiPut(self, url, data, onSuccess, onError, onFinish){
    const httpClient = axios.create();
    httpClient.defaults.timeout = 600000;

    httpClient.put(getServerAddress() + url, data, { timeout: 600000 })
        .then(res => {
            onSuccess(res);
        }).catch(function (error) {
        onError(error);
    })
        .then(function () {
            onFinish();
        });
}