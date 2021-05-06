import React from 'react';
import {
    formatDate,
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
    LOADING_DELAY, PLAYER_NO_PICTURE,
    UNAUTHORIZED_ERROR
} from "../../helpers/consts";
import OneOnOneStats from "./OneOnOneStats";
import StatsTable from "../../components/StatsTable";
import ButtonInput from "../../components/inputs/ButtonInput";
import {buildStatsInformation, BuildStatsTable, statsStyle} from "./OneOnOneHelper";
import PropTypes from "prop-types";
import DropdownInput from "../../components/inputs/DropdownInput";
import RealGames from "../../pages/Random/RealGames";
import TodayRandomGames from "../../pages/Random/TodayRandomGames";
import TextInput from "../../components/inputs/TextInput";
import OneOnOneSingleStats from "./OneOnOneSingleStats";

export default class OneOnOneManager extends React.Component {

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
            mvp_player: undefined,
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

            view_stats: this.props.view_stats || false,

            loaderDetails: LOADER_DETAILS(),
            general_stats: {
                'total_games': 0,
                'total_games_per_day': {},
                'total_points': 0,
                'total_points_per_day': {},
            },

            saved_game_id: undefined,

            view_real_games: this.props.view_real_games || false,
            view_today_games: this.props.view_today_games || false,

            is_comeback: false,
            total_overtimes: 0,

            loadedSettings: false,
            settings: {
                auto_calc_ot: 0,
            },

            error_retry: false,

            selected_player: undefined,
        };

        this.restart = this.restart.bind(this);
        this.init = this.init.bind(this);
        this.saveResult = this.saveResult.bind(this);
        this.updateResult = this.updateResult.bind(this);
        this.replaceOne = this.replaceOne.bind(this);
        this.onSpecificReplace = this.onSpecificReplace.bind(this);
        this.initStats = this.initStats.bind(this);
        this.loadUserSettings = this.loadUserSettings.bind(this);
        this.calcOT = this.calcOT.bind(this);
    }

    componentDidMount() {
        const {
            get_route,
            get_stats_route,
            game_mode,
            what
        } = this.props;

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
        apiGet(this,
            get_route,
            async function(res) {
                let players = res.data.data || res.data;
                self.setState({ players });
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
                console.log(error);
                let req_error = error.message;
                if (error.message.indexOf("401") !== -1) { req_error = UNAUTHORIZED_ERROR }
                if (error.message.indexOf("400") !== -1) { req_error = `Oops, it seems like no ${self.props.what} loaded :(<Br>It's probably related to a server error` }
                self.setState({ error: req_error, error_retry });
            },
            function() {

            }
        );

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
                    console.log(error);
                    let req_error = error.message;
                    if (error.message.indexOf("401") !== -1) { req_error = UNAUTHORIZED_ERROR; }
                    if (error.message.indexOf("400") !== -1) { req_error = `Oops, it seems like no ${self.props.what} loaded :(<Br>It's probably related to a server error` }
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
                console.log(error);
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
        let custom_keys = self.props.custom_keys || {};
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

        const { what, percents } = this.props;

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
        let scores_history = {};
        player1 = player1 || getRandomElement(this.state.players);
        player2 = player2 || getRandomElement(this.state.players);

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

        let is_comeback = false;
        let total_overtimes = 0;

        await this.setState({
            player1, player2, scores, saved: false, winner: "", loser: "", scores_history, saved_game_id: undefined, mvp_player: undefined, is_comeback: is_comeback, total_overtimes: total_overtimes
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

        let is_comeback = false;
        let total_overtimes = 0;

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
            player1, player2, scores, saved: false, winner: "", loser: "", scores_history, saved_game_id: undefined, mvp_player: undefined,
            is_comeback: is_comeback,
            total_overtimes: total_overtimes
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
        let is_comeback = false;
        let total_overtimes = 0;
        this.setState({ scores, saved: false, winner: "", loser: "", scores_history, saved_game_id: undefined, mvp_player: undefined, is_comeback, total_overtimes });
    }

    async updateResult(){

        const {
            update_result_route,
        } = this.props;

        this.setState({ saving: true });
        await sleep(100);

        const score1 = this.state.scores[this.state.player1.name];
        const score2 = this.state.scores[this.state.player2.name];
        const mvp_player = this.state.mvp_player;

        const self = this;

        if (!update_result_route || update_result_route === ""){
            const player1 = this.state.player1.name;
            const player2 = this.state.player2.name;

            let winner = "";
            let loser = "";
            if (score1 > score2) {
                winner = player1;
                loser = player2;
            } else if (score2 > score1) {
                winner = player2;
                loser = player1;
            }
            const scores_history = {...this.state.scores_history};
            scores_history[player1][scores_history[player1].length-1] = score1;
            scores_history[player2][scores_history[player2].length-1] = score2;

            await self.setState({ saved: true, winner, loser, scores_history });
        }
        else {

            const {is_comeback, total_overtimes } = this.state;

            await apiPut(this,
                update_result_route + this.state.saved_game_id,
                {
                    score1: score1,
                    score2: score2,
                    mvp_player: mvp_player,
                    is_comeback,
                    total_overtimes
                },
                async function(res) {

                    const stats = self.state.stats;
                    let scores_history = self.state.scores_history;

                    let response = res.data;
                    response = self.customKeysStats(self, response);

                    Object.keys(response).forEach((player_name) => {
                        stats[player_name] = response[player_name];

                        const lastRecord = response[player_name].records.slice(-1)[0];
                        scores_history[player_name][scores_history[player_name].length-1] = (lastRecord.player1_name === player_name) ? lastRecord.score1 : lastRecord.score2;
                    });

                    let scores = self.state.scores;

                    let arr = Object.keys(scores).map(function(name){
                        scores_history[name].slice(-1)[0] = Number(scores[name]);
                        return {
                            name: name,
                            score: Number(scores[name])
                        }
                    });

                    arr = arr.sort(function(a,b) { return b.score - a.score });

                    let winner = arr[0].name;
                    let loser = arr[1].name;

                    if (arr[0].score === arr[1].score){
                        winner = "";
                        loser = "";
                    }

                    await self.setState({ saved: true, winner, loser, scores_history, scores, stats, });
                    self.initStats();
                },
                function(error, error_retry) {
                    console.log(error);
                    let req_error = error.message;
                    if (error.message.indexOf("401") !== -1) { req_error = UNAUTHORIZED_ERROR; }
                    if (error.message.indexOf("400") !== -1) { req_error = `Oops, it seems like no ${self.props.what} loaded :(<Br>It's probably related to a server error` }
                    self.setState({ error: req_error, error_retry });
                },
                function() {
                    // finally
                }
            );
        }

        this.setState({ saving: false });
    }

    async saveResult(){

        await this.setState({ saving: true });
        await sleep(100);

        const {
            save_result_route,
        } = this.props;

        const self = this;

        const player1 = this.state.player1.name;
        const player2 = this.state.player2.name;
        const score1 = this.state.scores[this.state.player1.name];
        const score2 = this.state.scores[this.state.player2.name];
        const mvp_player = this.state.mvp_player;

        const { is_comeback, total_overtimes } = this.state;

        // no save route
        if (!save_result_route || save_result_route === "") {
            let winner = "";
            let loser = "";
            if (score1 > score2) {
                winner = player1;
                loser = player2;
            } else if (score2 > score1) {
                winner = player2;
                loser = player1;
            }
            let scores_history = self.state.scores_history;
            scores_history[player1].push(score1);
            scores_history[player2].push(score2);
            await self.setState({saved: true, winner, loser, scores_history});
        }
        // save route - save it on db.
        else {

            const key1 = this.props.custom_keys?.player1 || 'player1';
            const key2 = this.props.custom_keys?.player2 || 'player2';

            await apiPost(this,
                save_result_route,
                {
                    [key1]: player1,
                    [key2]: player2,
                    score1: score1,
                    score2: score2,
                    mvp_player: mvp_player,
                    is_comeback,
                    total_overtimes,
                },
                async function(res) {

                    let stats = self.state.stats;
                    stats = self.customKeysStats(self, stats);

                    const response = res.data;
                    Object.keys(response).forEach((player_name) => {
                        stats[player_name] = response[player_name];
                    });

                    const saved_game_id = response[Object.keys(response)[0]].records.slice(-1)[0].id;

                    let scores = self.state.scores;
                    let scores_history = self.state.scores_history;

                    let arr = Object.keys(scores).map(function(name){
                        scores_history[name].push(Number(scores[name]));
                        return {
                            name: name,
                            score: Number(scores[name])
                        }
                    });

                    arr = arr.sort(function(a,b) { return b.score - a.score });

                    let winner = arr[0].name;
                    let loser = arr[1].name;

                    if (arr[0].score === arr[1].score){
                        winner = "";
                        loser = "";
                    }

                    await self.setState({ saved: true, winner, loser, scores_history, scores, stats, saved_game_id });
                    self.initStats();
                },
                function(error, error_retry) {
                    console.log(error);
                    let req_error = error.message;
                    if (error.message.indexOf("401") !== -1) { req_error = UNAUTHORIZED_ERROR; }
                    if (error.message.indexOf("400") !== -1) { req_error = `Oops, it seems like no ${self.props.what} loaded :(<Br>It's probably related to a server error` }
                    self.setState({ error: req_error, error_retry });
                },
                function() {
                    // finally
                }
            );
        }

        this.setState({ saving: false });
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

        let is_comeback = false;
        let total_overtimes = 0;

        await this.setState({
            player1, player2, scores, saved: false, winner: "", loser: "", scores_history, saved_game_id:undefined, mvp_player: undefined,
            is_comeback: is_comeback,
            total_overtimes: total_overtimes
        });
        this.initStats();
    }

    render(){

        let { what, game_mode, custom_details_title, styles, get_route, get_stats_route, update_result_route, stats_page, stats_title, percents, get_stats_specific_route } = this.props;

        let original_custom_title = custom_details_title;

        let { error, error_retry, loaded, loadedSettings, players, loaderDetails } = this.state;

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

        if (this.state.view_stats && stats_page){
            return (
                <OneOnOneStats
                    what={what}
                    stats_title={stats_title}
                    game_mode={game_mode}
                    get_route={get_route}
                    get_stats_route={get_stats_route}
                    get_stats_specific_route={get_stats_specific_route}
                    mvp_block={this.props.mvp_block}
                    onBack={() => { this.setState({ view_stats: false }) }}
                    player_from_url={this.props.player_from_url}
                />
            );
        }

        const { selected_player } = this.state;

        if (selected_player){
            const get_specific_route = (what === "players") ? "/player" : "/team";
            const this_stats_title = stats_title || game_mode;

            return (
                <OneOnOneSingleStats
                    selected_player={selected_player}
                    what={what}
                    stats_title={`${this_stats_title} - ${selected_player}`}
                    game_mode={game_mode}
                    get_route={get_specific_route}
                    get_stats_route={get_stats_specific_route}
                    onBack={() => { this.setState({ selected_player: undefined }) }}
                />
            );
        }

        if (this.state.view_real_games){
            const self = this;
            return (
                <RealGames
                    onBack={() => { this.setState({ view_real_games: false }) }}
                    onSelect={(player1, player2) => {

                        self.state.players.forEach((player) => {
                           if (player1 === player.name){
                               player1 = player;
                           }
                           else if (player2 === player.name){
                               player2 = player;
                           }
                        });

                        this.setState({ view_real_games: false });
                        self.init(player1, player2);
                    }}
                />
            );
        }

        if (this.state.view_today_games){
            const self = this;
            return (
                <TodayRandomGames
                    onBack={() => { this.setState({ view_today_games: false }) }}
                    onSelect={(player1, player2) => {

                        self.state.players.forEach((player) => {
                            if (player1 === player.name){
                                player1 = player;
                            }
                            else if (player2 === player.name){
                                player2 = player;
                            }
                        });

                        this.setState({ view_today_games: false });
                        self.init(player1, player2);
                    }}
                />
            );
        }

        if (custom_details_title){
            original_custom_title = `<div style='border-top:1px solid #eaeaea; width:100%; margin: 10px 0px; padding-top: 10px;'>${custom_details_title}</div>`;
        }

        const { stats, scores, scores_history } = this.state;

        if (what === 'teams'){
            // console.log(this.state.player1, this.state.player2);
            const maxPlayers = Math.max(this.state.player1.players.length, this.state.player2.players.length);
            const minHeight = maxPlayers * 51;
            styles['descriptionStyle'] = { minHeight: minHeight };
        }

        const blocks =
        [this.state.player1, this.state.player2].map((player, idx) => {
            const _2k_rating = player['_2k_rating'] || 'N/A';

            let custom_details = undefined;
            if (what === 'teams'){
                custom_details = [];

                custom_details_title = `2K Rating: ${_2k_rating}` + original_custom_title;

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
                        custom_details_title={custom_details_title}
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
                        singleRounds={scores_history[player.name]}
                        lost={(this.state.saved && this.state.loser === player.name)}
                        winner={(this.state.saved && this.state.winner === player.name)}

                        all_players={this.state.players}
                        curr_players={[this.state.player1.name, this.state.player2.name]}
                        onReplace={(e) => { this.replaceOne(idx); }}
                        onSpecificReplace={(new_player) => { this.onSpecificReplace(player, new_player) }}

                        onImageClick={(e) => {

                            const target = e.target;
                            const html = $(e.target).wrap("<p>").parent().html();

                            // console.log(html);

                            // to avoid clicking on 'replace' or 'specific rpelace' from openning stats page.
                            if (html.indexOf('View Stats') !== -1 && get_stats_specific_route) {
                                this.setState({
                                    selected_player: player.name,
                                })
                            }

                        }}
                    />
            );
        })

        let bottom = 75; // (what === 'teams') ? 34 : 75;
        let teams = Object.keys(scores_history);
        if (teams.length > 0) {
            let team1 = scores_history[teams[0]];
            let team2 = scores_history[teams[1]];
            if (team1.length > 0 && team2.length > 0 && team1[team1.length-1] !== team2[team2.length-1]){
                bottom += 21;
            }
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

        let mvp_block = "";
        if (this.props.mvp_block){

            const { player1, player2 } = this.state;

            const options = (scores[player1.name] > scores[player2.name]) ? player1.players : (scores[player2.name] > scores[player1.name]) ? player2.players : [];

            mvp_block = (
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
                        disabled={options.length === 0}
                        onChange={(player) => {
                            this.setState({ mvp_player: player.name });
                        }}
                    />
                </div>
                );
        }

        const { is_comeback, total_overtimes } = this.state;

        // comeback
        const comeback_block = (
            <div style={{ paddingBottom: "20px" }}>
                <div
                    className="ui checkbox"
                >
                    <input type="checkbox" checked={is_comeback} onChange={() => { this.setState({ is_comeback: !is_comeback }) }}  />
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
                        onChange={(e) => {
                            this.setState({ total_overtimes: Math.min(20,Math.max(0,Number(e.target.value)) || 0) });
                        }}
                    />
                </div>
            </div>
        );

        return (

            <div style={{ paddingTop: "20px" }}>
                <Header />

                {(get_stats_route && get_stats_route !== "") ?
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
                        title={`${toPascalCase(what)} Individual Stats`}
                        marginTop="10px"
                        cols={["",this.state.player1.name,this.state.player2.name]}
                        stats={this.state.player_stats_values}
                    />
                </div> : ""}

                <div className="ui link cards centered" style={{margin: "auto", marginBottom:"5px"}}>
                    <ButtonInput
                        text={"Restart Game"}
                        onClick={this.restart}
                    />
                    <ButtonInput
                        text={"New Game"}
                        style={{ marginLeft:"5px" }}
                        onClick={() => { this.init()}}
                    />
                    {(stats_page) ?
                    <ButtonInput
                        text={"View Stats"}
                        style={{ marginLeft:"5px" }}
                        onClick={() => { this.setState({ view_stats: true }) }}
                    /> : ""}

                    {(this.props.real_games_button) ?
                        <ButtonInput
                            text={"View (Real) Games"}
                            style={{ marginLeft:"5px" }}
                            onClick={() => { this.setState({ view_real_games: true }) }}
                        /> : ""}
                    {(this.props.today_games_button) ?
                        <ButtonInput
                            text={"View (Your) Today Games"}
                            style={{ marginLeft:"5px" }}
                            onClick={() => { this.setState({ view_today_games: true }) }}
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
                            {(this.state.saved_game_id && update_result_route && update_result_route !== "") ?
                                (
                                    <ButtonInput
                                        text={"Update"}
                                        style={{ width: "100%" }}
                                        onClick={this.updateResult}
                                        disabled={this.state.saving}
                                    />
                                ): (
                                    <ButtonInput
                                        text={"Save"}
                                        style={{ width: "100%" }}
                                        onClick={this.saveResult}
                                        disabled={this.state.saved || this.state.saving}
                                    />
                                )}
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

                {mvp_block}

                <div className="ui link cards centered" style={{
                    position:"relative", display: "flex", textAlign: "center", alignItems: "strech", margin: "auto", paddingBottom: "20px",
                    width: "710px",
                }}>
                    {overtime_block}
                </div>

            </div>
        );
    }
};

OneOnOneManager.propTypes = {
    /**
     * Which game mode is that?.
     * Will be used for stats titles for example.
     *
     * For example - 1 on 1, Random Games
     */
    game_mode: PropTypes.string.isRequired,

    /**
     * What are we talking about? will be used for custom messages.
     *
     * In plural.
     *
     * For example - players, teams.
     */
    what: PropTypes.string.isRequired,

    /**
     * option to pass a title to custom details.
     *
     * for example: "Players", and then on custom_details pass array of players names.
     */
    custom_details_title: PropTypes.string,

    /**
     * option to pass custom details array. will override 'details' and 'stats'.
     *
     * for example, you can pass array of all players of specific team.
     */
    custom_details: PropTypes.arrayOf(PropTypes.string),

    /**
     * The route to get players/teams from.
     *
     * GET method will be used
     *
     * for example /team or /player/popular
     */
    get_route: PropTypes.string.isRequired,

    /**
     * The route to get players/teams stats from.
     *
     * GET method will be used
     *
     * for example /records/one-on-one/player
     */
    get_stats_route: PropTypes.string,

    /**
     * The route to save game result.
     *
     * POST method will be used
     *
     * for example /records/one-on-one/
     */
    save_result_route: PropTypes.string,

    /**
     * The route to update game result after it was saved (in order to fix typos for example)
     *
     * PUT method will be used
     *
     * for example /records/one-on-one/
     */
    update_result_route: PropTypes.string,

    /**
     * optional styles property, hash of the following UI settings you can control:
     *
     * \> placeRibbon - color (red/orange/blue etc) should we show a place ribbon that indicates player's place in a more noticeable way.
     *
     * \> imageContainerStyle - hash of styles for image container
     *
     * \> imageStyle - hash of styles for the image itself
     *
     * \> descriptionStyle - hash of styles for description block
     *
     * \> extraContentStyle - hash of styles for the bottom part of the card.
     *
     * Example:
     *
     * {
     * descriptionStyle: { minHeight: minHeight }, imageContainerStyle: { backgroundColor: "#F2F2F2" },
     * imageStyle: { width: 200, margin: "auto", padding: "20px" }, extraContentStyle: { display: "none" }
     * }
     */
    styles: PropTypes.object,

    /**
     * optional object to replace stats records keys with different keys, for example team1 and player1
     *
     * example:
     *
     * { player1: 'team1', player2: 'team2', player1Id: 'team1Id', player2Id: 'team2Id', player1_name: 'team1_name', player2_name: 'team2_name' }
     */
    custom_keys: PropTypes.object,

    /**
     * should we display a mvp select box?
     *
     */
    mvp_block: PropTypes.bool,

    /**
     * display Real Games button
     *
     */
    real_games_button: PropTypes.bool,

    /**
     * The route to get players/teams stats from.
     *
     * GET method will be used
     *
     * for example /records/one-on-one/player
     */
    get_stats_specific_route: PropTypes.string,
};

OneOnOneManager.defaultProps = {
};