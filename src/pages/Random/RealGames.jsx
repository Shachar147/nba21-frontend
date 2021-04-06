import React from "react";
import PropTypes from "prop-types";
import Header from "../../components/layouts/Header";
import ButtonInput from "../../components/inputs/ButtonInput";
import {APP_BACKGROUND_COLOR, LOADER_DETAILS, UNAUTHORIZED_ERROR} from "../../helpers/consts";
import {apiGet} from "../../helpers/api";
import ErrorPage from "../ErrorPage";
import LoadingPage from "../LoadingPage";
import PlayerPicture from "../../components/internal/PlayerPicture";
import {formatDate} from "../../helpers/utils";

export default class RealGames extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            loaded2: false,
            records: [],
            teams: [],
            error: false,
            loaderDetails: LOADER_DETAILS(),
        };

        this.loadRecords = this.loadRecords.bind(this);
    }

    loadRecords(){
        const self = this;

        const dt = new Date();
        const parts = dt.toLocaleDateString().split('/');
        alert(parts);
        if (parts[0].length === 1) parts[0] = '0' + parts[0];
        if (parts[1].length === 1) parts[1] = '0' + parts[1];

        const dtToday = parts[2] + '-' + parts[0] + '-' + parts[1];

        apiGet(this,
            '/realdata/' + dtToday,
            function(res) {
                let records = res.data;
                self.setState({ records });
            },
            function(error) {
                console.log(error);
                let req_error = error.message;
                if (error.message.indexOf("401") !== -1) { req_error = UNAUTHORIZED_ERROR; }
                if (error.message.indexOf("400") !== -1) { req_error = `Oops, it seems like no games loaded :(<Br>It's probably related to a server error` }
                self.setState({ error: req_error });
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
            function(error) {
                console.log(error);
                let req_error = error.message;
                if (error.message.indexOf("401") !== -1) { req_error = UNAUTHORIZED_ERROR; }
                if (error.message.indexOf("400") !== -1) { req_error = `Oops, it seems like no games loaded :(<Br>It's probably related to a server error` }
                self.setState({ error: req_error });
            },
            function() {
                self.setState({ loaded2: true });
            }
        );
    }

    componentDidMount() {
        this.loadRecords();
    }

    render() {

        let { error, loaded, loaded2, records, loaderDetails, teams } = this.state;

        const is_loading = !(loaded && loaded2);
        if (error || (!is_loading && records.length === 0)) {
            error = error || `Oops, it seems like no games loaded :(<Br>It's probably related to a server error`;
            return (
                <ErrorPage message={error} />
            );
        }
        else if (is_loading) {
            return (
                <LoadingPage message={`Please wait while loading games...`} loaderDetails={loaderDetails} />
            );
        }

        const arr = [];
        (records).forEach((game) => {
            arr.push(`${game['home_team']} vs ${game['visitor_team']}`);
        });
        const block = arr.join('<br>');

        const game_blocks = [];
         records.forEach((record) => {

             const team1 = record.home_team;
             const team2 = record.visitor_team;
             const logo1 = teams[team1];
             const logo2 = teams[team2];

             const score1 = (record.home_score && record.home_score !== "") ? `(${record.home_score})` : "";
             const score2 = (record.visitor_score && record.visitor_score !== "") ? `(${record.visitor_score})` : "";

            game_blocks.push(
                <div className="ui placeholder segment" style={{ width: "51%", marginBottom: "30px" }} key={record.date + "_" + team1 + "_" + team2}>
                    <div className="ui two column stackable center aligned grid">
                        <div className="ui vertical divider">VS</div>
                        <div className="middle aligned row">
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
                            <div className="ui primary button" style={{ zIndex:9999 }} onClick={() => {
                                this.props.onSelect(team2, team1);
                            }}>
                                Play this Game!
                            </div>
                        </div>
                    </div>
                </div>
            );
        });

        console.log(records.length);

        return (
            <div style={{ paddingTop: "20px" }}>
                <Header />

                <div className="ui link cards centered" style={{ margin: "auto", marginBottom:"20px" }}>
                    <ButtonInput
                        text={"Reload Stats"}
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
                    See list of today's real NBA games. You can choose any of these games and play it by yourself!
                </div>

                <div className="ui link cards centered" style={{ display: "flex", textAlign: "center", alignItems: "strech", margin: "auto", marginBottom: "20px" }}>

                    {game_blocks}

                </div>
            </div>
        );
    }
}

RealGames.propTypes = {

};

RealGames.defaultProps = {

};