import React from 'react';
import PlayerCard from '../../components/PlayerCard';
import SearchInput from '../../components/inputs/SearchInput';
import {formatDate, isDefined} from "../../helpers/utils";
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";

import Header from "../../components/layouts/Header";
import {apiGet} from "../../helpers/api";
import {
    DEFAULT_REAL_STATS_ORDER,
    LOADER_DETAILS,
    LOADING_DELAY,
    UNAUTHORIZED_ERROR
} from "../../helpers/consts";
import {
    GPSort,
    OVERALL_HIGHLIGHTS, specificSort,
    WPSort
} from "../../helpers/sort";
import DropdownInput from "../../components/inputs/DropdownInput";
import ButtonInput from "../../components/inputs/ButtonInput";

export default class RealStats extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            "players": [],
            "records": {},
            "leaderboard": [],
            "keyword": "",
            "loaded1": false,
            "loaded2": false,
            "merged": false,

            "orderByOptions":[
                { "Career Win%, 300 Games or more": WPSort },
                { "Career Win%": WPSort },
                { "Career Games Played": GPSort },

                { 'Career Minutes Per Game': (a,b) => specificSort('MPG', a, b) },
                { 'Career Points Per Game': (a,b) => specificSort('PPG', a, b) },
                { 'Career Rebounds Per Game': (a,b) => specificSort('RPG', a, b) },
                { 'Career Assists Per Game': (a,b) => specificSort('APG', a, b) },
                { 'Career Steals Per Game': (a,b) => specificSort('SPG', a, b) },
                { 'Career Blocks Per Game': (a,b) => specificSort('BPG', a, b) },
                { 'Career Turnovers Per Game': (a,b) => specificSort('TPG', a, b) },
                { 'Career FG Made': (a,b) => specificSort('FGM', a, b) },
                { 'Career FG Attempts': (a,b) => specificSort('FGA', a, b) },
                { 'Career FG%': (a,b) => specificSort('FGP', a, b) },
                { 'Career FT Made': (a,b) => specificSort('FTM', a, b) },
                { 'Career FT Attempts': (a,b) => specificSort('FTA', a, b) },
                { 'Career FT%': (a,b) => specificSort('FTP', a, b) },
                { 'Career 3P Made': (a,b) => specificSort('_3PM', a, b) },
                { 'Career 3P Attempts': (a,b) => specificSort('_3PA', a, b) },
                { 'Career 3P%': (a,b) => specificSort('_3PP', a, b) },
                { 'Career Total Minutes': (a,b) => specificSort('MIN', a, b) },
                { 'Career Total Points': (a,b) => specificSort('PTS', a, b) },
                { 'Career Total Rebounds': (a,b) => specificSort('REB', a, b) },
                { 'Career Total Assists': (a,b) => specificSort('AST', a, b) },
                { 'Career Total Steals': (a,b) => specificSort('STL', a, b) },
                { 'Career Total Blocks': (a,b) => specificSort('BLK', a, b) },
                { 'Career Total Turnovers': (a,b) => specificSort('TOV', a, b) },
                { 'Career Total Personal Fouls': (a,b) => specificSort('PF', a, b) },
                { 'Career Total +/-': (a,b) => specificSort('PM', a, b) },
                { 'Personal Fouls Per Game': (a,b) => specificSort('PFP', a, b) },
                { '+/- Per Game': (a,b) => specificSort('PMP', a, b) },
            ],
            "orderBy": DEFAULT_REAL_STATS_ORDER,
            loaderDetails: LOADER_DETAILS(),
        };

        this.applyFilters = this.applyFilters.bind(this);
        this.loadPlayerDetails = this.loadPlayerDetails.bind(this);
        this.buildLeaderBoard = this.buildLeaderBoard.bind(this);
    }

    buildLeaderBoard(records){

        const { orderByOptions, orderBy } = this.state;

        let func = null;
        let defFunc = null;
        orderByOptions.map((iter) => {
            const name = Object.keys(iter)[0];
            if (name === orderBy){
                func = iter[name];
            }
            if (name === DEFAULT_REAL_STATS_ORDER){
                defFunc = iter[name];
            }
        })

        const leaderboard =
            Object.keys(records).sort((a,b) => {
                return (func) ? func(records[a],records[b]) : defFunc(records[a],records[b]);
            });
        return leaderboard;
    }

    loadPlayerDetails(){
        const self = this;

        apiGet(this,
            `/playerdetails`,
            function(res) {
                let arr = res.data.data;

                const records = {};
                arr.forEach((record) => {
                    records[record.name] = record;
                })

                const leaderboard = self.buildLeaderBoard(records);
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

                setTimeout(() => {
                        self.setState({ loaded1: true })},
                    LOADING_DELAY);
            }
        );

        this.loadPlayerDetails();
    }

    merge(){

        const { players, records } = this.state;
        const merged = true;

        players.forEach((player) =>{
            if (records[player.name]){

                Object.keys(records[player.name]).forEach((recordDetail) => {
                    if (typeof(records[player.name][recordDetail]) !== "object"
                        && !isDefined(player[recordDetail])
                    ){

                        player[recordDetail] = records[player.name][recordDetail];

                    }
                })

            }
        });

        this.setState({ players, merged })
    }

    searchPlayers(event){
        const keyword = event.target.value;
        this.setState({ keyword });
    }

    applyFilters(){

        const { keyword, records, leaderboard } = this.state;

        const players = [...this.state.players];

        return players.filter((iter) => {

            if (!records[iter.name]) { return false; }

            if (this.state.orderBy === 'Career Win%, 300 Games or more'){
                if (!iter.GP || iter.GP < 300){
                    return false;
                }
            }

            let isOk = false;
            Object.keys(iter).forEach(function(a){
                let val = (a === 'team') ? (iter[a]) ? iter[a]["name"] : "" : iter[a];
                if (a === 'picture') val = '';
                if (val == undefined) val = '';

                if (isDefined(val) && val.toString().toLowerCase().indexOf(keyword.toLowerCase()) !== -1){
                    isOk = true;
                    return;
                }
            });
            // return isOk;
            iter.hide = !isOk;

            return true;

        }).sort((a,b) => {
            return leaderboard.indexOf(a.name) - leaderboard.indexOf(b.name);
        })
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
                <LoadingPage message={"Please wait while loading players..."} loaderDetails={this.state.loaderDetails} />
            );
        } else if (error || this.state.players.length === 0) {
            error = error || "Oops, it seems like no players loaded :(<Br>It's probably related to a server error";
            return (
                <ErrorPage message={error} />
            );
        }

        const self = this;

        const { records } = this.state;

        let selectedOption = null;
        const orderByOptions = this.state.orderByOptions.map((x,idx) => {

            const name = Object.keys(x)[0];

            const option = { name: name, id: idx }
            if (option.name === this.state.orderBy){
                selectedOption = option;
            }
            return option;
        }).sort((a,b) => { return a.name - b.name; });

        return (
            <div style={{ paddingTop: "20px" }}>
                <Header />

                <div className="ui link cards centered" style={{ margin: "auto", marginBottom:"20px" }}>
                    <h2 className="ui header centered" style={{margin: "10px", width:"100%"}}>
                        Players Real Stats
                    </h2>
                    <div style={{ color:"rgba(0,0,0,.6)" }}>
                        Here you can see real stats about all NBA players.
                    </div>
                </div>

                <div className="ui link cards centered" style={{ margin: "auto", marginBottom:"20px" }}>
                    <ButtonInput
                        text={"Reload Stats"}
                        onClick={(e) => { self.setState({ loaded2: false, merged: false }); this.loadPlayerDetails(); }}
                    />
                </div>

                <SearchInput onKeyUp={this.searchPlayers.bind(this)} />

                <div className="ui link cards centered" style={{ margin: "auto", marginTop: "10px" }}>
                    <DropdownInput
                        options={orderByOptions}
                        label={"Order By: "}
                        name={"orderBy"}
                        width={"330px"}
                        nameKey={"name"}
                        valueKey={"name"}
                        idKey={"id"}
                        selectedOption={selectedOption}
                        onChange={async(option) => {
                            await this.setState({ orderBy: option.name });
                            const leaderboard = self.buildLeaderBoard(self.state.records, option);
                            this.setState({ leaderboard });
                        }}
                    />
                </div>

                <div className="ui link cards centered" style={{ margin: "auto" }}>
                    <div className={"centered"} style={{ width: "100%", textAlign: "center" }}>
                        Total Results: {players.length}
                    </div>
                    { players.map((player,idx) => {
                        const _2k_rating = player['_2k_rating'] || 'N/A';

                        return (<PlayerCard
                                key={idx}
                                style={(player.hide) ? { display: "none" } : {}}

                                name={player.name}
                                picture={player.picture}
                                details={{
                                    _2k_rating: _2k_rating,
                                    team: player?.team?.name,
                                    place: idx+1,

                                    height_meters:player.height_meters,
                                    weight_kgs:player.weight_kgs,
                                }}
                                position={player.position}
                                debut_year={player.debut_year}

                                stats={{
                                    WP:player.WP,
                                    GP:player.GP,
                                    MPG: player.MPG,
                                    PPG: player.PPG,
                                    RPG: player.RPG,
                                    APG: player.APG,
                                    SPG: player.SPG,
                                    BPG: player.BPG,
                                    TPG: player.TPG,
                                    FGM: player.FGM,
                                    FGA: player.FGA,
                                    FGP: player.FGP,
                                    FTM: player.FTM,
                                    FTA: player.FTA,
                                    FTP: player.FTP,
                                    _3PM: player._3PM,
                                    _3PA: player._3PA,
                                    _3PP: player._3PP,
                                    MIN: player.MIN,
                                    PTS: player.PTS,
                                    REB: player.REB,
                                    AST: player.AST,
                                    STL: player.STL,
                                    BLK: player.BLK,
                                    TOV: player.TOV,
                                    PF: player.PF,
                                    PM: player.PM,
                                    PFP: player.PFP,
                                    PMP: player.PMP,

                                    highlights: (this.state.orderBy === 'Career Win%, 300 Games or more') ? ['Career Win%','Career Games Played'] : [this.state.orderBy],
                                }}

                                onClick={() => {
                                    // todo complete - show complete statistics
                                }}
                            />
                        );
                    })}
                    {(players.length === 0) ? <div style={{ marginTop: "20px"}}>
                        {
                            (this.state.keyword.length === 0) ? "Oops, no data found" :
                                `No Results Found for "${this.state.keyword}"`
                        }
                    </div> : "" }
                </div>
            </div>
        )
    }
}