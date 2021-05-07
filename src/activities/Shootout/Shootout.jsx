import React from 'react';
import PlayerCard from '../../components/PlayerCard';
import SearchInput from '../../components/inputs/SearchInput';
import { isDefined} from "../../helpers/utils";
import LoadingPage from "../../pages/LoadingPage";
import ErrorPage from "../../pages/ErrorPage";

import Header from "../../components/layouts/Header";
import {apiGet, apiPost, apiPut} from "../../helpers/api";
import ButtonInput from "../../components/inputs/ButtonInput";
import OneOnOneStats from "../shared/OneOnOneStats";
import {
    LOADING_DELAY,
    MAX_SHOOTOUT_ROUND_LENGTH,
    MIN_SHOOTOUT_ROUND_LENGTH, TEAM1_COLOR, UNAUTHORIZED_ERROR
} from "../../helpers/consts";
import ShootoutGame from "./ShootoutGame";

export default class Shootout extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            players: [],
            selected_player: undefined,

            game_started: false,

            loaded: false,
            error: undefined,

            keyword: "",

            show_save_form: false,
            score: 0,

            saved_game_id: 0,
            view_stats: this.props.view_stats,
            error_retry: false,
        };

        this.searchPlayers = this.searchPlayers.bind(this);
        this.applyFilters = this.applyFilters.bind(this);
        this.setRoundLength = this.setRoundLength.bind(this);
        this.startGame = this.startGame.bind(this);
        this.toggleState = this.toggleState.bind(this);
        this.saveResult = this.saveResult.bind(this);
        this.updateResult = this.updateResult.bind(this);
    }

    componentDidMount() {

        let self = this;
        apiGet(this,
            `/player/`,
            // `/player/3pts?names=Kyrie Irving,Stephen Curry,Seth Curry,James Harden,Klay Thompson,Duncan robinson,Joe Harris`,
            function(res) {
                let players = res.data.data;
                self.setState({ players });
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

    applyFilters(){

        const keyword = this.state.keyword;
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
        })
    }

    setRoundLength(event) {
        let round_length = event.target.value;
        round_length = Math.min(round_length,MAX_SHOOTOUT_ROUND_LENGTH);
        round_length = Math.max(round_length,MIN_SHOOTOUT_ROUND_LENGTH);

        this.setState({
            round_length
        });
    }

    startGame() {
        this.setState({
            game_started: true,
        });
    }

    toggleState (player){

        let { selected_player } = this.state;

        if (selected_player && selected_player.name === player.name){
            selected_player = undefined;
        } else {
            selected_player = player;
        }

        this.setState({
            selected_player
        });
    }

    async saveResult(){

        const self = this;

        const { score, round_length, selected_player } = this.state;

        await apiPost(this,
            '/records/stopwatch-shootout',
            {
                player: selected_player.name,
                roundLength: round_length,
                score: score,
            },
            async function(res) {

                const response = res.data;
                const saved_game_id = response[Object.keys(response)[0]].records.slice(-1)[0].id;

                await self.setState({ saved: true, saved_game_id: saved_game_id });
                // self.initStats();
            },
            function(error, error_retry) {
                console.log(error);
                let req_error = error.message;
                if (error.message.indexOf("401") !== -1) { req_error = UNAUTHORIZED_ERROR; }
                if (error.message.indexOf("400") !== -1) { req_error = `Oops, failed saving this game.` }
                self.setState({ error: req_error, error_retry });
            },
            function() {
                // finally
                self.setState({
                    saving: false,
                })
            }
        );
    }

    async updateResult(){

        const _this = this;

        const { score, saved_game_id } = this.state;

        this.setState({ saving: true });
        await apiPut(this,
            `/records/stopwatch-shootout/${saved_game_id}`,
            {
                score: score,
            },
            async function(res) {

                await _this.setState({ saved: true });
                // _this.initStats();
            },
            function(error, error_retry) {
                console.log(error);
                let req_error = error.message;
                if (error.message.indexOf("401") !== -1) { req_error = UNAUTHORIZED_ERROR; }
                if (error.message.indexOf("400") !== -1) { req_error = `Oops, failed updating this game.` }
                _this.setState({ error: req_error, error_retry });
            },
            function() {
                // finally
                _this.setState({
                    saving: false,
                })
            }
        );
    }

    render() {
        const players = this.applyFilters();

        const { selected_player, round_length, show_save_form, score } = this.state;

        let can_start = selected_player && round_length;
        if (this.state.error) can_start = false;

        if (this.state.view_stats){
            return (
                <OneOnOneStats
                    what={"players"}
                    stats_title={"Stopwatch Shootout"}
                    game_mode={"Stopwatch Shootout"}
                    get_route={"/player"}
                    custom_description={"Here you can see all NBA players that played on Stopwatch Shootout."}
                    get_stats_specific_route={"/records/stopwatch-shootout/by-player/:name"}
                    // percents={1} // percents, not points.
                    get_stats_route={"/records/stopwatch-shootout/by-player"}
                    onBack={() => { this.setState({ view_stats: false }) }}
                    stopwatch={true}
                    player_from_url={ this.props.player_from_url }
                />
            );
        }

        if (this.state.game_started){

            const { saved, saving, saved_game_id } = this.state;

            return (
                <ShootoutGame
                    selected_player={selected_player}
                    show_save_form={show_save_form}
                    round_length={round_length}
                    score={score}
                    onFinish={() => { this.setState({show_save_form: true}) }}
                    onChange={(e) => {
                        let score = Number(Math.max(0,e.target.value));
                        this.setState({ score });
                    }}
                    onSave={this.saveResult}
                    isSaveDisabled={saved || saving}
                    onRematch={() => {
                        this.setState({
                            show_save_form: false,
                            score: 0,
                            game_started:true,
                            saving: false,
                            saved: false,
                            saved_game_id: 0,
                        });
                    }}
                    saved_game_id={saved_game_id}
                    onUpdate={this.updateResult}
                    onEndGame={() => {
                        this.setState({
                            show_save_form: false,
                            score: 0,
                            game_started:false,
                            saving: false,
                            saved: false,
                            saved_game_id: 0,
                        })
                    }}
                    onViewStats={() => {
                        this.setState({
                            view_stats: true,
                        })
                    }}
                />
            )
        }

        let error = this.state.error;
        let error_retry = this.state.error_retry;
        const is_loading = !this.state.loaded;
        if (error || (!is_loading && this.state.players.length === 0)) {
            error = error || "Oops, it seems like no players loaded :(<Br>It's probably related to a server error";
            return (
                <ErrorPage message={error} retry={error_retry} />
            );
        } else if (is_loading) {
            return (
                <LoadingPage message={"Please wait while loading players..."} loaderDetails={this.state.loaderDetails} />
            );
        }

        return (
            <div style={{ paddingTop: "20px" }}>
                <Header />

                <div className="ui link input cards centered" style={{ margin: "auto", marginTop: "5px", marginBottom: "5px" }}>
                    Hello! Choose the player you want to practice on a stopwatch shootout with.
                    <br/><br/>
                </div>

                <div className="ui link input cards centered" style={{ margin: "auto", width: "700px", marginBottom:"15px" }}>

                    <div>
                        <span style={{ lineHeight: "38px", marginRight: "10px"}} > Round Length (minutes): </span>
                        <input type={"number"} value={this.state.round_length} min={MIN_SHOOTOUT_ROUND_LENGTH} max={MAX_SHOOTOUT_ROUND_LENGTH} onChange={this.setRoundLength.bind(this)} style={{ height: "38px", marginRight: "10px", border: "1px solid #eaeaea", padding:"0px 5px" }}/>

                        <ButtonInput
                            text={"Start Game"}
                            style={{ width:"150px" }}
                            disabled={!can_start}
                            onClick={this.startGame}
                        />

                        <ButtonInput
                            text={"View Stats"}
                            style={{ marginLeft:"5px" }}
                            // disabled={true}
                            onClick={() => { this.setState({ view_stats: true }) }}
                        />
                    </div>

                </div>

                <SearchInput onKeyUp={this.searchPlayers.bind(this)} />

                <div className="ui link cards centered" style={{ margin: "auto", textAlign: "center", marginTop: "10px", marginBottom:"10px" }}>

                    { (selected_player) ? <div style={{ display: "contents" }}>Selected Player: {selected_player.name}<br/></div> : undefined }

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
                                        percents: player['3pt_percents'], // 3pt percents
                                        height_meters:player.height_meters,
                                        weight_kgs:player.weight_kgs,
                                        team:player.team.name,
                                    }}
                                    position={player.position}
                                    debut_year={player.debut_year}
                                    style={(selected_player && selected_player.name === player.name) ? {"border": "1px solid " + TEAM1_COLOR, opacity: 1} : {opacity: 0.6}}
                                    onClick={() => {
                                        this.toggleState(player);
                                    }}
                                    disabled={false}
                                />
                        );
                    })}
                    {(players.length === 0) ? <div style={{ marginTop: "20px"}}>No Results Found for "{this.state.keyword}"</div> : "" }
                </div>
            </div>
        )
    }
}
