import React from 'react';
import PlayerCard from '../../components/PlayerCard';
import SearchInput from '../../components/inputs/SearchInput';
import SelectedPlayers from "../../components/SelectedPlayers";
import Game from './Game';
import './three.points.contest.css';
import {
    COMPUTER_PLAYER_PICTURE,
    DEFAULT_COMPUTER_LEVEL,
    DEFAULT_STATS_ORDER,
    DEFAULT_STOPWATCH_STATS_ORDER,
    LOADER_DETAILS,
    LOADING_DELAY,
    MAX_ROUND_LENGTH,
    MIN_ROUND_LENGTH,
    RANDOM_PLAYER_PICTURE,
    ROUND_DEFAULT_LENGTH,
    TEAM1_COLOR,
    TEAM2_COLOR,
    UNAUTHORIZED_ERROR
} from "../../helpers/consts";
import {deepClone, isDefined} from "../../helpers/utils";
import LoadingPage from "../../pages/LoadingPage";
import ErrorPage from "../../pages/ErrorPage";

import Header from "../../components/layouts/Header";
import {apiGet} from "../../helpers/api";
import ButtonInput from "../../components/inputs/ButtonInput";
import OneOnOneStats from "../shared/OneOnOneStats";
import {buildGeneralStats, BuildStatsTable, statsStyle} from "../shared/OneOnOneHelper";
import {
    currentLoseStreakSort,
    currentWinStreakSort, maxLoseStreakSort, maxWinStreakSort,
    overallSort, specificSort,
    totalGamesSort, totalLostSort, totalScored,
    totalWinsPercentsSort, totalWinsSort
} from "../../helpers/sort";
import DropdownInput from "../../components/inputs/DropdownInput";

const game_mode = "Three Points Contest";
const stats_title = "Three Points Contest";
const what = "players";
const get_stats_route = "/records/three-points-contest/by-player";
const percents = 1;

export default class Settings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            players: [],
            teams: [
                [],
                []
            ],
            randoms: [
                [],
                []
            ],
            computers: [
                [],
                []
            ],
            styles:[
                {"border": "1px solid " + TEAM1_COLOR, opacity: 1},
                {"border": "1px solid " + TEAM2_COLOR, opacity: 1}
            ],
            idx: 0,
            keyword: "",

            computer_level: DEFAULT_COMPUTER_LEVEL,
            computer_levels: {
                'Easy': 0.7,
                'Normal': 0.6,
                'Hard': 0.5,
                'Very Hard': 0.3,
                'Real Life': undefined,
            },
            round_length: ROUND_DEFAULT_LENGTH,
            game_started: false,

            loaded: false,

            loadedStats: false,
            stats: {},
            general_stats: {},
            leaderboard: [],

            error: undefined,
            loaderDetails: LOADER_DETAILS(),
            view_stats: this.props.view_stats || false,
            error_retry: false,

            orderBy: '3Pt Percents',
            "orderByOptions":[
                { "3Pt Percents": (a,b) => {
                    return parseFloat(b['3pt_percents']?.replace('%','')) - parseFloat(a['3pt_percents']?.replace('%',''));
                } },
                { "Total Games": totalGamesSort },
                { "Total Wins Percents": totalWinsPercentsSort },
                { "Current Win Streak": currentWinStreakSort },
                { "Current Lose Streak": currentLoseStreakSort },
                { "Max Win Streak": maxWinStreakSort },
                { "Max Lose Streak": maxLoseStreakSort },
                { "Total Scored": totalScored },
                { "Total Wins": totalWinsSort },
                { "Total Lost": totalLostSort },
            ],
            players_hash: {}, // for 3pt percents sort
        };

        this.state.orderByOptions.push({ 'Average Place': (a,b) => specificSort('average_place',b,a) });
        this.state.orderByOptions.push({ 'Total Games Played as Random': (a,b) => specificSort('total_randoms',a,b) });
        this.state.orderByOptions.push({ 'Total Games Played as Computer': (a,b) => specificSort('total_computers',a,b) });
        this.state.orderByOptions.push({ 'Total Shots Attempts': (a,b) => specificSort('total_from',a,b) });
        this.state.orderByOptions.push({ 'Total Shots Average': (a,b) => specificSort('total_shot_average',a,b) });
        this.state.orderByOptions.push({ 'Total Perfect Scores': (a,b) => specificSort('perfect_scores',a,b) });
        this.state.orderByOptions.push({ 'Total No Scores': (a,b) => specificSort('no_scores',a,b) });
        this.state.orderByOptions.push({ 'Total Rounds': (a,b) => specificSort('total_rounds',a,b) });
        this.state.orderByOptions.push({ 'Max Perfect Scores in Game': (a,b) => specificSort('max_perfect_scores_in_game',a,b) });
        this.state.orderByOptions.push({ 'Max No Scores in Game': (a,b) => specificSort('max_no_scores_in_game',a,b) });
        this.state.orderByOptions.push({ 'Average Perfect Scores in Game': (a,b) => specificSort('average_perfect_scores_in_game',a,b) });
        this.state.orderByOptions.push({ 'Perfect Scores Percents': (a,b) => specificSort('perfect_scores_percents',a,b) });

        this.state.orderByOptions.push({ 'Best Percentage in Game': (a,b) => specificSort('best_percentage_in_game',a,b) });
        this.state.orderByOptions.push({ 'Worst Percentage in Game': (a,b) => specificSort('worst_percentage_in_game',b, a) });

        this.toggleState = this.toggleState.bind(this);
        this.startGame = this.startGame.bind(this);
        this.setComputerLevel = this.setComputerLevel.bind(this);
        this.restart = this.restart.bind(this);
        this.buildLeaderBoard = this.buildLeaderBoard.bind(this);
        this.initStats = this.initStats.bind(this);
    }

    componentDidMount() {

        let self = this;
        apiGet(this,
            `/player/3pts`,
            // `/player/3pts?names=Kyrie Irving,Stephen Curry,Seth Curry,James Harden,Klay Thompson,Duncan robinson,Joe Harris`,
            function(res) {
                let players = res.data;
                // players = players.sort(function(a,b) { return parseFloat(b['3pt_percents'].replace('%','')) - parseFloat(a['3pt_percents'].replace('%','')); })

                const players_hash = {};
                players.forEach((player) => {
                    players_hash[player.name] = player;
                })

                self.setState({ players, players_hash });
            },
            function(error, retry) {
                console.log(error);
                let req_error = error.message;
                if (error.message.indexOf("401") !== -1) { req_error = UNAUTHORIZED_ERROR; }
                if (error.message.indexOf("400") !== -1) { req_error = "Oops, it seems like no players loaded :(<Br>It's probably related to a server error" }
                self.setState({ error: req_error, error_retry: retry });
            },
            function() {
                setTimeout(() => {
                    self.setState({ loaded: true })},
                LOADING_DELAY);

                self.initStats(self);
            }
        );
    }

    initStats(self) {
        apiGet(this,
            get_stats_route,
            async function(res) {
                let stats = res.data.data;

                const { general_stats } = buildGeneralStats(stats, percents);

                const leaderboard = self.buildLeaderBoard(stats);

                await self.setState({ stats, general_stats, leaderboard, loadedStats: true });
            },
            function(error, error_retry) {
                console.log(error);
                let req_error = error.message;
                if (error.message.indexOf("401") !== -1) { req_error = UNAUTHORIZED_ERROR; }
                if (error.message.indexOf("400") !== -1) { req_error = `Oops, it seems like stats weren't loaded :(<Br>It's probably related to a server error` }
                self.setState({ error: req_error, error_retry });
            },
            async function() {

            }
        );
    }

    toggleState (player){

        let players = this.state.players;

        if (player.name.indexOf('Random Player') !== -1){
            this.onRemoveRandom(player.name);
            return;
        }

        if (player.name.indexOf('Computer Player') !== -1){
            this.onRemoveComputer(player.name);
            return;
        }

        let teams = this.state.teams;
        let idx = this.state.idx;

        for (let a in players){
            let iter = players[a];
            if (iter.name === player.name) {
                if (isDefined(iter.selected)) {
                    teams[iter.selected] = teams[iter.selected].filter(function(a) { return a.name !== player.name });
                    iter.selected = undefined;
                } else {
                    iter.selected = idx;
                    teams[idx].push(player);
                    idx++;
                }
            }
            players[a] = iter;
        }

        if (idx >= teams.length) idx = 0;

        this.setState({
            idx, teams, players
        });
    }

    searchPlayers(event){
        const keyword = event.target.value;
        this.setState({ keyword });
    }

    applyFilters(){

        const { keyword, players, leaderboard, orderBy } = this.state;

        // console.log(orderBy);

        return players.filter(function(iter) {
            let isOk = false;
            Object.keys(iter).forEach(function(a){
                let val = (a === 'team') ? iter[a]["name"] : iter[a];
                if (a === 'picture') val = '';
                if (isDefined(val) && val != undefined && val.toString().toLowerCase().indexOf(keyword.toLowerCase()) !== -1){
                    isOk = true;
                    return;
                }
            });
            return isOk;
        }).sort((a,b) => {

            if (orderBy === '2K Rating'){
                return b['_2k_rating'] - a['_2k_rating'];
            }
            else {
                // console.log(leaderboard.indexOf(a.name), leaderboard.indexOf(b.name));
                let i1 = leaderboard.indexOf(a.name);
                let i2 = leaderboard.indexOf(b.name);
                if (i1 === -1) { i1 = 9999999; }
                if (i2 === -1) { i2 = 9999999; }
                return i1 - i2;
            }
        })
    }

    onClear (idx) {
        const teams = this.state.teams;
        const randoms = this.state.randoms;
        const computers = this.state.computers;
        const players = this.state.players.map(function(iter){
            if (iter.selected === idx) iter.selected = undefined;
            return iter;
        })

        teams[idx] = [];
        randoms[idx] = [];
        computers[idx] = [];

        this.setState({
            teams, players, randoms, computers
        });
    }

    setRoundLength(event) {
        let round_length = event.target.value;
        round_length = Math.min(round_length,MAX_ROUND_LENGTH);
        round_length = Math.max(round_length,MIN_ROUND_LENGTH);

        this.setState({
            round_length
        });
    }

    setComputerLevel(event) {
        let computer_level = event.target.value;

        this.setState({
            computer_level
        });
    }

    startGame() {
        this.setState({
            game_started: true,
        });
    }

    onAddRandom(idx) {

        const randoms = this.state.randoms;

        randoms[idx].push({
            name: "Random Player " + parseInt(idx+1) + ' - ' + parseInt(randoms[idx].length+1),
            picture: RANDOM_PLAYER_PICTURE,
            team: { name: 'Random' }
        })

        this.setState({
            randoms
        });
    }

    onAddComputer(idx) {

        const { computers } = this.state;

        computers[idx].push({
            name: "Computer Player " + parseInt(idx+1) + ' - ' + parseInt(computers[idx].length+1),
            picture: COMPUTER_PLAYER_PICTURE,
            team: { name: 'Computer' }
        })

        this.setState({
            computers
        });
    }

    onRemoveRandom(name) {
        let { randoms } = this.state;

        let team_idx;

        randoms.forEach(function(arr, idx){
           arr.forEach(function(iter, i){
               if (name === iter.name){
                   team_idx = idx;
               }
           })
        });

        if (isDefined(team_idx)){
            randoms[team_idx].splice(randoms[team_idx].length-1, 1);
        }

        this.setState({
            randoms
        });
    }

    onRemoveComputer(name){
        let { computers } = this.state;

        let team_idx;

        computers.forEach(function(arr, idx){
            arr.forEach(function(iter, i){
                if (name === iter.name){
                    team_idx = idx;
                }
            })
        });

        if (isDefined(team_idx)){
            computers[team_idx].splice(computers[team_idx].length-1, 1);
        }

        this.setState({
            computers
        });
    }

    restart() {
        this.setState({
            game_started: false,
            keyword: "",
        });
    }

    buildLeaderBoard(records){

        const { orderByOptions, orderBy, players_hash } = this.state;

        let func = null;
        let defFunc = null; // (a,b) => { return a-b; };
        orderByOptions.map((iter) => {
            const name = Object.keys(iter)[0];
            if (name === orderBy){
                func = iter[name];
            }
            if (name === DEFAULT_STATS_ORDER){
                defFunc = iter[name];
            }
        });

        const leaderboard =
            Object.keys(records).sort((a,b) => {

                if (players_hash[a]) {
                    records[a]['3pt_percents'] = players_hash[a]['3pt_percents'];
                } else {
                    // console.log('not exist ' + a);
                }
                if (players_hash[b]) {
                    records[b]['3pt_percents'] = players_hash[b]['3pt_percents'];
                } else {
                    // console.log('not exist ' + b);
                }

                return (func) ? func(records[a],records[b]) : defFunc(records[a],records[b]);
            });
        return leaderboard;
    }

    render() {

        const players = this.applyFilters();

        let can_start = (this.state.teams[0].length > 0 || this.state.randoms[0].length > 0 || this.state.computers[0].length > 0) && (this.state.teams[1].length > 0 || this.state.randoms[1].length > 0 || this.state.computers[1].length > 0);
        if (this.state.error) can_start = false;

        const game_teams = [
            this.state.teams[0].concat(this.state.randoms[0]).concat(this.state.computers[0]),
            this.state.teams[1].concat(this.state.randoms[1]).concat(this.state.computers[1])];

        if (this.state.view_stats){
            return (
                <OneOnOneStats
                    what={what}
                    stats_title={stats_title}
                    game_mode={game_mode}
                    get_route={"/player"}
                    percents={1} // percents, not points.
                    get_stats_route={get_stats_route}
                    get_stats_specific_route={"/records/three-points-contest/by-player/:name"}
                    onBack={() => { this.setState({ view_stats: false }) }}
                    player_from_url={ this.props.player_from_url }
                />
            );
        }

        if (this.state.game_started){

            return (
              <Game
                all_players={deepClone(this.state.players)}
                teams={deepClone(game_teams)}
                stats_title={stats_title}
                game_mode={game_mode}
                what={what}
                round_length={this.state.round_length}
                computer_level={this.state.computer_level}
                have_computers={(this.state.computers[0].length + this.state.computers[1].length > 0)}
                computer_levels={this.state.computer_levels}
                goHome={this.restart}
                get_stats_specific_route={"/records/three-points-contest/by-player/:name"}
              />
            );
        }

        const computer_level = this.state.computer_level;

        let { error, error_retry, loaded, loadedStats } = this.state;

        const is_loading = !loaded || !loadedStats;
        if (error || (!is_loading && this.state.players.length === 0)) {
            error = error || "Oops, it seems like no players loaded :(<Br>It's probably related to a server error";
            return (
                <ErrorPage message={error} retry={error_retry} />
            );
        } else if (is_loading) {
            return (
                <LoadingPage message={"Please wait while loading players..."} loaderDetails={this.state.loaderDetails} />
            );
        }

        const self = this;

        // avoid selecting more players then we have
        const total_selected_players = game_teams[0].length + game_teams[1].length;

        // one on one stats
        let general_stats_block = (get_stats_route && get_stats_route !== "") ? BuildStatsTable(this.state.general_stats,0,game_mode, 0, undefined, percents) : "";
        const records = this.state.stats;

        let selectedOption = null;
        const orderByOptions = this.state.orderByOptions.map((x,idx) => {

            const name = Object.keys(x)[0];

            const option = { name: name, id: idx }
            if (option.name === this.state.orderBy){
                selectedOption = option;
            }
            return option;
        }).sort((a,b) => { return a.name - b.name; });

        return (
            <div style={{ paddingTop: "20px" }}>
                <Header />

                <div className="ui link cards centered" style={statsStyle}>
                    {general_stats_block}

                    <div style={{ display: "block", textAlign:"center", marginTop:"5px", width: "100%" }}>
                        <div className={"ui basic buttons"} style={{ margin: "auto", border: "0px" }}>

                            <ButtonInput
                                text={"Reload Stats"}
                                onClick={async () => {
                                    await self.setState({ loadedStats: false })
                                    self.initStats(self);
                                }}
                            />

                            <ButtonInput
                                text={"View Stats"}
                                style={{ marginLeft:"5px" }}
                                onClick={() => { this.setState({ view_stats: true }) }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{...statsStyle, marginBottom: "20px", paddingBottom: "10px" }}>
                    <div className="ui link input cards centered" style={{ margin: "auto", width: "550px" }}>
                        <div style={{ display: "block", width: "100%" }}>

                            <div style={{ display:"inline-block", width:"50%", textAlign: "center" }}>
                                <span style={{ lineHeight: "38px", marginRight: "10px"}} > Computer Level: </span>
                                <select style={{ border: "1px solid #eaeaea", borderRadius: "5px", padding: "5px" }} onChange={this.setComputerLevel} value={computer_level}>
                                    {
                                        Object.keys(this.state.computer_levels).map((x,idx) => <option key={idx} value={x}>{x}</option>)
                                    }
                                </select>
                            </div>

                            <div style={{ display:"inline-block", width:"50%", textAlign: "center" }}>
                                <span style={{ lineHeight: "38px", marginRight: "10px"}} > Round Length: </span>
                                <input type={"number"} value={this.state.round_length} min={MIN_ROUND_LENGTH} max={MAX_ROUND_LENGTH} onChange={this.setRoundLength.bind(this)} style={{ height: "38px", marginRight: "10px", border: "1px solid #eaeaea", padding:"0px 5px" }}/>
                            </div>
                        </div>
                        <div style={{ display: "block", textAlign:"center", marginTop:"15px", width: "100%" }}>
                            <div className={"ui basic buttons"} style={{ margin: "auto", border: "0px" }}>

                                <ButtonInput
                                    text={"Start Game"}
                                    style={{ width:"150px" }}
                                    disabled={!can_start}
                                    onClick={this.startGame}
                                />

                            </div>
                        </div>
                    </div>

                    <div className="ui link cards centered" style={{ margin: "auto", marginBottom:"10px" }}>

                    </div>
                </div>

                <div className="ui centered selected-players" style={{ display: "flex", textAlign: "center", alignItems: "strech", margin: "auto", width: "80%", marginBottom: "10px" }}>
                    <SelectedPlayers title={"Team One"}
                                     team={this.state.teams[0].concat(this.state.randoms[0]).concat(this.state.computers[0])}
                                     onClear={() => this.onClear(0)} toggle={this.toggleState}
                                     onAddRandom={() => this.onAddRandom(0)}
                                     onAddComputer={() => this.onAddComputer(0)}
                                     enabled={this.state.players.length > 0 && total_selected_players < this.state.players.length}
                    />
                    <SelectedPlayers title={"Team Two"}
                                     team={this.state.teams[1].concat(this.state.randoms[1]).concat(this.state.computers[1])}
                                     onClear={() => this.onClear(1)} toggle={this.toggleState}
                                     onAddRandom={() => this.onAddRandom(1)}
                                     onAddComputer={() => this.onAddComputer(1)}
                                     enabled={this.state.players.length > 0 && total_selected_players < this.state.players.length}
                    />
                </div>

                <SearchInput onKeyUp={this.searchPlayers.bind(this)} />

                <div className="ui link cards centered" style={{ margin: "auto", marginTop: "10px" }}>
                    <DropdownInput
                        options={orderByOptions}
                        label={"Order By: "}
                        name={"orderBy"}
                        width={"250px"}
                        nameKey={"name"}
                        valueKey={"name"}
                        idKey={"id"}
                        selectedOption={selectedOption}
                        onChange={async(option) => {
                            await self.setState({ orderBy: option.name });
                            const leaderboard = self.buildLeaderBoard(self.state.stats, option);
                            self.setState({ leaderboard });
                        }}
                    />
                </div>

                <div className="ui link cards centered" style={{ margin: "auto" }}>
                    { players.map((player,idx) => {
                        const _2k_rating = player['_2k_rating'] || 'N/A';

                        return (<PlayerCard
                                    key={idx}
                                    name={player.name}
                                    picture={player.picture}
                                    details={{
                                        _2k_rating: _2k_rating,
                                        percents: player['3pt_percents'], // 3pt percents
                                        height_meters:player.height_meters,
                                        weight_kgs:player.weight_kgs,
                                        team:player.team.name,
                                    }}
                                    stats={{

                                        total_wins: records[player.name]?.total_wins,
                                        total_lost: records[player.name]?.total_lost,
                                        total_games: records[player.name]?.total_games,
                                        total_win_percents: records[player.name]?.total_win_percents,

                                        total_scored: records[player.name]?.total_scored,

                                        win_streak: records[player.name]?.win_streak,
                                        lose_streak: records[player.name]?.lose_streak,
                                        max_win_streak: records[player.name]?.max_win_streak,
                                        max_lose_streak: records[player.name]?.max_lose_streak,

                                        // 3pt
                                        average_place: records[player.name]?.average_place,
                                        total_computers: records[player.name]?.total_computers,
                                        total_randoms: records[player.name]?.total_randoms,
                                        total_from: records[player.name]?.total_from,
                                        total_shot_average: records[player.name]?.total_shot_average,

                                        perfect_scores: records[player.name]?.perfect_scores,
                                        no_scores: records[player.name]?.no_scores,
                                        total_rounds: records[player.name]?.total_rounds,
                                        max_perfect_scores_in_game: records[player.name]?.max_perfect_scores_in_game,
                                        max_no_scores_in_game: records[player.name]?.max_no_scores_in_game,
                                        average_perfect_scores_in_game: records[player.name]?.average_perfect_scores_in_game,
                                        perfect_scores_percents: records[player.name]?.perfect_scores_percents,

                                        max_perfect_scores_in_game_date: records[player.name]?.max_perfect_scores_in_game_date,
                                        max_perfect_scores_in_game_percents: records[player.name]?.max_perfect_scores_in_game_percents,
                                        max_no_scores_in_game_date: records[player.name]?.max_no_scores_in_game_date,
                                        max_no_scores_in_game_percents: records[player.name]?.max_no_scores_in_game_percents,

                                        max_no_scores_in_game_place: records[player.name]?.max_no_scores_in_game_place,
                                        max_perfect_scores_in_game_place: records[player.name]?.max_perfect_scores_in_game_place,

                                        best_percentage_in_game: records[player.name]?.best_percentage_in_game,
                                        best_percentage_in_game_date: records[player.name]?.best_percentage_in_game_date,
                                        best_percentage_in_game_percents: records[player.name]?.best_percentage_in_game_percents,
                                        best_percentage_in_game_place: records[player.name]?.best_percentage_in_game_place,
                                        best_percentage_in_game_shots: records[player.name]?.best_percentage_in_game_shots,
                                        best_percentage_in_game_attempts: records[player.name]?.best_percentage_in_game_attempts,

                                        worst_percentage_in_game: records[player.name]?.worst_percentage_in_game,
                                        worst_percentage_in_game_date: records[player.name]?.worst_percentage_in_game_date,
                                        worst_percentage_in_game_percents: records[player.name]?.worst_percentage_in_game_percents,
                                        worst_percentage_in_game_place: records[player.name]?.worst_percentage_in_game_place,
                                        worst_percentage_in_game_shots: records[player.name]?.worst_percentage_in_game_shots,
                                        worst_percentage_in_game_attempts: records[player.name]?.worst_percentage_in_game_attempts,

                                        highlights: [this.state.orderBy],
                                    }}
                                    position={player.position}
                                    debut_year={player.debut_year}
                                    style={isDefined(player.selected) ? this.state.styles[player.selected] : {opacity: 0.6}}
                                    onClick={() => {
                                        this.toggleState(player);
                                    }}
                                    disabled={(total_selected_players >= this.state.players.length)}
                                />
                        );
                    })}
                    {(players.length === 0) ? <div style={{ marginTop: "20px"}}>No Results Found for "{this.state.keyword}"</div> : "" }
                </div>
            </div>
        )
    }
}
