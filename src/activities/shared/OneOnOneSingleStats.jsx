import React from 'react';
import PlayerCard from '@components/PlayerCard';
import SearchInput from '@components/inputs/SearchInput';
import {formatDate, isDefined, nth} from "@helpers/utils";
import LoadingPage from "@pages/LoadingPage";
import ErrorPage from "@pages/ErrorPage";

import Header from "@components/layout/Header";
import {apiGet} from "@helpers/api";
import {
    LOADER_DETAILS,
    LOADING_DELAY,
    UNAUTHORIZED_ERROR
} from "@helpers/consts";
import ButtonInput from "@components/inputs/ButtonInput";
import {buildGeneralStats, BuildStatsTable} from "./OneOnOneHelper";
import AxisGraph from "../../components/layout/AxisGraph";

export function getGraphDataPoints(games, selected_player){
    let dataPoints = [];
    let counter = 0;
    let previousDate = null;

    games.sort((a, b) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime());

    games.forEach((game, idx) => {
        const currentDate = new Date(game.addedAt);
        const isSameDay = previousDate && currentDate.getDate() === previousDate.getDate() && currentDate.getMonth() === previousDate.getMonth() && currentDate.getFullYear() === previousDate.getFullYear();

        if (idx === 0) {
            const date = new Date(game.addedAt);
            date.setDate(date.getDate() - 1);
            dataPoints.push({
                x: date,
                y: counter
            })
        }

        if (!isSameDay) {
            if (idx !== 0) {
                dataPoints.push({
                    x: previousDate,
                    y: counter
                });
            }
        }

        let { team1_name, team2_name, player1_name, player2_name, score1, score2 } = game;
        player1_name = player1_name || team1_name;
        player2_name = player2_name || team2_name;
        const opponent = (player1_name === selected_player) ? player2_name : player1_name;
        const lost_or_won = ((player1_name === selected_player && score1 > score2) || (player2_name === selected_player && score2 > score1)) ? "Won" : "Lost";

        if (lost_or_won === "Won") {
            counter++;
        } else {
            counter--;
        }

        // Store current date as previous date for next iteration
        previousDate = currentDate;
    });

    // Push last data point
    if (previousDate) {
        dataPoints.push({
            x: previousDate,
            y: counter
        });
    }

    return dataPoints;
}

export default class OneOnOneSingleStats extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            player: {},
            players_hash: {},
            records: {},
            loaded1: false,
            loaded2: false,

            loaderDetails: LOADER_DETAILS(),
        };

        this.loadDetails = this.loadDetails.bind(this);
        this.loadRecords = this.loadRecords.bind(this);
    }

    loadRecords(){
        const self = this;

        let { get_stats_route, what, selected_player } = this.props;

        get_stats_route = get_stats_route.replace(':name',selected_player);

        if (get_stats_route && get_stats_route !== "") {
            apiGet(this,
                get_stats_route,
                function(res) {
                    let records = res.data;
                    self.setState({ records });
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
                }
            );
        } else {
            this.setState({ error: "Internal Server Error<br/>Missing GET stats route." })
        }
    }

    loadDetails() {
        let self = this;
        const { get_route, what, selected_player } = this.props;

        if (get_route && get_route !== "") {

            apiGet(this,
                get_route,
                function (res) {
                    let players = res.data.data;

                    let player = {};
                    let players_hash = {};
                    players.map((iter) => {
                        players_hash[iter.name] = iter;

                        if (iter.name === selected_player){
                            player = iter;
                        }
                    });

                    // console.log(players_hash, selected_player, player);
                    self.setState({player, players_hash});
                },
                function (error) {
                    console.log(error);
                    let req_error = error.message;
                    if (error.message.indexOf("401") !== -1) {
                        req_error = UNAUTHORIZED_ERROR;
                    }
                    if (error.message.indexOf("400") !== -1) {
                        req_error = `Oops, it seems like no ${what} loaded :(<Br>It's probably related to a server error`
                    }
                    self.setState({error: req_error});
                },
                function () {

                    setTimeout(async () => {
                            await self.setState({loaded1: true})
                        },
                        LOADING_DELAY);
                }
            );
        }
        else {
            this.setState({ error: "Internal Server Error<br/>Missing GET route." })
        }
    }

    componentDidMount() {
        this.loadDetails();
        this.loadRecords();
    }

    render() {
        const { what, game_mode, selected_player, custom_description, stats_title } = this.props;
        let { error_retry, error, loaded1, loaded2, loaderDetails, records, players_hash } = this.state;
        const self = this;

        const is_loading = !(loaded1 && loaded2);
        if (error) {
            return (
                <ErrorPage message={error} retry={error_retry} />
            );
        }
        else if (is_loading) {
            return (
                <LoadingPage message={`Please wait while loading ${what}...`} loaderDetails={loaderDetails} />
            );
        }
        else if (!records.records){
            return (
                <ErrorPage message={'Oops, seems like player does not exist, or does not have any history information.'} retry={() => { window.location.reload(); }} />
            );
        }

        // one on one stats
        // let general_stats_block = BuildStatsTable(this.state.general_stats, 1, game_mode, this.props.mvp_block, this.state.mvp_stats, this.props.percents);

        const description = (custom_description) ? custom_description :
            `Here you can see details about ${selected_player} from ${game_mode} game mode.`;

        const games_options = [];
        const lose_options = [];
        const won_options = [];
        const won_knockout_options = [];
        const lose_knockout_options = [];

        let win_block = undefined;
        let lose_block = undefined;
        let win_knockout_block = undefined;
        let lose_knockout_block = undefined;
        let mvps_block = undefined;
        let tournament_mvps_block = undefined;
        let mvp_options = [];
        let tournament_mvp_options = [];
        const mvps = {};

        records.records.reverse().forEach((game) => {

            let { team1_name, team2_name, player1_name, player2_name } = game;
            const { score1, score2, is_comeback, total_overtimes, mvp_player, addedAt } = game;

            player1_name = player1_name || team1_name;
            player2_name = player2_name || team2_name;

            const opponent = (player1_name === selected_player) ? player2_name : player1_name;

            const style = (what === "players") ? "height:30px; width:40px;" : "";

            let option;
            let lost_or_won;
            let myscore;
            let opponent_score;

            const dt = formatDate(new Date(addedAt));

            // 1on1, random
            if (player1_name && player2_name) {

                const home_or_road = (player2_name === selected_player) ? "home game" : "road game";
                lost_or_won = ((player1_name === selected_player && score1 > score2) || (player2_name === selected_player && score2 > score1)) ? "Won" : "Lost";
                const game_record = (score1 > score2) ? `${score1}-${score2}` : `${score2}-${score1}`;
                const comeback = is_comeback ? "Comeback.<br/>" : "";

                const mvp_name = (mvp_player && typeof(mvp_player) === 'object' && mvp_player.name) ? mvp_player.name : mvp_player;

                const mvp = mvp_name ? `MVP: ${mvp_name}.<br/>` : "";
                const overtimes = total_overtimes ? `Overtimes: ${total_overtimes}.<br/>` : "";

                if (lost_or_won.toLowerCase() === "won" && mvp_name) {
                    mvps[mvp_name] = mvps[mvp_name] || 0;
                    mvps[mvp_name]++;
                }

                const opponent_image = players_hash[opponent].picture || players_hash[opponent].logo;
                myscore = (player1_name === selected_player) ? score1 : score2;
                opponent_score = (player1_name === selected_player) ? score2 : score1;

                option = `<div class="item">
                    <img class="ui avatar image" style="${style}" src="${opponent_image}">
                    <div class="content">
                        <a class="header">${lost_or_won} ${game_record} against ${opponent} (${home_or_road})</a>
                        <div class="description">${overtimes}${comeback}${mvp}Played at ${dt}</div>
                    </div>
                </div>`;
            }

            // 3pt contest
            if (game_mode === 'Three Points Contest'){

                const { winner_name, scoresHistory } = game;
                lost_or_won = (winner_name === selected_player) ? "Won" : "Lost";
                const game_record = `Scored ${scoresHistory[selected_player]}`;

                if (lost_or_won.toLowerCase() === "lost" && game.leaderboard){
                    Object.keys(game.leaderboard).forEach((place) => {
                        if (game.leaderboard[place] === selected_player) {
                            if (place == Object.keys(game.leaderboard).length){
                                lost_or_won += ' (last)';
                            } else {
                                lost_or_won += ' (' + place + nth(place) + ')';
                            }
                        }
                    })
                }

                const winner_image = players_hash[winner_name]?.picture;

                option = `<div class="item">
                    <img class="ui avatar image" style="${style}" src="${winner_image}">
                    <div class="content">
                        <a class="header">${lost_or_won}, ${game_record} against ${Object.keys(game.leaderboard).length-1} opponents</a>
                        <div class="description">Played at ${dt}</div>
                    </div>
                </div>`;
            }

            // stopwatch shootout
            if (game_mode === 'Stopwatch Shootout'){
                const { roundLength, score } = game;
                const player_image = players_hash[selected_player].picture;

                option = `<div class="item">
                    <img class="ui avatar image" style="${style}" src="${player_image}">
                    <div class="content">
                        <a class="header">Scored ${score} baskets in ${roundLength} ${(roundLength > 1) ? "minutes" : "minute"}</a>
                        <div class="description">Played at ${dt}</div>
                    </div>
                </div>`;
            }

            games_options.push(option);

            if (game_mode !== 'Stopwatch Shootout') {
                if (lost_or_won.toLowerCase() === "won") {
                    won_options.push(option);
                    if (opponent_score && opponent_score === 0) won_knockout_options.push(option);
                } else {
                    lose_options.push(option);
                    if (myscore && myscore === 0) lose_knockout_options.push(option);
                }
            }
        });

        let total = games_options.length;
        const games_history_block = (
            <div className="ui link cards centered" style={{ margin: "auto", marginBottom:"20px", marginTop:"20px", borderTop: "1px solid #eaeaea" }}>
                <h2 className="ui header centered" style={{margin: "10px", width:"100%"}}>
                    Games History
                </h2>
                <span style={{ width: "100%", display:"block",textAlign:"center" }}>Total: {total}</span>
                <div className="ui relaxed divided list" dangerouslySetInnerHTML={{ __html: games_options.join("") }} />
            </div>
        );

        if (['Stopwatch Shootout'].indexOf(game_mode) === -1) {
            total = won_options.length;
            if (won_options.length === 0) { won_options.push("-") }
            win_block = (
                <div className="ui link cards centered" style={{ margin: "auto", marginBottom:"20px", marginTop:"20px", borderTop: "1px solid #eaeaea" }}>
                    <h2 className="ui header centered" style={{margin: "10px", width:"100%"}}>
                        Won Games
                    </h2>
                    <span style={{ width: "100%", display:"block",textAlign:"center" }}>Total: {total}</span>
                    <div className="ui relaxed divided list" dangerouslySetInnerHTML={{ __html: won_options.join("") }} />
                </div>
            );

            total = lose_options.length;
            if (lose_options.length === 0) { lose_options.push("-") }
            lose_block = (
                <div className="ui link cards centered" style={{ margin: "auto", marginBottom:"20px", marginTop:"20px", borderTop: "1px solid #eaeaea" }}>
                    <h2 className="ui header centered" style={{margin: "10px", width:"100%"}}>
                        Lost Games
                    </h2>
                    <span style={{ width: "100%", display:"block",textAlign:"center" }}>Total: {total}</span>
                    <div className="ui relaxed divided list" dangerouslySetInnerHTML={{ __html: lose_options.join("") }} />
                </div>
            );

            if (['Three Points Contest'].indexOf(game_mode) === -1){

                total = won_knockout_options.length;
                if (won_knockout_options.length === 0) { won_knockout_options.push("-") }
                win_knockout_block = (
                    <div className="ui link cards centered" style={{ margin: "auto", marginBottom:"20px", marginTop:"20px", borderTop: "1px solid #eaeaea" }}>
                        <h2 className="ui header centered" style={{margin: "10px", width:"100%"}}>
                            Won Games in Knockout
                        </h2>
                        <span style={{ width: "100%", display:"block",textAlign:"center" }}>Total: {total}</span>
                        <div className="ui relaxed divided list" dangerouslySetInnerHTML={{ __html: won_knockout_options.join("") }} />
                    </div>
                );

                total = lose_knockout_options.length;
                if (lose_knockout_options.length === 0) { lose_knockout_options.push("-") }
                lose_knockout_block = (
                    <div className="ui link cards centered" style={{ margin: "auto", marginBottom:"20px", marginTop:"20px", borderTop: "1px solid #eaeaea" }}>
                        <h2 className="ui header centered" style={{margin: "10px", width:"100%"}}>
                            Lost Games in Knockout
                        </h2>
                        <span style={{ width: "100%", display:"block",textAlign:"center" }}>Total: {total}</span>
                        <div className="ui relaxed divided list" dangerouslySetInnerHTML={{ __html: lose_knockout_options.join("") }} />
                    </div>
                );
            }
        }

        if (what === 'teams'){

            Object.keys(mvps).sort(function(a,b) { return mvps[b] - mvps[a] } ).forEach((player_name) => {

                const playerObj = players_hash[selected_player].players.filter((iter) => { return iter.name === player_name})[0];

                // console.log(player_name, players_hash, playerObj);

                if (playerObj) {
                    let player_image = playerObj?.picture;
                    mvp_options.push(
                        `<div class="item">
                            <img class="ui avatar image" style="height:30px; width:40px;" src="${player_image}">
                            <div class="content">
                                <a class="header">${player_name}</a>
                                <div class="description">won MVP ${mvps[player_name]} times</div>
                            </div>
                        </div>`
                    );
                }
            })

            mvps_block = (
                <div className="ui link cards centered" style={{ margin: "auto", marginBottom:"20px", marginTop:"20px", borderTop: "1px solid #eaeaea" }}>
                    <h2 className="ui header centered" style={{margin: "10px", width:"100%"}}>
                        MVPs
                    </h2>
                    <span style={{ width: "100%", display:"block",textAlign:"center" }}>Total: {mvp_options.length}</span>
                    <div className="ui relaxed divided list" dangerouslySetInnerHTML={{ __html: mvp_options.join("") }} />
                </div>
            );
        }

        if (this.state.records.tournament_mvps){
            let { tournament_mvps } = this.state.records;

            Object.keys(tournament_mvps).sort(function(a,b) { return tournament_mvps[b] - tournament_mvps[a] } ).forEach((player_name) => {

                const playerObj = players_hash[selected_player].players.filter((iter) => { return iter.name === player_name})[0];

                // console.log(player_name, players_hash, playerObj);

                if (playerObj) {
                    let player_image = playerObj?.picture;
                    tournament_mvp_options.push(
                        `<div class="item">
                            <img class="ui avatar image" style="height:30px; width:40px;" src="${player_image}">
                            <div class="content">
                                <a class="header">${player_name}</a>
                                <div class="description">won Tournament MVP ${tournament_mvps[player_name]} times</div>
                            </div>
                        </div>`
                    );
                }
            })

            tournament_mvps_block = (
                <div className="ui link cards centered" style={{ margin: "auto", marginBottom:"20px", marginTop:"20px", borderTop: "1px solid #eaeaea" }}>
                    <h2 className="ui header centered" style={{margin: "10px", width:"100%"}}>
                        Tournament MVPs
                    </h2>
                    <span style={{ width: "100%", display:"block",textAlign:"center" }}>Total: {tournament_mvp_options.length}</span>
                    <div className="ui relaxed divided list" dangerouslySetInnerHTML={{ __html: tournament_mvp_options.join("") }} />
                </div>
            );
        }

        const { player } = this.state;
        const _2k_rating = player['_2k_rating'] || 'N/A';
        let player_block = (
             <PlayerCard
                name={player.name}
                picture={player.picture || player.logo}
                details={{
                    _2k_rating: _2k_rating,
                    percents: player['3pt_percents'],
                    team: player?.team?.name,

                    lastSyncAt: player.lastSyncAt
                }}
                position={player.position}
                team_division={(player.conference && player.division) ? player.division + " (" + player.conference + ")" : undefined}
                debut_year={player.debut_year}

                stats={{
                    avg_opponent_2k_rating: records.avg_2k_rating,
                    total_wins: records.total_wins,
                    total_lost: records.total_lost,
                    total_win_percents: records.total_win_percents,
                    total_games: records.total_games,
                    total_home_games: records.total_home_games,
                    total_away_games: records.total_away_games,
                    total_diff: records.total_diff,
                    total_diff_per_game: records.total_diff_per_game,
                    total_scored: records.total_scored,
                    total_suffered: records.total_suffered,
                    total_knockouts: records.total_knockouts,
                    total_suffered_knockouts: records.total_suffered_knockouts,
                    win_streak: records.win_streak,
                    lose_streak: records.lose_streak,
                    max_win_streak: records.max_win_streak,
                    max_lose_streak: records.max_lose_streak,

                    // 3pt
                    average_place: records.average_place,
                    total_computers: records.total_computers,
                    total_randoms: records.total_randoms,
                    total_from: records.total_from,
                    total_shot_average: records.total_shot_average,

                    perfect_scores: records.perfect_scores,
                    no_scores: records.no_scores,
                    total_rounds: records.total_rounds,
                    max_perfect_scores_in_game: records.max_perfect_scores_in_game,
                    max_no_scores_in_game: records.max_no_scores_in_game,
                    average_perfect_scores_in_game: records.average_perfect_scores_in_game,
                    perfect_scores_percents: records.perfect_scores_percents,

                    max_perfect_scores_in_game_date: records.max_perfect_scores_in_game_date,
                    max_perfect_scores_in_game_percents: records.max_perfect_scores_in_game_percents,
                    max_no_scores_in_game_date: records.max_no_scores_in_game_date,
                    max_no_scores_in_game_percents: records.max_no_scores_in_game_percents,

                    max_no_scores_in_game_place: records.max_no_scores_in_game_place,
                    max_perfect_scores_in_game_place: records.max_perfect_scores_in_game_place,

                    best_percentage_in_game: records.best_percentage_in_game,
                    best_percentage_in_game_date: records.best_percentage_in_game_date,
                    best_percentage_in_game_percents: records.best_percentage_in_game_percents,
                    best_percentage_in_game_place: records.best_percentage_in_game_place,
                    best_percentage_in_game_shots: records.best_percentage_in_game_shots,
                    best_percentage_in_game_attempts: records.best_percentage_in_game_attempts,

                    worst_percentage_in_game: records.worst_percentage_in_game,
                    worst_percentage_in_game_date: records.worst_percentage_in_game_date,
                    worst_percentage_in_game_percents: records.worst_percentage_in_game_percents,
                    worst_percentage_in_game_place: records.worst_percentage_in_game_place,
                    worst_percentage_in_game_shots: records.worst_percentage_in_game_shots,
                    worst_percentage_in_game_attempts: records.worst_percentage_in_game_attempts,

                    // stopwatch shootout
                    average_points_per_minute: records.average_points_per_minute,
                    average_round_length: records.average_round_length,
                    total_minutes: records.total_minutes,

                    // comebacks and overtime
                    total_overtimes: records.total_overtimes,
                    total_won_comebacks: records.total_won_comebacks,
                    total_lost_comebacks: records.total_lost_comebacks,

                    total_home_wins: records.total_home_wins,
                    total_home_lost: records.total_home_lost,
                    total_road_wins: records.total_road_wins,
                    total_road_lost: records.total_road_lost,

                    // tournament
                    total_tournaments: records.total_tournaments,
                    total_tournament_wins: records.total_tournament_wins,
                    total_matchups: (records['matchups']) ? Object.keys(records['matchups']).length : undefined,
                }}
            />
        );

        function renderGamesHistoryGraph() {
            const dataPoints = getGraphDataPoints(records.records, selected_player);
            return (
                <AxisGraph title="Wins & Losses Over Time" axisY="Wins/Losses Diff" dataPoints={dataPoints} />
            );
        }

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

                <div className="ui link cards centered" style={{ margin: "auto", marginBottom:"20px" }}>
                     <ButtonInput
                         text={"Reload Stats"}
                         onClick={(e) => { self.setState({ loaded2: false }); this.loadRecords(); }}
                     />
                     <ButtonInput
                         text={"Go Back"}
                         style={{ marginLeft: "5px" }}
                         onClick={this.props.onBack}
                     />
                </div>

                <div className="ui link cards centered" style={{ margin: "auto", marginBottom:"20px" }}>
                    {player_block}
                </div>

                {tournament_mvps_block}
                {mvps_block}
                {renderGamesHistoryGraph()}
                {games_history_block}
                {win_block}
                {lose_block}
                {win_knockout_block}
                {lose_knockout_block}

                <br/><br/>
            </div>
        );
    }
}