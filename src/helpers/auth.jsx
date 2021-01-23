import Cookies from "js-cookie";
import {isDefined} from "./utils";

export function setToken (token) {
    Cookies.set('token', token);
}

export function getToken(){
    return Cookies.get('token');
}

export function isLoggedOn(){
    // todo complete - check that token is valid, and not expired
    return isDefined(Cookies.get('token')) && Cookies.get('token') !== "";
}