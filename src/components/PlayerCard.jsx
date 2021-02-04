import React from "react";
import {
    LOST_X_IMAGE,
    PLAYER_NO_PICTURE
} from "../helpers/consts";
import {isDefined, nth} from "../helpers/utils";
import DropdownInput from "./inputs/DropdownInput";
import PropTypes, {objectOf, string} from "prop-types";
import {buildDetails} from "../helpers/playercard.helper";

export default class PlayerCard extends React.Component {

    constructor(props) {
        super(props);

        const fallback_image = this.getFallbackImage(this.props.name)

        this.state = {
            picture: this.props.picture,
            fallback: 0,
            fallbacks: [
                this.props.picture,
                fallback_image,
                PLAYER_NO_PICTURE
            ],

            shoot_score: 0,

            specific_replace: false,
            select_replacement: false,
        };

        this.onError = this.onError.bind(this);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.picture){
            this.setState({ picture: nextProps.picture })
        }
    }

    getFallbackImage(name){
        return 'https://nba-players.herokuapp.com/players/' + name.replace(".", "").split(' ').reverse().join('/');
    }

    onError(){
        let fallback = this.state.fallback;
        const fallbacks = this.state.fallbacks;

        fallback++;
        if (fallback > fallbacks.length-1) return;
        const picture = fallbacks[fallback];
        this.setState({ picture, fallback });
    }

    render() {
        const {

            // required
            name,
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
            placeRibbon,
            className,
            style,
            imageStyle,
            imgStyle,
            descriptionStyle,
            extraContentStyle,

            wrapper,
        } = this.props;

        const {
            picture,
            shoot_score,
            specific_replace,
            select_replacement,

        } = this.state;

        const stats = {...this.props.stats};
        const details = {...this.props.details};
        const { team } = details;

        let details_arr = (custom_details) ? custom_details : buildDetails(details, stats)

        // debut year
        const debut_year_block = (debut_year !== undefined) ? `Joined in ${debut_year}` : "";

        // shoot
        let input_style= { height: "38px", width: "30%", border: "1px solid #eaeaea", padding:"0px 5px" };
        let shoot_block = (shoot && !winner) ? (
            <div style={{display: "inline-block", paddingTop: "10px", marginTop: "10px", borderTop: "1px solid #eaeaea"}}>
                <input
                    type={"number"}
                    value={shoot_score}
                    min={0}
                    max={round_length}
                    onChange={(e) => {
                        this.setState({
                            shoot_score: Math.min(round_length, e.target.value)
                        })
                    }}
                    style={input_style}
                />
                <span style={{ margin: "0px 5px" }} > / </span>
                <input type={"number"} value={round_length} disabled style={input_style}/>
                <div className={"ui basic buttons"} style={{ marginLeft: "10px" }}>
                    <input
                        type={"button"}
                        className={"ui basic button"}
                        value={"Go"}
                        onClick={() => {
                            onScore(shoot_score);
                            this.setState({ shoot_score: 0});
                        }}
                    />
                </div>
            </div>
        ) : undefined;

        // single shoot (one on one)
        if (isDefined(singleShot)) {
            input_style.width = "100%";
            const shot_style = {
                display: "inline-block",
                paddingTop: "10px",
                marginTop: "10px",
                paddingBottom: "10px",
                marginBottom: "10px",
                borderTop: "1px solid #eaeaea",
                width: "100%"
            };
            shoot_block = (
               <div style={shot_style}>
                   <input
                       type={"number"}
                       value={singleShot}
                       min={0}
                       onChange={(e) => {
                           e.target.value = Number(e.target.value);
                           onChange(e);
                       }}
                       style={input_style}
                   />
               </div>
            );
        }

        // place
        const place_block = (place) ? "Place: " + place + nth(place) : "";

        // rounds
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

        // lost / win
        const lost_block = (lost) ? "Loser" : "";
        const lostImage = (lost) ? (<img className="lost-image" alt={"lost"} src={LOST_X_IMAGE} />) : undefined;
        const winner_block = (winner) ? "Winner!" : "";

        // position / division
        let position_block = <div />
        if (position) position_block = `Position: ${position}`;
        if (team_division) position_block = `Division: ${team_division}`;

        let title = (custom_details_title) ? custom_details_title : "";

        // replace / specific replace
        let replace = (onReplace) ? (
            <a onClick={() => { this.setState({ specific_replace: true }); onReplace(); }} style={{ position: "absolute", bottom: "5px", zIndex:"9999999", backgroundColor: "rgba(255,255,255,1)", padding: "5px 8px", borderRadius: "10px", right: "10px", textDecoration: "underline", textTransform: "uppercase", fontSize:"11px" }}>Replace</a>
        ) : "";
        let specific_replace_block =  (specific_replace && onSpecificReplace) ? (
            <a onClick={() => {
                if (select_replacement) {
                    this.setState({ specific_replace: false, select_replacement: false });
                } else {
                    this.setState({ select_replacement: true });
                }
            }} style={{ position: "absolute", bottom: "5px", zIndex:"9999999", backgroundColor: "rgba(255,255,255,1)", padding: "5px 8px", borderRadius: "10px", right: "80px", textDecoration: "underline", textTransform: "uppercase", fontSize:"11px" }}>Specific Replace</a>
        ) : "";

        // name / select specific replace
        let name_block =
            (select_replacement) ? (
                <DropdownInput
                    options={all_players?.filter((player) => { return curr_players.indexOf(player.name) === -1 })}
                    name={"select_replacement"}
                    placeholder={"Select Replacement..."}
                    nameKey={"name"}
                    valueKey={"name"}
                    idKey={"id"}
                    onChange={(player) => { onSpecificReplace(player); this.setState({ select_replacement: false, specific_replace: false }); }}
                />
            ) : name;

        // place ribbon
        const place_tag = (!place || !placeRibbon) ? null : (
            <a className={`ui ${placeRibbon} ribbon label`} style={{ left: "-15px", top: "3px", position: "absolute" }}>#{place}</a>
        )

        const card = (
            <div className={"card" + (className ? " " + className : "")} onClick={onClick} style={style}>
                {lostImage}
                <div className="image" style={imageStyle}>
                    {place_tag}
                    <img src={picture} onError={this.onError} alt={name} style={imgStyle} />
                    {replace}
                    {specific_replace_block}
                </div>
                <div className="content">
                    <div className="header">{name_block}</div>
                    <div className="meta">
                        <a disabled={true} style={{ cursor: "default" }}>
                            {team}
                        </a>
                    </div>
                    <div className="description" style={descriptionStyle} dangerouslySetInnerHTML={{__html: title + details_arr.join("<br/>")}}/>
                    {rounds_block}
                    {shoot_block}
                    {lost_block}
                    {winner_block}
                </div>
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
                <div className="ui link cards centered" style={{ margin: "auto" }}>
                    {card}
                </div>
            )
        }

        return card;
    }
}

PlayerCard.propTypes = {
    /**
     * option to pass a title to custom details. for example: "Players", and then on custom_details pass array of players names.
     */
    custom_details_title: PropTypes.string,
    /**
     * option to pass custom details array. will override 'details' and 'stats'. for example, you can pass array of all players of specific team.
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
     */
    all_players: PropTypes.arrayOf(PropTypes.object).isRequired,
    /**
     * Array of strings that represents players names that are on current game. (for example in One on One we will have array of 2 players)
     *
     * Example:
     * ["Khris Middleton","LeBron James"]
     */
    curr_players: PropTypes.arrayOf(string).isRequired,
    /**
     * Player Position, for example: Guard, Forward, Center etc.
     */
    position: PropTypes.string,
    /**
     * Team Division.
     */
    team_division: PropTypes.string,
    /**
     * Player debut year - when did he joined the NBA? for example 2009
     */
    debut_year: PropTypes.number,
    /**
     * Hash of player details.
     *
     * for example:
     * {"\_2k\_rating": "95","height\_meters": 1.9,"percents":"43.43%","team": "Golden State Warriors","weight\_kgs": "83.9"}
     */
    details: PropTypes.object,
    /**
     * Hash of player stats.
     *
     * for example:
     * {"avg\_opponent\_2k\_rating":95,"lose\_streak":0,"max\_lose\_streak":0,"max\_win\_streak":12,"total\_away\_games":50,"total\_diff":250,"total\_diff\_per\_game":2.5,
     * "total\_games":100,"total\_home\_games":50,"total\_knockouts":25,"total\_lost":20,"total\_scored":1250,"total\_suffered":1000,"total\_suffered\_knockouts":3,
     * "total\_win\_percents":"80.00%","total\_wins":80,"win\_streak":2}
     */
    stats: PropTypes.object,

    // shoot block
    shoot: PropTypes.string,
    winner: PropTypes.bool,
    lost: PropTypes.bool,
    round_length: PropTypes.string,
    singleShot: PropTypes.number,
    rounds: PropTypes.arrayOf(PropTypes.number),
    singleRounds: PropTypes.arrayOf(PropTypes.number),

    // Events
    onScore: PropTypes.func,
    onChange: PropTypes.func,
    onReplace: PropTypes.func,
    onSpecificReplace: PropTypes.func,
    onClick: PropTypes.func,

    // ui settings
    placeRibbon: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    imageStyle: PropTypes.object,
    imgStyle: PropTypes.object,
    descriptionStyle: PropTypes.object,
    extraContentStyle: PropTypes.object,

    /**
     * should we wrap this card with cards wrapper?
     * default is false because usually we would like to print multiple cards under the same wrapper, so we will print the wrapper outside.
     */
    wrapper: PropTypes.bool,
};

PlayerCard.defaultProps = {
    wrapper: false,
};