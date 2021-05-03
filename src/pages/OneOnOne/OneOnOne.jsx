import React from "react";
import OneOnOneManager from "../../activities/OneOnOne/OneOnOneManager";

export default class OneOnOne extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {

        return (
            <OneOnOneManager
                stats_title={"1 on 1"}
                game_mode={"One on One"}
                get_route={"/player/popular"}
                get_stats_route={"/records/one-on-one/by-player"}
                get_stats_specific_route={"/records/one-on-one/by-player/:name"}
                what={"players"}
                save_result_route={"/records/one-on-one/"}
                update_result_route={"/records/one-on-one/"}
                stats_page={true}
                view_stats={this.props.view_stats||false}
                player_from_url={ this.props.player_from_url }
            />
        );
    }
}