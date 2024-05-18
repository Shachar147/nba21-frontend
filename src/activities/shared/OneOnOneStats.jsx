import React from 'react';
import PlayerCard from '@components/PlayerCard';
import SearchInput from '@components/inputs/SearchInput';
import { isDefined } from "@helpers/utils";
import LoadingPage from "@pages/LoadingPage";
import ErrorPage from "@pages/ErrorPage";

import Header from "@components/layout/Header";
import {apiGet} from "@helpers/api";
import {
    DEFAULT_STATS_ORDER,
    DEFAULT_STOPWATCH_STATS_ORDER, DEFAULT_TOURNAMENT_STATS_ORDER,
    LOADER_DETAILS,
    LOADING_DELAY,
    UNAUTHORIZED_ERROR
} from "@helpers/consts";
import {
    _2kRatingSort, average2kRatingSort,
    currentLoseStreakSort,
    currentWinStreakSort, maxLoseStreakSort, maxWinStreakSort, OVERALL_HIGHLIGHTS,
    overallSort, overallTournamentSort, specificSort, totalAwayGames, totalDiffPerGameSort, totalDiffSort,
    totalGamesSort, totalHomeGames,
    totalKnockoutsSort, totalLostSort, totalScored, totalSuffered, totalSufferedKnockoutsSort,
    totalWinsPercentsSort, totalWinsSort,
} from "@helpers/sort";
import DropdownInput from "@components/inputs/DropdownInput";
import ButtonInput from "@components/inputs/ButtonInput";
import {buildGeneralStats, BuildStatsTable} from "./OneOnOneHelper";
import OneOnOneSingleStats, {getGraphDataPoints} from "./OneOnOneSingleStats";
import './OneOnOneStats.scss';

// @ts-ignore
import { withRouter } from "react-router";
import {
    OVERALL_WINS_HIGHLIGHTS,
    winsAndMatchupsSort,
    totalFinalsAppearancesPercentsSort, totalFinalsWinsPercentsSort,
    totalGamesWithOTSort,
    totalOTLostSort,
    totalOTWinsPercentSort,
    totalOTWinsSort
} from "../../helpers/sort";
import {DEFAULT_SEASON_STATS_ORDER} from "../../helpers/consts";
import AxisGraph from "../../components/layout/AxisGraph";

class OneOnOneStats extends React.Component {

    constructor(props) {
        super(props);

        const orderBy = (props.game_mode === 'Stopwatch Shootout') ? DEFAULT_STOPWATCH_STATS_ORDER :
                        (props.game_mode === 'Tournament') ? DEFAULT_TOURNAMENT_STATS_ORDER :
                        (props.game_mode === 'Season') ? DEFAULT_SEASON_STATS_ORDER :
                        DEFAULT_STATS_ORDER;

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
                { "Total Win Percents": totalWinsPercentsSort },
                { "Current Win Streak": currentWinStreakSort },
                { "Current Lose Streak": currentLoseStreakSort },
                { "Max Win Streak": maxWinStreakSort },
                { "Max Lose Streak": maxLoseStreakSort },
                { "Total Scored": totalScored },
                { "Total Wins": totalWinsSort },
                { "Total Lost": totalLostSort },
            ],
            "orderBy": orderBy,
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
            },
            selected_player: undefined,
        };

        if (this.props.game_mode === "Season") {
            this.state.orderByOptions.push({ 'Wins & Matchups': winsAndMatchupsSort })
        }

        if (this.props.game_mode === "Three Points Contest") {
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
        }
        else if (this.props.game_mode === "Stopwatch Shootout") {
            this.state.orderByOptions = [
                { "Total Games": totalGamesSort },
                { "Total Scored": totalScored },
            ];
            this.state.orderByOptions.push({ 'Total Minutes': (a,b) => specificSort('total_minutes',a,b) });
            this.state.orderByOptions.push({ 'Average Scores Per Minute': (a,b) => specificSort('average_points_per_minute',a,b) });
            this.state.orderByOptions.push({ 'Average Round Length': (a,b) => specificSort('average_round_length',a,b) });
        }
        else {
            // all of these are for other games modes. (not 3pt contest or stopwatch)
            this.state.orderByOptions.push({ "Total Diff": totalDiffSort });
            this.state.orderByOptions.push({ "Total Diff Per Game": totalDiffPerGameSort });
            this.state.orderByOptions.push({ "Total Home Games": totalHomeGames });
            this.state.orderByOptions.push({ "Total Road Games": totalAwayGames });
            this.state.orderByOptions.push({ "Total Suffered": totalSuffered });
            this.state.orderByOptions.push({ "Total Knockouts": totalKnockoutsSort });
            this.state.orderByOptions.push({ "Total Suffered Knockouts": totalSufferedKnockoutsSort });

            this.state.orderByOptions.push({ "Total Overtimes": (a,b) => specificSort('total_overtimes',a, b) });

            if (this.props.game_mode === "Tournament") {
                this.state.orderByOptions.push({ "Total Overtimes Wins": totalOTWinsSort });
                this.state.orderByOptions.push({ "Total Overtimes Lost": totalOTLostSort });
                this.state.orderByOptions.push({ "Total Overtimes Wins Percent": totalOTWinsPercentSort });
                this.state.orderByOptions.push({ "Total Games with Overtime": totalGamesWithOTSort });
                this.state.orderByOptions.push({ 'Total Finals Appearances': (a,b) => specificSort('total_finals_appearances',a,b) });
                this.state.orderByOptions.push({ 'Total Finals Appearances Percents': totalFinalsAppearancesPercentsSort });
                this.state.orderByOptions.push({ 'Total Finals Wins Percents': totalFinalsWinsPercentsSort });
            }

            if (this.props.game_mode === "Season") {
                this.state.orderByOptions.push({ "Total Overtimes Wins": totalOTWinsSort });
                this.state.orderByOptions.push({ "Total Overtimes Lost": totalOTLostSort });
                this.state.orderByOptions.push({ "Total Overtimes Wins Percent": totalOTWinsPercentSort });
                this.state.orderByOptions.push({ "Total Games with Overtime": totalGamesWithOTSort });
            }

            this.state.orderByOptions.push({ "Total Comebacks Made": (a,b) => specificSort('total_won_comebacks',a, b) });
            this.state.orderByOptions.push({ "Total Comebacks Suffered": (a,b) => specificSort('total_lost_comebacks',a, b) });

            this.state.orderByOptions.push({ "Total Home Wins": (a,b) => specificSort('total_home_wins',a, b) });
            this.state.orderByOptions.push({ "Total Home Lost": (a,b) => specificSort('total_home_lost',a, b) });
            this.state.orderByOptions.push({ "Total Road Wins": (a,b) => specificSort('total_road_wins',a, b) });
            this.state.orderByOptions.push({ "Total Road Lost": (a,b) => specificSort('total_road_lost',a, b) });
        }

        this.state.orderByOptions.push({ "2K Rating": _2kRatingSort });

        if (this.props.what === "players"){

            if (["Three Points Contest","Stopwatch Shootout"].indexOf(this.props.game_mode) === -1) {
                this.state.orderByOptions.push({"Average Opponent 2K Rating": average2kRatingSort});
            }
        }

        if (this.props.game_mode === "Tournament") {
            this.state.orderByOptions[0] = { "Overall": overallTournamentSort },
            this.state.orderByOptions.push({ 'Total Tournaments': (a,b) => specificSort('total_tournaments',a,b) });
            this.state.orderByOptions.push({ 'Total Championships': (a,b) => specificSort('total_tournament_wins',a,b) });
            this.state.orderByOptions.push({ 'Total Matchups': (b,a) => {
                const val1 = Object.keys(a['matchups']).length;
                const val2 = Object.keys(b['matchups']).length;

                if (val1 > val2) return 1;
                else if (val1 < val2) return -1;
                else return 0;
                // specificSort('total_matchups',b,a)
            } });
        }

        if (this.props.game_mode === "Season") {
            this.state.orderByOptions[0] = { "Overall": overallTournamentSort },
            this.state.orderByOptions.push({ 'Total Matchups': (b,a) => {
                    const val1 = Object.keys(a['matchups']).length;
                    const val2 = Object.keys(b['matchups']).length;

                    if (val1 > val2) return 1;
                    else if (val1 < val2) return -1;
                    else return 0;
                    // specificSort('total_matchups',b,a)
                } });
        }

        this.applyFilters = this.applyFilters.bind(this);
        this.loadRecords = this.loadRecords.bind(this);
        this.buildLeaderBoard = this.buildLeaderBoard.bind(this);
    }

    buildLeaderBoard(records){

        const { orderByOptions, orderBy } = this.state;

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
                    let stats = res.data.stats; // for tournament. for other game modes let it be undefined.
                    self.setState({ records, leaderboard, stats });
                },
                function(error, retry) {
                    console.log(error);
                    let req_error = error.message;
                    if (error.message.indexOf("401") !== -1) { req_error = UNAUTHORIZED_ERROR; }
                    if (error.message.indexOf("400") !== -1) { req_error = `Oops, it seems like no ${what} loaded :(<Br>It's probably related to a server error` }
                    self.setState({ error: req_error, error_retry: retry });
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
        const { general_stats, mvp_stats } = buildGeneralStats(records, this.props.percents, this.props.stopwatch);

        let { selected_player } = this.state;
        const { player_from_url } = this.props;
        if (player_from_url){
            selected_player = this.props.match.params.player;
        }

        this.setState({ players, merged, general_stats, mvp_stats, selected_player, player_from_url: false })
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

        const { what, game_mode, stats_title, custom_description, get_stats_specific_route, get_specific_route, player_from_url, max_teams, advanced_teams } = this.props;

        let { error_retry, error, loaded1, loaded2, merged, loaderDetails, selected_player } = this.state;

        const is_loading = !(loaded1 && loaded2 && merged);
        if (error || (!is_loading && this.state.players.length === 0)) {
            error = error || `Oops, it seems like no ${what} loaded :(<Br>It's probably related to a server error`;
            return (
                <ErrorPage message={error} retry={error_retry} />
            );
        }
        else if (is_loading) {
            return (
                <LoadingPage message={`Please wait while loading ${what}...`} loaderDetails={loaderDetails} />
            );
        }

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

        // tournament
        let moreStats;
        let totalTournaments;
        let tournament_mvps;
        let tournamentStats;
        if ((game_mode === 'Tournament' || game_mode == 'Season') && this.state.stats){
            const { total_tournaments = 'N/A', total_comebacks, total_knockouts, total_overtimes, days_since_last_knockout, games_since_last_knockout } = this.state.stats;
            moreStats = `<br>Comebacks: ${total_comebacks} | Knockouts: ${total_knockouts} | Overtimes: ${total_overtimes}`;
            if (days_since_last_knockout !== -1) {
                moreStats += `<br><b>Last Knockout:</b> by <u>${this.state.stats.last_knockout_by}</u> on the head of <u>${this.state.stats.last_knockout_on}</u>, ${days_since_last_knockout} days ago, ${games_since_last_knockout} games ago`;
            }

            totalTournaments = game_mode === 'Tournament' ? `Tournaments: ${total_tournaments}` : '';

            tournament_mvps = this.state.stats.tournament_mvps;

            tournamentStats = {
                totalTournaments, moreStats, tournament_mvps
            };
        }

        // one on one stats
        let general_stats_block = BuildStatsTable(this.state.general_stats, 1, game_mode, this.props.mvp_block, this.state.mvp_stats, this.props.percents, tournamentStats);

        const description = (custom_description) ? custom_description :
            `Here you can see all NBA ${what} that played on ${game_mode}, ordered from the one with best percentages to the worst.`;


        function renderGraph() {

            if (game_mode === "Three Points Contest" || game_mode === "Stopwatch Shootout") {
                return null;
            }

            const dataPoints = [];
            const legends = [];
            players.forEach((player) => {
                dataPoints.push(getGraphDataPoints(records[player.name].records, player.name));
                legends.push(player.name);
            })

            return (
                <div className="margin-block-20">
                    <AxisGraph title="Wins & Losses Over Time" axisY="Wins/Losses Diff" dataPoints={dataPoints} legends={legends} />
                </div>
            );
        }

        return (
            <div className="one-on-one-stats-page" style={{ paddingTop: "20px" }}>
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

                        // NBA21-12 - implemented 2k rating
                        // if (what === 'teams'){
                        //     _2k_rating = undefined;
                        // }

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

                                lost={game_mode === 'Season' && ((max_teams && (idx+1 > max_teams)) || (advanced_teams && !advanced_teams.includes(player.name)))}

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
                                    highlights: (this.state.orderBy === 'Wins & Matchups') ? OVERALL_WINS_HIGHLIGHTS : (this.state.orderBy === 'Overall') ? OVERALL_HIGHLIGHTS : [this.state.orderBy],

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
                                    best_percentage_in_game_shots: records[player.name].best_percentage_in_game_shots,
                                    best_percentage_in_game_attempts: records[player.name].best_percentage_in_game_attempts,

                                    worst_percentage_in_game: records[player.name].worst_percentage_in_game,
                                    worst_percentage_in_game_date: records[player.name].worst_percentage_in_game_date,
                                    worst_percentage_in_game_percents: records[player.name].worst_percentage_in_game_percents,
                                    worst_percentage_in_game_place: records[player.name].worst_percentage_in_game_place,
                                    worst_percentage_in_game_shots: records[player.name].worst_percentage_in_game_shots,
                                    worst_percentage_in_game_attempts: records[player.name].worst_percentage_in_game_attempts,

                                    // stopwatch shootout
                                    average_points_per_minute: records[player.name].average_points_per_minute,
                                    average_round_length: records[player.name].average_round_length,
                                    total_minutes: records[player.name].total_minutes,

                                    // comebacks and overtime
                                    total_overtimes: records[player.name].total_overtimes,
                                    total_won_comebacks: records[player.name].total_won_comebacks,
                                    total_lost_comebacks: records[player.name].total_lost_comebacks,

                                    total_home_wins: records[player.name].total_home_wins,
                                    total_home_lost: records[player.name].total_home_lost,
                                    total_road_wins: records[player.name].total_road_wins,
                                    total_road_lost: records[player.name].total_road_lost,

                                    // tournament
                                    total_tournaments: records[player.name].total_tournaments,
                                    total_tournament_wins: records[player.name].total_tournament_wins,
                                    total_matchups: (records[player.name]['matchups']) ? Object.keys(records[player.name]['matchups']).length : undefined,
                                    total_ot_wins: records[player.name].total_ot_wins,
                                    total_ot_lost: records[player.name].total_ot_lost,
                                    total_finals_appearances: records[player.name].total_finals_appearances,
                                    matchups: game_mode === 'Season' ? records[player.name]['matchups'] : undefined,
                                    highlight_matchups: game_mode === 'Season' ? records[player.name]['highlight_matchups'] : undefined
                                }}

                                onImageClick={() => {

                                    if (get_stats_specific_route) {
                                        this.setState({
                                            selected_player: player.name,
                                        })
                                    }

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

                {renderGraph()}
            </div>
        )
    }
}

export default OneOnOneStats;
// export default withRouter(OneOnOneStats);