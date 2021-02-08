import React from "react";
import PropTypes from "prop-types";
import OneOnOne from "../OneOnOne/OneOnOne";

export default class RandomNew extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {

        const maxPlayers = 20; // Math.max(this.state.team1.players.length, this.state.team2.players.length);
        const minHeight = maxPlayers * 51;

        return (
            <OneOnOne
                game_mode={"Random Games"}
                get_route={"/team"}
                get_stats_route={""}
                what={"teams"}
                custom_details_title={"Players:"}
                styles={{
                    imageContainerStyle: { backgroundColor: "#F2F2F2" },
                    imageStyle: { width: 200, margin: "auto", padding: "20px" },
                    extraContentStyle: { display: "none" },
                }}
                save_result_route={""}
                stats_page={false}
                // > custom details
                // > stat route
                // > do not use default get route and stats route. move OneOnOne to wrapper as on RandomNew
                // > if no route was passed, display error message.
                // > save results routes
                // > styles property
            />
        );
    }
}

RandomNew.propTypes = {

};

RandomNew.defaultProps = {

};