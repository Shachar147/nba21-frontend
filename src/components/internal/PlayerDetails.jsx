import React from "react";
import PropTypes from "prop-types";
import {buildDetails} from "../../helpers/playercard.helper";
import {PLAYER_STATS_SHOW_MORE_THRESHOLD} from "../../helpers/consts";

export default class PlayerDetails extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            show_more: false,
            show_more_opened: false,
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.stats){
            const { show_more } = this.init();
            this.setState({ show_more });
        }
    }

    init() {
        const { details, stats, custom_details } = this.props;

        let show_more = false;
        let details_arr = [];
        let stats_arr = [];

        if (custom_details){
            details_arr = custom_details;
        } else {
            const hash = buildDetails(details, stats);
            details_arr = hash.details_arr;
            stats_arr = hash.stats_arr;
        }

        if (stats_arr.length > PLAYER_STATS_SHOW_MORE_THRESHOLD){
            show_more = true;
        }

        return { details_arr, stats_arr, show_more };
    }

    componentDidMount() {
        const { show_more } = this.init();
        this.setState({ show_more });
    }

    render() {

        const { custom_details_title, styles } = this.props;
        const { show_more, show_more_opened } = this.state;

        const { details_arr, stats_arr } = this.init();

        return (
            <div
                className="description"
                style={styles.description}
            >
                <div dangerouslySetInnerHTML={{ __html: custom_details_title }} />
                {
                    [...details_arr].map((x, idx) => {
                        return (<div key={`details-${idx}`} dangerouslySetInnerHTML={{__html: x}}/>);
                    })
                }
                {
                    [...stats_arr].map((x,idx) => {
                        if (idx <= PLAYER_STATS_SHOW_MORE_THRESHOLD || show_more_opened) {
                            return (<div key={`stats-${idx}`} dangerouslySetInnerHTML={{__html: x}}/>);
                        }
                    })
                }
                {
                    (show_more) ? <a style={{ cursor: "pointer" }} onClick={() => { this.setState({ show_more_opened: !show_more_opened })}}>Show { (show_more_opened) ? "Less" : "More" }</a> : ""
                }
            </div>
        );
    }
}

PlayerDetails.propTypes = {
    /**
     * option to pass a title to custom details.
     *
     * for example: "Players", and then on custom_details pass array of players names.
     */
    custom_details_title: PropTypes.string,
    /**
     * option to pass custom details array. will override 'details' and 'stats'.
     *
     * for example, you can pass array of all players of specific team.
     */
    custom_details: PropTypes.arrayOf(PropTypes.string),
    /**
     * Hash of player details.
     *
     * \> \_2k_rating
     *
     * \> height\_meters
     *
     * \> weight_kgs
     *
     * \> percents (3pt percents)
     *
     * \> team
     *
     * \> lastSyncAt - date of last details sync.
     *
     * Example:
     *
     * {"\_2k\_rating": "95","height\_meters": 1.9,"percents":"43.43%","team": "Golden State Warriors","weight\_kgs": "83.9"}
     */
    details: PropTypes.object,
    /**
     * Hash of player stats.
     *
     * \> win\_streak
     *
     * \> max\_win\_streak
     *
     * \> lose\_streak
     *
     * \> max\_lose\_streak
     *
     * \> total\_win\_percents
     *
     * \> total\_games
     *
     * \> total\_wins
     *
     * \> total\_lost
     *
     * \> total\_diff
     *
     * \> total\_diff\_per\_game
     *
     * \> total\_away\_games
     *
     * \> total\_home\_games
     *
     * \> total\_knockouts
     *
     * \> avg\_opponent\_2k\_rating
     *
     * \> total\_scored
     *
     * \> total\_suffered
     *
     * \> total\_suffered\_knockouts
     *
     *
     * Real Stats:
     *
     * \> WP - Career win percents
     *
     * \> GP - Career games played
     *
     * \> MPG - Minutes per game
     *
     * \> PPG - Points per game
     *
     * \> RPG - Rebounds per game
     *
     * \> APG - Assists per game
     *
     * \> SPG - Steals per game
     *
     * \> BPG - Blocks per game
     *
     * \> TPG - Turnovers per game
     *
     * \> FGM - Field Goals Made
     *
     * \> FGA - Field Goals Attempted
     *
     * \> FGP - Field Goals Percents
     *
     * \> FTM - Free Throws Made
     *
     * \> FTA - Free Throws Attempted
     *
     * \> FTP - Free Throws Percents
     *
     * \> _3PM - Three Points Made
     *
     * \> _3PA - Three Points Attempted
     *
     * \> _3PP - Three Points Percents
     *
     * \> MIN - Career Total Minutes
     *
     * \> PTS - Career Total Points
     *
     * \> REB - Career Total Rebounds
     *
     * \> AST - Career Total Assists
     *
     * \> STL - Career Total Steals
     *
     * \> BLK - Career Total Blocks
     *
     * \> TOV - Career Total Turnovers
     *
     * \> PF - Career Total Personal Fouls
     *
     * \> PM - Career Total +/-
     *
     * \> PFP - Personal Fouls Per Game
     *
     * \> PMP - +/- per Game
     *
     * \> lastSyncAt - date of last stats sync
     *
     *
     * Example:
     *
     * {"avg\_opponent\_2k\_rating":95,"lose\_streak":0,"max\_lose\_streak":0,"max\_win\_streak":12,
     * "total\_away\_games":50,"total\_diff":250,"total\_diff\_per\_game":2.5,
     * "total\_games":100,"total\_home\_games":50,"total\_knockouts":25,"total\_lost":20,
     * "total\_scored":1250,"total\_suffered":1000,"total\_suffered\_knockouts":3,
     * "total\_win\_percents":"80.00%","total\_wins":80,"win\_streak":2}
     */
    stats: PropTypes.object,

    /**
     * optional styles property, hash of the following UI settings you can control:
     *
     * \> description - hash of styles for description block
     **
     * Example:
     *
     * {
     * description: { minHeight: minHeight }
     * }
     */
    styles: PropTypes.object,

    /**
     * should we wrap this card with cards wrapper?
     *
     * default is false because usually we would like to print multiple cards under the same wrapper, so we will print the wrapper outside.
     */
    wrapper: PropTypes.bool,
};

PlayerDetails.defaultProps = {
    wrapper: false,
    stats: {},
    details: {},
    styles: {},
};