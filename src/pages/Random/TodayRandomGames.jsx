import React from "react";
import PropTypes from "prop-types";
import Header from "../../components/layouts/Header";
import ButtonInput from "../../components/inputs/ButtonInput";
import {APP_BACKGROUND_COLOR, LOADER_DETAILS, UNAUTHORIZED_ERROR} from "../../helpers/consts";
import {apiDelete, apiGet} from "../../helpers/api";
import ErrorPage from "../ErrorPage";
import LoadingPage from "../LoadingPage";
import PlayerPicture from "../../components/internal/PlayerPicture";

export default class TodayRandomGames extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            loaded2: false,
            records: [],
            teams: [],
            error: false,
            loaderDetails: LOADER_DETAILS(),

            delete_id: '',
            error_retry: false,
        };

        this.loadRecords = this.loadRecords.bind(this);
    }

    loadRecords(){
        const self = this;

        const dt = new Date();
        const parts = dt.toLocaleDateString().split('/');

        if (parts.length === 3) {
            if (parts[0].length === 1) parts[0] = '0' + parts[0];
            if (parts[1].length === 1) parts[1] = '0' + parts[1];
        }

        const dtToday = (parts.length === 3) ? parts[2] + '-' + parts[0] + '-' + parts[1] : parts[0];

        apiGet(this,
            '/records/random/date/today', // + dtToday,
            function(res) {
                let records = res.data.data;
                self.setState({ records });
            },
            function(error, error_retry) {
                console.log(error);
                let req_error = error.message;
                if (error.message.indexOf("401") !== -1) { req_error = UNAUTHORIZED_ERROR; }
                if (error.message.indexOf("400") !== -1) { req_error = `Oops, it seems like no games loaded :(<Br>It's probably related to a server error` }
                self.setState({ error: req_error, error_retry });
            },
            function() {
                self.setState({ loaded: true });
            }
        );

        apiGet(this,
            '/team',
            function(res) {
                let data = res.data.data;

                const teams = {};
                data.forEach((iter) => {
                    teams[iter.name] = iter.logo;
                });

                self.setState({ teams });
            },
            function(error, error_retry) {
                console.log(error);
                let req_error = error.message;
                if (error.message.indexOf("401") !== -1) { req_error = UNAUTHORIZED_ERROR; }
                if (error.message.indexOf("400") !== -1) { req_error = `Oops, it seems like no games loaded :(<Br>It's probably related to a server error` }
                self.setState({ error: req_error, error_retry });
            },
            function() {
                self.setState({ loaded2: true });
            }
        );
    }

    Delete(){
        const self = this;
        const id = this.state.delete_id;

        if (id !== '') {
            apiDelete(this,
                '/records/random/' + id, // + dtToday,
                function (res) {
                },
                function (error, error_retry) {
                    console.log(error);
                    let req_error = error.message;
                    if (error.message.indexOf("401") !== -1) {
                        req_error = UNAUTHORIZED_ERROR;
                    }
                    if (error.message.indexOf("400") !== -1) {
                        req_error = `Oops, it seems like delete game operation failed.(<Br>It's probably related to a server error`
                    }
                    self.setState({error: req_error, error_retry});
                },
                function () {
                    self.setState({ delete_id: '' });
                    self.loadRecords();
                }
            );
        }
    }

    componentDidMount() {
        this.loadRecords();
    }

    render() {

        let { error, loaded, loaded2, records, loaderDetails, teams, error_retry } = this.state;

        const is_loading = !(loaded && loaded2);
        if (error) {
            return (
                <ErrorPage message={error} retry={error_retry} />
            );
        }
        else if (is_loading) {
            return (
                <LoadingPage message={`Please wait while loading games...`} loaderDetails={loaderDetails} />
            );
        }

        const arr = [];
        (records).forEach((game) => {
            arr.push(`${game['team2_name']} vs ${game['team1_name']}`);
        });
        const block = arr.join('<br>');

        const game_blocks = [];
        records.forEach((record) => {

            const team1 = record.team2_name;
            const team2 = record.team1_name;
            const logo1 = teams[team1];
            const logo2 = teams[team2];

            const score1 = (record.score2 != undefined && record.score2 !== "") ? `(${record.score2})` : "";
            const score2 = (record.score1 != undefined && record.score1 !== "") ? `(${record.score1})` : "";

            const arr = [];
            if (record.mvp_player_name) arr.push("MVP: " + record.mvp_player_name);
            else arr.push("MVP: N/A");
            if (record.total_overtimes) arr.push("OTs: " + record.total_overtimes);
            if (record.is_comeback) arr.push("Comeback!");
            const summary = arr.join(", ");

            game_blocks.push(
                <div className="ui placeholder segment" style={{ width: "45%", margin: "20px 20px" }} key={record.date + "_" + team1 + "_" + team2}>
                    <div className="ui two column stackable center aligned grid">
                        <div className="ui vertical divider">VS</div>
                        <div className="middle aligned row" style={{ paddingBottom: "40px" }}>
                            <div className="column">
                                <div className="ui icon header">
                                    <PlayerPicture
                                        picture={logo2}
                                        name={team2}
                                        styles={{
                                            container: { width: 200, height: 200 },
                                            image: { width: 200, margin: "auto", padding: "20px" },
                                        }}
                                    />
                                </div>
                                <div className="field" style={{ maxWidth: "unset" }}>
                                    <div className="ui search">
                                        <div className="ui icon input" style={{ fontSize: "18px" }}>
                                            <b>{team2} {score2}</b>
                                        </div>
                                        <div className="results" />
                                    </div>
                                </div>
                            </div>
                            <div className="column">
                                <div className="ui icon header">
                                    <PlayerPicture
                                        picture={logo1}
                                        name={team1}
                                        styles={{
                                            container: { width: 200, height: 200 },
                                            image: { width: 200, margin: "auto", padding: "18px" },
                                        }}
                                    />
                                </div>
                                <div className="field" style={{ maxWidth: "unset" }}>
                                    <div className="ui search">
                                        <div className="ui icon input" style={{ fontSize: "18px" }}>
                                            <b>{team1} {score1}</b>
                                        </div>
                                        <div className="results" />
                                    </div>
                                </div>
                            </div>
                            <div className={"buttons"} style={{ zIndex:2, position: "absolute", bottom: "-18px" }}>
                                <div
                                    className="ui primary button"
                                    style={{ display:"inline-block", margin:"0px 5px" }}
                                    onClick={() => {
                                    this.props.onSelect(team2, team1);
                                }}>
                                    Play Again!
                                </div>
                            </div>
                            <div
                                style={{
                                    display:"inline-block",
                                    color: "black",
                                    position: "absolute",
                                    top: "15px",
                                    right: "15px",
                                    fontSize: "11px",
                                    textTransform: "uppercase",
                                    cursor: "pointer",
                                }}
                                onClick={async () => {
                                    const delete_id = record.id;
                                    await this.setState({ delete_id });
                                }}>
                                <img
                                    // className="ui nbared button"
                                    src={"/delete.png"}
                                    width={30}
                                    height={30}
                                    alt={"Delete"}
                                    title={"Delete"}
                                />
                            </div>
                            <div className="ui link cards centered" style={{
                                zIndex:2, position: "absolute", top: "-3px",
                                backgroundColor: "white",
                                padding: "5px 30px",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                display: (summary === "") ? 'none' : 'block',
                            }}>
                                {summary}
                            </div>
                        </div>
                    </div>
                </div>
            );
        });

        const self = this;

        const delete_modal = (this.state.delete_id) ?
            (
                <div className="ui dimmer modals page transition visible active" style={{display: "flex"}}>
                    <div className="ui modal transition visible active" style={{
                        position: "absolute",
                        width: "900px",
                        height: "190px",
                        zIndex: "15",
                        top: "50%",
                        left: "50%",
                        margin: "-95px 0 0 -450px",
                    }}>
                        <div className="header">Delete Game</div>
                        <div className="content">
                            <p>Are you sure you want to delete this game? Once you do it, you won't be able to undo.</p>
                        </div>
                        <div className="actions">
                            <div className="ui nbared button" style={{ color: "white" }} onClick={() => self.Delete()}>Delete</div>
                            <div className="ui cancel button" onClick={() => self.setState({ delete_id: '' })}>Cancel</div>
                        </div>
                    </div>
                </div>
            ) : "";

        return (
            <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                <Header />

                <div className="ui link cards centered" style={{ margin: "auto", marginBottom:"20px" }}>
                    <ButtonInput
                        text={"Reload Games"}
                        onClick={(e) => { this.setState({ loaded: false }); this.loadRecords(); }}
                    />
                    <ButtonInput
                        text={"Go Back"}
                        style={{ marginLeft: "5px" }}
                        onClick={this.props.onBack}
                    />
                </div>


                <div className="ui link cards centered" style={{ display: "flex", textAlign: "center", alignItems: "strech", margin: "auto", marginTop: "20px", marginBottom: "5px" }}>
                    <b>Today Games</b>
                </div>
                <div className="ui link cards centered" style={{ display: "flex", textAlign: "center", alignItems: "strech", margin: "auto", marginTop: "5px", marginBottom: "20px" }}>
                    See list of your today's played NBA games. You can choose any of these games and play it again!
                </div>

                <div className="ui link cards centered" style={{ display: "flex", textAlign: "center", alignItems: "strech", margin: "auto", marginBottom: "10px" }}>
                    Total: {game_blocks.length}
                </div>
                <div className="ui link cards centered" style={{ display: "flex", textAlign: "center", alignItems: "strech", margin: "auto", marginBottom: "20px" }}>

                {game_blocks}

                </div>

                {delete_modal}
            </div>
        );
    }
}

TodayRandomGames.propTypes = {

};

TodayRandomGames.defaultProps = {

};