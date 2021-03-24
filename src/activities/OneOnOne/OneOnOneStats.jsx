import React from 'react';
import PlayerCard from '../../components/PlayerCard';
import SearchInput from '../../components/inputs/SearchInput';
import {formatDate, isDefined, nth} from "../../helpers/utils";
import LoadingPage from "../../pages/LoadingPage";
import ErrorPage from "../../pages/ErrorPage";

import Header from "../../components/layouts/Header";
import {apiGet} from "../../helpers/api";
import {DEFAULT_STATS_ORDER, LOADER_DETAILS, LOADING_DELAY, UNAUTHORIZED_ERROR} from "../../helpers/consts";
import {
    _2kRatingSort, average2kRatingSort,
    currentLoseStreakSort,
    currentWinStreakSort, maxLoseStreakSort, maxWinStreakSort, OVERALL_HIGHLIGHTS,
    overallSort, specificSort, totalAwayGames, totalDiffPerGameSort, totalDiffSort,
    totalGamesSort, totalHomeGames,
    totalKnockoutsSort, totalLostSort, totalScored, totalSuffered, totalSufferedKnockoutsSort,
    totalWinsPercentsSort, totalWinsSort,
} from "../../helpers/sort";
import DropdownInput from "../../components/inputs/DropdownInput";
import ButtonInput from "../../components/inputs/ButtonInput";
import {buildGeneralStats, BuildStatsTable} from "./OneOnOneHelper";

export default class OneOnOneStats extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            "players": [],
            "records": {},
            "leaderboard": [],
            "keyword": "",
            "loaded1": false,
            "loaded2": false,
            "merged": false,

            "orderByOptions":[
                { "Overall": overallSort },
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
            "orderBy": DEFAULT_STATS_ORDER,
            loaderDetails: LOADER_DETAILS(),

            general_stats: {
                'total_games': 0,
                'total_games_per_day': {},
                'total_points': 0,
                'total_points_per_day': {},
            },
            mvp_stats: {
                'total_mvps': 0,
                'total_mvps_per_player': {},
                'total_mvps_on_knockouts': 0,
                'total_mvps_on_knockouts_per_player': {},
            }
        };

        if (this.props.game_mode === "Three Points Contest") {
            this.state.orderByOptions.push({ 'Average Place': (a,b) => specificSort('average_place',b,a) });
            this.state.orderByOptions.push({ 'Total Games Played as Random': (a,b) => specificSort('total_randoms',a,b) });
            this.state.orderByOptions.push({ 'Total Games Played as Computer': (a,b) => specificSort('total_computers',a,b) });
            this.state.orderByOptions.push({ 'Total Shots Attempts': (a,b) => specificSort('total_from',a,b) });
            this.state.orderByOptions.push({ 'Total Shots Average': (a,b) => specificSort('total_shot_average',a,b) });

            // todo complete
            this.state.orderByOptions.push({ 'Total Perfect Scores': (a,b) => specificSort('perfect_scores',a,b) });
            this.state.orderByOptions.push({ 'Total No Scores': (a,b) => specificSort('no_scores',a,b) });
            this.state.orderByOptions.push({ 'Total Rounds': (a,b) => specificSort('total_rounds',a,b) });
            this.state.orderByOptions.push({ 'Max Perfect Scores in Game': (a,b) => specificSort('max_perfect_scores_in_game',a,b) });
            this.state.orderByOptions.push({ 'Max No Scores in Game': (a,b) => specificSort('max_no_scores_in_game',a,b) });
            this.state.orderByOptions.push({ 'Average Perfect Scores in Game': (a,b) => specificSort('average_perfect_scores_in_game',a,b) });
            this.state.orderByOptions.push({ 'Perfect Scores Percents': (a,b) => specificSort('perfect_scores_percents',a,b) });

            this.state.orderByOptions.push({ 'Best Percentage in Game': (a,b) => specificSort('best_percentage_in_game',a,b) });
            this.state.orderByOptions.push({ 'Worst Percentage in Game': (a,b) => specificSort('worst_percentage_in_game',a,b) });
        }
        else {
            // all of these are for other games modes. (not 3pt contest)
            this.state.orderByOptions.push({ "Total Diff": totalDiffSort });
            this.state.orderByOptions.push({ "Total Diff Per Game": totalDiffPerGameSort });
            this.state.orderByOptions.push({ "Total Home Games": totalHomeGames });
            this.state.orderByOptions.push({ "Total Road Games": totalAwayGames });
            this.state.orderByOptions.push({ "Total Suffered": totalSuffered });
            this.state.orderByOptions.push({ "Total Knockouts": totalKnockoutsSort });
            this.state.orderByOptions.push({ "Total Suffered Knockouts": totalSufferedKnockoutsSort });
        }

        if (this.props.what === "players"){
            this.state.orderByOptions.push({ "2K Rating": _2kRatingSort });

            if (this.props.game_mode !== "Three Points Contest") {
                this.state.orderByOptions.push({"Average Opponent 2K Rating": average2kRatingSort});
            }
        }

        this.applyFilters = this.applyFilters.bind(this);
        this.loadRecords = this.loadRecords.bind(this);
        this.buildLeaderBoard = this.buildLeaderBoard.bind(this);
    }

    buildLeaderBoard(records){

        const { orderByOptions, orderBy } = this.state;

        let func = null;
        let defFunc = null;
        orderByOptions.map((iter) => {
            const name = Object.keys(iter)[0];
            if (name === orderBy){
                func = iter[name];
            }
            if (name === DEFAULT_STATS_ORDER){
                defFunc = iter[name];
            }
        })

        const leaderboard =
            Object.keys(records).sort((a,b) => {
                return (func) ? func(records[a],records[b]) : defFunc(records[a],records[b]);
            });
        return leaderboard;
    }

    loadRecords(){
        const self = this;

        const { get_stats_route, what } = this.props;

        if (get_stats_route && get_stats_route !== "") {
            apiGet(this,
                get_stats_route,
                function(res) {
                    let records = res.data.data;

                    // on 3pt contest, we may have records of players played only by computer. in these cases, total games will be 0.
                    // do not show these players.
                    let filtered = {};
                    Object.keys(records).forEach((player_name) => {
                        const player = records[player_name];
                        if (player.total_games > 0){
                            filtered[player_name] = player;
                        }
                    });
                    records = filtered;

                    const leaderboard = self.buildLeaderBoard(records);
                    self.setState({ records, leaderboard });
                },
                function(error) {
                    console.log(error);
                    let req_error = error.message;
                    if (error.message.indexOf("401") !== -1) { req_error = UNAUTHORIZED_ERROR; }
                    if (error.message.indexOf("400") !== -1) { req_error = `Oops, it seems like no ${what} loaded :(<Br>It's probably related to a server error` }
                    self.setState({ error: req_error });
                },
                function() {
                    self.setState({ loaded2: true });

                    if (self.state.loaded1 && self.state.loaded2 && !self.state.merged){
                        self.merge();
                    }
                }
            );
        } else {
            this.setState({ error: "Internal Server Error<br/>Missing GET stats route." })
        }
    }

    componentDidMount() {

        let self = this;

        const { get_route, what } = this.props;

        if (get_route && get_route !== "") {
            apiGet(this,
                get_route,
                function(res) {
                    let players = res.data.data;
                    self.setState({ players });
                },
                function(error) {
                    console.log(error);
                    let req_error = error.message;
                    if (error.message.indexOf("401") !== -1) { req_error = UNAUTHORIZED_ERROR; }
                    if (error.message.indexOf("400") !== -1) { req_error = `Oops, it seems like no ${what} loaded :(<Br>It's probably related to a server error` }
                    self.setState({ error: req_error });
                },
                function() {

                    setTimeout(async() => {
                            await self.setState({ loaded1: true })

                            if (self.state.loaded1 && self.state.loaded2 && !self.state.merged){
                                self.merge();
                            }
                        },
                        LOADING_DELAY);
                }
            );

            this.loadRecords();
        }
        else {
            this.setState({ error: "Internal Server Error<br/>Missing GET route." })
        }
    }

    merge(){

        const { players, records } = this.state;
        const merged = true;

        players.forEach((player) =>{
            if (records[player.name]){

                Object.keys(records[player.name]).forEach((recordDetail) => {
                    if (typeof(records[player.name][recordDetail]) !== "object" &&
                        !isDefined(player[recordDetail])){

                        player[recordDetail] = records[player.name][recordDetail];

                    }
                })

            }
        });

        // general stats
        const { general_stats, mvp_stats } = buildGeneralStats(records, this.props.percents);

        this.setState({ players, merged, general_stats, mvp_stats })
    }

    searchPlayers(event){
        const keyword = event.target.value;
        this.setState({ keyword });
    }

    applyFilters(){

        const { keyword, records, leaderboard } = this.state;
        return this.state.players.filter(function(iter) {

            if (!records[iter.name]) { return false; }

            let isOk = false;
            Object.keys(iter).forEach(function(a){
                let val = (a === 'team') ? iter[a]["name"] : iter[a];
                if (val == null) val = '';
                if (a === 'picture') val = '';
                if (isDefined(val) && val.toString().toLowerCase().indexOf(keyword.toLowerCase()) !== -1){
                    isOk = true;
                    return;
                }
            });
            return isOk;
        }).sort((a,b) => {

            if (this.state.orderBy === '2K Rating'){
                return b['_2k_rating'] - a['_2k_rating'];
            }
            else {
                return leaderboard.indexOf(a.name) - leaderboard.indexOf(b.name);
            }
        })
    }

    render() {
        const players = this.applyFilters();

        const { what, game_mode, stats_title, custom_description } = this.props;

        let error = this.state.error;
        const is_loading = !(this.state.loaded1 && this.state.loaded2 && this.state.merged);
        if (error || (!is_loading && this.state.players.length === 0)) {
            error = error || `Oops, it seems like no ${what} loaded :(<Br>It's probably related to a server error`;
            return (
                <ErrorPage message={error} />
            );
        }
        else if (is_loading) {
            return (
                <LoadingPage message={`Please wait while loading ${what}...`} loaderDetails={this.state.loaderDetails} />
            );
        }

        const self = this;

        const { records } = this.state;

        let selectedOption = null;
        const orderByOptions = this.state.orderByOptions.map((x,idx) => {

            const name = Object.keys(x)[0];

            const option = { name: name, id: idx }
            if (option.name === this.state.orderBy){
                selectedOption = option;
            }
            return option;
        }).sort((a,b) => { return a.name - b.name; });

        // one on one stats
        let general_stats_block = BuildStatsTable(this.state.general_stats, 1, game_mode, this.props.mvp_block, this.state.mvp_stats, this.props.percents);

        const description = (custom_description) ? custom_description :
            `Here you can see all NBA ${what} that played on ${game_mode}, ordered from the one with best percentages to the worst.`;


        return (
            <div style={{ paddingTop: "20px" }}>
                <Header />

                <div className="ui link cards centered" style={{ margin: "auto", marginBottom:"20px" }}>
                    <h2 className="ui header centered" style={{margin: "10px", width:"100%"}}>
                        {stats_title || game_mode} Stats
                    </h2>
                    <div style={{ color:"rgba(0,0,0,.6)" }}>
                        {description}
                    </div>
                </div>

                {general_stats_block}

                <div className="ui link cards centered" style={{ margin: "auto", marginBottom:"20px" }}>
                    <ButtonInput
                        text={"Reload Stats"}
                        onClick={(e) => { self.setState({ loaded2: false, merged: false }); this.loadRecords(); }}
                    />
                    <ButtonInput
                        text={"Go Back"}
                        style={{ marginLeft: "5px" }}
                        onClick={this.props.onBack}
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
                            await this.setState({ orderBy: option.name });
                            const leaderboard = self.buildLeaderBoard(self.state.records, option);
                            this.setState({ leaderboard });
                        }}
                    />
                </div>

                <div className="ui link cards centered" style={{ margin: "auto" }}>
                    <div className={"centered"} style={{ width: "100%", textAlign: "center" }}>
                        Total Results: {players.length}
                    </div>
                    { players.map((player,idx) => {
                        let _2k_rating = player['_2k_rating'] || 'N/A';

                        if (what === 'teams'){
                            _2k_rating = undefined;
                        }

                        return (<PlayerCard
                                key={idx}
                                style={{}}

                                name={player.name}
                                picture={player.picture || player.logo}
                                details={{
                                    _2k_rating: _2k_rating,
                                    percents: player['3pt_percents'],
                                    team: player?.team?.name,
                                    place: idx+1,

                                    lastSyncAt: player.lastSyncAt
                                }}
                                position={player.position}
                                team_division={(player.conference && player.division) ? player.division + " (" + player.conference + ")" : undefined}
                                debut_year={player.debut_year}

                                stats={{
                                    avg_opponent_2k_rating: records[player.name].avg_2k_rating,
                                    total_wins: records[player.name].total_wins,
                                    total_lost: records[player.name].total_lost,
                                    total_win_percents: records[player.name].total_win_percents,
                                    total_games: records[player.name].total_games,
                                    total_home_games: records[player.name].total_home_games,
                                    total_away_games: records[player.name].total_away_games,
                                    total_diff: records[player.name].total_diff,
                                    total_diff_per_game: records[player.name].total_diff_per_game,
                                    total_scored: records[player.name].total_scored,
                                    total_suffered: records[player.name].total_suffered,
                                    total_knockouts: records[player.name].total_knockouts,
                                    total_suffered_knockouts: records[player.name].total_suffered_knockouts,
                                    win_streak: records[player.name].win_streak,
                                    lose_streak: records[player.name].lose_streak,
                                    max_win_streak: records[player.name].max_win_streak,
                                    max_lose_streak: records[player.name].max_lose_streak,
                                    highlights: (this.state.orderBy === 'Overall') ? OVERALL_HIGHLIGHTS : [this.state.orderBy],


                                    // 3pt
                                    average_place: records[player.name].average_place,
                                    total_computers: records[player.name].total_computers,
                                    total_randoms: records[player.name].total_randoms,
                                    total_from: records[player.name].total_from,
                                    total_shot_average: records[player.name].total_shot_average,

                                    perfect_scores: records[player.name].perfect_scores,
                                    no_scores: records[player.name].no_scores,
                                    total_rounds: records[player.name].total_rounds,
                                    max_perfect_scores_in_game: records[player.name].max_perfect_scores_in_game,
                                    max_no_scores_in_game: records[player.name].max_no_scores_in_game,
                                    average_perfect_scores_in_game: records[player.name].average_perfect_scores_in_game,
                                    perfect_scores_percents: records[player.name].perfect_scores_percents,

                                    max_perfect_scores_in_game_date: records[player.name].max_perfect_scores_in_game_date,
                                    max_perfect_scores_in_game_percents: records[player.name].max_perfect_scores_in_game_percents,
                                    max_no_scores_in_game_date: records[player.name].max_no_scores_in_game_date,
                                    max_no_scores_in_game_percents: records[player.name].max_no_scores_in_game_percents,

                                    max_no_scores_in_game_place: records[player.name].max_no_scores_in_game_place,
                                    max_perfect_scores_in_game_place: records[player.name].max_perfect_scores_in_game_place,

                                    best_percentage_in_game: records[player.name].best_percentage_in_game,
                                    best_percentage_in_game_date: records[player.name].best_percentage_in_game_date,
                                    best_percentage_in_game_percents: records[player.name].best_percentage_in_game_percents,
                                    best_percentage_in_game_place: records[player.name].best_percentage_in_game_place,
                                    worst_percentage_in_game: records[player.name].worst_percentage_in_game,
                                    worst_percentage_in_game_date: records[player.name].worst_percentage_in_game_date,
                                    worst_percentage_in_game_percents: records[player.name].worst_percentage_in_game_percents,
                                    worst_percentage_in_game_place: records[player.name].worst_percentage_in_game_place,

                                }}

                                onClick={() => {
                                    // todo complete - show complete statistics
                                }}
                            />
                        );
                    })}
                    {(players.length === 0) ? <div style={{ marginTop: "20px"}}>
                        {
                            (this.state.keyword.length === 0) ? `Oops, it seems like you didn't played ${game_mode} yet, so there are no ${what} in this list` :
                            `No Results Found for "${this.state.keyword}"`
                        }
                    </div> : "" }
                </div>
            </div>
        )
    }
}