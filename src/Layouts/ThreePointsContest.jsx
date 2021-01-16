import React from 'react';
import axios from 'axios';
import PlayerCard from '../Components/PlayerCard';

export default class ThreePointsContest extends React.Component {
    state = {
        players: []
    }

    componentDidMount() {

        axios.get(`http://localhost:3000/player/3pts`,{
            headers: {
                'Access-Control-Allow-Origin': '*',
            }})
            .then(res => {
                const players = res.data;
                this.setState({ players });
            });
    }

    render() {
        return (
            <div className="ui link cards centered" style={{ margin: "auto" }}>
                { this.state.players.sort(function(a,b) { return parseFloat(b['3pt_percents'].replace('%','')) - parseFloat(a['3pt_percents'].replace('%','')); }).map(player => <PlayerCard
                    name={player.name}
                    team={player.team.name}
                    position={player.position}
                    weight_kgs={player.weight_kgs}
                    height_meters={player.height_meters}
                    debut_year={player.debut_year}
                    picture={player.picture}
                    percents={player['3pt_percents']}
                />)}
            </div>
        )
    }
}