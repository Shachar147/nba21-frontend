import React from 'react';
import PlayerCard from '../../components/PlayerCard';
import SearchInput from '../../components/inputs/SearchInput';
import { isDefined} from "../../helpers/utils";
import LoadingPage from "../../pages/LoadingPage";
import ErrorPage from "../../pages/ErrorPage";

import Header from "../../components/layouts/Header";
import {apiGet} from "../../helpers/api";
import {
    DEFAULT_REAL_INACTIVE_ORDER,
    LOADING_DELAY, UNAUTHORIZED_ERROR
} from "../../helpers/consts";
import {specificSort, TeamSort, textSort} from "../../helpers/sort";
import DropdownInput from "../../components/inputs/DropdownInput";
import {Link} from "react-router-dom";
import ButtonInput from "../../components/inputs/ButtonInput";

export default class RealInactive extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            players: [],
            records: [],

            loaded: false,
            error: undefined,

            keyword: "",

            "leaderboard": [],
            "orderByOptions":[
                { 'Team Name': (a,b) =>  TeamSort(a, b) },
                { 'Joined In': (a,b) => specificSort('debut_year', b, a) },
                { 'Name': (a,b) => textSort('name', b, a) },
            ],
            orderBy: DEFAULT_REAL_INACTIVE_ORDER,
            error_retry: false,
        };

        this.searchPlayers = this.searchPlayers.bind(this);
        this.applyFilters = this.applyFilters.bind(this);
        this.buildLeaderBoard = this.buildLeaderBoard.bind(this);
        this.loadPlayers = this.loadPlayers.bind(this);
    }

    componentDidMount() {
        this.loadPlayers();
    }

    loadPlayers(){
        let self = this;
        apiGet(this,
            `/player?isActive=false&include_inactive=true`,
            function(res) {
                let players = res.data.data;

                const records = {};
                players.forEach((record) => {
                    records[record.name] = record;
                })

                const leaderboard = self.buildLeaderBoard(records);
                self.setState({ players, records, leaderboard });
            },
            function(error, error_retry) {
                console.log(error);
                let req_error = error.message;
                if (error.message.indexOf("401") !== -1) { req_error = UNAUTHORIZED_ERROR; }
                if (error.message.indexOf("400") !== -1) { req_error = "Oops, it seems like no players loaded :(<Br>It's probably related to a server error" }
                self.setState({ error: req_error, error_retry });
            },
            function() {
                setTimeout(() => {
                        self.setState({ loaded: true })},
                    LOADING_DELAY);
            }
        );
    }

    searchPlayers(event){
        const keyword = event.target.value;
        this.setState({ keyword });
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
            if (name === DEFAULT_REAL_INACTIVE_ORDER){
                defFunc = iter[name];
            }
        })

        const leaderboard =
            Object.keys(records).sort((a,b) => {
                return (func) ? func(records[a],records[b]) : defFunc(records[a],records[b]);
            });
        return leaderboard;
    }

    applyFilters(){

        const { keyword, leaderboard } = this.state;
        return this.state.players.filter(function(iter) {
            let isOk = false;
            Object.keys(iter).forEach(function(a){
                let val = (a === 'team') ? iter[a]["name"] : iter[a];
                if (a === 'picture') val = '';
                if (isDefined(val) && val != undefined && val.toString().toLowerCase().indexOf(keyword.toLowerCase()) !== -1){
                    isOk = true;
                    return;
                }
            });
            return isOk;
        }).sort((a,b) => {
            return leaderboard.indexOf(a.name) - leaderboard.indexOf(b.name);
        })
    }

    render() {
        const players = this.applyFilters();

        let { error, error_retry, loaded, loaderDetails, orderByOptions } = this.state;

        const is_loading = !loaded;
        if (error || (!is_loading && this.state.players.length === 0)) {
            error = error || "Oops, it seems like no players loaded :(<Br>It's probably related to a server error";
            return (
                <ErrorPage message={error} retry={error_retry} />
            );
        } else if (is_loading) {
            return (
                <LoadingPage message={"Please wait while loading players..."} loaderDetails={loaderDetails} />
            );
        }

        let selectedOption = null;
        orderByOptions = orderByOptions.map((x,idx) => {

            const name = Object.keys(x)[0];

            const option = { name: name, id: idx }
            if (option.name === this.state.orderBy){
                selectedOption = option;
            }
            return option;
        }).sort((a,b) => { return a.name - b.name; });

        const self = this;

        return (
            <div style={{ paddingTop: "20px" }}>
                <Header />

                <div className="ui link input cards centered" style={{ margin: "auto", marginTop: "5px", marginBottom: "5px" }}>
                    <h2 className="ui header centered" style={{margin: "10px", width:"100%"}}>
                        Inactive Players
                    </h2>
                    <div style={{ color:"rgba(0,0,0,.6)" }}>
                        Here you can see real info about inactive NBA players.
                    </div>
                </div>

                <div className="ui link cards centered" style={{ margin: "auto", marginTop:"10px", marginBottom: "10px" }}>
                    <Link to={'/real'}>
                        <ButtonInput
                            text={"Go Back"}
                        />
                    </Link>

                    <ButtonInput
                        text={"Reload Details"}
                        style={{ marginLeft: "5px" }}
                        onClick={(e) => { self.setState({ loaded: false }); this.loadPlayers(); }}
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

                <div className="ui link cards centered" style={{ margin: "auto", textAlign: "center", marginTop: "10px", marginBottom:"10px" }}>
                    Total Results: { players.length }
                    <br/>
                </div>

                <div className="ui link cards centered" style={{ margin: "auto" }}>
                    { players.map((player,idx) => {

                        const _2k_rating = player['_2k_rating'] || 'N/A';

                        return (<PlayerCard
                                key={idx}
                                name={player.name}
                                picture={player.picture}
                                details={{
                                    _2k_rating: _2k_rating,
                                    height_meters:player.height_meters,
                                    weight_kgs:player.weight_kgs,
                                    team:player.team.name,
                                }}
                                stats={{

                                }}
                                show_more_threshold={1}
                                position={player.position}

                                debut_year={player.debut_year}
                                disabled={true}
                            />
                        );
                    })}
                    {(players.length === 0) ? <div style={{ marginTop: "20px"}}>No Results Found for "{this.state.keyword}"</div> : "" }
                </div>
            </div>
        )
    }
}
