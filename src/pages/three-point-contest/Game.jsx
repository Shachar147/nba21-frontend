import React from 'react';
import { shuffle } from "../../shared/utils";
import PlayerCard from "../../components/PlayerCard";

export default class Game extends React.Component {

    constructor (props){
        super(props);

        this.state = {
            round_players: this.props.teams[0].concat(this.props.teams[1]),
            played_players: [],
            teams: this.props.teams,
            scores: {},
            current_player: {},
            lost: {},
            winner: "",
        };

        this.onScore = this.onScore.bind(this);
    }

    componentDidMount() {
        this.StartRound();
    }

    StartRound() {
        let round_players = this.state.round_players;
        // alert("round players - " + round_players.length)
        if (round_players.length === 0) {
            this.EndRound();

        } else {
            round_players = shuffle(round_players);
            const current_player = round_players[0];
            this.setState({ current_player });
        }
    }

    async EndRound() {

        let scores = this.state.scores;

        let played_players = this.state.played_players;
        // console.log("played players:" + played_players.map(function(iter){ return iter.name }).join(", "));

        const worst_score = played_players.reduce((min, iter) => scores[iter.name].reduce((a, b) => a + b) < min ? scores[iter.name].reduce((a, b) => a + b) : min, scores[played_players[0].name].reduce((a, b) => a + b));
        // console.log("worst score: " + worst_score);

        let lost = this.state.lost;

        played_players = shuffle(played_players);
        let foundLost = false;
        let round_players = played_players.filter(function(iter){
            const total = scores[iter.name].reduce((a, b) => a + b);
            if (!foundLost && total === worst_score){
                // alert("lost - " + iter.name);
                lost[iter.name] = true;
                foundLost = true;
                return false;
            } else {
                return true;
            }
        });
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

        // console.log(current_player_name + " - " + score);

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

        // console.log("rp - " + round_players.length);
        // console.log("pp - " + played_players.length);

        await this.setState({ played_players, round_players, scores });

        this.StartRound();
    }

    render(){

        const team1 = this.state.teams[0];
        const team2 = this.state.teams[1];
        const scores = this.state.scores;
        const lost = this.state.lost;

        const round_length = this.props.round_length;

        const shoot_player = this.state.current_player;

        return (

            <div style={{ paddingTop: "20px" }}>
                <div className="ui link cards centered" style={{ margin: "auto" }}>
                    { team1.map((player,idx) => <PlayerCard
                        key={"team1-" + idx}
                        name={player.name}
                        team={player.team.name}
                        position={player.position}
                        // weight_kgs={player.weight_kgs}
                        // height_meters={player.height_meters}
                        shoot={player.name === shoot_player.name}
                        style={ (player.name !== shoot_player.name) ? { opacity: 0.6 } : undefined }
                        debut_year={player.debut_year}
                        picture={player.picture}
                        percents={player['3pt_percents']}
                        round_length={round_length}
                        onScore={this.onScore}
                        className={"in-game"}
                        rounds={scores[player.name]}
                        lost={lost[player.name]}
                        winner={this.state.winner === player.name}
                    />)}
                </div>
                <div className={"ui link cards centered"} style={{ marginTop: "5px", marginBottom: "5px" }}>
                    <div className="ui header" style={{lineHeight: "38px"}}>
                        Against
                    </div>
                </div>
                <div className="ui link cards centered" style={{ margin: "auto" }}>
                    { team2.map((player,idx) => <PlayerCard
                        key={"team2-" + idx}
                        name={player.name}
                        team={player.team.name}
                        position={player.position}
                        // weight_kgs={player.weight_kgs}
                        // height_meters={player.height_meters}
                        shoot={player.name === shoot_player.name}
                        style={ (player.name !== shoot_player.name) ? { opacity: 0.6 } : undefined }
                        className={"in-game"}
                        debut_year={player.debut_year}
                        picture={player.picture}
                        percents={player['3pt_percents']}
                        round_length={round_length}
                        onScore={this.onScore}
                        rounds={scores[player.name]}
                        lost={lost[player.name]}
                        winner={this.state.winner === player.name}
                    />)}
                </div>
            </div>

        );

    }

};