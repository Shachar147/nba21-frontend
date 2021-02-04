import React from "react";
import {
    ICE_COLD_COLOR, ICE_COLD_ICON, ICE_COLD_STYLE,
    ICE_COLD_THRESHOLD,
    LOST_X_IMAGE,
    ON_FIRE_COLOR,
    ON_FIRE_ICON,
    ON_FIRE_STYLE,
    ON_FIRE_THRESHOLD,
    PLAYER_NO_PICTURE
} from "../helpers/consts";
import {isDefined, nth} from "../helpers/utils";
import DropdownInput from "./inputs/DropdownInput";

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

            details_title,

            // player details
            name,
            team,
            _2k_rating,
            place,
            percents, // 3pt percents
            height_meters,
            weight_kgs,
            debut_year,
            position,
            team_division,

            placeRibbon,

            // stats details
            total_win_percents,
            total_wins,
            total_lost,
            total_games,
            win_streak,
            lose_streak,
            total_diff,
            total_diff_per_game,
            avg_opponent_2k_rating,
            total_home_games,
            total_away_games,
            total_scored,
            total_suffered,
            total_knockouts,
            total_suffered_knockouts,
            max_win_streak,
            max_lose_streak,

            // details - override all the above
            details,

            // order by highlightes
            highlights,

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

            all_players,
            curr_players,

            className,
            style,
            imageStyle,
            imgStyle,
            descriptionStyle,
            extraContentStyle,

        } = this.props;

        const {
            picture,
            shoot_score,
            specific_replace,
            select_replacement,

        } = this.state;

        let settings = {
            '2K Rating': _2k_rating,

            'Total Wins Percents': total_win_percents,
            'Total Wins': `${total_wins}W`,
            'Total Lost': `${total_lost}L`,
            'Total Games': total_games,
            'Current Win Streak': win_streak,
            'Current Lose Streak': lose_streak,
            'Total Diff': total_diff,

            'Average Opponent 2K Rating': avg_opponent_2k_rating?.toFixed(0),

            'Total Diff Per Game': `(${total_diff_per_game} per game)`,
            'Total Home Games': total_home_games,
            'Total Road Games': total_away_games,
            'Total Scored': total_scored,
            'Total Suffered': total_suffered,
            'Total Knockouts': total_knockouts,
            'Total Suffered Knockouts': total_suffered_knockouts,
            'Max Win Streak': `(Max: ${max_win_streak})`,
            'Max Lose Streak': `(Max: ${max_lose_streak})`,
        };

        // on fire / ice cold
        let onfire = "";
        let icecold = "";
        if (win_streak >= ON_FIRE_THRESHOLD){
            onfire = ` <span style="color:${ON_FIRE_COLOR}">On Fire! <img style="${ON_FIRE_STYLE}" src="${ON_FIRE_ICON}" /></span>`
        }
        if (lose_streak >= ICE_COLD_THRESHOLD){
            icecold = ` <span style="color:${ICE_COLD_COLOR}">Ice Cold <img style="${ICE_COLD_STYLE}" src="${ICE_COLD_ICON}" /></span>`
        }

        // order by highlights
        if (highlights) {
            Object.keys(settings).map((name) => {
                if(highlights.indexOf(name) !== -1){
                    settings[name] = `<b><u>${settings[name]}</u></b>`
                }
            });
        }

        let details_arr = [];

        // general details
        if (place) details_arr.push(place + nth(place));
        if (percents) details_arr.push("3Pt Percents: " + percents);
        if (_2k_rating) details_arr.push(`2K Rating: ${settings['2K Rating']}`);
        if (avg_opponent_2k_rating) details_arr.push(`Average Opponent 2K Rating: ${settings['Average Opponent 2K Rating']}`);
        if (height_meters) details_arr.push("Height: " + height_meters + " meters");
        if (weight_kgs) details_arr.push("Weight: " + weight_kgs + " kgs");

        // one on one
        if (total_win_percents) details_arr.push(`Total Wins Percents: ${settings['Total Wins Percents']} (${settings['Total Wins']} - ${settings['Total Lost']})`);
        if (total_games) details_arr.push(`Total Games: ${settings['Total Games']}`);
        if (isDefined(total_home_games) && isDefined(total_away_games)) details_arr.push(`Home/Road Games: ${settings['Total Home Games']} - ${settings['Total Road Games']}`);
        if (isDefined(win_streak)) { details_arr.push(`Win Streak: ${settings['Current Win Streak']} ${settings['Max Win Streak']}` + onfire); }
        if (isDefined(lose_streak)) { details_arr.push(`Lose Streak: ${settings['Current Lose Streak']} ${settings['Max Lose Streak']}` + icecold); }
        if (isDefined(total_diff)) details_arr.push(`Total Diff: ${settings['Total Diff']} ${settings['Total Diff Per Game']}`);
        if (isDefined(total_scored)) details_arr.push(`Total Scored/Suffered: ${settings['Total Scored']} - ${settings['Total Suffered']}`);
        if (isDefined(total_knockouts)) details_arr.push(`Total Knockouts Did/Suffered: ${settings['Total Knockouts']} - ${settings['Total Suffered Knockouts']}`);

        // team details (built outside)
        if (details) details_arr = details;

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
            shoot_block = (
               <div style={{
                   display: "inline-block",
                   paddingTop: "10px",
                   marginTop: "10px",
                   paddingBottom: "10px",
                   marginBottom: "10px",
                   borderTop: "1px solid #eaeaea",
                   width: "100%"}}
               >
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

        let title = (details_title) ? details_title : "";

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
                    options={all_players.filter((player) => { return curr_players.indexOf(player.name) === -1 })}
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

        return (
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
    }
}