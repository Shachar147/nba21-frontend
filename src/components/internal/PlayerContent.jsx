import React from "react";
import PropTypes from "prop-types";
import ShootingBox from "./ShootingBox";
import {isDefined, nth} from "@helpers/utils";
import PlayerDetails from "./PlayerDetails";

export default function PlayerContent(props) {
    let { name, team,
          custom_details_title, custom_details, details, stats,
          shoot, singleShot, winner, lost, round_length, onScore, onChange,
          place, rounds, singleRounds,
          styles, wrapper, show_more_threshold } = props;

    // rounds
    const place_block = (place) ? "Place: " + place + nth(place) : "";
    const total_made = (!rounds || !rounds.length) ? 0 : rounds.reduce((a, b) => a + b);
    const total_attempt = (!rounds || !rounds.length) ? 0 : rounds.length * round_length;
    let rounds_block = (rounds) ? (
        <div style={{display: "inline-block", paddingTop: "10px", marginTop: "10px", borderTop: "1px solid #eaeaea", width: "100%"}}>
            { <div style={{ marginBottom: "5px", fontWeight: "bold" }}>
                Total: {total_made}/{total_attempt} - { ( (total_made/total_attempt)* 100).toFixed(2) + "%" }
            </div> }
            {place_block}
            { rounds.map(function(iter,idx) {
                return (
                    <div key={`round-` + idx}>
                        <span>{iter}/{round_length}</span>
                    </div>
                );
            }) }

        </div>
    ) : undefined;

    // Single Rounds (one on One, random teams)
    if (singleRounds){
        rounds_block = (
            <div style={{display: "inline-block", paddingTop: "10px", marginTop: "10px", borderTop: "1px solid #eaeaea", width: "100%"}}>
                { <div style={{ marginBottom: "5px", fontWeight: "bold" }}>
                    Total: {singleRounds.reduce((a, b) => a + b, 0) } Points
                </div> }
                { singleRounds.map(function(iter,idx) {
                    return (
                        <div key={`round-` + idx}>
                            <span>{iter} Points</span>
                        </div>
                    );
                }) }

            </div>
        );
    }

    const dataTestId = props['data-testid'];

    const playerContent = (
        <div className="content" data-testid={dataTestId}>
            <div className="header">{name}</div>
            <div className="meta">
                <a disabled={true} style={{ cursor: "default" }}>
                    {team}
                </a>
            </div>
            <PlayerDetails
                data-testid={"player-details"}
                details={details}
                stats={stats}
                custom_details={custom_details}
                custom_details_title={custom_details_title}
                styles={styles}
                show_more_threshold={show_more_threshold}
            />
            {rounds_block}
            <ShootingBox
                show={(shoot || isDefined(singleShot) || lost) ? true : false} // isDefined because value can be 0. ? true : false because otherwise it will send undefined and default is true
                is_winner={winner}
                is_loser={lost}
                round_length={round_length}
                onScore={onScore}
                singleShot={singleShot}
                onChange={onChange}
            />
        </div>
    );

    if (wrapper){
        return (
            <div className={"ui card centered"}>
                {playerContent}
            </div>
        );
    }

    return playerContent;
}

PlayerContent.propTypes = {
    /**
     * The name of this player.
     */
    name: PropTypes.string,
    /**
     * The name of the team of this player.
     */
    team: PropTypes.string,


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
     * Is the player shooting right now? (for example in 3pt contest)
     * If so, a "scored/from" inputs will appear.
     */
    shoot: PropTypes.bool,
    /**
     * What is the current place of this player?
     */
    place: PropTypes.number,
    /**
     * Is this player won? if so, a "Winner" message will appear
     */
    winner: PropTypes.bool,
    /**
     * Is this player lost? if so, a "Loser" message will appear and a X on the player.
     */
    lost: PropTypes.bool,
    /**
     * Round length. determines shooting "from" input.
     */
    round_length: PropTypes.number,
    /**
     * Is the player shooting a single shot right now? (for example in One on One or Random games)
     * If so, the value that passed here will be used for his shooting score.
     *
     * If this setting passed, it's overriding shot (scored/from shot)
     */
    singleShot: PropTypes.number,
    /**
     * Array of passed scores of the previous rounds.
     *
     * For example, in 3 pts contest, holds all previous rounds scoring list.
     *
     * Example:
     *
     * [3, 2, 2]
     */
    rounds: PropTypes.arrayOf(PropTypes.number),

    /**
     * Array of passed scores of the previous rounds in single shootout.
     * Will be used to display rounds history in case the player is using singleshoot block.
     *
     * Example:
     *
     * [3, 2, 2]
     */
    singleRounds: PropTypes.arrayOf(PropTypes.number),

    // Events
    /**
     * onScore event. relevant for scored/from shots (for example in 3pt contest).
     *
     * Handles what will happen after the user submits scored/from result for specific player.
     *
     * onScore gets as parameter scored value.
     *
     * Example:
     *
     * onScore: (value) => { alert(`Player scored ${value}/${example_round_length}`) }
     */
    onScore: PropTypes.func,
    /**
     * onChange event. relevant for single shot. (for example One on One or Random).
     *
     * Handles what will happen when the user changes singleshot input.
     *
     * Example:
     *
     * onChange: (e) => { alert(`Current Score Value: ${e.target.value}`) }
     */
    onChange: PropTypes.func,

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
     * should we wrap this component with a wrapper div?
     */
    wrapper: PropTypes.bool,
};

PlayerContent.defaultProps = {
    round_length: 3,
    wrapper: false,
    styles: {},
    custom_details_title: "",
    stats: {},
    details: {},
};