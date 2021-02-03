import React from 'react';
import PlayerCard from '../../components/PlayerCard';
import SearchInput from '../../components/shared/SearchInput';
import {formatDate, isDefined} from "../../helpers/utils";
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";

import Header from "../../components/shared/Header";
import {apiGet} from "../../helpers/api";
import {DEFAULT_STATS_ORDER, LOADER_DETAILS, LOADING_DELAY, UNAUTHORIZED_ERROR} from "../../helpers/consts";
import {
    _2kRatingSort, average2kRatingSort,
    currentLoseStreakSort,
    currentWinStreakSort, maxLoseStreakSort, maxWinStreakSort, OVERALL_HIGHLIGHTS,
    overallSort, totalAwayGames, totalDiffPerGameSort, totalDiffSort,
    totalGamesSort, totalHomeGames,
    totalKnockoutsSort, totalLostSort, totalScored, totalSuffered, totalSufferedKnockoutsSort,
    totalWinsPercentsSort, totalWinsSort,
} from "../../helpers/sort";
import DropdownInput from "../../components/shared/DropdownInput";
import ButtonInput from "../../components/shared/ButtonInput";
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
                { "Total Knockouts": totalKnockoutsSort },
                { "Total Suffered Knockouts": totalSufferedKnockoutsSort },
                { "Total Diff": totalDiffSort },
                { "Total Diff Per Game": totalDiffPerGameSort },
                { "2K Rating": _2kRatingSort },
                { "Total Home Games": totalHomeGames },
                { "Total Road Games": totalAwayGames },
                { "Total Scored": totalScored },
                { "Total Suffered": totalSuffered },
                { "Average Opponent 2K Rating": average2kRatingSort },
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
            }
        };

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

        apiGet(this,
            `/records/one-on-one/by-player`,
            function(res) {
                let records = res.data.data;
                const leaderboard = self.buildLeaderBoard(records);
                self.setState({ records, leaderboard });
            },
            function(error) {
                console.log(error);
                let req_error = error.message;
                if (error.message.indexOf("401") !== -1) { req_error = UNAUTHORIZED_ERROR; }
                if (error.message.indexOf("400") !== -1) { req_error = "Oops, it seems like no players loaded :(<Br>It's probably related to a server error" }
                self.setState({ error: req_error });
            },
            function() {
                self.setState({ loaded2: true });
            }
        );
    }

    componentDidMount() {

        let self = this;
        apiGet(this,
            `/player`,
            function(res) {
                let players = res.data.data;
                self.setState({ players });
            },
            function(error) {
                console.log(error);
                let req_error = error.message;
                if (error.message.indexOf("401") !== -1) { req_error = UNAUTHORIZED_ERROR; }
                if (error.message.indexOf("400") !== -1) { req_error = "Oops, it seems like no players loaded :(<Br>It's probably related to a server error" }
                self.setState({ error: req_error });
            },
            function() {

                setTimeout(() => {
                    self.setState({ loaded1: true })},
                LOADING_DELAY);
            }
        );

        this.loadRecords();
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
        const general_stats = buildGeneralStats(records);

        this.setState({ players, merged, general_stats })
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

        if (this.state.loaded1 && this.state.loaded2 && !this.state.merged){
            this.merge();
        }

        let error = this.state.error;
        const is_loading = !(this.state.loaded1 && this.state.loaded2 && this.state.merged);
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
        let general_stats_block = BuildStatsTable(this.state.general_stats, 1);

        return (
            <div style={{ paddingTop: "20px" }}>
                <Header />

                <div className="ui link cards centered" style={{ margin: "auto", marginBottom:"20px" }}>
                    <h2 className="ui header centered" style={{margin: "10px", width:"100%"}}>
                        1 on 1 Stats
                    </h2>
                    <div style={{ color:"rgba(0,0,0,.6)" }}>
                         Here you can see all  NBA players that played on 1on1, ordered from the one with best percentages to the worst.
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
                        width={"230px"}
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
                        const _2k_rating = player['_2k_rating'] || 'N/A';

                        return (<PlayerCard
                                key={idx}
                                name={player.name}
                                team={player.team.name}
                                position={player.position}
                                _2k_rating={_2k_rating}
                                avg_opponent_2k_rating={records[player.name].avg_2k_rating}
                                // weight_kgs={player.weight_kgs}
                                // height_meters={player.height_meters}
                                place={(idx+1)}
                                total_wins={records[player.name].total_wins}
                                total_lost={records[player.name].total_lost}
                                total_win_percents={records[player.name].total_win_percents}
                                total_games={records[player.name].total_games}
                                total_home_games={records[player.name].total_home_games}
                                total_away_games={records[player.name].total_away_games}
                                total_diff={records[player.name].total_diff}
                                total_diff_per_game={records[player.name].total_diff_per_game}
                                total_scored={records[player.name].total_scored}
                                total_suffered={records[player.name].total_suffered}
                                total_knockouts={records[player.name].total_knockouts}
                                total_suffered_knockouts={records[player.name].total_suffered_knockouts}
                                highlights={(this.state.orderBy === 'Overall') ? OVERALL_HIGHLIGHTS : [this.state.orderBy]}
                                win_streak={records[player.name].win_streak}
                                lose_streak={records[player.name].lose_streak}
                                max_win_streak={records[player.name].max_win_streak}
                                max_lose_streak={records[player.name].max_lose_streak}
                                debut_year={player.debut_year}
                                picture={player.picture}
                                percents={player['3pt_percents']}
                                style={{}}
                                onClick={() => {
                                    // todo complete - show complete statistics
                                }}
                            />
                        );
                    })}
                    {(players.length === 0) ? <div style={{ marginTop: "20px"}}>No Results Found for "{this.state.keyword}"</div> : "" }
                </div>
            </div>
        )
    }
}