import React from 'react';
import {deepClone, getRandomElement, shuffle} from "@helpers/utils";
import PlayerCard from "@components/PlayerCard";
import Header from "@components/layout/Header";
import ButtonInput from "@components/inputs/ButtonInput";
import {_3PT_COMPUTER_SCORE_DELAY, UNAUTHORIZED_ERROR} from "@helpers/consts";
import ErrorPage from "@pages/ErrorPage";
import Notification from "@components/internal/Notification";
import {apiGet, apiPost} from "@helpers/api";
import OneOnOneStats from "@shared_activities/OneOnOneStats";
import OneOnOneSingleStats from "@shared_activities/OneOnOneSingleStats";
import {buildGeneralStats, BuildStatsTable, formatTimeAgo, statsStyle} from "@shared_activities/OneOnOneHelper";

export default class Game extends React.Component {

    constructor (props){
        super(props);

        this.state = {
            all_players: this.props.all_players, // for random
            round_players: this.props.teams[0].concat(this.props.teams[1]), // who left to play in this round
            played_players: [], // who already played in this round
            teams: this.props.teams,
            scores: {},
            current_player: {},
            lost: {},
            winner: "",
            leaderboard: [],
            total_leader_board: {},
            computer_level: this.props.computer_level,
            levels: this.props.computer_levels,
            game_started: true,
            error:"",

            error_retry: false,

            saved: false,

            selected_player: undefined,

            general_stats: this.props.general_stats,

            game_started_at: Date.now(),
            finished_at : undefined,
            game_type: this.props.game_type || "tournament",
            targetScore: 10,
        };

        this.onScore = this.onScore.bind(this);
        this.restart = this.restart.bind(this);
        this.goHome = this.goHome.bind(this);
    }

    componentDidMount() {
        this.StartRound();
    }

    // computer
    randNum(){
        let percents = this.state.current_player["3pt_percents"].replace("%","");
        if (percents === "N/A") {
            percents = 14.9; //https://www.statmuse.com/nba/ask/nba-league-average-3-point-percentage
        }
        const level = (this.state.computer_level === 'Real Life') ? (1 - (parseFloat(percents/100))) : this.state.levels[this.state.computer_level];
        let y = Math.random();
        if(y <= level){
            y = Math.floor(y)
        }
        else {
            y= Math.ceil(y)
        }
        return y;
    }

    getComputerScoreResult(){
        let scored = 0;
        const from = this.props.round_length;
        for (let i=0; i<from; i++){
            scored += this.randNum();
        }

        // easy
        if (scored === 1) {
            if (["Easy","Normal"].indexOf(this.state.computer_level) !== -1){
                scored -= this.randNum();
            }
        }
        return scored;
    }

    randUniquePlayer(){

        const { teams, all_players } = this.state;

        const team_players = [...teams[0],...teams[1]];
        const existing_ids = team_players.map(x => x.id);

        let non_existing_players = all_players.filter((player) => {
           return existing_ids.indexOf(player.id) === -1;
        });

        if (non_existing_players.length === 0){
            this.setState({ error: "Oops, Something went wrong.<br>Seems like there are more selected players then actual players." });
            return {};
        }

        return deepClone(getRandomElement(non_existing_players));
    }

    StartRound() {

        if (!this.state.game_started){
            return;
        }

        let round_players = this.state.round_players;
        if (round_players.length === 0) {
            this.EndRound();

        } else {
            round_players = shuffle(round_players);
            let current_player = round_players[0];

            if (current_player.name.indexOf("Random Player") !== -1 || current_player.name.indexOf("Computer Player") !== -1){
                let random_name = current_player.name;
                current_player = this.randUniquePlayer();
                current_player.name += " (" + random_name.replace("Random Player","Random").replace("Computer Player","Computer") + ")";

                let teams = this.state.teams;
                let round_players = this.state.round_players;

                teams = teams.map(arr => {
                   return arr.map(iter => {
                       if (iter.name === random_name){
                           iter = current_player
                       }
                       return iter;
                   })
                });

                round_players = round_players.map(iter => {
                    if (iter.name === random_name){
                        iter = current_player
                    }
                    return iter;
                });

                this.setState({ teams, round_players, current_player });
            }
            else {
                this.setState({ current_player });
            }

            if (current_player && current_player.name.indexOf("Computer") !== -1){
                setTimeout(() => this.onScore(this.getComputerScoreResult()),_3PT_COMPUTER_SCORE_DELAY);
            }
        }
    }

    async EndRoundTargetScore() {
        const isFinished = await this.CheckGameFinishedTargetScore();
        if (!isFinished) {

            const { played_players } = this.state;
            await this.setState({ played_players: [], round_players: played_players });

            this.StartRound();
        }
    }

    async CheckGameFinishedTargetScore(){
        const { leaderboard, scores, targetScore, played_players } = this.state;

        for (let i = 0; i< leaderboard.length; i++) {

            const player = leaderboard[i];
            const totalScore = scores[player].reduce((a,b) => { return a + b });
            // console.log("player", player, totalScore, "goal: ", targetScore);
            if (totalScore >= targetScore){

                // game over!
                let current_player = played_players.filter(iter => player.indexOf(iter.name) !== -1)[0];
                let winner = player;
                let lost = {};
                leaderboard.filter(iter => iter !== winner).map(x => lost[x] = 1);
                await this.setState({ current_player, winner, lost });

                await this.SaveResult();

                // console.log("is finished true");
                return true;
            }
        }

        // console.log("is finished false");
        return false;
    }

    async EndRound() {

        if (this.state.game_type === 'target_score'){
            return this.EndRoundTargetScore();
        }

        let played_players = this.state.played_players;

        const leaderboard = this.state.leaderboard;
        const lost_player = leaderboard[leaderboard.length-1];
        let round_players = played_players.filter(function(iter){ return (iter.name !== lost_player) });
        let lost = this.state.lost;
        lost[lost_player] = true;
        played_players = [];

        await this.setState({ played_players, round_players, lost });

        if (round_players.length + played_players.length === 1){
            // game over!
            let current_player = round_players.concat(played_players).map(function(iter){ return iter })[0];
            let winner = current_player.name;
            this.setState({ current_player, winner });

            await this.SaveResult();
        }
        else {
            this.StartRound();
        }
    }

    async onScore(score){

        if(!this.state.game_started){
            return;
        }

        let current_player_name = this.state.current_player.name;

        let scores = this.state.scores;

        let played_players = this.state.played_players;
        const round_players = this.state.round_players.filter(function(iter){
            if (iter.name === current_player_name){
                scores[iter.name] = scores[iter.name] || [];
                scores[iter.name].push(score);
                played_players.push(iter);
                return false;
            } else {
                return true;
            }
        });

        // leaderboard
        const leaderboard = this.buildLeaderBoard(scores);

        const total_leader_board = this.state.total_leader_board;
        leaderboard.forEach((player,idx) => { total_leader_board[idx+1] = player });

        await this.setState({ played_players, round_players, scores, leaderboard, total_leader_board });

        const isFinished = await this.CheckGameFinishedTargetScore();
        if (!isFinished) {
            this.StartRound();
        }
    }

    buildLeaderBoard(scores){

        const lost = this.state.lost;
        const round_length = this.props.round_length;

        let leaderboard = [];
        Object.keys(scores).forEach(function(name){
            if(lost[name]) return;

            const total_made = scores[name].reduce((a, b) => a + b);
            const total_attempt = scores[name].length * round_length
            const percents = (total_attempt) ? ((total_made/total_attempt)*100).toFixed(2) : 0;
            leaderboard.push({
                name: name,
                percents: percents
            });
        })
        leaderboard = leaderboard.sort(function(a,b){ return b.percents - a.percents });
        leaderboard = leaderboard.map(x => x.name);

        return leaderboard;
    }

    restart(){
        debugger;
        this.setState({
            all_players: this.props.all_players,
            round_players: this.props.teams[0].concat(this.props.teams[1]),
            played_players: [],
            teams: this.props.teams,
            scores: {},
            current_player: {},
            lost: {},
            winner: "",
            leaderboard: [],
            saved: false,

            game_started_at: Date.now(),
            finished_at: undefined,
        });

        this.StartRound();
    }

    async goHome(){
        await this.setState({ game_started: false, saved: false, });
        this.props.goHome();
    }

    timePassed(){
        const current = this.state.finished_at || Date.now();
        let time_took = current - this.state.game_started_at;
        time_took /= 1000; // ms to s

        return time_took;
    }

    async SaveResult(){

        const self = this;

        const finished_at = Date.now();
        this.setState({
            finished_at: finished_at,
        })
        // alert("Game took " + formatTimeAgo(finished_at));

        const team1_players = this.state.teams[0].map(x => x.name);
        const team2_players = this.state.teams[1].map(x => x.name);
        const all_players = [...team1_players, ...team2_players];
        const computer_players = [];
        const random_players = [];
        all_players.forEach((player) => {
            if (player.indexOf("Computer") !== -1){
                computer_players.push(player.split(' (')[0])
            }
            if (player.indexOf("Random") !== -1){
                random_players.push(player.split(' (')[0])
            }
        })

        await apiPost(this,
            '/records/three-points-contest',
            {
                team1_players: team1_players.map(x => x.split(' (')[0]),
                team2_players: team2_players.map(x => x.split(' (')[0]),
                roundLength: this.props.round_length,
                computerLevel: this.props.computer_level,
                computer_players: computer_players,
                random_players: random_players,
                winner_name: this.state.winner.split(' (')[0],
                leaderboard: this.state.total_leader_board,
                scoresHistory: this.state.scores,
                gameTotalTime: this.timePassed(),
            },
            async function(res) {

                await self.setState({ saved: true });
                // self.initStats();
            },
            function(error, retry) {
                console.log(error);
                let req_error = error.message;
                if (error.message.indexOf("401") !== -1) { req_error = UNAUTHORIZED_ERROR; }
                if (error.message.indexOf("400") !== -1) { req_error = `Oops, failed saving this game.` }
                self.setState({ error: req_error, error_retry: retry });
            },
            async function() {
                // finally

                await self.setState({ loadedStats: false })
                self.initStats(self);
            }
        );
    }

    initStats(self) {
        const { get_stats_route, percents } = this.props;
        apiGet(self,
            get_stats_route,
            async function(res) {
                let stats = res.data.data;

                const { general_stats } = buildGeneralStats(stats, percents);

                await self.setState({ stats, general_stats  , loadedStats: true });
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

    render(){

        const { error, error_retry } = this.state;
        if (error) {
            return (
                <ErrorPage message={error} retry={error_retry} />
            );
        }

        let totals_arr = [];

        if (this.state.view_stats){
            return (
                <OneOnOneStats
                    what={"players"}
                    stats_title={"Three Points Contest"}
                    game_mode={"Three Points Contest"}
                    get_route={"/player"}
                    percents={1} // percents, not points.
                    get_stats_route={"/records/three-points-contest/by-player"}
                    get_stats_specific_route={"/records/three-points-contest/by-player/:name"}
                    onBack={() => { this.setState({ view_stats: false }) }}
                />
            );
        }
        const { selected_player } = this.state;
        if (selected_player){

            const { what, game_mode, stats_title, get_stats_specific_route } = this.props;

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


        // variables
        const lost = this.state.lost;
        const round_length = this.props.round_length;
        const shoot_player = this.state.current_player;
        const teams = this.state.teams;

        // calculate percents
        const percents = [];
        const teams_players = [];
        this.state.teams.forEach((arr,idx) => teams_players.push(arr.map(iter => iter.name)));
        this.state.teams.forEach((arr,idx) => percents.push({ made: 0, attempt: 0, percents: 0, made_no_c: 0, attempt_no_c: 0 }));
        const scores = this.state.scores;
        Object.keys(scores).forEach(function(name){

            const total_made = scores[name].reduce((a, b) => a + b);
            const total_attempt = scores[name].length * round_length;

            teams_players.forEach((arr,idx) => {

                if (arr.indexOf(name) !== -1){
                    percents[idx]["attempt"] += total_attempt;
                    percents[idx]["made"] += total_made;
                    percents[idx]["percents"] = ((percents[idx]["made"]/percents[idx]["attempt"])*100).toFixed(2);

                    if (name.indexOf("Computer") === -1){
                        percents[idx]["attempt_no_c"] += total_attempt;
                        percents[idx]["made_no_c"] += total_made;
                    }
                }
            });
        });

        let game_total_made = 0;
        let game_total_attempts = 0;
        let game_total_percents = 0;
        let game_total_made_no_c = 0;
        let game_total_attempts_no_c = 0;
        let game_total_percents_no_c = 0;

        const { get_stats_specific_route, stats } = this.props;

        // build teams blocks
        const teams_blocks = [];
        for (let team_idx=0; team_idx < percents.length; team_idx++) {
            const team = percents[team_idx];

            game_total_made += team.made;
            game_total_attempts += team.attempt;
            game_total_percents = (game_total_attempts === 0) ? 0 : ((game_total_made/game_total_attempts)*100).toFixed(2);

            game_total_made_no_c += team.made_no_c;
            game_total_attempts_no_c += team.attempt_no_c;
            game_total_percents_no_c = (game_total_attempts_no_c === 0) ? 0 : ((game_total_made_no_c/game_total_attempts_no_c)*100).toFixed(2);

            teams_blocks.push(
                <div key={"team_block_" + team_idx}>
                    <div className={"ui link cards centered"} style={{marginTop: "5px", marginBottom: "5px"}}>
                        <div className="ui header" style={{fontSize: "14px", fontWeight: "normal"}}>
                            {`Total: ` + team.made + `/` + team.attempt + ` - ` + team.percents + `%`}
                        </div>
                    </div>
                    <div className="ui link cards centered" style={{margin: "auto"}}>
                        {teams[team_idx].map((player, idx) => {
                            const _2k_rating = player['_2k_rating'] || 'N/A';

                            let placeRibbon = "blue";
                            const in_game = this.state.leaderboard.filter((a) => { return !this.state.lost[a] });
                            if (in_game.indexOf(player.name) === in_game.length-1 && in_game.length > 1){
                                placeRibbon = "red";
                            }
                            else if (in_game.indexOf(player.name) === in_game.length-2 && in_game.length > 2){
                                placeRibbon = "orange";
                            }

                            return (
                                <PlayerCard
                                    key={"team" + team_idx + "-" + idx}
                                    className={"in-game"}
                                    style={(player.name !== shoot_player.name) ? {opacity: 0.6, cursor: "default" } : undefined}

                                    name={player.name}
                                    picture={player.picture}
                                    position={player.position}
                                    debut_year={player.debut_year}
                                    details={{
                                        _2k_rating: _2k_rating,
                                        percents: player['3pt_percents'],
                                        team: player.team.name,
                                    }}

                                    shoot={player.name === shoot_player.name}
                                    round_length={round_length}
                                    rounds={scores[player.name]}
                                    lost={lost[player.name]}
                                    winner={this.state.winner === player.name}
                                    place={this.state.leaderboard.indexOf(player.name)+1}

                                    styles={{
                                        placeRibbon:placeRibbon,
                                    }}

                                    onScore={this.onScore}

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
                    </div>
                </div>
            );
        }

        // total time
        const totalTime = formatTimeAgo(this.timePassed());
        totals_arr.push(`<div style="width:100%; text-align:center; display:block;"><b>Passed Time: ${totalTime}</b></div>`);

        totals_arr.push(`<div style="width:100%; text-align:center; display:block;"><b>Game Total: ${game_total_made}/${game_total_attempts} - ${game_total_percents}%</b></div>`);
        if (game_total_attempts_no_c !== game_total_attempts){
            totals_arr.push(`<div style="width:100%; text-align:center; display:block;"><b>Non-Computer Game Total: ${game_total_made_no_c}/${game_total_attempts_no_c} - ${game_total_percents_no_c}%</b></div>`);
        }

        // computer level
        const computers_block = (this.props.have_computers) ?
            (
                <div className="ui link cards centered" style={{margin: "auto", marginBottom:"20px"}}>
                    <div className="ui header" style={{lineHeight: "38px"}}>
                        Computer Level: {this.props.computer_level}
                    </div>
                </div>
            ): "";


        const game_saved = (this.state.saved) ? (
            <Notification
                title={"Game was saved!"}
                description={"This game was saved. you can take a look at stats page to see details about past games."}
            />
        ) : "";

        const totals = (
            <div
                className={"ui link cards centered"}
                style={{ marginTop: "0px", marginBottom: "25px" }}
                dangerouslySetInnerHTML={{ __html: totals_arr.join("<br/>") }}
            />
        );


        let get_stats_route = this.props.get_stats_route;
        let game_mode = this.props.game_mode;
        let general_stats_block = (get_stats_route && get_stats_route !== "") ? BuildStatsTable(this.state.general_stats,0,`${game_mode} (${this.state.game_type})`, 0, undefined, percents) : "";

        const self = this;

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

                <div className="ui link cards centered" style={{margin: "auto", marginBottom:"20px"}}>
                    <ButtonInput
                        text={"Rematch"}
                        onClick={this.restart}
                    />
                    <ButtonInput
                        text={"End Game"}
                        style={{ marginLeft: "5px" }}
                        onClick={this.goHome}
                    />
                    {/*<ButtonInput*/}
                    {/*    text={"View Stats"}*/}
                    {/*    style={{ marginLeft:"5px" }}*/}
                    {/*    onClick={() => { this.setState({ view_stats: true }) }}*/}
                    {/*/>*/}
                </div>
                {computers_block}
                {totals}
                {teams_blocks[0]}
                <div className={"ui link cards centered"} style={{ marginTop: "5px", marginBottom: "5px" }}>
                    <div className="ui header" style={{lineHeight: "38px"}}>
                        Against
                    </div>
                </div>
                {teams_blocks[1]}

                {game_saved}
            </div>
        );

    }

};