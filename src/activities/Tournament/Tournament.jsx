import React from 'react';
import {
    getPlayerShortenPosition,
    getRandomElement,
    isDefined, sleep,
    swap,
    toPascalCase
} from "../../helpers/utils";
import Header from "../../components/layouts/Header";
import {apiGet, apiPost, apiPut} from "../../helpers/api";
import PlayerCard from "../../components/PlayerCard";
import LoadingPage from "../../pages/LoadingPage";
import ErrorPage from "../../pages/ErrorPage";
import {
    APP_BACKGROUND_COLOR,
    LOADER_DETAILS,
    LOADING_DELAY,
    MAX_TEAMS_IN_TOURNAMENT,
    MIN_TEAMS_IN_TOURNAMENT,
    PLAYER_NO_PICTURE,
    UNAUTHORIZED_ERROR
} from "../../helpers/consts";
import OneOnOneStats from "../shared/OneOnOneStats";
import StatsTable from "../../components/StatsTable";
import ButtonInput from "../../components/inputs/ButtonInput";
import {buildStatsInformation, BuildStatsTable, statsStyle} from "../shared/OneOnOneHelper";
import DropdownInput from "../../components/inputs/DropdownInput";
import TextInput from "../../components/inputs/TextInput";
import OneOnOneSingleStats from "../shared/OneOnOneSingleStats";
import Notification from "../../components/internal/Notification";
import Confirmation from "../../components/internal/Confirmation";

const game_mode = "Tournament";
const what = "teams";
const get_route = "/team";
const styles = {
    imageContainerStyle: { backgroundColor: "#F2F2F2" },
    imageStyle: { width: 200, margin: "auto", padding: "20px" },
    // extraContentStyle: { display: "none" },
};
let custom_keys = {
    player1: 'team1',
    player2: 'team2',
    player1Id: 'team1Id',
    player2Id: 'team2Id',
    player1_name: 'team1_name',
    player2_name: 'team2_name',
};
let custom_details_title = "Players:";
const percents = false;
const mvp_block = true;

const get_stats_route = '/records/tournament/stats';
const save_final_result_route = '/records/tournament'
const stats_page = true;
const stats_title = undefined;
const get_stats_specific_route = undefined; // todo complete
const save_result_route = undefined; // todo complete (?) <- save at the middle of tournament
const update_result_route = undefined; // todo complete (?) <- save at the middle of tournament
const debug = 0;

let view_stats = undefined; // if true it'll open stats page by default
let player_from_url = undefined; // todo complete
let mvp;

export default class Tournament extends React.Component {

    constructor (props){
        super(props);

        player_from_url = this.props.player_from_url;
        view_stats = this.props.view_stats;

        this.state = {
            players: [],
            curr_players: [],
            player1: undefined,
            player2: undefined,
            loaded: false,
            scores:{

            },
            games_history:{

            },
            winner: "",
            loser: "",
            mvp_player: undefined,
            saved: false,
            saved_api: false,
            saving: false,

            loadedStats: false,
            stats: [], // all players stats
            curr_stats: ["Loading Stats..."],
            player_stats: ["Loading Stats..."],

            max_teams: undefined,
            is_started: false,

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

            view_stats: view_stats || false,

            loaderDetails: LOADER_DETAILS(),
            general_stats: {
                'total_games': 0,
                'total_games_per_day': {},
                'total_points': 0,
                'total_points_per_day': {},
            },

            saved_game_id: undefined,

            is_comeback: false,
            total_overtimes: 0,

            loadedSettings: false,
            settings: {
                auto_calc_ot: 0,
            },

            error_retry: false,

            selected_player: undefined,

            standings: {},
            leaderboard: [],
            finished: false,
            lost_teams: {},
            step: '',
            tournament_players: [],
            played_games: [],

            button_clicked:undefined,
            button_clicked_action_text: undefined,
            button_clicked_func: undefined,
        };

        this.nextGame = this.nextGame.bind(this);
        this.init = this.init.bind(this);
        this.saveResult = this.saveResult.bind(this);
        this.updateResult = this.updateResult.bind(this);
        this.initStats = this.initStats.bind(this);
        this.loadUserSettings = this.loadUserSettings.bind(this);
        this.calcOT = this.calcOT.bind(this);
        this.buildLeaderBoard = this.buildLeaderBoard.bind(this);
        this.loadTeams = this.loadTeams.bind(this);
        this.saveFinalResult = this.saveFinalResult.bind(this);
    }

    buildLeaderBoard() {
        const { standings } = this.state;

        const leaderboard = Object.keys(standings).sort((b,a) => {

            a = standings[a];
            b = standings[b];

            a['percents'] = a['wins'] / a['total_games'];
            b['percents'] = b['wins'] / b['total_games'];

            if (a['wins'] > b['wins']) {
                return 1;
            } else if (a['wins'] < b['wins']) {
                return -1;
            } else {
                if (a['percents'] > b['percents']) {
                    return 1;
                } else if (a['percents'] < b['percents']) {
                    return -1;
                } else {

                    if (a['total_diff'] > b['total_diff']) {
                        return 1;
                    } else if (a['total_diff'] < b['total_diff']) {
                        return -1;
                    } else {
                        return 0;
                    }

                }
            }
        });

        if (debug) console.log(leaderboard);

        this.setState({ leaderboard });
    }

    loadTeams() {
        let self = this;

        apiGet(this,
            get_route,
            async function(res) {
                let players = res.data.data || res.data;

                const tournament_teams = [
                    "Los Angeles Lakers",
                    "Golden State Warriors",
                    "Brooklyn Nets",
                    "Miami Heat",
                    "Boston Celtics",
                    "Denver Nuggets",
                    "Utah Jazz",
                    "LA Clippers",
                    "Phoenix Suns",
                    // "New York Knicks", //
                    // "Charlotte Hornets", //

                    "Philadelphia 76ers", //
                    // "Toronto Raptors", //
                    // "Milwaukee Bucks", //
                    "Washington Wizards", //
                    "Dallas Mavericks",
                ];

                players = players.filter(iter => tournament_teams.indexOf(iter.name) !== -1);

                let curr_players = players;
                curr_players = players.sort((a, b) => 0.5 - Math.random()); // shuffle
                curr_players = players.slice(0,self.state.max_teams); // slice
                // if (debug) console.log('curr players', curr_players);
                console.log(curr_players);

                self.setState({ players, curr_players, tournament_players: curr_players });
                await self.init();

                setTimeout(async () => {
                        await self.setState({ loaded: true })

                        // initialize stats
                        if (self.canInitStats()){
                            self.initStats();
                        }
                    },
                    LOADING_DELAY);
            },
            function(error, error_retry) {
                console.error(error);
                let req_error = error.message;
                if (error.message.indexOf("401") !== -1) { req_error = UNAUTHORIZED_ERROR }
                if (error.message.indexOf("400") !== -1) { req_error = `Oops, it seems like no ${what} loaded :(<Br>It's probably related to a server error` }
                self.setState({ error: req_error, error_retry });
            },
            function() {

            }
        );
    }

    componentDidMount() {
        if (!what || what === ""){
            this.setState({ loaded:true, error: "Internal Server Error<br/>Opponents Type not specified." });
            return;
        }

        if (!game_mode || game_mode === ""){
            this.setState({ loaded:true, error: "Internal Server Error<br/>Game Mode not specified." });
            return;
        }

        if (!get_route || get_route === ""){
            this.setState({ loaded:true, error: "Internal Server Error<br/>Missing GET route." });
            return;
        }

        let self = this;

        if (get_stats_route && get_stats_route !== "") {
            apiGet(this,
                get_stats_route,
                async function(res) {
                    let stats = res.data.data;
                    stats = self.customKeysStats(self, stats);

                    await self.setState({ stats, loadedStats: true });

                    // initialize stats
                    if (self.canInitStats()){
                        self.initStats();
                    }
                },
                function(error, error_retry) {
                    console.error(error);
                    let req_error = error.message;
                    if (error.message.indexOf("401") !== -1) { req_error = UNAUTHORIZED_ERROR; }
                    if (error.message.indexOf("400") !== -1) { req_error = `Oops, it seems like no ${what} loaded :(<Br>It's probably related to a server error` }
                    self.setState({ error: req_error, error_retry });
                },
                async function() {

                }
            );
        } else {
            self.setState({ loadedstats: true })
        }

        this.loadUserSettings();
    }

    loadUserSettings(){
        const self = this;
        apiGet(this,
            '/user/settings',
            function(res) {
                let data = res.data.data;
                let settings = {};
                data.forEach((setting) => {
                    settings[setting.name.toLowerCase()] = setting.value;
                });
                // console.log(settings);
                self.setState({ settings, loadedSettings: true });
            },
            function(error, error_retry) {
                console.error(error);
                let req_error = error.message;
                if (error.message.indexOf("401") !== -1) { req_error = UNAUTHORIZED_ERROR; }
                if (error.message.indexOf("400") !== -1) { req_error = `Oops, it seems like no Settings loaded :(<Br>It's probably related to a server error` }
                self.setState({ error: req_error, error_retry });
            },
            async function() {

            }
        );
    }

    customKeysStats(self, stats){
        custom_keys = custom_keys || {};
        if (Object.keys(custom_keys).length > 0 ){
            custom_keys = swap(custom_keys);
            // console.log(custom_keys);
            Object.keys(stats).forEach((name) => {
                stats[name].records.forEach((record) => {
                    Object.keys(custom_keys).forEach((key) => {
                        if (isDefined(record[key])) {
                            record[custom_keys[key]] = record[key];
                        }
                        return record;
                    });

                });
            });
        }
        return stats;
    }

    initStats(){

        const { curr_stats, player_stats, player_stats_values, matchups_values, met_each_other, general_stats } =
            buildStatsInformation(
                this.state.player1,
                this.state.player2,
                this.state.stats,
                this.state.player_stats_values,
                this.state.matchups_values, what, percents);

        this.setState({ curr_stats, player_stats, player_stats_values, matchups_values, met_each_other, general_stats })
    }

    async init(player1, player2){
        let scores = {};
        let games_history = {};
        let played_games = [];
        player1 = player1 || getRandomElement(this.state.curr_players);
        player2 = player2 || getRandomElement(this.state.curr_players);

        // prevent same player
        if (this.state.players.length >= 2) {
            while (player1.name === player2.name) {
                player2 = getRandomElement(this.state.curr_players);
            }
        }

        scores[player1.name] = 0;
        scores[player2.name] = 0;
        games_history[player1.name] = [];
        games_history[player2.name] = [];

        let is_comeback = false;
        let total_overtimes = 0;

        // const { players, max_teams } = this.state;
        // let curr_players = players;
        // curr_players = players.sort((a, b) => 0.5 - Math.random()); // shuffle
        // if (debug) console.log('curr players', curr_players);

        const { tournament_players } = this.state;
        let curr_players = tournament_players;

        await this.setState({
            player1,
            player2,
            scores,
            saved: false,
            saved_api: false,
            winner: "",
            loser: "",
            games_history,
            saved_game_id: undefined,
            mvp_player: undefined,
            is_comeback: is_comeback,
            total_overtimes: total_overtimes,

            standings: {},
            leaderboard: [],
            finished: false,
            lost_teams: {},

            curr_players,
            played_games,
        });

        if (this.state.loaded && this.state.loadedStats){
            this.initStats();
        }
    }

    canInitStats(){
        return this.state.loaded && this.state.loadedStats && this.state.curr_stats.length === 1 && this.state.curr_stats[0] === "Loading Stats...";
    }

    nextGame(){
        let { scores, games_history, curr_players, lost_teams, step, played_games, leader_mvp } = this.state;
        if (debug) console.log('players', this.state.players);
        if (debug) console.log('curr players', curr_players);
        Object.keys(scores).forEach(function(key, idx){
            scores[key] = 0;
        });
        let is_comeback = false;
        let total_overtimes = 0;

        let remaining_players = curr_players.filter(iter => games_history[iter.name] == undefined);
        let player1 = getRandomElement(remaining_players);
        let player2 = getRandomElement(remaining_players);

        if (debug) console.log('remaining', remaining_players);
        if (debug) console.log('curr', curr_players);

        if (remaining_players.length < 2){

            if (debug) console.log('remaining players < 2');

            const { leaderboard } = this.state;
            const max = Math.ceil(curr_players.length/2);
            step = (max === 4 || max === 3) ? 'Semi-Finals' : (max === 2) ? 'Finals' : 'Top ' + max;

            // games_history = {};
            const remaining_player_names = leaderboard.slice(0,max);
            leaderboard.slice(max,leaderboard.length).forEach((lost_team) => {
                lost_teams[lost_team] = true;
            });
            // remaining_players.forEach((iter) => { remaining_players.push(iter.name) });

            if (remaining_players.length === 0 && Object.keys(lost_teams).length < curr_players.length) {
                // remaining_players = curr_players.filter(iter => lost_teams[iter.name] == undefined);
                console.log(lost_teams);
                console.log(max);
                console.log(remaining_player_names);
            }

            if (debug) console.log('remaing player names', remaining_player_names);
            remaining_players = curr_players.filter(iter => remaining_player_names.indexOf(iter.name) !== -1);
            curr_players = remaining_players;

            if (debug) console.log('new remaining players', remaining_players);
            if (debug) console.log('new curr players', curr_players);

            if (remaining_players.length >= 2) {
                player1 = getRandomElement(remaining_players);
                player2 = getRandomElement(remaining_players);
            }
            else {

                alert('finished! ' + remaining_players[0].name + ' is the winner!');
                if (mvp === 'N/A') mvp = undefined;

                let winner = remaining_players[0].name;
                let teams = Object.keys(games_history);
                let gamesHistory = played_games;
                let mvpPlayer = mvp;

                console.log({
                    winner: winner,
                    teams: teams,
                    // history: games_history,
                    gamesHistory: gamesHistory,
                    mvpPlayer: mvpPlayer,
                });

                this.setState({
                    finished: true
                });

                this.saveFinalResult(winner, teams, gamesHistory, mvpPlayer)

                return;
            }
        }

        // prevent same player
        if (remaining_players.length >= 2) {
            while (player1.name === player2.name) {
                player2 = getRandomElement(remaining_players);
            }
        }

        scores[player1.name] = 0;
        scores[player2.name] = 0;
        games_history[player1.name] = games_history[player1.name] || [];
        games_history[player2.name] = games_history[player2.name] || [];

        if (debug) console.log("lost teams", lost_teams);

        this.setState({ player1, player2, scores, lost_teams, games_history, curr_players, saved: false, saved_api: false,winner: "", loser: "", saved_game_id: undefined, mvp_player: undefined, is_comeback, total_overtimes, step });
    }

    async updateResult(){

        this.setState({ saving: true });
        await sleep(100);

        const { scores, standings, played_games } = this.state;

        const score1 = scores[this.state.player1.name];
        const score2 = scores[this.state.player2.name];
        let mvp_player = this.state.mvp_player;

        const { is_comeback, total_overtimes } = this.state;

        const player1 = this.state.player1.name;
        const player2 = this.state.player2.name;

        const options = (score1 > score2) ? this.state.player1.players : (score2 > score1) ? this.state.player2.players : [];
        if (mvp_player) {
            if (options.filter(iter => iter.name === mvp_player).length === 0) {
                mvp_player = undefined;
            }
        }

        let winner = "";
        let loser = "";
        if (score1 > score2) {
            winner = player1;
            loser = player2;
        } else if (score2 > score1) {
            winner = player2;
            loser = player1;
        }
        const games_history = {...this.state.games_history};

        if (debug) console.log('scores', scores);

        const lastRecord1 = games_history[player1][games_history[player1].length-1];
        lastRecord1['score'] = score1;
        lastRecord1['score1'] = score1;
        lastRecord1['score2'] = score2;
        lastRecord1['diff'] = score1 - score2;
        lastRecord1['won_or_lost'] = (score1 > score2) ? 'won' : 'lost';
        lastRecord1['total_overtimes'] = total_overtimes;
        lastRecord1['is_comeback'] = is_comeback;
        lastRecord1['mvp_player'] = mvp_player;

        const game = {...lastRecord1};
        delete game.won_or_lost;
        delete game.score;
        game.diff = Math.abs(game.diff);
        game.winner = winner;
        played_games[played_games.length-1] = game;

        const lastRecord2 = games_history[player2][games_history[player2].length-1];
        lastRecord2['score'] = score2;
        lastRecord2['score1'] = score1;
        lastRecord2['score2'] = score2;
        lastRecord2['diff'] = score2 - score1;
        lastRecord2['won_or_lost'] = (score2 > score1) ? 'won' : 'lost';
        lastRecord2['total_overtimes'] = total_overtimes;
        lastRecord2['is_comeback'] = is_comeback;
        lastRecord2['mvp_player'] = mvp_player;

        if (debug) console.log('updated', games_history);

        const standing1 = standings[this.state.player1.name];
        const standing2 = standings[this.state.player2.name];

        standing1['total_games'] = games_history[player1].length;
        standing1['wins'] = games_history[player1].filter((iter) => iter.won_or_lost === 'won').length;
        standing1['lose'] = games_history[player1].filter((iter) => iter.won_or_lost !== 'won').length;

        let sum1 = 0;
        games_history[player1].forEach((iter) => { sum1 += iter['diff']; });
        standing1['total_diff'] = sum1;

        standing2['total_games'] = games_history[player2].length;
        standing2['wins'] = games_history[player2].filter((iter) => iter.won_or_lost === 'won').length;
        standing2['lose'] = games_history[player2].filter((iter) => iter.won_or_lost !== 'won').length;

        let sum2 = 0;
        games_history[player2].forEach((iter) => { sum2 += iter['diff']; });
        standing2['total_diff'] = sum2;

        if (debug) console.log('standings', standings);

        await this.setState({ saved: true, winner, loser, games_history, standings, scores, saving: false, played_games });
        this.buildLeaderBoard();
    }

    async saveResult(){

        await this.setState({ saving: true });
        await sleep(100);

        const { scores, standings, played_games } = this.state;

        const player1 = this.state.player1.name;
        const player2 = this.state.player2.name;
        const score1 = scores[this.state.player1.name];
        const score2 = scores[this.state.player2.name];
        const mvp_player = this.state.mvp_player;

        const { is_comeback, total_overtimes } = this.state;

        let winner = "";
        let loser = "";
        if (score1 > score2) {
            winner = player1;
            loser = player2;
        } else if (score2 > score1) {
            winner = player2;
            loser = player1;
        }

        let games_history = this.state.games_history;
        games_history[player1] = games_history[player1] || [];
        games_history[player2] = games_history[player2] || [];

        const row = [];
        row['player1'] = player1;
        row['player2'] = player2;
        row['score'] = score1;
        row['score1'] = score1;
        row['score2'] = score2;
        row['won_or_lost'] = (score1 > score2) ? 'won' : 'lost';
        row['mvp_player'] = mvp_player;
        row['is_comeback'] = is_comeback;
        row['total_overtimes'] = total_overtimes;
        row['diff'] = score1 - score2;
        games_history[player1].push(row);

        const game = {...row};
        delete game.won_or_lost;
        delete game.score;
        game.diff = Math.abs(game.diff);
        game.winner = winner;
        played_games.push(game);

        const row2 = [];
        row2['player1'] = player1;
        row2['player2'] = player2;
        row2['mvp_player'] = mvp_player;
        row2['is_comeback'] = is_comeback;
        row2['total_overtimes'] = total_overtimes;
        row2['won_or_lost'] = (score2 > score1) ? 'won' : 'lost';
        row2['score'] = score2;
        row2['score1'] = score1;
        row2['score2'] = score2;
        row2['diff'] = score2 - score1;
        games_history[player2].push(row2);

        if (debug) console.log('scores', scores);
        if (debug) console.log('added', games_history);

        const template = {
            total_games: 0,
            wins: 0,
            lose: 0,
            total_diff: 0,
        };

        standings[this.state.player1.name] = standings[this.state.player1.name] || {...template};
        standings[this.state.player2.name] = standings[this.state.player2.name] || {...template};
        const standing1 = standings[this.state.player1.name];
        const standing2 = standings[this.state.player2.name];

        standing1['total_games']++;
        standing2['total_games']++;

        standing1['total_diff']+= (score1-score2);
        standing2['total_diff']+= (score2-score1);

        if (score1 > score2) {
            standing1['wins']++;
            standing2['lose']++;
        } else  {
            standing1['lose']++;
            standing2['wins']++;
        }

        if (debug) console.log('standings', standings);

        await this.setState({saved: true, winner, loser, games_history, standings, saving: false, played_games});
        this.buildLeaderBoard();
    }

    calcOT(){
        const { auto_calc_ot_game_length } = this.state.settings;
        const { player1, player2, scores } = this.state;

        let val = Math.max(scores[player1.name], scores[player2.name]);
        let total_overtimes = 0;
        // console.log("val: ", val);
        // console.log("auto calc", auto_calc_ot_game_length);
        while (val >= Number(auto_calc_ot_game_length) + 2) {
            val -= 2;
            total_overtimes++;
            // console.log("val2:", val);
        }

        // console.log("total overtimes: ",total_overtimes);

        this.setState({ total_overtimes });
    }

    async saveFinalResult(winner, teams, gamesHistory, mvpPlayer){

        const self = this;

        await apiPost(this,
            save_final_result_route,
            {
                winner,
                teams,
                gamesHistory,
                mvpPlayer
            },
            async function(res) {

                await self.setState({ saved: true, saved_api:true });
                // self.initStats();
            },
            function(error, retry) {
                console.log(error);
                let req_error = error.message;
                if (error.message.indexOf("401") !== -1) { req_error = UNAUTHORIZED_ERROR; }
                if (error.message.indexOf("400") !== -1) { req_error = `Oops, failed saving this game.` }
                self.setState({ error: req_error, error_retry: retry });
            },
            function() {
                // finally
            }
        );
    }

    render(){

        let original_custom_title = custom_details_title;

        let { error, error_retry, loaded, loadedSettings, players, loaderDetails, max_teams, is_started } = this.state;

        if (this.state.view_stats && stats_page){
            return (
                <OneOnOneStats
                    what={what}
                    stats_title={stats_title}
                    game_mode={game_mode}
                    get_route={get_route}
                    get_stats_route={get_stats_route}
                    get_stats_specific_route={get_stats_specific_route}
                    // mvp_block={mvp_block}
                    mvp_block={false}
                    onBack={() => { this.setState({ view_stats: false }) }}
                    player_from_url={player_from_url}
                />
            );
        }

        // const { selected_player } = this.state;
        //
        // if (selected_player){
        //     const get_specific_route = (what === "players") ? "/player" : "/team";
        //     const this_stats_title = stats_title || game_mode;
        //
        //     return (
        //         <OneOnOneSingleStats
        //             selected_player={selected_player}
        //             what={what}
        //             stats_title={`${this_stats_title} - ${selected_player}`}
        //             game_mode={game_mode}
        //             get_route={get_specific_route}
        //             get_stats_route={get_stats_specific_route}
        //             onBack={() => { this.setState({ selected_player: undefined }) }}
        //         />
        //     );
        // }

        if (!max_teams || !is_started){
            return (
                <div style={{ paddingTop: "20px" }}>
                    <Header />

                    <div className="ui link cards centered" style={{margin: "auto", marginTop: "20px"}}>
                    {(stats_page) ?
                        <ButtonInput
                            text={"View Stats"}
                            style={{ marginLeft:"5px" }}
                            onClick={() => { this.setState({ view_stats: true }) }}
                        /> : ""}
                    </div>

                    <div className="ui link cards centered" style={{...statsStyle,textAlign: "center"}}>
                        <div className="ui header" style={{ width: "100%", textAlign: "center", marginBottom: 10}}>
                            Tournament Settings
                        </div>
                        Please choose how many teams you want to participate in this tournament.<br/>
                        <div style={{ width: "100%" }}>
                            <span style={{ opacity: "0.6" }}>min: {MIN_TEAMS_IN_TOURNAMENT}. max: {MAX_TEAMS_IN_TOURNAMENT}. number must be even.</span>
                        </div>
                        <div style={{ width: "100%", marginTop:"20px", zIndex:99999 }}>
                            <input
                                type={"number"}
                                value={this.state.max_teams || 8}
                                min={MIN_TEAMS_IN_TOURNAMENT}
                                max={MAX_TEAMS_IN_TOURNAMENT}
                                onChange={(e) => {
                                    let number = e.target.value;

                                    // only even
                                    if (number %2 !== 0){
                                        number++;
                                    }

                                    // apply min/max restrictions
                                    number = Math.max(MIN_TEAMS_IN_TOURNAMENT,Math.min(MAX_TEAMS_IN_TOURNAMENT,number));

                                    this.setState({ max_teams: number })
                                }}
                                style={{ height: "38px", border: "1px solid #eaeaea", padding:"0px 5px", width: "50px" }}/>
                            <ButtonInput
                                text={"Start!"}
                                style={{ marginLeft:"5px" }}
                                onClick={() => {
                                    this.setState({ is_started: true });
                                    this.loadTeams();
                                }}
                            />
                        </div>
                    </div>
                </div>
            )
        }

        const is_loading = !loaded || !loadedSettings;
        if (error || (!is_loading && players.length === 0)) {
            error = error || `Oops, it seems like no ${what} loaded :(<Br>It's probably related to a server error`;
            return (
                <ErrorPage message={error} retry={error_retry} />
            );
        } else if (is_loading) {
            return (
                <LoadingPage message={`Please wait while loading ${what}...`} loaderDetails={loaderDetails} />
            );
        }

        let confirmation_modal = "";
        if (this.state.button_clicked){

            confirmation_modal = (
                <Confirmation
                    title={"Are you sure?"}
                    description={`Are you sure you want to ${this.state.button_clicked_action_text}?<br>Doing that will erase all the games you did so far.`}
                    okText={"Continue"}
                    // okColor={"nbared"}
                    okFunc={async () => {
                        await this.state.button_clicked_func();

                        this.setState({
                            button_clicked: undefined,
                            button_clicked_action_text: undefined,
                            button_clicked_func: undefined,
                        });
                    }}
                    cancelText={"Cancel"}
                    cancelFunc={() => {
                        this.setState({
                            button_clicked: undefined,
                            button_clicked_action_text: undefined,
                            button_clicked_func: undefined,
                        });
                    }}
                />
            );
        }

        if (custom_details_title){
            original_custom_title = `<div style='border-top:1px solid #eaeaea; width:100%; margin: 10px 0px; padding-top: 10px;'>${custom_details_title}</div>`;
        }

        const { stats, scores, games_history } = this.state;

        if (what === 'teams'){
            // console.log(this.state.player1, this.state.player2);
            const maxPlayers = Math.max(this.state.player1.players.length, this.state.player2.players.length);
            const minHeight = maxPlayers * 54;
            styles['descriptionStyle'] = { minHeight: minHeight };
        }

        const blocks =
            [this.state.player1, this.state.player2].map((player, idx) => {
                const _2k_rating = player['_2k_rating'] || 'N/A';

                let custom_details = undefined;
                let curr_custom_details_title = undefined;
                if (what === 'teams'){
                    custom_details = [];

                    curr_custom_details_title = `2K Rating: ${_2k_rating}` + original_custom_title;

                    player.players.forEach(function(player){
                        let rate = (player["_2k_rating"]) ? Number(player["_2k_rating"]) : "N/A";
                        player["rate"] = rate;
                    })

                    const arr = player.players.sort((a,b) => {

                        let rate1 = (a["rate"] === "N/A") ? 0 : Number(a["rate"]);
                        let rate2 = (b["rate"] === "N/A") ? 0 : Number(b["rate"]);

                        return rate2 - rate1;
                    }).map((x) => {
                        return (
                            `<div>
                            <img class="ui avatar image" src=${x.picture} onError="this.src='${PLAYER_NO_PICTURE}';" style="width: 39px;" />
                            <span>${x.name} <span style='opacity:0.6;'>(${getPlayerShortenPosition(x.position)})</span> <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: ${x.rate}</span></span>
                        </div>`
                        )
                    });
                    custom_details = [custom_details.concat(...arr).join("")];
                }

                return (
                    <PlayerCard
                        Key={idx}
                        className={"in-game"}
                        style={{ cursor: "default", textAlign: "left" }}
                        styles={styles}
                        name={player.name}
                        picture={player.picture || player.logo}
                        position={player.position}
                        team_division={(player.conference && player.division) ? player.division + " (" + player.conference + ")" : undefined}
                        debut_year={player.debut_year}
                        details={{
                            _2k_rating: _2k_rating,
                            percents: player['3pt_percents'], // 3pt percents
                            height_meters:player.height_meters,
                            weight_kgs:player.weight_kgs,
                            team: player.team?.name, // on random tems it won't exist.
                        }}
                        custom_details_title={curr_custom_details_title}
                        custom_details={custom_details}
                        stats={{
                            win_streak: stats[player.name]?.win_streak || "0",
                            max_win_streak: stats[player.name]?.max_win_streak || "0",
                            lose_streak: stats[player.name]?.lose_streak || "0",
                            max_lose_streak: stats[player.name]?.max_lose_streak || "0",
                        }}

                        onChange={async (e) => {
                            let scores = this.state.scores;
                            scores[player.name] = Number(Math.max(0,e.target.value));
                            await this.setState({ scores });

                            if (Number(this.state.settings.auto_calc_ot)) {
                                this.calcOT();
                            }
                        }}
                        singleShot={scores[player.name]}
                        singleRounds={games_history[player.name].score}
                        lost={(this.state.saved && this.state.loser === player.name)}
                        winner={(this.state.saved && this.state.winner === player.name)}

                        all_players={this.state.players}
                        curr_players={[this.state.player1.name, this.state.player2.name]}

                        // todo complete - view stats
                        // onImageClick={(e) => {
                        //
                        //     const target = e.target;
                        //     const html = $(e.target).wrap("<p>").parent().html();
                        //
                        //     // console.log(html);
                        //
                        //     // to avoid clicking on 'replace' or 'specific rpelace' from openning stats page.
                        //     if (html.indexOf('View Stats') !== -1 && get_stats_specific_route) {
                        //         this.setState({
                        //             selected_player: player.name,
                        //         })
                        //     }
                        //
                        // }}
                    />
                );
            })

        let bottom = 75; // (what === 'teams') ? 34 : 75;
        let teams = Object.keys(games_history);
        if (teams.length > 0 && this.state.saved) {
            bottom += 20;
        }

        const { met_each_other } = this.state;
        const plural = (met_each_other > 1) ? "s" : "";
        let matchups_description = `These ${what} met each other ${met_each_other} time${plural}.`;
        if (met_each_other === 0) matchups_description = `This is the first time these ${what} meet each other.`;

        // one on one stats
        let general_stats_block = (get_stats_route && get_stats_route !== "") ? BuildStatsTable(this.state.general_stats,0,game_mode, percents) : "";

        const titleStyle = {
            margin: 0,
            padding: 0,
            backgroundColor: "transparent",
            boxShadow: "none",
            fontWeight: "bold",
            fontSize: "18px",
        }

        let mvp_block_html = "";
        if (mvp_block){

            const { player1, player2 } = this.state;

            const options = (scores[player1.name] > scores[player2.name]) ? player1.players : (scores[player2.name] > scores[player1.name]) ? player2.players : [];

            mvp_block_html = (
                <div className="ui link cards centered" style={{ position:"relative", display: "flex", textAlign: "center", alignItems: "strech", margin: "auto" }}>
                    <DropdownInput
                        options={(options)}
                        name={"select_mvp"}
                        placeholder={"Select MVP..."}
                        nameKey={"name"}
                        sortKey={"rate"}
                        sort={"desc"}
                        valueKey={"name"}
                        idKey={"id"}
                        style={{ width: "710px", paddingBottom: "15px" }}
                        disabled={options.length === 0 || this.state.finished}
                        onChange={(player) => {
                            this.setState({ mvp_player: player.name });
                        }}
                    />
                </div>
            );
        }

        const { is_comeback, total_overtimes, lost_teams } = this.state;

        // comeback
        const comeback_block = (
            <div style={{ paddingBottom: "20px" }}>
                <div
                    className="ui checkbox"
                >
                    <input type="checkbox" checked={is_comeback} onChange={() => { this.setState({ is_comeback: !is_comeback }) }} disabled={this.state.finished}  />
                    <label>Comeback?</label>
                </div>
            </div>
        );

        // overtime
        const overtime_block = (
            <div style={{ width: "100%", display:"flex", paddingBottom: "10px", }}>
                <label style={{ display: "inline-block", fontWeight:"bold", marginRight: "7px", lineHeight: "38px" }}>Number of Overtimes:</label>
                <div style={{ flexGrow: "100", display: "inline-block" }}>
                    <TextInput
                        name={'total_overtimes'}
                        type={'number'}
                        value={total_overtimes}
                        placeholder={"0"}
                        disabled={this.state.finished}
                        onChange={(e) => {
                            this.setState({ total_overtimes: Math.min(20,Math.max(0,Number(e.target.value)) || 0) });
                        }}
                    />
                </div>
            </div>
        );

        // tournament standings
        let standings_block = undefined;
        const { standings, leaderboard } = this.state;
        if (Object.keys(standings).length > 0){

            let total_games = 0;
            let total_comebacks = 0;
            let total_overtimes = 0;
            let total_knockouts = 0;
            let mvps = {};
            let mvp_per_team = {};
            Object.keys(games_history).forEach((team) => {
                games_history[team].forEach((game) => {
                    total_games += 1/2;

                    if (game.score1 === 0 || game.score2 === 0) { total_knockouts += 1/2; }

                    if (game.is_comeback) total_comebacks += 1/2;
                    if (game.total_overtimes) total_overtimes += (game.total_overtimes/2);
                    if (game.mvp_player) {
                        if (game.won_or_lost === 'won') {
                            mvps[game.mvp_player] = mvps[game.mvp_player] || 0;
                            mvps[game.mvp_player] ++;

                            mvp_per_team[team] = mvp_per_team[team] || {};
                            mvp_per_team[team][game.mvp_player] = mvp_per_team[team][game.mvp_player] || 0;
                            mvp_per_team[team][game.mvp_player] ++;
                        }
                    }
                });
            });

            let max = 0;
            mvp = "N/A";
            // Object.keys(mvps).forEach((player) => {
            //     if(mvps[player] > max){
            //         max = mvps[player];
            //         mvp = player;
            //     }
            // });

            let values = {};
            leaderboard.forEach((team,idx) => {

                mvp_per_team[team] = mvp_per_team[team] || {};
                let leader_mvp = Object.keys(mvp_per_team[team]).sort((a,b) => {
                    return mvp_per_team[team][b] - mvp_per_team[team][a]
                });
                if (leader_mvp.length > 0){

                    if (mvp === 'N/A') {
                        mvp = `${leader_mvp[0]}`;
                    }

                    leader_mvp = ` ~ ${leader_mvp[0]} (${mvp_per_team[team][leader_mvp[0]]})`;

                } else {
                    leader_mvp = '';
                }

                const row = [];
                const hash = this.state.players.filter((iter) => iter.name === team)[0];
                const isOut = (lost_teams[team]) ? ' (Out)' : '';
                let text = `${team}${isOut}`;
                if (isOut !== ''){
                    text = `<s>${text}</s>`
                }
                row[0] = `<div class="box" style="display: flex;align-items:center;"><img src="${hash.logo || hash.picture}" style="height:30px;" /> <span style="margin-left:1px;"> ${text}</span></div>`;

                let percents = ((standings[team]['wins'] / standings[team]['total_games']) * 100).toFixed(2);
                row[1] = `${standings[team]['wins']}W-${standings[team]['lose']}L DIFF:${standings[team]['total_diff']} ${percents}% ${leader_mvp}`;
                values[`#${idx+1}`] = row;
            });

            let step = (this.state.step) ? ` - ${this.state.step}` : '';

            let standings_table = (
                <StatsTable
                    title={`${game_mode} Standings${step}`}
                    description={[
                        // `Current tournament standings, based on total wins, win percents and total diff.`,
                        `Total Games: ${total_games} | Total Comebacks: ${total_comebacks} | Total Knockouts: ${total_knockouts} | Total OTs: ${total_overtimes} | Leader MVP: ${mvp}`,
                    ]}
                    cols={["","Team", "Details"]}
                    stats={values}
                    showMoreSwitch={true}
                    switchMaxNumber={10}
                />
            );

            standings_block = (
                <div className="ui link cards centered" style={statsStyle}>
                    {standings_table}
                </div>
            );
        }

        const game_saved = (this.state.finished && this.state.saved_api) ? (
            <Notification
                title={"Game was saved!"}
                description={"This game was saved. you can take a look at stats page to see details about past games."}
            />
        ) : "";

        return (

            <div style={{ paddingTop: "20px" }}>
                <Header />

                {/*{(get_stats_route && get_stats_route !== "") ?*/}
                {/*    <div className="ui link cards centered" style={statsStyle}>*/}
                {/*        {general_stats_block}*/}
                {/*        <StatsTable*/}
                {/*            title={"Previous Matchups Stats"}*/}
                {/*            marginTop="10px"*/}
                {/*            description={matchups_description}*/}
                {/*            hidden={(met_each_other === 0)}*/}
                {/*            cols={["",this.state.player1.name,this.state.player2.name]}*/}
                {/*            stats={this.state.matchups_values}*/}
                {/*        />*/}
                {/*        <StatsTable*/}
                {/*            title={`${toPascalCase(what)} Individual Stats`}*/}
                {/*            marginTop="10px"*/}
                {/*            cols={["",this.state.player1.name,this.state.player2.name]}*/}
                {/*            stats={this.state.player_stats_values}*/}
                {/*        />*/}
                {/*    </div> : ""}*/}

                {standings_block}

                <div className="ui link cards centered" style={{margin: "auto", marginBottom:"5px"}}>
                    <ButtonInput
                        text={"New Tournament"}
                        style={{ marginLeft:"5px" }}
                        onClick={() => {

                            if (this.state.played_games.length === 0){
                                this.setState({
                                    is_started: false,
                                    loaded: false,
                                });
                            }
                            else {
                                this.setState({
                                    button_clicked: "new_tournament",
                                    button_clicked_action_text: 'Start a New Tournament',
                                    button_clicked_func: () => {
                                        this.setState({
                                            is_started: false,
                                            loaded: false,
                                        });
                                    }
                                });
                            }
                        }}
                    />
                    <ButtonInput
                        text={"Restart Tournament"}
                        style={{ marginLeft:"5px" }}
                        onClick={() => {

                            if (this.state.played_games.length === 0){
                                this.init();

                            } else {
                                this.setState({
                                    button_clicked: "restart_tournament",
                                    button_clicked_action_text: 'Restart Tournament',
                                    button_clicked_func: this.init,
                                });
                            }
                        }}
                    />
                    {(stats_page) ?
                        <ButtonInput
                            text={"View Stats"}
                            style={{ marginLeft:"5px" }}
                            onClick={() => { this.setState({ view_stats: true }) }}
                        /> : ""}
                </div>


                <div className="ui link cards centered" style={{ display: "flex", textAlign: "center", alignItems: "strech", margin: "auto", marginTop: "20px" }}>
                    <div className={"card in-game"} style={titleStyle}>Guest</div>
                    <div style={{ width: 110 }}></div>
                    <div className={"card in-game"} style={titleStyle}>Home</div>
                </div>

                <div className="ui link cards centered" style={{ display: "flex", textAlign: "center", alignItems: "strech", margin: "auto", marginBottom: "10px" }}>
                    {blocks[0]}
                    <div className={"card in-game"} style={{ border:0, width: 100, boxShadow: "unset", cursor: "default", backgroundColor: APP_BACKGROUND_COLOR }}>

                        <div style={{ position: "absolute", bottom: bottom, width:"100%" }}>
                            {(this.state.saved) ?
                                (
                                    <ButtonInput
                                        text={"Update"}
                                        style={{ width: "100%" }}
                                        onClick={this.updateResult}
                                        disabled={this.state.saving || this.state.finished}
                                    />
                                ): (
                                    <ButtonInput
                                        text={"Save"}
                                        style={{ width: "100%" }}
                                        onClick={this.saveResult}
                                        disabled={this.state.saved || this.state.saving || this.state.finished}
                                    />
                                )}
                        </div>

                        <div style={{ position: "absolute", bottom: bottom - 50, width:"100%" }}>
                            {(this.state.saved) ?
                                (
                                    <ButtonInput
                                        text={"Next"}
                                        style={{ width: "100%" }}
                                        onClick={this.nextGame}
                                        disabled={this.state.finished}
                                    />
                                ): ""}
                        </div>

                    </div>
                    {blocks[1]}
                </div>

                <div className="ui link cards centered" style={{
                    position:"relative", display: "flex", textAlign: "center",
                    width: "710px", alignItems: "strech", margin: "auto"
                }}>
                    {comeback_block}
                </div>

                {mvp_block_html}

                <div className="ui link cards centered" style={{
                    position:"relative", display: "flex", textAlign: "center", alignItems: "strech", margin: "auto", paddingBottom: "20px",
                    width: "710px",
                }}>
                    {overtime_block}
                </div>

                {confirmation_modal}
                {game_saved}
            </div>
        );
    }
};

Tournament.propTypes = {

};

Tournament.defaultProps = {
};