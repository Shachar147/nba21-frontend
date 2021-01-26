import React from "react";
import {LOST_X_IMAGE, PLAYER_NO_PICTURE} from "../helpers/consts";
import {isDefined, nth, toPascalCase} from "../helpers/utils";

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
        // console.log("here", fallback, fallbacks.length-1);
        if (fallback > fallbacks.length-1) return;
        const picture = fallbacks[fallback];
        this.setState({ picture, fallback });
    }

    render() {
        let details = [];
        if (this.props.percents) details.push("3Pt Percents: " + this.props.percents);
        if (this.props._2k_rating) details.push(`2K Rating: ${this.props._2k_rating}`);
        if (this.props.height_meters) details.push("Height: " + this.props.height_meters + " meters");
        if (this.props.weight_kgs) details.push("Weight: " + this.props.weight_kgs + " kgs");

        // team
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
               <div style={{display: "inline-block", paddingTop: "10px", marginTop: "10px", paddingBottom: "10px", marginBottom: "10px", borderTop: "1px solid #eaeaea", borderBottom: "1px solid #eaeaea", width: "100%"}}>
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

        // Single Rounds (one oo One)
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

        let position = <div />
        if (this.props.position) position = `Position: ${this.props.position}`;
        if (this.props.team_division) position = `Division: ${this.props.team_division}`;

        // let _2k_rating = <span />;
        // if (this.props._2k_rating)
        //     _2k_rating = (
        //         <span style={{ opacity: "0.6", fontWeight: "normal", marginLeft: "5px" }}>
        //             (2k rating: {this.props._2k_rating})
        //         </span>
        //     );

        let title = (this.props.details_title) ? this.props.details_title : "";

        return (
            <div className={"card" + (this.props.className ? " " + this.props.className : "")} onClick={this.props.onClick} style={this.props.style}>
                {lostImage}
                <div className="image" style={this.props.imageStyle}>
                    <img src={picture} onError={this.onError} alt={this.props.name} style={this.props.imgStyle} />
                </div>
                <div className="content">
                    <div className="header">{this.props.name}</div>
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
                <div className="extra content">
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