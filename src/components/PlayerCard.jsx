import React from "react";
import {isDefined} from "../helpers/utils";
import PropTypes, {string} from "prop-types";
import LostImage from "./internal/LostImage";
import PlayerPicture from "./internal/PlayerPicture";
import PlayerContent from "./internal/PlayerContent";

export default class PlayerCard extends React.Component {

    render() {
        let {

            // required
            name,
            picture,

            all_players,
            curr_players,

            // player details
            place,
            debut_year,
            position,

            // team details
            team_division,

            // custom details - override all the above
            custom_details_title,
            custom_details,

            // shoot block
            shoot,
            winner,
            lost,
            round_length,
            singleShot,
            rounds,
            singleRounds,

            // Events
            onScore,
            onChange,
            onReplace,
            onSpecificReplace,
            onClick,

            // style
            style,
            className,
            styles,

            wrapper,

            disabled,

            show_more_threshold,

            onImageClick,

        } = this.props;

        const {
            placeRibbon,
            imageContainerStyle,
            imageStyle,
            descriptionStyle,
            extraContentStyle,
        } = styles;

        if (!isDefined(curr_players) && isDefined(name)) {
            curr_players = [name];
        }

        const stats = {...this.props.stats};
        const details = {...this.props.details};
        const { team } = details;

        // debut year
        const debut_year_block = (debut_year !== undefined) ? `Joined in ${debut_year}` : "";

        // position / division
        let position_block = <div />
        if (position) position_block = `Position: ${position}`;
        if (team_division) position_block = `Division: ${team_division}`;


        if (disabled){
            onClick = undefined;
        }

        const card = (
            <div className={"card" + (className ? " " + className : "")} onClick={onClick} style={style}>
                <LostImage show={(lost) ? true : false} />
                <PlayerPicture
                    picture={picture}
                    name={name}
                    place={place}
                    onReplace={onReplace}
                    replace_options={all_players?.filter((player) => { return curr_players?.indexOf(player.name) === -1 })}
                    onSpecificReplace={onSpecificReplace}
                    styles={{
                        container: imageContainerStyle,
                        image: imageStyle,
                        placeRibbon: placeRibbon,
                    }}
                    onClick={onImageClick}
                />
                <PlayerContent
                    name={name}
                    team={team}
                    custom_details_title={custom_details_title}
                    custom_details={custom_details}
                    details={details}
                    stats={stats}
                    shoot={shoot}
                    singleShot={singleShot}
                    winner={winner}
                    lost={lost}
                    round_length={round_length}
                    onScore={onScore}
                    onChange={onChange}
                    place={place}
                    rounds={rounds}
                    singleRounds={singleRounds}
                    show_more_threshold={show_more_threshold}
                    styles={{
                        description: descriptionStyle,
                    }}
                />
                <div className="extra content" style={extraContentStyle}>
                    <span className="right floated">{debut_year_block}</span>
                    <span>
                    <i className="user icon"/>
                        {position_block}
                </span>
                </div>
            </div>
        );

        if (wrapper){
            return (
                <div className="ui link cards centered" style={{ margin: "auto" }} key={"wrapper-" + name}>
                    {card}
                </div>
            )
        }

        return card;
    }
}

PlayerCard.propTypes = {
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

    // required details
    /**
     * The name of the player.
     */
    name: PropTypes.string.isRequired,
    /**
     * The picture of the player.
     */
    picture:PropTypes.string.isRequired,
    /**
     * Array of hashes that represents all players. this array will be used for "replace" functionality, and will be filtered to all players except of curr_players. this way it won't random the same player again.
     *
     * Example:
     *
     * [{"id":233,"name":"LeBron James",
     * "picture":"https:\/\/ak-static.cms.nba.com\/wp-content\/uploads\/headshots\/nba\/latest\/260x190\/2544.png",
     * "position":"Forward","height_feet":6,"height_meters":2.06,"height_inches":9,"weight_pounds":250,
     * "weight_kgs":113.4,"jersey":23,"debut_year":2003,
     * "_2k_rating":97,"team":{"id":14,"name":"Los Angeles Lakers",
     * "logo":"https:\/\/www.nba.com\/.element\/img\/1.0\/teamsites\/logos\/teamlogos_500x500\/lal.png",
     * "division":"PACIFIC","conference":"WEST"}},
     * {"id":184,"name":"James Harden",
     * "picture":"https:\/\/ak-static.cms.nba.com\/wp-content\/uploads\/headshots\/nba\/latest\/260x190\/201935.png",
     * "position":"Guard","height_feet":6,"height_meters":1.96,"height_inches":5,"weight_pounds":220,
     * "weight_kgs":99.8,"jersey":13,"debut_year":2009,"_2k_rating":95,
     * "team":{"id":3,"name":"Brooklyn Nets",
     * "logo":"https:\/\/www.nba.com\/.element\/img\/1.0\/teamsites\/logos\/teamlogos_500x500\/bkn.png","division":"ATLANTIC",
     * "conference":"EAST"}},
     * {"id":109,"name":"Stephen Curry",
     * "picture":"https:\/\/ak-static.cms.nba.com\/wp-content\/uploads\/headshots\/nba\/latest\/260x190\/201939.png",
     * "position":"Guard","height_feet":6,"height_meters":1.9,"height_inches":3,"weight_pounds":185,"weight_kgs":83.9,
     * "jersey":30,"debut_year":2009,"_2k_rating":95,
     * "team":{"id":10,"name":"Golden State Warriors",
     * "logo":"https:\/\/www.nba.com\/.element\/img\/1.0\/teamsites\/logos\/teamlogos_500x500\/gsw.png",
     * "division":"PACIFIC","conference":"WEST"}}]
     */
    all_players: PropTypes.arrayOf(PropTypes.object),
    /**
     * Array of strings that represents players names that are on current game. (for example in One on One we will have array of 2 players)
     *
     * Example:
     *
     * ["Khris Middleton","LeBron James"]
     */
    curr_players: PropTypes.arrayOf(string),
    /**
     * Player Position, for example: Guard, Forward, Center etc.
     *
     * Will be appeared at the bottom of the card.
     */
    position: PropTypes.string,
    /**
     * Team Division.
     */
    team_division: PropTypes.string,
    /**
     * Player debut year - when did he joined the NBA? for example 2009
     *
     * Will be appeared at the bottom of the card, and override position if passed.
     */
    debut_year: PropTypes.number,
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
     * onReplace event. happens when the user clicks on replace.
     *
     * You should pass a function that will random a new player and trigger a setState on the parent that will cause this specific player replacement.
     *
     * Example:
     *
     * onReplace: () => { this.replaceOne(idx); },
     *
     * idx in this example indicates if it's player number 1 or player number 2 in one on one.
     *
     * Notes:
     *
     * \> Replace link will appear only if this function is being passed as property (!!)
     */
    onReplace: PropTypes.func,
    /**
     * onSpecificReplace event.
     *
     * If passed, after the user clicks on Replace he'll see also a Specific Replace button.
     *
     * Clicking on it will transform player name into a select dropdown, in which the user can choose specific player to replace to.
     *
     *
     * Example:
     *
     * onSpecificReplace={(new_player) => { this.onSpecificReplace(old_player, new_player) }}
     *
     *
     * Notes:
     *
     * \> Specific Replace link will appear only if this function is being passed as property (!!)
     *
     * \> You should also pass all_players property in order to have a list of players to select from.
     */
    onSpecificReplace: PropTypes.func,
    /**
     * onClick event.
     *
     * Handles what will happen when the user clicks on the PlayerCard.
     *
     * You can use this event, to, for example, let the user choose players for two different teams and change PlayerCard style accordingly.
     *
     * Example:
     *
     * onClick: (e) => { alert(`This player was selected! do something with this information.`) }
     */
    onClick: PropTypes.func,

    // ui settings
    /**
     * optional style property to style PlayerCard wrapper div.
     *
     * for example, change its border color based on selected team.
     */
    style: PropTypes.object,
    /**
     * optional className property to add to PlayerCard wrapper div. (in addition to the default 'card' class)
     *
     * for example, pass 'in-game' className to show the player always with opacity 1.
     */
    className: PropTypes.string,
    /**
     * optional styles property, hash of the following UI settings you can control:
     *
     * \> placeRibbon - color (red/orange/blue etc) should we show a place ribbon that indicates player's place in a more noticeable way.
     *
     * \> imageContainerStyle - hash of styles for image container
     *
     * \> imageStyle - hash of styles for the image itself
     *
     * \> descriptionStyle - hash of styles for description block
     *
     * \> extraContentStyle - hash of styles for the bottom part of the card.
     *
     * Example:
     *
     * {
     * descriptionStyle: { minHeight: minHeight }, imageContainerStyle: { backgroundColor: "#F2F2F2" },
     * imageStyle: { width: 200, margin: "auto", padding: "20px" }, extraContentStyle: { display: "none" }
     * }
     */
    styles: PropTypes.object,

    /**
     * should we wrap this card with cards wrapper?
     *
     * default is false because usually we would like to print multiple cards under the same wrapper, so we will print the wrapper outside.
     */
    wrapper: PropTypes.bool,

    /**
     * Is this card disabled? if so onClick event won't be available and card will appear in disabled mode.
     */
    disabled: PropTypes.bool,
};

PlayerCard.defaultProps = {
    round_length: 3,
    onReplace: undefined,
    wrapper: false,
    styles: {},
    stats: {},
    details: {},
    disabled: false,
};