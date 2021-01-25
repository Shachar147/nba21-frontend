import React from 'react';
import {getRandomElement, shuffle} from "../../helpers/utils";
import Header from "../../components/Header";
import {apiGet} from "../../helpers/api";
import PlayerCard from "../../components/PlayerCard";
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";

export default class OneOnOne extends React.Component {

    constructor (props){
        super(props);

        this.state = {
            players: [],
            player1: undefined,
            player2: undefined,
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
            `/player/popular`,
            function(res) {
                let players = res.data;
                self.setState({ players });
                self.init();
            },
            function(error) {
                console.log(error);
                let req_error = error.message;
                if (error.message.indexOf("401") !== -1) { req_error = "Oops, seems like you are unauthorized to view this content." }
                if (error.message.indexOf("400") !== -1) { req_error = "Oops, it seems like no players loaded :(<Br>It's probably related to a server error" }
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
        const player1 = getRandomElement(this.state.players);
        const player2 = getRandomElement(this.state.players);
        scores[player1.name] = 0;
        scores[player2.name] = 0;
        scores_history[player1.name] = [];
        scores_history[player2.name] = [];
        this.setState({
            player1, player2, scores, saved: false, winner: "", loser: "", scores_history
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
                <LoadingPage message={"Please wait while loading players..."} />
            );
        } else if (error || this.state.players.length === 0) {
            error = error || "Oops, it seems like no players loaded :(<Br>It's probably related to a server error";
            return (
                <ErrorPage message={error} />
            );
        }

        const self = this;

        const blocks =
        [this.state.player1, this.state.player2].map(function(player, idx){
            return <PlayerCard
                        key={"player" + "-" + idx}
                        name={player.name}
                        team={player.team.name}
                        position={player.position}
                        weight_kgs={player.weight_kgs}
                        height_meters={player.height_meters}
                        debut_year={player.debut_year}
                        picture={player.picture}
                        percents={player['3pt_percents']}
                        className={"in-game"}
                        style={{ cursor: "default", textAlign: "left" }}
                        singleShot={self.state.scores[player.name]}
                        singleRounds={self.state.scores_history[player.name]}
                        onChange={(e) => {
                            let scores = self.state.scores;
                            scores[player.name] = e.target.value;
                            self.setState({ scores });
                        }}
                        lost={(self.state.saved && self.state.loser === player.name)}
                        winner={(self.state.saved && self.state.winner === player.name)}
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
                            Against
                        </div>
                        <button className={"ui button basic blue"} onClick={this.saveResult} style={{ position: "absolute", bottom: "0px" }}>
                            Save Result
                        </button>
                    </div>
                    {blocks[1]}
                </div>
            </div>
        );

    }

};