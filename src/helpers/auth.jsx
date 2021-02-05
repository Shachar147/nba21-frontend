import Cookies from "js-cookie";
import {isDefined} from "./utils";
import {apiPost} from "./api";
import jwtDecode from "jwt-decode";

export function setToken (token) {
    Cookies.set('token', token);
}

export function getToken(){
    return Cookies.get('token');
}

export function getUser(){
    const decodedPayload = jwtDecode(getToken())
    return decodedPayload.username;
}

export function isLoggedOn(){

    // if (isDefined(Cookies.get('token')) && Cookies.get('token') !== ""){
    //     let isLoggedOn = true;
    //
    //     apiPost(this,
    //         `/auth/test`,
    //         {},
    //         function(res) {
    //         },
    //         function(error) {
    //             console.log(error);
    //             // if (error.message.indexOf("401") !== -1) {
    //             //     isLoggedOn = false;
    //             // }
    //             debugger;
    //             isLoggedOn = false;
    //         },
    //         function() {
    //         }
    //     );
    //
    //     debugger;
    //     return isLoggedOn;
    // }
    //
    // return false;

    // todo complete - check that token is valid, and not expired
    return isDefined(Cookies.get('token')) && Cookies.get('token') !== "";
}