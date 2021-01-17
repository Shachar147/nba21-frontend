import React from 'react';
import { deepClone, shuffle } from "../../shared/utils";
import PlayerCard from "../../components/PlayerCard";

export default class Game extends React.Component {

    constructor (props){
        super(props);

        this.state = {
            players: deepClone(this.props.teams[0].concat(this.props.teams[1])),
            teams: this.props.teams,
            round_length: this.props.round_length,
            scores: [],
            round: 1
        };
    }

    componentDidMount() {

    }

    getNextPlayer() {
        let remaining_players = this.state.players.filter(function(iter) { return !iter.lost; });
        remaining_players = shuffle(remaining_players);
        return remaining_players[0];
    }

    render(){

        const team1 = this.state.teams[0];
        const team2 = this.state.teams[1];

        const round_length = this.state.round_length;

        const shoot_player = this.getNextPlayer();

        return (

            <div style={{ paddingTop: "20px" }}>
                <div className="ui link cards centered" style={{ margin: "auto" }}>
                    { team1.map(player => <PlayerCard
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
                    />)}
                </div>
                <div className={"ui link cards centered"} style={{ marginTop: "5px", marginBottom: "5px" }}>
                    <div className="ui header" style={{lineHeight: "38px"}}>
                        Against
                    </div>
                </div>
                <div className="ui link cards centered" style={{ margin: "auto" }}>
                    { team2.map(player => <PlayerCard
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
                    />)}
                </div>
            </div>

        );

    }

};