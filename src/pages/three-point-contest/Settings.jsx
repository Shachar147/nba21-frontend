import React from 'react';
import axios from 'axios';
import PlayerCard from '../../components/PlayerCard';
import SearchInput from '../../components/SearchInput';
import SelectedPlayers from "../../components/SelectedPlayers";
import Game from './Game';
import './three.points.contest.css';
import {
    MAX_ROUND_LENGTH,
    MIN_ROUND_LENGTH,
    RANDOM_PLAYER_PICTURE,
    ROUND_DEFAULT_LENGTH,
    TEAM1_COLOR, TEAM2_COLOR
} from "../../shared/consts";
import {isDefined} from "../../shared/utils";
import {SERVER_ADDRESS} from "../../config/config";

export default class Settings extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            players: [],
            teams: [
                [],
                []
            ],
            randoms: [
                [],
                []
            ],
            styles:[
                {"border": "1px solid " + TEAM1_COLOR, opacity: 1},
                {"border": "1px solid " + TEAM2_COLOR, opacity: 1}
            ],
            idx: 0,
            keyword: "",

            round_length: ROUND_DEFAULT_LENGTH,
            game_started: false
        };

        this.toggleState = this.toggleState.bind(this);
        this.startGame = this.startGame.bind(this);
    }

    componentDidMount() {

        axios.get(SERVER_ADDRESS + `/player/3pts`,{
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

        if (player.name.indexOf('Random Player') !== -1){
            this.onRemoveRandom(player.name);
            return;
        }

        let teams = this.state.teams;
        let idx = this.state.idx;

        for (let a in players){
            let iter = players[a];
            if (iter.name === player.name) {
                if (isDefined(iter.selected)) {
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
                if (isDefined(val) && val.toString().toLowerCase().indexOf(keyword.toLowerCase()) !== -1){
                    isOk = true;
                    return;
                }
            });
            return isOk;
        })
    }

    onClear (idx) {
        const teams = this.state.teams;
        const randoms = this.state.randoms;
        const players = this.state.players.map(function(iter){
            if (iter.selected === idx) iter.selected = undefined;
            return iter;
        })

        teams[idx] = [];
        randoms[idx] = [];

        this.setState({
            teams, players, randoms
        });
    }

    setRoundLength(event) {
        let round_length = event.target.value;
        round_length = Math.min(round_length,MAX_ROUND_LENGTH);
        round_length = Math.max(round_length,MIN_ROUND_LENGTH);

        this.setState({
            round_length
        });
    }

    startGame() {
        this.setState({
            game_started: true
        });
    }

    onAddRandom(idx) {

        const randoms = this.state.randoms;

        randoms[idx].push({
            name: "Random Player " + parseInt(idx+1) + ' - ' + parseInt(randoms[idx].length+1),
            picture: RANDOM_PLAYER_PICTURE,
            team: { name: 'Random' }
        })

        this.setState({
            randoms
        });
    }

    onRemoveRandom(name) {
        let randoms = this.state.randoms;

        let team_idx;

        randoms.forEach(function(arr, idx){
           arr.forEach(function(iter, i){
               if (name === iter.name){
                   team_idx = idx;
               }
           })
        });

        if (isDefined(team_idx)){
            randoms[team_idx].splice(randoms[team_idx].length-1, 1);
        }

        this.setState({
            randoms
        });
    }

    render() {
        const players = this.applyFilters();

        const can_start = (this.state.teams[0].length > 0 || this.state.randoms[0].length > 0) &&
                          (this.state.teams[1].length > 0 || this.state.randoms[1].length > 0);

        if (this.state.game_started){

            let game_teams = [this.state.teams[0].concat(this.state.randoms[0]),this.state.teams[1].concat(this.state.randoms[1])];
            return (
              <Game
                all_players={this.state.players}
                teams={game_teams}
                round_length={this.state.round_length}
              />
            );
        }

        return (
            <div style={{ paddingTop: "20px" }}>

                <div className="ui centered selected-players" style={{ display: "flex", textAlign: "center", alignItems: "strech", margin: "auto", width: "80%", marginBottom: "10px" }}>
                    <SelectedPlayers title={"Team One"} team={this.state.teams[0].concat(this.state.randoms[0])} onClear={() => this.onClear(0)} toggle={this.toggleState} onAddRandom={() => this.onAddRandom(0)}/>
                    <SelectedPlayers title={"Team Two"} team={this.state.teams[1].concat(this.state.randoms[1])} onClear={() => this.onClear(1)} toggle={this.toggleState} onAddRandom={() => this.onAddRandom(1)} />
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
                        style={ isDefined(player.selected) ? this.state.styles[player.selected] : { opacity: 0.6 } }
                        onClick={() => this.toggleState(player)}
                    />)}
                </div>
            </div>
        )
    }
}