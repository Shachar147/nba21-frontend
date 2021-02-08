import React from "react";
import PropTypes from "prop-types";
import OneOnOne from "../OneOnOne/OneOnOne";

export default class Random extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {

        return (
            <OneOnOne

                // game_mode={"One on One"}
                // get_route={"/player/popular"}
                // get_stats_route={"/records/one-on-one/by-player"}
                // what={"players"}
                // custom_details_title={"Players:"}
                // save_result_route={"/records/one-on-one/"}
                // update_result_route={"/records/one-on-one/"}
                // stats_page={true}


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

                // > stat route
                // > do not use default get route and stats route. move OneOnOne to wrapper as on Random
                // > if no route was passed, display error message.
                // > save results routes
            />
        );
    }
}

Random.propTypes = {

};

Random.defaultProps = {

};