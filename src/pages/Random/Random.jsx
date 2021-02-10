import React from "react";
import PropTypes from "prop-types";
import OneOnOneManager from "../../activities/OneOnOne/OneOnOneManager";

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
                stats_page={true} // todo complete
            />
        );
    }
}

Random.propTypes = {

};

Random.defaultProps = {

};