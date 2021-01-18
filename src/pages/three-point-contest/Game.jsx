import React from 'react';
import { shuffle } from "../../helpers/utils";
import PlayerCard from "../../components/PlayerCard";
import {DEFAULT_COMPUTER_LEVEL} from "../../helpers/consts";

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

            computer_level: this.props.computer_level,
            levels: {
                'Easy': 0.7,
                'Normal': 0.6,
                'Hard': 0.5,
                'Very Hard': 0.3
            }
        };

        this.onScore = this.onScore.bind(this);
        this.restart = this.restart.bind(this);
    }

    componentDidMount() {
        this.StartRound();
    }

    getRandomPlayer() {
        let players = shuffle(this.state.all_players);
        return players[0];
    }

    // computer
    randNum(){
        const level = this.state.levels[this.state.computer_level];
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

    StartRound() {
        let round_players = this.state.round_players;
        if (round_players.length === 0) {
            this.EndRound();

        } else {
            round_players = shuffle(round_players);
            let current_player = round_players[0];

            if (current_player.name.indexOf("Random Player") !== -1 || current_player.name.indexOf("Computer Player") !== -1){
                let random_name = current_player.name;
                current_player = this.getRandomPlayer();
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
                setTimeout(() => this.onScore(this.getComputerScoreResult()),1000);
            }
        }
    }

    async EndRound() {

        let played_players = this.state.played_players;

        // let scores = this.state.scores;

        // const worst_score = played_players.reduce((min, iter) => scores[iter.name].reduce((a, b) => a + b) < min ? scores[iter.name].reduce((a, b) => a + b) : min, scores[played_players[0].name].reduce((a, b) => a + b));
        //
        // let lost = this.state.lost;
        //
        // console.log(this.state.leaderboard);
        //
        // played_players = shuffle(played_players);
        // let foundLost = false;
        // let round_players = played_players.filter(function(iter){
        //     const total = scores[iter.name].reduce((a, b) => a + b);
        //     if (!foundLost && total === worst_score){
        //         // alert("lost - " + iter.name);
        //         lost[iter.name] = true;
        //         foundLost = true;
        //         return false;
        //     } else {
        //         return true;
        //     }
        // });
        // played_players = [];

        const leaderboard = this.state.leaderboard;
        const lost_player = leaderboard[leaderboard.length-1];
        let round_players = played_players.filter(function(iter){ return (iter.name !== lost_player) });
        let lost = this.state.lost;
        lost[lost_player] = true;
        played_players = [];

        await this.setState({ played_players, round_players, lost });

        if (round_players.length + played_players.length === 1){
            // alert("Game Over!!");

            let current_player = round_players.concat(played_players).map(function(iter){ return iter })[0];
            let winner = current_player.name;
            this.setState({ current_player, winner });
        }
        else {
            this.StartRound();
        }
    }

    async onScore(score){
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

        await this.setState({ played_players, round_players, scores, leaderboard });

        this.StartRound();
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
        this.setState({
            all_players: this.props.all_players,
            round_players: this.props.teams[0].concat(this.props.teams[1]),
            played_players: [],
            teams: this.props.teams,
            scores: {},
            current_player: {},
            lost: {},
            winner: "",
            leaderboard: []
        });

        this.StartRound();
    }

    render(){

        // variables
        const lost = this.state.lost;
        const round_length = this.props.round_length;
        const shoot_player = this.state.current_player;
        const teams = this.state.teams;

        // calculate percents
        const percents = [];
        const teams_players = [];
        this.state.teams.forEach((arr,idx) => teams_players.push(arr.map(iter => iter.name)));
        this.state.teams.forEach((arr,idx) => percents.push({ made: 0, attempt: 0, percents: 0 }));
        const scores = this.state.scores;
        Object.keys(scores).forEach(function(name){

            const total_made = scores[name].reduce((a, b) => a + b);
            const total_attempt = scores[name].length * round_length;

            teams_players.forEach((arr,idx) => {

                if (arr.indexOf(name) !== -1){
                    percents[idx]["attempt"] += total_attempt;
                    percents[idx]["made"] += total_made;
                    percents[idx]["percents"] = ((percents[idx]["made"]/percents[idx]["attempt"])*100).toFixed(2);
                }
            });
        });

        // build teams blocks
        const teams_blocks = [];
        for (let team_idx=0; team_idx < percents.length; team_idx++) {
            const team = percents[team_idx];
            teams_blocks.push(
                <div key={"team_block_" + team_idx}>
                    <div className={"ui link cards centered"} style={{marginTop: "5px", marginBottom: "5px"}}>
                        <div className="ui header" style={{fontSize: "14px", fontWeight: "normal"}}>
                            {`Total: ` + team.made + `/` + team.attempt + ` - ` + team.percents + `%`}
                        </div>
                    </div>
                    <div className="ui link cards centered" style={{margin: "auto"}}>
                        {teams[team_idx].map((player, idx) => <PlayerCard
                            key={"team" + team_idx + "-" + idx}
                            name={player.name}
                            team={player.team.name}
                            position={player.position}
                            // weight_kgs={player.weight_kgs}
                            // height_meters={player.height_meters}
                            shoot={player.name === shoot_player.name}
                            style={(player.name !== shoot_player.name) ? {opacity: 0.6, cursor: "default" } : undefined}
                            debut_year={player.debut_year}
                            picture={player.picture}
                            percents={player['3pt_percents']}
                            round_length={round_length}
                            onScore={this.onScore}
                            className={"in-game"}
                            rounds={scores[player.name]}
                            lost={lost[player.name]}
                            winner={this.state.winner === player.name}
                            place={this.state.leaderboard.indexOf(player.name)+1}
                        />)}
                    </div>
                </div>
            );
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

        return (

            <div style={{ paddingTop: "20px" }}>
                <div className="ui link cards centered" style={{margin: "auto", marginBottom:"20px"}}>
                    <button className={"ui button basic blue"} onClick={this.restart}>
                        Rematch
                    </button>
                </div>
                {computers_block}
                {teams_blocks[0]}
                <div className={"ui link cards centered"} style={{ marginTop: "5px", marginBottom: "5px" }}>
                    <div className="ui header" style={{lineHeight: "38px"}}>
                        Against
                    </div>
                </div>
                {teams_blocks[1]}
            </div>
        );

    }

};