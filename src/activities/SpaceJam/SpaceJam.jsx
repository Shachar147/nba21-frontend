import React from "react";
import OneOnOneManager from "../shared/OneOnOneManager";

export default class SpaceJam extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {

        return (
            <OneOnOneManager
                stats_title={"Space Jam"}
                game_mode={"Space Jam"}
                get_route={"/space-jam/player"}
                get_stats_route={"/records/space-jam/by-player"}
                get_stats_specific_route={"/records/space-jam/by-player/:name"}
                what={"space jam players"}
                save_result_route={"/records/space-jam/"}
                update_result_route={"/records/space-jam/"}
                stats_page={true}
                view_stats={this.props.view_stats||false}
                player_from_url={ this.props.player_from_url }
            />
        );
    }
}