import React from 'react';
import PlayerCard from '../../components/PlayerCard';
import SearchInput from '../../components/SearchInput';
import {isDefined} from "../../helpers/utils";
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";

import Header from "../../components/Header";
import {apiGet} from "../../helpers/api";
import {Link} from "react-router-dom";
import {UNAUTHORIZED_ERROR} from "../../helpers/consts";

export default class OneOnOneStats extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            players: [],
            records: {},
            leaderboard: [],
            keyword: "",
            loaded1: false,
            loaded2: false,
            merged: false,
        };

        this.applyFilters = this.applyFilters.bind(this);
        this.loadRecords = this.loadRecords.bind(this);
    }

    loadRecords(){
        const self = this;

        apiGet(this,
            `/records/one-on-one/by-player`,
            function(res) {
                let records = res.data.data;

                let leaderboard = Object.keys(records).sort(function(a,b){

                    // first sort
                    const percent1 = parseFloat(records[b]['total_win_percents'].replace('%',''));
                    const percent2 = parseFloat(records[a]['total_win_percents'].replace('%',''));

                    // second sort
                    const total_games1 = parseFloat(records[b]['total_games']);
                    const total_games2 = parseFloat(records[a]['total_games']);

                    // second sort
                    const diff1 = parseFloat(records[b]['total_diff_per_game']);
                    const diff2 = parseFloat(records[a]['total_diff_per_game']);

                    // // third sort
                    const total_knockouts1 = parseFloat(records[b]['total_knockouts']);
                    const total_knockouts2 = parseFloat(records[a]['total_knockouts']);

                    if (percent1 > percent2) return 1;
                    else if (percent1 < percent2) return -1;

                    if (diff1 > diff2) return 1;
                    else if (diff1 < diff2) return -1;

                    if (total_knockouts1 > total_knockouts2) return 1;
                    else if (total_knockouts1 < total_knockouts2) return -1;

                    return 0;
                });

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
                self.setState({ loaded1: true });
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
        })

        this.setState({ players, merged })

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
        }).sort(function(a,b){
            return leaderboard.indexOf(a.name) - leaderboard.indexOf(b.name);
        })
        return this.state.players;
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
                <LoadingPage message={"Please wait while loading players..."} />
            );
        } else if (error || this.state.players.length === 0) {
            error = error || "Oops, it seems like no players loaded :(<Br>It's probably related to a server error";
            return (
                <ErrorPage message={error} />
            );
        }

        const self = this;

        const { records } = this.state;

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

                <div className="ui link cards centered" style={{ margin: "auto", marginBottom:"20px" }}>
                    <button className={"ui button basic blue"} onClick={(e) => { self.setState({ loaded2: false, merged: false }); this.loadRecords(); }}>
                        Reload Stats
                    </button>

                    <button className={"ui button basic blue"} style={{ marginLeft: "5px" }} onClick={this.props.onBack}>
                        {/*<Link to={"/1on1"}>Go Back</Link>*/}
                        Go Back
                    </button>
                </div>

                <SearchInput onKeyUp={this.searchPlayers.bind(this)} />

                <div className="ui link cards centered" style={{ margin: "auto" }}>
                    { players.map(function(player,idx) {
                        const _2k_rating = player['_2k_rating'] || 'N/A';

                        return (<PlayerCard
                                key={idx}
                                name={player.name}
                                team={player.team.name}
                                position={player.position}
                                _2k_rating={_2k_rating}
                                // weight_kgs={player.weight_kgs}
                                // height_meters={player.height_meters}
                                place={(idx+1)}
                                total_win_percents={records[player.name].total_win_percents}
                                total_games={records[player.name].total_games}
                                home_road_games={`${records[player.name].total_home_games} - ${records[player.name].total_away_games}`}
                                total_diff={`${records[player.name].total_diff} (${records[player.name].total_diff_per_game} per game)`}
                                total_knockouts={records[player.name].total_knockouts}
                                debut_year={player.debut_year}
                                picture={player.picture}
                                percents={player['3pt_percents']}
                                style={isDefined(player.selected) ? self.state.styles[player.selected] : {opacity: 0.6}}
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