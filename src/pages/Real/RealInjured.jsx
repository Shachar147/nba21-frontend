import React from 'react';
import PlayerCard from '../../components/PlayerCard';
import SearchInput from '../../components/inputs/SearchInput';
import { isDefined} from "../../helpers/utils";
import LoadingPage from "../../pages/LoadingPage";
import ErrorPage from "../../pages/ErrorPage";

import Header from "../../components/layouts/Header";
import {apiGet} from "../../helpers/api";
import {
    DEFAULT_REAL_INJURED_ORDER,
    LOADING_DELAY, UNAUTHORIZED_ERROR
} from "../../helpers/consts";
import {_2kRatingSort, OVERALL_HIGHLIGHTS, specificSort, specificSortDate, textSort} from "../../helpers/sort";
import DropdownInput from "../../components/inputs/DropdownInput";
import {Link} from "react-router-dom";
import ButtonInput from "../../components/inputs/ButtonInput";

export default class RealInjured extends React.Component {

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
                { 'Team Name': (a,b) => textSort('team_name', b, a) },
                { 'Injury Last Update': (a,b) => specificSortDate('lastUpdate', a, b) },
                { 'Injury Status': (a,b) => specificSort('injury_status_severity', b, a) },
                { '2K Rating': (a,b) => specificSort('_2k_rating', a, b) },
            ],
            orderBy: DEFAULT_REAL_INJURED_ORDER,
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
            `/realdata/injured`,
            function(res) {
                let players = res.data.data;

                const records = {};
                players.forEach((record) => {
                    records[record.name] = record;
                    record['_2k_rating'] = record.player['_2k_rating'];
                })

                const leaderboard = self.buildLeaderBoard(records);
                self.setState({ players, records, leaderboard });
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
        orderByOptions.map((iter) => {
            const name = Object.keys(iter)[0];
            if (name === orderBy){
                func = iter[name];
            }
        })

        let leaderboard = Object.keys(records);

        if (func)
            leaderboard = leaderboard.sort((a,b) => {
                return func(records[a],records[b]);
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

        let error = this.state.error;
        const is_loading = !this.state.loaded;
        if (error || (!is_loading && this.state.players.length === 0)) {
            error = error || "Oops, it seems like no players loaded :(<Br>It's probably related to a server error";
            return (
                <ErrorPage message={error} />
            );
        } else if (is_loading) {
            return (
                <LoadingPage message={"Please wait while loading players..."} loaderDetails={this.state.loaderDetails} />
            );
        }

        let selectedOption = null;
        const orderByOptions = this.state.orderByOptions.map((x,idx) => {

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
                        Injured Players
                    </h2>
                    <div style={{ color:"rgba(0,0,0,.6)" }}>
                        Here you can see real info about all injured NBA players.
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
                    { players.map((obj,idx) => {

                        const player = obj.player;

                        const _2k_rating = player['_2k_rating'] || 'N/A';
                        const injury_details = obj.details !== "" ? `<br>${obj.details}</br>` : undefined;

                        const injury_status =
                            (obj.status.toLowerCase() === 'out') ? `<div class="nbaredColor">${obj.status}</div>` :
                                (obj.status.toLowerCase() === 'day-to-day') ? `<div style="color: orange">${obj.status}</div>` :
                                    `<div>${obj.status}</div>`;

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
                                    injury_last_update: obj.lastUpdate,
                                    injury_status: injury_status,
                                    injury_details: injury_details,
                                    highlights: [this.state.orderBy],
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
