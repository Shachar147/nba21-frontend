import React, { useEffect } from "react";
import {setToken} from "@helpers/auth";
// import { Redirect } from 'react-router'

const LogoutPage = () => {
    useEffect(() => {
        setToken("");

        setTimeout(() => {
            window.location.href = "/login";
        }, 100)
    }, []);

    return <></>;
    // return <Redirect to="/login" />;
};

export default LogoutPage;