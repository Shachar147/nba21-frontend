import React, { useEffect } from "react";
import {setToken} from "@helpers/auth";
import { Redirect } from 'react-router'

const LogoutPage = () => {
    useEffect(() => {
        setToken("");
    }, [])

    return <Redirect to="/login" />;
};

export default LogoutPage;