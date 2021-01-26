import React from 'react';
import {getRandomElement} from "../../helpers/utils";
import Header from "../../components/Header";
import {apiGet} from "../../helpers/api";
import PlayerCard from "../../components/PlayerCard";
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";
import {PLAYER_NO_PICTURE} from "../../helpers/consts";

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
        };

        this.restart = this.restart.bind(this);
        this.init = this.init.bind(this);
        this.saveResult = this.saveResult.bind(this);
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
                if (error.message.indexOf("401") !== -1) { req_error = "Oops, seems like you are unauthorized to view this content." }
                if (error.message.indexOf("400") !== -1) { req_error = "Oops, it seems like no teams loaded :(<Br>It's probably related to a server error" }
                self.setState({ error: req_error });
            },
            function() {
                self.setState({ loaded: true });
            }
        );
    }

    init(){
        let scores = {};
        let scores_history = {};
        const team1 = getRandomElement(this.state.teams);
        const team2 = getRandomElement(this.state.teams);
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

    render(){

        let error = this.state.error;
        const is_loading = !this.state.loaded;
        if (is_loading) {
            return (
                <LoadingPage message={"Please wait while loading teams..."} />
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
            [this.state.team1, this.state.team2].map(function(team, idx){

                let details_title = "<div style='border-top:1px solid #ccc; width:100%; margin: 10px 0px; padding-top: 10px;'>Players:</div>";
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
                            <span>${x.name} <span style='opacity:0.6'>(2k rating: ${x.rate})</span></span>
                        </div>`
                    )
                });
                details = details.concat(...arr);
                // }).map(x => `> ${x.name} <span style='opacity:0.6'>(2k rating: ${x.rate})</span>`);

                return <PlayerCard
                    key={"team" + "-" + idx}
                    name={team.name}
                    team={team.conference}
                    team_conference={team.conference}
                    team_division={team.division}
                    details_title={details_title}
                    details={details}
                    // weight_kgs={player.weight_kgs}
                    // height_meters={player.height_meters}
                    // debut_year={player.debut_year}
                    picture={team.logo}
                    // percents={player['3pt_percents']}
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

        // let history_rounds = 0;
        // let teams = Object.keys(this.state.scores_history);
        // if (teams.length > 0) {
        //     history_rounds = this.state.scores_history[teams[0]].length;
        //     alert(history_rounds);
        //     if (history_rounds > 0) history_rounds *= 10;
        // }
        let bottom = 75;

        return (

            <div style={{ paddingTop: "20px" }}>
                <Header />

                <div className="ui link cards centered" style={{margin: "auto", marginBottom:"20px"}}>
                    <button className={"ui button basic blue"} onClick={this.restart}>
                        Restart Game
                    </button>
                    <button className={"ui button basic blue"} style={{ marginLeft: "5px" }} onClick={this.init}>
                        New Game
                    </button>
                </div>
                <div className="ui link cards centered" style={{ display: "flex", textAlign: "center", alignItems: "strech", margin: "auto", marginBottom: "20px" }}>
                    {blocks[0]}
                    <div className={"card in-game"} style={{ border:0, width: 150, boxShadow: "unset", cursor: "default" }}>
                        <div className="ui header" style={againstStyle}>
                            V.S.
                        </div>
                        <button className={"ui button basic blue"} onClick={this.saveResult} style={{ position: "absolute", bottom: bottom }}>
                            Save Result
                        </button>
                    </div>
                    {blocks[1]}
                </div>
            </div>
        );

    }

};