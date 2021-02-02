import React from 'react';
import {getRandomElement} from "../../helpers/utils";
import Header from "../../components/Header";
import {apiGet} from "../../helpers/api";
import PlayerCard from "../../components/PlayerCard";
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";
import {
    APP_BACKGROUND_COLOR,
    LOADER_DETAILS,
    LOADING_DELAY,
    PLAYER_NO_PICTURE,
    UNAUTHORIZED_ERROR
} from "../../helpers/consts";

export default class Random extends React.Component {

    constructor (props){
        super(props);

        this.state = {
            teams: [],
            team1: undefined,
            team2: undefined,
            loaded: false,
            scores:{

            },
            scores_history:{

            },
            winner: "",
            loser: "",
            saved: false,

            loaderDetails: LOADER_DETAILS(),
        };

        this.restart = this.restart.bind(this);
        this.init = this.init.bind(this);
        this.saveResult = this.saveResult.bind(this);
        this.replaceOne = this.replaceOne.bind(this);
        this.onSpecificReplace = this.onSpecificReplace.bind(this);
    }

    componentDidMount() {
        let self = this;
        apiGet(this,
            `/team`,
            function(res) {
                let teams = res.data.data;
                self.setState({ teams });
                self.init();
            },
            function(error) {
                console.log(error);
                let req_error = error.message;
                if (error.message.indexOf("401") !== -1) { req_error = UNAUTHORIZED_ERROR; }
                if (error.message.indexOf("400") !== -1) { req_error = "Oops, it seems like no teams loaded :(<Br>It's probably related to a server error" }
                self.setState({ error: req_error });
            },
            function() {
                setTimeout(() => {
                    self.setState({ loaded: true })},
                LOADING_DELAY);
            }
        );
    }

    init(){
        let scores = {};
        let scores_history = {};
        const team1 = getRandomElement(this.state.teams);
        let team2 = getRandomElement(this.state.teams);

        // prevent same team
        if (this.state.teams.length >= 2) {
            while (team1.name === team2.name) {
                team2 = getRandomElement(this.state.teams);
            }
        }

        scores[team1.name] = 0;
        scores[team2.name] = 0;
        scores_history[team1.name] = [];
        scores_history[team2.name] = [];
        this.setState({
            team1, team2, scores, saved: false, winner: "", loser: "", scores_history
        })
    }

    replaceOne(idx){
        let scores = {};
        let scores_history = {};
        let team1 = this.state.team1;
        let team2 = this.state.team2;

        if (idx === 0){
            team1 = getRandomElement(this.state.teams);

            // prevent same team
            if (this.state.teams.length >= 2) {
                while (team1.name === team2.name) {
                    team1 = getRandomElement(this.state.teams);
                }
            }
        } else if (idx === 1){
            team2 = getRandomElement(this.state.teams);

            // prevent same team
            if (this.state.teams.length >= 2) {
                while (team1.name === team2.name) {
                    team2 = getRandomElement(this.state.teams);
                }
            }
        }

        scores[team1.name] = 0;
        scores[team2.name] = 0;
        scores_history[team1.name] = [];
        scores_history[team2.name] = [];
        this.setState({
            team1, team2, scores, saved: false, winner: "", loser: "", scores_history
        })
    }

    restart(){
        let scores = this.state.scores;
        let scores_history = this.state.scores_history;
        Object.keys(scores).forEach(function(key, idx){
            scores[key] = 0;
            scores_history[key] = [];
        });
        this.setState({ scores, saved: false, winner: "", loser: "", scores_history });
    }

    saveResult(){
        let scores = this.state.scores;
        let scores_history = this.state.scores_history;

        let arr = Object.keys(scores).map(function(name){
            scores_history[name].push(Number(scores[name]));
            return {
                name: name,
                score: Number(scores[name])
            }
        });

        Object.keys(scores).forEach(function(key, idx){
            scores[key] = 0;
        });

        arr = arr.sort(function(a,b) { return b.score - a.score });

        let winner = arr[0].name;
        let loser = arr[1].name;

        if (arr[0].score === arr[1].score){
            winner = "";
            loser = "";
        }

        this.setState({ saved: true, winner, loser, scores_history, scores });
    }

    async onSpecificReplace(team, new_team){
        let { scores, scores_history, team1, team2} = this.state;

        if (team1.name === team.name){
            team1 = new_team;
        }
        else if (team2.name === team.name){
            team2 = new_team;
        }

        scores[team1.name] = 0;
        scores[team2.name] = 0;
        scores_history[team1.name] = [];
        scores_history[team2.name] = [];
        await this.setState({
            team1, team2, scores, saved: false, winner: "", loser: "", scores_history
        });
        // this.initStats();
    }

    render(){

        let error = this.state.error;
        const is_loading = !this.state.loaded;
        if (is_loading) {
            return (
                <LoadingPage message={"Please wait while loading teams..."} loaderDetails={this.state.loaderDetails} />
            );
        } else if (error || this.state.teams.length === 0) {
            error = error || "Oops, it seems like no teams loaded :(<Br>It's probably related to a server error";
            return (
                <ErrorPage message={error} />
            );
        }

        const self = this;

        const maxPlayers = Math.max(this.state.team1.players.length, this.state.team2.players.length);
        const minHeight = maxPlayers * 51;

        const blocks =
            [this.state.team1, this.state.team2].map((team, idx) => {

                let details_title = "<div style='border-top:1px solid #eaeaea; width:100%; margin: 10px 0px; padding-top: 10px;'>Players:</div>";
                let details = [];

                team.players.forEach(function(player){
                    let rate = (player["_2k_rating"]) ? Number(player["_2k_rating"]) : "N/A";
                    player["rate"] = rate;
                })

                const arr = team.players.sort((a,b) => {

                    let rate1 = (a["rate"] === "N/A") ? 0 : Number(a["rate"]);
                    let rate2 = (b["rate"] === "N/A") ? 0 : Number(b["rate"]);

                    return rate2 - rate1;
                }).map((x) => {
                    return (
                        `<div>
                            <img class="ui avatar image" src=${x.picture} onError="this.src='${PLAYER_NO_PICTURE}';" style="width: 39px;" />
                            <span>${x.name} <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: ${x.rate}</span></span>
                        </div>`
                    )
                });
                details = [details.concat(...arr).join("")];
                // }).map(x => `> ${x.name} <span style='opacity:0.6'>(2k rating: ${x.rate})</span>`);

                return <PlayerCard
                    key={"team" + "-" + idx}
                    name={team.name}
                    team={team.conference + ' - ' + team.division}
                    details_title={details_title}
                    details={details}
                    picture={team.logo}
                    className={"in-game"}
                    style={{ cursor: "default", textAlign: "left" }}
                    descriptionStyle={{ minHeight: minHeight }}
                    singleShot={self.state.scores[team.name]}
                    singleRounds={self.state.scores_history[team.name]}
                    onChange={(e) => {
                        let scores = self.state.scores;
                        scores[team.name] = Math.max(0,e.target.value);
                        self.setState({ scores });
                    }}
                    lost={(self.state.saved && self.state.loser === team.name)}
                    winner={(self.state.saved && self.state.winner === team.name)}
                    imageStyle={{ backgroundColor: "#F2F2F2" }}
                    imgStyle={{ width: 200, margin: "auto", padding: "20px" }}
                    extraContentStyle={{ display: "none" }}
                    onReplace={(e) => {
                        self.replaceOne(idx);
                    }}

                    all_players={this.state.teams}
                    curr_players={[this.state.team1.name, this.state.team2.name]}
                    onSpecificReplace={(new_team) => { this.onSpecificReplace(team, new_team) }}
                />
            })

        const againstStyle = {
            margin: 0,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "auto",
        };

        let bottom = 35;
        let teams = Object.keys(this.state.scores_history);
        if (teams.length > 0) {
            let team1 = this.state.scores_history[teams[0]];
            let team2 = this.state.scores_history[teams[1]];
            if (team1.length > 0 && team2.length > 0 && team1[team1.length-1] !== team2[team2.length-1]){
                bottom += 21;
            }
        }

        return (

            <div style={{ paddingTop: "20px" }}>
                <Header />

                <div className="ui link cards centered" style={{margin: "auto", marginBottom:"5px"}}>
                    <button className={"ui button basic blue"} onClick={this.restart}>
                        Restart Game
                    </button>
                    <button className={"ui button basic blue"} style={{ marginLeft: "5px" }} onClick={this.init}>
                        New Game
                    </button>
                </div>
                <div className="ui link cards centered" style={{ display: "flex", textAlign: "center", alignItems: "strech", margin: "auto", marginBottom: "20px" }}>
                    {blocks[0]}
                    <div className={"card in-game"} style={{ border:0, width: 100, boxShadow: "unset", cursor: "default", backgroundColor: APP_BACKGROUND_COLOR }}>
                        <button className={"ui button basic blue"} onClick={this.saveResult} style={{ position: "absolute", bottom: bottom }}>
                            Save
                        </button>
                    </div>
                    {blocks[1]}
                </div>
            </div>
        );

    }

};