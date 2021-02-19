import React from "react";
import axios from "axios";
import {getServerAddress} from "../config/config";
import {setToken} from "../helpers/auth";
import { Redirect } from 'react-router'
import Logo from "../components/layouts/Logo";
import {Link} from "react-router-dom";
import {LOGIN_DELAY, UNAUTHORIZED_ERROR} from "../helpers/consts";
import TextInput from "../components/inputs/TextInput";
import {apiPost, apiPut} from "../helpers/api";

export default class SyncPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            syncing: false,
            progress: 0,
            state: {
                teams: false,
                players: false,
                playersDetails: false,
                ratings: false,
            },
            requests: [
                '/team/sync',
                '/player/sync',
                '/playerdetails/sync',
                '/team/sync/ratings'
            ],
            names: [
                'Teams',
                'Players',
                'Real-Stats',
                '2K-Ratings',
            ],
            synced: [],
        };

        this.sync = this.sync.bind(this);
    }

    sync() {

        const { syncing, requests } = this.state;

        if (syncing) return;

        this.setState({ syncing: true });

        let promises = [];

        for (let i = 0; i < requests.length; i++) {
            apiPut(this,
                requests[i],
                {},
                async (res) => {
                    // success
                    console.log(res);

                    let { progress, synced, names } = this.state;

                    progress += Math.round((1/requests.length) * 100);
                    synced.push(names[i]);

                    if (synced.length === names.length){
                        progress = 100;
                    }

                    this.setState({ progress, synced });
                },
                function(err) {
                    // error
                    console.log(err);
                },
                function() {
                    // finally
                }
            )
        }
    }

    render() {

        const { syncing, progress, synced } = this.state;

        let buttonStyle = (syncing) ? { opacity: 0.6 , cursor: "default", width: "150px", margin: "auto" } : { width: "150px", margin: "auto" };

        const progress_bar = (syncing) ? (
            <div className="ui indicating progress">
                <div className="bar" style={{ background: "#F10B45", transitionDuration: "300ms", width: progress + "%" }} />
                <div className="label" style={{ margin: "8px 0px" }}>
                    Performing Sync... {progress}%
                    { (synced.length > 0) ?
                        (<div style={{ marginTop: "5px", fontWeight:"normal" }}>Already Synced: {synced.join(", ")}</div>) : undefined
                    }
                </div>
            </div>
        ) : null;

        return (
            <div className={"ui header cards centered"} style={{ width: "100%", height: "100vh", backgroundColor: "#FAFAFB" }} >
                <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                    <Logo />
                    <div className="sub cards header content" style={{ width:"100%", bottom: 0, textAlign: "center", fontSize: "20px", fontWeight: "bold" }}>
                        <div className="sub cards header content centered" style={{ width:"100%", bottom: "0px", margin: "auto" }}>
                            Click on 'Sync' to sync app data with real stats, update teams and players details etc.
                            <br/><br/>
                            {progress_bar}
                            { (syncing) ? (<div><br/><br/></div>) : "" }
                            <div className="ui fluid large blue submit button" onClick={this.sync} style={buttonStyle}>Sync</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}