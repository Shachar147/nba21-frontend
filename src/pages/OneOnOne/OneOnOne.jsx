import React from 'react';
import {getRandomElement, isDefined} from "../../helpers/utils";
import Header from "../../components/Header";
import {apiGet, apiPost} from "../../helpers/api";
import PlayerCard from "../../components/PlayerCard";
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";
import {APP_BACKGROUND_COLOR, UNAUTHORIZED_ERROR} from "../../helpers/consts";
import {Link} from "react-router-dom";
import OneOnOneStats from "./OneOnOneStats";

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
            // `/player/popular?names=James Harden,Stephen Curry,LeBron James,Klay Thompson,Tristan Thompson,Kevin Durant`,
            // `/player/popular?names=Kevin Durant,James Harden`,
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
                self.setState({ loaded: true });
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
            function() {
                self.setState({ loadedStats: true });
            }
        );
    }

    initStats(){

        const { player1, player2, stats, player_stats_values, matchups_values } = this.state;

        const noStats = { records: [], win_streak: 0, lose_streak: 0, max_lose_streak: 0, max_win_streak: 0, total_knockouts: 0, total_diff: 0, total_diff_per_game: 0, total_games:0, total_wins: 0, total_lost: 0, total_win_percents: "" };

        const stats1 = isDefined(stats[player1.name]) ? stats[player1.name] : Object.assign({},noStats);
        const stats2 = isDefined(stats[player2.name]) ? stats[player2.name] : Object.assign({},noStats);

        const curr_stats = [];
        const player_stats = [];

        // stats counter
        let met_each_other = 0;
        let mutual_games_wins1 = 0;
        let mutual_scored1 = 0;
        let mutual_scored2 = 0;
        let mutual_knockouts1 = 0;
        let mutual_knockouts2 = 0;

        const arr = (stats1.records.length > stats2.records.length) ? stats1.records : stats2.records; // in case one of them is empty

        arr.forEach((record) => {
            if ((record.player1_name === player1.name && record.player2_name === player2.name) || (record.player1_name === player2.name && record.player2_name === player1.name)) {

                // met each other
                met_each_other += 1;

                if (record.player1_name === player1.name){

                    // total scored (for diff)
                    mutual_scored1 += record.score1;
                    mutual_scored2 += record.score2;

                    // counting player1 wins in these mutual games
                    if (record.score1 > record.score2) mutual_games_wins1+=1;

                    // knockouts
                    if (record.score1 === 0 && record.score2 > 0) mutual_knockouts2 += 1;
                    else if (record.score2 === 0 && record.score1 > 0) mutual_knockouts1 += 1;

                } else if (record.player2_name === player1.name) {

                    // total scored (for diff)
                    mutual_scored1 += record.score2;
                    mutual_scored2 += record.score1;

                    // counting player1 wins in these mutual games
                    if (record.score2 > record.score1) mutual_games_wins1+=1;

                    // knockouts
                    if (record.score1 === 0 && record.score2 > 0) mutual_knockouts1 += 1;
                    else if (record.score2 === 0 && record.score1 > 0) mutual_knockouts2 += 1;
                }
            }
        });

        // met each other stat
        if (met_each_other === 0) {
            curr_stats.push("This is the first time these players meet each other.");
        } else {
            const plural = (met_each_other > 1) ? "s" : "";

            let mutual_games_wins2 = met_each_other - mutual_games_wins1;
            if (player1.name === player2.name){
                mutual_games_wins1 = met_each_other;
                mutual_games_wins2 = met_each_other;
            }

            // matchups stats
            curr_stats.push(`These players met each other ${met_each_other} time${plural}.`);
            curr_stats.push(`Wins: ${mutual_games_wins1} - ${mutual_games_wins2}`);
            curr_stats.push(`Total Scored: ${mutual_scored1} - ${mutual_scored2}`);
            curr_stats.push(`Total Diff: ${Math.max(0,mutual_scored1-mutual_scored2)} - ${Math.max(0,mutual_scored2-mutual_scored1)}`);
            curr_stats.push(`Knockouts: ${mutual_knockouts1} - ${mutual_knockouts2}`);

            // matchups stats - table
            // matchups_values['Total Previous Matchups'] = [met_each_other,met_each_other];
            matchups_values['Wins'] = [mutual_games_wins1,mutual_games_wins2];
            matchups_values['Total Scored'] = [mutual_scored1,mutual_scored2];
            matchups_values['Total Diff'] = [Math.max(0,mutual_scored1-mutual_scored2), Math.max(0,mutual_scored2-mutual_scored1)];
            matchups_values['Knockouts'] = [mutual_knockouts1, mutual_knockouts2];
        }

        // player stats
        player_stats.push(`Total Played Games: ${stats1.total_games} - ${stats2.total_games}`);
        player_stats.push(`Standing: ${stats1.total_wins}W ${stats1.total_lost}L ${(stats1.total_win_percents) ? '(' + stats1.total_win_percents + ')' : ''} - ${stats2.total_wins}W ${stats2.total_lost}L ${(stats2.total_win_percents) ? '(' + stats2.total_win_percents + ')' : ''}`);
        player_stats.push(`Current Win Streak: ${stats1.win_streak} - ${stats2.win_streak}`);
        player_stats.push(`Current Lose Streak: ${stats1.lose_streak} - ${stats2.lose_streak}`);
        player_stats.push(`Best Win Streak: ${stats1.max_win_streak} - ${stats2.max_win_streak}`);
        player_stats.push(`Worst Lose Streak: ${stats1.max_lose_streak} - ${stats2.max_lose_streak}`);
        player_stats.push(`Total Knockouts: ${stats1.total_knockouts} - ${stats2.total_knockouts}`);
        player_stats.push(`Total Diff: ${stats1.total_diff} / ${stats2.total_diff}`);
        player_stats.push(`Total Diff Per Game: ${stats1.total_diff_per_game} / ${stats2.total_diff_per_game}`);

        // player stats - table
        player_stats_values['Total Played Games'] = [stats1.total_games, stats2.total_games];
        player_stats_values['Standing'] = [`${stats1.total_wins}W ${stats1.total_lost}L ${(stats1.total_win_percents)}`, `${stats2.total_wins}W ${stats2.total_lost}L ${(stats2.total_win_percents)}`];
        player_stats_values['Current Win Streak'] = [stats1.win_streak, stats2.win_streak];
        player_stats_values['Current Lose Streak'] = [stats1.lose_streak, stats2.lose_streak];
        player_stats_values['Best Win Streak'] = [stats1.max_win_streak, stats2.max_win_streak];
        player_stats_values['Worst Lose Streak'] = [stats1.max_lose_streak, stats2.max_lose_streak];
        player_stats_values['Total Knockouts'] = [stats1.total_knockouts, stats2.total_knockouts];
        player_stats_values['Total Diff'] = [stats1.total_diff, stats2.total_diff];
        player_stats_values['Total Diff Per Game'] = [stats1.total_diff_per_game, stats2.total_diff_per_game];

        this.setState({ curr_stats, player_stats, player_stats_values, matchups_values, met_each_other })
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
                <LoadingPage message={"Please wait while loading players..."} />
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

        // initialize stats
        if (this.canInitStats()){
            this.initStats();
        }

        const self = this;

        const blocks =
        [this.state.player1, this.state.player2].map((player, idx) => {
            const _2k_rating = player['_2k_rating'] || 'N/A';
            return <PlayerCard
                        key={"player" + "-" + idx}
                        name={player.name}
                        team={player.team.name}
                        position={player.position}
                        weight_kgs={player.weight_kgs}
                        height_meters={player.height_meters}
                        debut_year={player.debut_year}
                        picture={player.picture}
                        _2k_rating={_2k_rating}
                        percents={player['3pt_percents']}
                        className={"in-game"}
                        style={{ cursor: "default", textAlign: "left" }}
                        singleShot={self.state.scores[player.name]}
                        singleRounds={self.state.scores_history[player.name]}
                        onChange={(e) => {
                            let scores = self.state.scores;
                            scores[player.name] = Math.max(0,e.target.value);
                            self.setState({ scores });
                        }}
                        lost={(self.state.saved && self.state.loser === player.name)}
                        winner={(self.state.saved && self.state.winner === player.name)}
                        onReplace={(e) => {
                            self.replaceOne(idx);
                        }}

                        all_players={this.state.players}
                        curr_players={[this.state.player1.name, this.state.player2.name]}
                        onSpecificReplace={(new_player) => { this.onSpecificReplace(player, new_player) }}
                    />
        })

        const againstStyle = {
            margin: 0,
            position: "absolute",
            top: "50%",
            // top: "10px",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "auto",
        };

        let bottom = 75;
        let teams = Object.keys(this.state.scores_history);
        if (teams.length > 0) {
            let team1 = this.state.scores_history[teams[0]];
            let team2 = this.state.scores_history[teams[1]];
            if (team1.length > 0 && team2.length > 0 && team1[team1.length-1] !== team2[team2.length-1]){
                bottom += 21;
            }
        }

        // const { curr_stats, player_stats } = this.state;

        const statsStyle = {
            margin: "30px auto 20px",
            width: "40%",
            backgroundColor: "rgba(255,255,255,0.6)",
            padding: "20px",
            border: "1px solid #eaeaea",
            borderRadius: "20px",
        }

        const { met_each_other } = this.state;
        const plural = (met_each_other > 1) ? "s" : "";
        let matchups_title = `These players met each other ${met_each_other} time${plural}.`;
        if (met_each_other === 0) matchups_title = "This is the first time these players meet each other.";

        return (

            <div style={{ paddingTop: "20px" }}>
                <Header />

                <div className="ui link cards centered" style={statsStyle}>

                    {/*matchups stats*/}
                    <div className="ui header" style={{ width:"100%", textAlign: "center", marginBottom: "0px" }}>Previous Matchups Stats</div>
                    <div style={{ display: "block", width: "100%", textAlign: "center" }}>
                        <ul style={{ padding: "0px", }}>
                            {/*{curr_stats.map((iter, idx) => {*/}
                            {/*    return (<li key={idx} className={(iter === "<br>") ? "" : "arrow"} style={{ listStyle: "none" }} dangerouslySetInnerHTML={{ __html: iter }} />);*/}
                            {/*})}*/}
                            <li style={{ listStyle: "none" }}>{matchups_title}</li>
                            {(met_each_other === 0) ? "" :
                                (<table className="ui celled table">
                                    <thead>
                                    <tr>
                                        <th></th>
                                        <th>{ this.state.player1.name }</th>
                                        <th>{ this.state.player2.name }</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {Object.keys(this.state.matchups_values).map((stat) => {
                                        const values = this.state.matchups_values[stat];
                                        const value1 = (values.length > 0) ? values[0] : "N/A";
                                        const value2 = (values.length > 1) ? values[1] : "N/A";
                                        if (!(value1 === 0 && value2 === 0) && !(value1 === "N/A" && value2 === "N/A"))
                                            return (<tr>
                                                <td style={{ fontWeight: "bold" }}>{stat}</td>
                                                <td>{value1}</td>
                                                <td>{value2}</td>
                                            </tr>)
                                    })}
                                    </tbody>
                                </table>)}

                        </ul>
                    </div>

                    {/*player stats*/}
                    <div className="ui header" style={{ width:"100%", textAlign: "center", marginBottom: "0px", marginTop: "10px" }}>Players Individual Stats</div>
                    <div style={{ display: "block", width: "100%", textAlign: "center" }}>
                        <ul style={{ padding: "0px", }}>
                            {/*{player_stats.map((iter, idx) => {*/}
                            {/*    return (<li key={idx} className={(iter === "<br>") ? "" : "arrow"} style={{ listStyle: "none" }} dangerouslySetInnerHTML={{ __html: iter }} />);*/}
                            {/*})}*/}

                            <table className="ui celled table">
                                <thead>
                                <tr>
                                    <th></th>
                                    <th>{ this.state.player1.name }</th>
                                    <th>{ this.state.player2.name }</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(this.state.player_stats_values).map((stat) => {
                                        const values = this.state.player_stats_values[stat];
                                        const value1 = (values.length > 0) ? values[0] : "N/A";
                                        const value2 = (values.length > 1) ? values[1] : "N/A";
                                        if (!(value1 === 0 && value2 === 0) && !(value1 === "N/A" && value2 === "N/A"))
                                        return (<tr>
                                                    <td style={{ fontWeight: "bold" }}>{stat}</td>
                                                    <td>{value1}</td>
                                                    <td>{value2}</td>
                                                </tr>)
                                    })}
                                </tbody>
                            </table>

                        </ul>
                    </div>
                </div>

                <div className="ui link cards centered" style={{margin: "auto", marginBottom:"5px"}}>
                    <button className={"ui button basic blue"} onClick={this.restart}>
                        Restart Game
                    </button>
                    <button className={"ui button basic blue"} style={{ marginLeft: "5px" }} onClick={this.init}>
                        New Game
                    </button>
                    <button className={"ui button basic blue"} style={{ marginLeft: "5px" }} onClick={() => { this.setState({ view_stats: true }) }}>
                        {/*<Link to={"/1on1/stats"}>View Stats</Link>*/}
                        View Stats
                    </button>
                </div>

                <div className="ui link cards centered" style={{ display: "flex", textAlign: "center", alignItems: "strech", margin: "auto", marginBottom: "20px" }}>
                    {blocks[0]}
                    <div className={"card in-game"} style={{ border:0, width: 100, boxShadow: "unset", cursor: "default", backgroundColor: APP_BACKGROUND_COLOR }}>
                        <button className={"ui button basic blue"} onClick={this.saveResult} style={{ position: "absolute", bottom: bottom }} disabled={this.state.saved || this.state.saving} >
                            Save
                        </button>
                    </div>
                    {blocks[1]}
                </div>
            </div>
        );

    }

};