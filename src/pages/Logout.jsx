import React from "react";
import {setToken} from "../helpers/auth";
import { Redirect } from 'react-router'

export default class LogoutPage extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        setToken("");
    }

    render() {
        // setToken(undefined);
        return <Redirect to="/login" />;
    }
}