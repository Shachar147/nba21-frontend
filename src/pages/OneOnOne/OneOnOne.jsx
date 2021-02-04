import React from 'react';
import {formatDate, getRandomElement, isDefined} from "../../helpers/utils";
import Header from "../../components/layouts/Header";
import {apiGet, apiPost} from "../../helpers/api";
import PlayerCard from "../../components/PlayerCard";
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";
import {
    APP_BACKGROUND_COLOR,
    LOADER_DETAILS,
    LOADING_DELAY,
    UNAUTHORIZED_ERROR
} from "../../helpers/consts";
import OneOnOneStats from "./OneOnOneStats";
import StatsTable from "../../components/StatsTable";
import ButtonInput from "../../components/inputs/ButtonInput";
import {buildStatsInformation, BuildStatsTable, statsStyle} from "./OneOnOneHelper";

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
            saving: false,

            loadedStats: false,
            stats: [], // all players stats
            curr_stats: ["Loading Stats..."],
            player_stats: ["Loading Stats..."],

            matchups_values: {
                'Total Previous Matchups': [],
                'Wins': [],
                'Total Scored': [],
                'Total Diff': [],
                'Knockouts': [],
            },
            player_stats_values: {
                'Total Played Games': [],
                'Standing': [],
                'Current Win Streak': [],
                'Current Lose Streak': [],
                'Best Win Streak': [],
                'Worst Lose Streak': [],
                'Total Knockouts': [],
                'Total Diff': [],
                'Total Diff Per Game': [],
            },
            met_each_other: 0,

            view_stats: false,
            loaderDetails: LOADER_DETAILS(),
            general_stats: {
                'total_games': 0,
                'total_games_per_day': {},
                'total_points': 0,
                'total_points_per_day': {},
            }
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
            `/player/popular`,
            function(res) {
                let players = res.data;
                self.setState({ players });
                self.init();
            },
            function(error) {
                console.log(error);
                let req_error = error.message;
                if (error.message.indexOf("401") !== -1) { req_error = UNAUTHORIZED_ERROR }
                if (error.message.indexOf("400") !== -1) { req_error = "Oops, it seems like no players loaded :(<Br>It's probably related to a server error" }
                self.setState({ error: req_error });
            },
            function() {
                setTimeout(async () => {
                    await self.setState({ loaded: true })

                    // initialize stats
                    if (self.canInitStats()){
                        self.initStats();
                    }
                },
                LOADING_DELAY);
            }
        );

        apiGet(this,
            `/records/one-on-one/by-player`,
            function(res) {
                let stats = res.data.data;
                self.setState({ stats });
            },
            function(error) {
                console.log(error);
                let req_error = error.message;
                if (error.message.indexOf("401") !== -1) { req_error = UNAUTHORIZED_ERROR; }
                if (error.message.indexOf("400") !== -1) { req_error = "Oops, it seems like no players loaded :(<Br>It's probably related to a server error" }
                self.setState({ error: req_error });
            },
            async function() {
                await self.setState({ loadedStats: true });

                // initialize stats
                if (self.canInitStats()){
                    self.initStats();
                }
            }
        );
    }

    initStats(){

        const { curr_stats, player_stats, player_stats_values, matchups_values, met_each_other, general_stats } =
            buildStatsInformation(
                this.state.player1,
                this.state.player2,
                this.state.stats,
                this.state.player_stats_values,
                this.state.matchups_values);

        this.setState({ curr_stats, player_stats, player_stats_values, matchups_values, met_each_other, general_stats })
    }

    async init(){
        let scores = {};
        let scores_history = {};
        const player1 = getRandomElement(this.state.players);
        let player2 = getRandomElement(this.state.players);

        // prevent same player
        if (this.state.players.length >= 2) {
            while (player1.name === player2.name) {
                player2 = getRandomElement(this.state.players);
            }
        }

        scores[player1.name] = 0;
        scores[player2.name] = 0;
        scores_history[player1.name] = [];
        scores_history[player2.name] = [];
        await this.setState({
            player1, player2, scores, saved: false, winner: "", loser: "", scores_history
        });

        if (this.state.loaded && this.state.loadedStats){
            this.initStats();
        }
    }

    canInitStats(){
        return this.state.loaded && this.state.loadedStats && this.state.curr_stats.length === 1 && this.state.curr_stats[0] === "Loading Stats...";
    }

    async replaceOne(idx){
        let scores = {};
        let scores_history = {};
        let player1 = this.state.player1;
        let player2 = this.state.player2;

        if (idx === 0){
            player1 = getRandomElement(this.state.players);

            // prevent same player
            if (this.state.players.length >= 2) {
                while (player1.name === player2.name) {
                    player1 = getRandomElement(this.state.players);
                }
            }

        } else if (idx === 1){
            player2 = getRandomElement(this.state.players);

            // prevent same player
            if (this.state.players.length >= 2) {
                while (player1.name === player2.name) {
                    player2 = getRandomElement(this.state.players);
                }
            }
        }

        scores[player1.name] = 0;
        scores[player2.name] = 0;
        scores_history[player1.name] = [];
        scores_history[player2.name] = [];
        await this.setState({
            player1, player2, scores, saved: false, winner: "", loser: "", scores_history
        });
        this.initStats();
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

    async saveResult(){

        this.setState({ saving: true });

        const self = this;
        await apiPost(this,
            `/records/one-on-one`,
            {
                player1: this.state.player1.name,
                player2: this.state.player2.name,
                score1: this.state.scores[this.state.player1.name],
                score2: this.state.scores[this.state.player2.name]
            },
            async function(res) {

                const stats = self.state.stats;

                const response = res.data;
                Object.keys(response).forEach((player_name) => {
                    stats[player_name] = response[player_name];
                });

                let scores = self.state.scores;
                let scores_history = self.state.scores_history;

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

                await self.setState({ saved: true, winner, loser, scores_history, scores, stats });
                self.initStats();
            },
            function(error) {
                console.log(error);
                let req_error = error.message;
                if (error.message.indexOf("401") !== -1) { req_error = UNAUTHORIZED_ERROR; }
                if (error.message.indexOf("400") !== -1) { req_error = "Oops, it seems like no players loaded :(<Br>It's probably related to a server error" }
                self.setState({ error: req_error });
            },
            function() {
                // finally
            }
        );

        this.setState({ saving: false });
    }

    async onSpecificReplace(player, new_player){
        let { scores, scores_history, player1, player2} = this.state;

        if (player1.name === player.name){
            player1 = new_player;
        }
        else if (player2.name === player.name){
            player2 = new_player;
        }

        scores[player1.name] = 0;
        scores[player2.name] = 0;
        scores_history[player1.name] = [];
        scores_history[player2.name] = [];
        await this.setState({
            player1, player2, scores, saved: false, winner: "", loser: "", scores_history
        });
        this.initStats();
    }

    render(){

        let error = this.state.error;
        const is_loading = !this.state.loaded;
        if (is_loading) {
            return (
                <LoadingPage message={"Please wait while loading players..."} loaderDetails={this.state.loaderDetails} />
            );
        } else if (error || this.state.players.length === 0) {
            error = error || "Oops, it seems like no players loaded :(<Br>It's probably related to a server error";
            return (
                <ErrorPage message={error} />
            );
        }

        if (this.state.view_stats){
            return (
                <OneOnOneStats
                    onBack={() => { this.setState({ view_stats: false }) }}
                />
            );
        }

        const { stats } = this.state;

        const blocks =
        [this.state.player1, this.state.player2].map((player, idx) => {
            const _2k_rating = player['_2k_rating'] || 'N/A';
            return <PlayerCard
                        key={"player" + "-" + idx}
                        className={"in-game"}
                        style={{ cursor: "default", textAlign: "left" }}
                        name={player.name}
                        picture={player.picture}
                        position={player.position}
                        debut_year={player.debut_year}
                        details={{
                            _2k_rating: _2k_rating,
                            percents: player['3pt_percents'], // 3pt percents
                            height_meters:player.height_meters,
                            weight_kgs:player.weight_kgs,
                            team: player.team.name,
                        }}
                        stats={{
                            win_streak: stats[player.name]?.win_streak || "0",
                            max_win_streak: stats[player.name]?.max_win_streak || "0",
                            lose_streak: stats[player.name]?.lose_streak || "0",
                            max_lose_streak: stats[player.name]?.max_lose_streak || "0",
                        }}

                        onChange={(e) => {
                            let scores = this.state.scores;
                            scores[player.name] = Number(Math.max(0,e.target.value));
                            this.setState({ scores });
                        }}
                        singleShot={this.state.scores[player.name]}
                        singleRounds={this.state.scores_history[player.name]}
                        lost={(this.state.saved && this.state.loser === player.name)}
                        winner={(this.state.saved && this.state.winner === player.name)}

                        all_players={this.state.players}
                        curr_players={[this.state.player1.name, this.state.player2.name]}
                        onReplace={(e) => { this.replaceOne(idx); }}
                        onSpecificReplace={(new_player) => { this.onSpecificReplace(player, new_player) }}
                    />
        })

        let bottom = 75;
        let teams = Object.keys(this.state.scores_history);
        if (teams.length > 0) {
            let team1 = this.state.scores_history[teams[0]];
            let team2 = this.state.scores_history[teams[1]];
            if (team1.length > 0 && team2.length > 0 && team1[team1.length-1] !== team2[team2.length-1]){
                bottom += 21;
            }
        }

        const { met_each_other } = this.state;
        const plural = (met_each_other > 1) ? "s" : "";
        let matchups_description = `These players met each other ${met_each_other} time${plural}.`;
        if (met_each_other === 0) matchups_description = "This is the first time these players meet each other.";

        // one on one stats
        let general_stats_block = BuildStatsTable(this.state.general_stats);

        return (

            <div style={{ paddingTop: "20px" }}>
                <Header />

                <div className="ui link cards centered" style={statsStyle}>
                    {general_stats_block}
                    <StatsTable
                        title={"Previous Matchups Stats"}
                        marginTop="10px"
                        description={matchups_description}
                        hidden={(met_each_other === 0)}
                        cols={["",this.state.player1.name,this.state.player2.name]}
                        stats={this.state.matchups_values}
                    />
                    <StatsTable
                        title={"Players Individual Stats"}
                        marginTop="10px"
                        cols={["",this.state.player1.name,this.state.player2.name]}
                        stats={this.state.player_stats_values}
                    />
                </div>

                <div className="ui link cards centered" style={{margin: "auto", marginBottom:"5px"}}>
                    <ButtonInput
                        text={"Restart Game"}
                        onClick={this.restart}
                    />
                    <ButtonInput
                        text={"New Game"}
                        style={{ marginLeft:"5px" }}
                        onClick={this.init}
                    />
                    <ButtonInput
                        text={"View Stats"}
                        style={{ marginLeft:"5px" }}
                        onClick={() => { this.setState({ view_stats: true }) }}
                    />
                </div>

                <div className="ui link cards centered" style={{ display: "flex", textAlign: "center", alignItems: "strech", margin: "auto", marginBottom: "20px" }}>
                    {blocks[0]}
                    <div className={"card in-game"} style={{ border:0, width: 100, boxShadow: "unset", cursor: "default", backgroundColor: APP_BACKGROUND_COLOR }}>
                        <ButtonInput
                            text={"Save"}
                            style={{ position: "absolute", bottom: bottom }}
                            onClick={this.saveResult}
                            disabled={this.state.saved || this.state.saving}
                        />
                    </div>
                    {blocks[1]}
                </div>
            </div>
        );

    }

};