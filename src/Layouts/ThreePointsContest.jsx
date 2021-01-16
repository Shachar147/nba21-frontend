import React from 'react';
import axios from 'axios';
import PlayerCard from '../Components/PlayerCard';

export default class ThreePointsContest extends React.Component {

    state = {
        players: [],
        teams: [
            [],
            []
        ],
        styles:[
            {"border": "1px solid lightseagreen"},
            {"border": "1px solid lightcoral"}
        ],
        idx: 0,
        keyword: ""
    }

    constructor(props) {
        super(props);

        this.toggleState = this.toggleState.bind(this);
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

    teamDetails (teams, idx){
        let team = teams[idx-1];
        return (
            <div style={{margin: "20px"}}>
                <div className="ui ordered list" dangerouslySetInnerHTML={{ __html: team.map(player => { return '<a class="item">' + player.name + '</a>' }).join("")} } />
            </div>
        );
    }

    toggleState (player){

        let players = this.state.players;

        let teams = this.state.teams;
        let idx = this.state.idx;

        for (let a in players){
            let iter = players[a];
            if (iter.name === player.name) {
                if (iter.selected != undefined) {
                    // alert("here");
                    teams[iter.selected] = teams[iter.selected].filter(function(a) { return a.name !== player.name });
                    iter.selected = undefined;
                } else {
                    // alert("there");
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
        var keyword = event.target.value;
        this.setState({ keyword });
    }

    applyFilters(){

        const keyword = this.state.keyword;
        const players = this.state.players.filter(function(iter) {
            let isOk = false;
            // console.log(Object.keys(iter));
            Object.keys(iter).forEach(function(a){
                let val = (a === 'team') ? iter[a]["name"] : iter[a];
                if (val != undefined && val.toString().toLowerCase().indexOf(keyword.toLowerCase()) != -1){
                    isOk = true;
                    return;
                }
            });
            return isOk;
        })

        return players;
    }

    render() {
        const names = ["Team One", "Team Two"];
        const teams = this.state.teams;

        const players = this.applyFilters();

        return (
            <div>
                <div className="ui centered" style={{ display: "flex", alignItems: "strech", margin: "auto", width: "80%", marginTop: "20px", marginBottom: "10px" }}>
                    {
                        names.map((value, index) => (
                            <h2 className="ui header" style={{margin: "10px", width:"50%"}}>
                                {value}
                                <div className="sub header">Selected players for this team {this.teamDetails(teams,index+1)}</div>
                            </h2>
                        ))
                    }
                </div>
                <div className="ui link cards" style={{ margin: "auto", marginBottom: "5px" }}>
                    <div className="ui icon input" style={{ margin: "auto", width: "40%" }}>
                        <input type="text" placeholder="Search..." onKeyUp={this.searchPlayers.bind(this)} />
                        <i className="search icon" />
                    </div>
                </div>
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
                        style={ (player.selected != undefined) ? this.state.styles[player.selected] : undefined }
                        onClick={() => this.toggleState(player)}
                    />)}
                </div>
            </div>
        )
    }
}