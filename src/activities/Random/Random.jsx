import React from "react";
import PropTypes from "prop-types";
import OneOnOneManager from "@shared_activities/OneOnOneManager";

export default class Random extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {

        return (
            <OneOnOneManager
                game_mode={"Random Games"}
                get_route={"/team"}
                get_stats_route={"/records/random/by-team"}
                get_stats_specific_route={"/records/random/by-team/:name"}
                what={"teams"}
                custom_details_title={"Players:"}
                styles={{
                    imageContainerStyle: { backgroundColor: "#F2F2F2" },
                    imageStyle: { width: 200, margin: "auto", padding: "20px" },
                    // extraContentStyle: { display: "none" },
                }}
                save_result_route={"/records/random/"}
                update_result_route={"/records/random/"}
                custom_keys={{
                    player1: 'team1',
                    player2: 'team2',
                    player1Id: 'team1Id',
                    player2Id: 'team2Id',
                    player1_name: 'team1_name',
                    player2_name: 'team2_name',
                }}
                real_games_button={true}
                today_games_button={true}
                view_today_games={this.props.view_today_games||false}
                stats_page={true}
                mvp_block={true}
                view_stats={this.props.view_stats||false}
                selected_player={this.props.selected_player||undefined}
                player_from_url={ this.props.player_from_url }
            />
        );
    }
}

Random.propTypes = {

};

Random.defaultProps = {

};