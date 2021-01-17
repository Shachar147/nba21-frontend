import React from 'react';
import axios from 'axios';
import PlayerCard from '../../components/PlayerCard';
import SearchInput from '../../components/SearchInput';
import SelectedPlayers from "../../components/SelectedPlayers";
import Game from './Game';
import './three.points.contest.css';

export default class Settings extends React.Component {

    constructor(props) {
        super(props);

        const MIN_ROUND_LENGTH = 3;
        const MAX_ROUND_LENGTH = 10;

        this.state = {
            players: [],
            teams: [
                [],
                []
            ],
            styles:[
                {"border": "1px solid lightseagreen", opacity: 1},
                {"border": "1px solid lightcoral", opacity: 1}
            ],
            idx: 0,
            keyword: "",

            round_length: 3,
            game_started: false
        };

        this.toggleState = this.toggleState.bind(this);
        this.startGame = this.startGame.bind(this);
    }

    componentDidMount() {

        axios.get(`http://localhost:3000/player/3pts`,{
            headers: {
                'Access-Control-Allow-Origin': '*',
            }})
            .then(res => {
                let players = res.data;
                players = players.sort(function(a,b) { return parseFloat(b['3pt_percents'].replace('%','')) - parseFloat(a['3pt_percents'].replace('%','')); })
                this.setState({ players });
            });
    }

    toggleState (player){

        let players = this.state.players;

        let teams = this.state.teams;
        let idx = this.state.idx;

        for (let a in players){
            let iter = players[a];
            if (iter.name === player.name) {
                if (typeof(iter.selected) != 'undefined') {
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

        const keyword = this.state.keyword;
        return this.state.players.filter(function(iter) {
            let isOk = false;
            Object.keys(iter).forEach(function(a){
                let val = (a === 'team') ? iter[a]["name"] : iter[a];
                if (a === 'picture') val = '';
                if (typeof(val) !== 'undefined' && val.toString().toLowerCase().indexOf(keyword.toLowerCase()) !== -1){
                    // console.log(a, val);
                    isOk = true;
                    return;
                }
            });
            return isOk;
        })
    }

    onClear (idx) {
        const teams = this.state.teams;
        const players = this.state.players.map(function(iter){
            if (iter.selected === idx) iter.selected = undefined;
            return iter;
        })

        teams[idx] = [];

        this.setState({
            teams, players
        });
    }

    setRoundLength(event) {
        let round_length = event.target.value;
        round_length = Math.min(round_length,10);
        round_length = Math.max(round_length,3);

        this.setState({
            round_length
        });
    }

    startGame() {
        this.setState({
            game_started: true
        });
    }

    render() {
        const players = this.applyFilters();

        const can_start = this.state.teams[0].length > 0 && this.state.teams[1].length > 0;

        if (this.state.game_started){
            return (
              <Game
                teams={this.state.teams}
                round_length={this.state.round_length}
              />
            );
        }

        return (
            <div style={{ paddingTop: "20px" }}>

                {/*<div className="ui centered cards" style={{ marginBottom: "20px" }}>
                    <img src={"https://breakinball.com/wp-content/uploads/2019/01/nba2.jpg"} style={{ align: "center", width: "60px" }} alt="logo" />
                </div>*/}

                <div className="ui centered selected-players" style={{ display: "flex", textAlign: "center", alignItems: "strech", margin: "auto", width: "80%", marginBottom: "10px" }}>
                    <SelectedPlayers title={"Team One"} team={this.state.teams[0]} onClear={() => this.onClear(0)} toggle={this.toggleState} />
                    <SelectedPlayers title={"Team Two"} team={this.state.teams[1]} onClear={() => this.onClear(1)} toggle={this.toggleState} />
                </div>

                <div className="ui link input cards centered" style={{ margin: "auto", width: "350px" }}>
                    <span style={{ lineHeight: "38px", marginRight: "10px"}} > Round Length: </span>
                    <input type={"number"} value={this.state.round_length} min={3} max={10} onChange={this.setRoundLength.bind(this)} style={{ height: "38px", marginRight: "10px", border: "1px solid #eaeaea", padding:"0px 5px" }}/>

                    <div className={"ui basic buttons"} style={{ margin: "auto", marginBottom: "10px", width: "150px" }}>
                        <button className={"ui button" + (can_start ? " basic blue" : "")} disabled={!can_start} onClick={this.startGame}>
                            Start Game
                        </button>
                    </div>
                </div>

                <SearchInput onKeyUp={this.searchPlayers.bind(this)} />

                <div className="ui link cards centered" style={{ margin: "auto" }}>
                    { players.map(player => <PlayerCard
                        name={player.name}
                        team={player.team.name}
                        position={player.position}
                        weight_kgs={player.weight_kgs}
                        height_meters={player.height_meters}
                        debut_year={player.debut_year}
                        picture={player.picture}
                        percents={player['3pt_percents']}
                        style={ (typeof(player.selected) !== 'undefined') ? this.state.styles[player.selected] : { opacity: 0.6 } }
                        onClick={() => this.toggleState(player)}
                    />)}
                </div>
            </div>
        )
    }
}