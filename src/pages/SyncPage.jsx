import React from "react";
import axios from "axios";
import Logo from "../components/layouts/Logo";
import {apiPut} from "../helpers/api";
import Header from "../components/layouts/Header";

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
                '/team/sync/ratings',
                '/playerdetails/sync/bulk/1',
                '/playerdetails/sync/bulk/2',
                '/playerdetails/sync/bulk/3',
                '/playerdetails/sync/bulk/4',
                '/playerdetails/sync/bulk/5',
                '/playerdetails/sync/bulk/6',
                '/playerdetails/sync/bulk/7',
                '/playerdetails/sync/bulk/8',
                '/playerdetails/sync/bulk/9',
                '/playerdetails/sync/bulk/10',
                '/playerdetails/sync/bulk/11',
                '/playerdetails/sync/bulk/12',
                '/playerdetails/sync/bulk/13',
                '/playerdetails/sync/bulk/14',
                '/playerdetails/sync/bulk/15',
                '/playerdetails/sync/bulk/16',
                '/playerdetails/sync/bulk/17',
                '/playerdetails/sync/bulk/18',
                '/playerdetails/sync/bulk/19',
                '/playerdetails/sync/bulk/20',
                '/playerdetails/sync/bulk/21',
                '/playerdetails/sync/bulk/22',
                '/playerdetails/sync/bulk/23',
                '/playerdetails/sync/bulk/24',
                '/playerdetails/sync/bulk/25',
            ],
            names: [
                'Teams',
                'Players',
                '2K-Ratings',
            ],
            real_stats: 0,
            synced: [],
            failed: [],
        };

        this.sync = this.sync.bind(this);
    }

    sync() {

        const { syncing, requests } = this.state;

        if (syncing) return;

        this.setState({ syncing: true });

        axios.defaults.timeout = 100000;

        for (let i = 0; i < requests.length; i++) {
            apiPut(this,
                requests[i],
                {},
                async (res) => {
                    // success
                    console.log(res);

                    let { progress, synced, names, failed, real_stats } = this.state;

                    progress += Math.round((1/requests.length) * 100);

                    if (i >= 3) {
                        real_stats++;

                        if (real_stats === 25){
                            synced.push("Real-Stats");
                        }

                    } else {
                        synced.push(names[i]);
                    }

                    if (synced.length + failed.length === names.length + 25){
                        progress = 100;
                    }
                    if (progress > 100) { progress = 100; }

                    this.setState({ progress, synced, real_stats });
                },
                (err) => {
                    // error
                    console.log(err);

                    let { progress, synced, names, failed, real_stats } = this.state;

                    progress += Math.round((1/requests.length) * 100);

                    if (i >= 3) {
                        real_stats++;

                        if (failed.indexOf("Real-Stats") === -1) {
                            failed.push("Real-Stats");
                        }
                    }
                    else {
                        failed.push(names[i]);
                    }

                    if (synced.length + failed.length === names.length + 25){
                        progress = 100;
                    }

                    if (progress > 100) { progress = 100; }

                    this.setState({ progress, failed, real_stats });
                },
                function() {
                    // finally
                }
            )
        }
    }

    render() {

        const { syncing, progress, synced, failed } = this.state;

        let buttonStyle = (syncing) ? { opacity: 0.6 , cursor: "default", width: "150px", margin: "auto" } : { width: "150px", margin: "auto" };

        const progress_bar = (syncing) ? (
            <div className="ui indicating progress">
                <div className="bar" style={{ background: "#F10B45", transitionDuration: "300ms", width: progress + "%" }} />
                <div className="label" style={{ margin: "8px 0px" }}>
                    Performing Sync... {progress}%
                    { (synced.length > 0) ?
                        (<div style={{ marginTop: "5px", fontWeight:"normal" }}>Already Synced: {synced.join(", ")}</div>) : undefined
                    }
                    { (failed.length > 0) ?
                        (<div style={{ marginTop: "5px", fontWeight:"normal" }}>Failed: {failed.join(", ")}</div>) : undefined
                    }
                </div>
            </div>
        ) : null;

        return (
            <div>
                <Header nologo={true} />
                <div className={"ui header cards centered"} style={{ width: "100%", height: "100vh", backgroundColor: "#FAFAFB" }} >
                    <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                        <Logo />
                        <div className="sub cards header content" style={{ width:"100%", bottom: 0, textAlign: "center", fontSize: "20px", fontWeight: "bold" }}>
                            <div className="sub cards header content centered" style={{ width:"100%", bottom: "0px", margin: "auto" }}>
                                Click on 'Sync' to sync app data with real stats, update teams and players details etc.
                                <br/><br/>
                                {progress_bar}
                                { (syncing) ? (<div><br/><br/></div>) : "" }
                                { (failed.length > 0) ? (<div><br/><br/></div>) : "" }
                                <div className="ui fluid large blue submit button" onClick={this.sync} style={buttonStyle}>Sync</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}