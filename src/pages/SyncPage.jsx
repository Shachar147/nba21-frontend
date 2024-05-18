import React, {useEffect, useMemo, useState} from "react";
import axios from "axios";
import Logo from "@components/layout/Logo";
import {apiPut} from "@helpers/api";
import Header from "@components/layout/Header";
import DropdownInput from "../components/inputs/DropdownInput";
import PlayersApiService from "../activities/shared/services/PlayersApiService";
import TeamsApiService from "../activities/shared/services/TeamsApiService";
import Card from "../components/Card";
import ButtonInput from "../components/inputs/ButtonInput";

export default function SyncPage() {

    const [isMoving, setIsMoving] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [progress, setProgress] = useState(0);

    const [state, setState] = useState({
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
    })

    const [selectedPlayer, setSelectedPlayer] = useState(undefined);
    const [selectedTeam, setSelectedTeam] = useState(undefined);
    const [allPlayers, setAllPlayers] = useState([]);
    const [allTeams, setAllTeams] = useState([]);

    const [reRenderCounter, setReRenderCounter] = useState(0);

    useMemo(() => {
        PlayersApiService.getAllPlayers().then((players) => {
            setAllPlayers(players);
            console.log('all players', players);
        });
    }, [reRenderCounter])

    useMemo(() => {
        TeamsApiService.getAllTeams().then((teams) => {
            setAllTeams(teams);
            console.log('all teams', teams);
        })
    }, [reRenderCounter]);

    function sync() {

        const { requests } = state;

        if (isSyncing) {
            return;
        }

        setIsSyncing(true);

        axios.defaults.timeout = 100000;

        for (let i = 0; i < requests.length; i++) {
            apiPut(this,
                requests[i],
                {},
                async (res) => {
                    // success
                    console.log(res);

                    let { synced, names, failed, real_stats } = state;

                    let newProgress = progress;

                    newProgress += Math.round((1/requests.length) * 100);

                    if (i >= 3) {
                        real_stats++;

                        if (real_stats === 25){
                            synced.push("Real-Stats");
                        }

                    } else {
                        synced.push(names[i]);
                    }

                    if (synced.length + failed.length === names.length + 25){
                        newProgress = 100;
                    }
                    if (newProgress > 100) { newProgress = 100; }

                    setProgress(newProgress);

                    setState({ ...state, synced, real_stats });
                },
                (err) => {
                    // error
                    console.log(err);

                    let { synced, names, failed, real_stats } = state;
                    let newProgress = progress;

                    newProgress += Math.round((1/requests.length) * 100);

                    if (i >= 3) {
                        real_stats++;

                        // if (failed.indexOf("Real-Stats") === -1) {
                            failed.push("Real-Stats");
                        // }
                    }
                    else {
                        failed.push(names[i]);
                    }

                    if (synced.length + failed.length === names.length + 25){
                        newProgress = 100;
                    }

                    if (newProgress > 100) { newProgress = 100; }

                    setProgress(newProgress);

                    setState({ ...state, failed, real_stats });
                },
                function() {
                    // finally
                }
            )
        }
    }

    function render() {

        const { synced, failed } = state;

        let buttonStyle = (isSyncing) ? { opacity: 0.6 , cursor: "default", width: "150px", margin: "auto" } : { width: "150px", margin: "auto" };

        const progress_bar = (isSyncing) ? (
            <div className="ui indicating progress">
                <div className="bar" style={{ background: "#F10B45", transitionDuration: "300ms", width: progress + "%" }} />
                <div className="label" style={{ margin: "8px 0px" }}>
                    Performing Sync... {progress}%
                    { (synced.length > 0) ?
                        (<div style={{ marginTop: "5px", fontWeight:"normal" }}>Already Synced: {synced.join(", ")}</div>) : undefined
                    }
                    { (failed.length > 0) ?
                        (<div style={{ marginTop: "5px", fontWeight:"normal" }}>Failed: {[...new Set(failed)].join(", ")}</div>) : undefined
                    }
                </div>
            </div>
        ) : null;

        function renderSelectedPlayerCard(){
            const player = allPlayers.find((p) => p.name === selectedPlayer.name);
            return (
                <div className="ui link cards centered" style={{ margin: "auto" }}>
                    <Card
                        name={`${selectedPlayer?.name}<br/>Currently on: ${player?.team?.name}`}
                        picture={player?.picture}
                        style={{ width: "160px" }}
                        onDelete={() => setSelectedPlayer(undefined)}
                    />
                </div>
            )
        }

        function renderSelectedTeamCard(){
            const team = allTeams.find((t) => t.name === selectedTeam.name);
            return (
                <div className="ui link cards centered" style={{ margin: "auto" }}>
                    <Card
                        name={`${selectedTeam?.name}`}
                        picture={team?.logo}
                        style={{ width: "160px" }}
                        onDelete={() => setSelectedTeam(undefined)}
                    />
                </div>
            )
        }

        function renderManualSync(){
            const options = allPlayers.map((player) => ({ name: player.name }));
            const options2 = allTeams.map((team) => ({ name: team.name }));
            return (
                <div className="flex-col gap-4">
                    <b>Manually move players to other teams:</b>
                    <br/>
                    <div className="manual-sync-container flex-row gap-16 align-items-start justify-content-center">
                        <div className="flex-col gap-4" key={selectedPlayer?.name}>
                            <DropdownInput
                                options={(options)}
                                name={"select_player"}
                                placeholder={"Select Player..."}
                                nameKey={"name"}
                                sortKey={"name"}
                                sort={"asc"}
                                selectedOption={selectedPlayer}
                                valueKey={"name"}
                                idKey={"name"}
                                style={{ width: "300px" }}
                                disabled={options.length === 0}
                                onChange={(player) => {
                                    setSelectedPlayer(player)
                                }}
                            />
                            {!!selectedPlayer && renderSelectedPlayerCard()}
                        </div>
                        <div style={{ height: 40, lineHeight: "30px" }}><b>To:</b></div>
                        <div className="flex-col gap-4" key={selectedTeam?.name}>
                            <DropdownInput
                                options={(options2)}
                                name={"select_team"}
                                placeholder={"Select Team..."}
                                nameKey={"name"}
                                sortKey={"name"}
                                sort={"asc"}
                                valueKey={"name"}
                                idKey={"name"}
                                selectedOption={selectedTeam}
                                style={{ width: "300px" }}
                                disabled={options2.length === 0}
                                onChange={(team) => {
                                    setSelectedTeam(team)
                                }}
                            />
                            {!!selectedTeam && renderSelectedTeamCard()}
                        </div>
                    </div>
                    <ButtonInput
                        text={isMoving ? "Moving..." : "Move"}
                        disabled={!selectedTeam || !selectedPlayer || isMoving}
                        onClick={async (e) => {
                            setIsMoving(true);
                            await PlayersApiService.movePlayerToDifferentTeam(selectedPlayer.name, selectedTeam.name);
                            setReRenderCounter(reRenderCounter+1);
                            setIsMoving(false);
                        }}
                    />
                </div>
            )
        }

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
                                { (isSyncing) ? (<div><br/><br/></div>) : "" }
                                { (failed.length > 0) ? (<div><br/><br/></div>) : "" }
                                <div className="ui fluid large blue submit button" onClick={() => sync()} style={buttonStyle}>Sync</div>
                                <br/><br/>
                                {renderManualSync()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return render();
}