import React from "react";
import {LOST_X_IMAGE, PLAYER_NO_PICTURE} from "../helpers/consts";
import {isDefined, nth} from "../helpers/utils";
import DropdownInput from "./DropdownInput";

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
        let details = [];

        let settings = {
            '2K Rating': this.props._2k_rating,

            'Total Wins Percents': this.props.total_win_percents,
            'Total Games': this.props.total_games,
            'Current Win Streak': this.props.win_streak,
            'Current Lose Streak': this.props.lose_streak,
            'Total Diff': this.props.total_diff,

            'Average Opponent 2K Rating': this.props.avg_opponent_2k_rating,

            'Total Diff Per Game': `(${this.props.total_diff_per_game} per game)`,
            'Total Home Games': this.props.total_home_games,
            'Total Road Games': this.props.total_away_games,
            'Total Scored': this.props.total_scored,
            'Total Suffered': this.props.total_suffered,
            'Total Knockouts': this.props.total_knockouts,
            'Total Suffered Knockouts': this.props.total_suffered_knockouts,
            'Max Win Streak': `(Max: ${this.props.max_win_streak})`,
            'Max Lose Streak': `(Max: ${this.props.max_lose_streak})`,
        };

        const { highlights } = this.props;
        if (highlights) {
            Object.keys(settings).map((name) => {
                if(highlights.indexOf(name) !== -1){
                    settings[name] = `<b><u>${settings[name]}</u></b>`
                }
            });
        }

        // general details
        if (this.props.place) details.push(this.props.place + nth(this.props.place));
        if (this.props.percents) details.push("3Pt Percents: " + this.props.percents);
        if (this.props._2k_rating) details.push(`2K Rating: ${settings['2K Rating']}`);
        if (this.props.avg_opponent_2k_rating) details.push(`Average Opponent 2K Rating: ${settings['Average Opponent 2K Rating']}`);
        if (this.props.height_meters) details.push("Height: " + this.props.height_meters + " meters");
        if (this.props.weight_kgs) details.push("Weight: " + this.props.weight_kgs + " kgs");

        // one on one
        if (this.props.total_win_percents) details.push(`Total Wins Percents: ${settings['Total Wins Percents']}`);
        if (this.props.total_win_percents) details.push(`Total Games: ${settings['Total Games']}`);
        if (isDefined(this.props.total_home_games) && isDefined(this.props.total_away_games)) details.push(`Home/Road Games: ${settings['Total Home Games']} - ${settings['Total Road Games']}`);
        if (isDefined(this.props.win_streak)) { details.push(`Win Streak: ${settings['Current Win Streak']} ${settings['Max Win Streak']}`); }
        if (isDefined(this.props.lose_streak)) { details.push(`Lose Streak: ${settings['Current Lose Streak']} ${settings['Max Lose Streak']}`); }
        if (isDefined(this.props.total_diff)) details.push(`Total Diff: ${settings['Total Diff']} ${settings['Total Diff Per Game']}`);
        if (isDefined(this.props.total_scored)) details.push(`Total Scored/Suffered: ${settings['Total Scored']} - ${settings['Total Suffered']}`);
        if (isDefined(this.props.total_knockouts)) details.push(`Total Knockouts Did/Suffered: ${settings['Total Knockouts']} - ${settings['Total Suffered Knockouts']}`);

        // team details (built outside)
        if (this.props.details){
            details = this.props.details;
        }

        const picture = this.state.picture;
        const debut_year = (this.props.debut_year !== undefined) ? `Joined in ${this.props.debut_year}` : "";

        // shoot
        let input_style= { height: "38px", width: "30%", border: "1px solid #eaeaea", padding:"0px 5px" };
        let shoot = (this.props.shoot && !this.props.winner) ? (
            <div style={{display: "inline-block", paddingTop: "10px", marginTop: "10px", borderTop: "1px solid #eaeaea"}}>
                <input type={"number"} value={this.state.shoot_score} min={0} max={this.props.round_length} onChange={(e) => { this.setState({ shoot_score: Math.min(this.props.round_length,e.target.value) }) }} style={input_style}/>
                <span style={{ margin: "0px 5px" }} > / </span>
                <input type={"number"} value={this.props.round_length} disabled style={input_style}/>
                <div className={"ui basic buttons"} style={{ marginLeft: "10px" }}>
                    <input type={"button"} className={"ui basic button"} value={"Go"} onClick={() => { this.props.onScore(this.state.shoot_score); this.setState({ shoot_score: 0}); }} />
                </div>
            </div>
        ) : undefined;

        // single shoot (one on one)
        if (isDefined(this.props.singleShot)) {
            input_style.width = "100%";
            shoot = (
               <div style={{display: "inline-block", paddingTop: "10px", marginTop: "10px", paddingBottom: "10px", marginBottom: "10px", borderTop: "1px solid #eaeaea", width: "100%"}}>
                   <input type={"number"} value={this.props.singleShot} min={0} onChange={this.props.onChange} style={input_style}/>
               </div>
            );
        }

        // place
        const place = (this.props.place) ? "Place: " + this.props.place + nth(this.props.place) : "";

        // rounds
        const round_length = this.props.round_length;
        const total_made = (!this.props.rounds || !this.props.rounds.length) ? 0 : this.props.rounds.reduce((a, b) => a + b);
        const total_attempt = (!this.props.rounds || !this.props.rounds.length) ? 0 : this.props.rounds.length * round_length;
        let rounds = (this.props.rounds) ? (
            <div style={{display: "inline-block", paddingTop: "10px", marginTop: "10px", borderTop: "1px solid #eaeaea", width: "100%"}}>
                { <div style={{ marginBottom: "5px", fontWeight: "bold" }}>
                    Total: {total_made}/{total_attempt} - { ( (total_made/total_attempt)* 100).toFixed(2) + "%" }
                </div> }
                {place}
                { this.props.rounds.map(function(iter,idx) {
                    return (
                        <div key={`round-` + idx}>
                            <span>{iter}/{round_length}</span>
                        </div>
                    );
                }) }

            </div>
        ) : undefined;

        // Single Rounds (one on One, random teams)
        if (this.props.singleRounds){
            rounds = (
                <div style={{display: "inline-block", paddingTop: "10px", marginTop: "10px", borderTop: "1px solid #eaeaea", width: "100%"}}>
                    { <div style={{ marginBottom: "5px", fontWeight: "bold" }}>
                        Total: {this.props.singleRounds.reduce((a, b) => a + b, 0) } Points
                    </div> }
                    { this.props.singleRounds.map(function(iter,idx) {
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
        const lost = (this.props.lost) ? "Loser" : "";
        const lostImage = (this.props.lost) ? (<img className="lost-image" alt={"lost"} src={LOST_X_IMAGE} />) : undefined;
        const winner = (this.props.winner) ? "Winner!" : "";

        // position / division
        let position = <div />
        if (this.props.position) position = `Position: ${this.props.position}`;
        if (this.props.team_division) position = `Division: ${this.props.team_division}`;

        let title = (this.props.details_title) ? this.props.details_title : "";

        // replace / specific replace
        let replace = (this.props.onReplace) ? (
            <a onClick={() => { this.setState({ specific_replace: true }); this.props.onReplace(); }} style={{ position: "absolute", bottom: "5px", zIndex:"9999999", backgroundColor: "rgba(255,255,255,1)", padding: "5px 8px", borderRadius: "10px", right: "10px", textDecoration: "underline", textTransform: "uppercase", fontSize:"11px" }}>Replace</a>
        ) : "";
        let specific_replace =  (this.state.specific_replace && this.props.onSpecificReplace) ? (
            <a onClick={() => {
                if (this.state.select_replacement) {
                    this.setState({ specific_replace: false, select_replacement: false });
                } else {
                    this.setState({ select_replacement: true });
                }
            }} style={{ position: "absolute", bottom: "5px", zIndex:"9999999", backgroundColor: "rgba(255,255,255,1)", padding: "5px 8px", borderRadius: "10px", right: "80px", textDecoration: "underline", textTransform: "uppercase", fontSize:"11px" }}>Specific Replace</a>
        ) : "";

        // name / select specific replace
        let name =
            (this.state.select_replacement) ? (
                <DropdownInput
                    options={this.props.all_players.filter((player) => { return this.props.curr_players.indexOf(player.name) === -1 })}
                    name={"select_replacement"}
                    placeholder={"Select Replacement..."}
                    nameKey={"name"}
                    valueKey={"name"}
                    idKey={"id"}
                    onChange={(player) => { this.props.onSpecificReplace(player); this.setState({ select_replacement: false, specific_replace: false }); }}
                />
            ) : this.props.name;

        return (
            <div className={"card" + (this.props.className ? " " + this.props.className : "")} onClick={this.props.onClick} style={this.props.style}>
                {lostImage}
                <div className="image" style={this.props.imageStyle}>
                    <img src={picture} onError={this.onError} alt={this.props.name} style={this.props.imgStyle} />
                    {replace}
                    {specific_replace}
                </div>
                <div className="content">
                    <div className="header">{name}</div>
                    <div className="meta">
                        <a disabled={true} style={{ cursor: "default" }}>
                            {this.props.team}
                        </a>
                    </div>
                    <div className="description" style={this.props.descriptionStyle} dangerouslySetInnerHTML={{__html: title + details.join("<br/>")}}/>
                    {rounds}
                    {shoot}
                    {lost}
                    {winner}
                </div>
                <div className="extra content" style={this.props.extraContentStyle}>
                    <span className="right floated">{debut_year}</span>
                    <span>
                    <i className="user icon"/>
                        {position}
                </span>
                </div>
            </div>
        );
    }
}