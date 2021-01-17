import React from "react";

export default class PlayerCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            players: [],

            shoot_score: 0,
        };
    }

    render() {
        const details = [];
        if (this.props.percents) details.push("3Pt Percents: " + this.props.percents);
        if (this.props.height_meters) details.push("Height: " + this.props.height_meters + " meters");
        if (this.props.weight_kgs) details.push("Weight: " + this.props.weight_kgs + " kgs")

        const fallback_image = 'https://nba-players.herokuapp.com/players/' + this.props.name.replace(".", "").split(' ').reverse().join('/');
        const picture = this.props.picture || fallback_image;

        const debut_year = this.props.debut_year || "N/A";

        // shoot
        const input_style= { height: "38px", width: "30%", border: "1px solid #eaeaea", padding:"0px 5px" }
        const shoot = (this.props.shoot && !this.props.winner) ? (
            <div style={{display: "inline-block", paddingTop: "10px", marginTop: "10px", borderTop: "1px solid #eaeaea"}}>
                <input type={"number"} value={this.state.shoot_score} min={0} max={this.props.round_length} onChange={(e) => { this.setState({ shoot_score: Math.min(this.props.round_length,e.target.value) }) }} style={input_style}/>
                <span style={{ margin: "0px 5px" }} > / </span>
                <input type={"number"} value={this.props.round_length} disabled style={input_style}/>
                <div className={"ui basic buttons"} style={{ marginLeft: "10px" }}>
                    <input type={"button"} className={"ui basic button"} value={"Go"} onClick={() => this.props.onScore(this.state.shoot_score)} />
                </div>
            </div>
        ) : undefined;

        // rounds
        const round_length = this.props.round_length;
        const total_made = (!this.props.rounds || !this.props.rounds.length) ? 0 : this.props.rounds.reduce((a, b) => a + b);
        const total_attempt = (!this.props.rounds || !this.props.rounds.length) ? 0 : this.props.rounds.length * round_length;
        const rounds = (this.props.rounds) ? (
            <div style={{display: "inline-block", paddingTop: "10px", marginTop: "10px", borderTop: "1px solid #eaeaea", width: "100%"}}>
                { <div style={{ marginBottom: "5px", fontWeight: "bold" }}>
                    Total: {total_made}/{total_attempt} - { ( (total_made/total_attempt)* 100).toFixed(2) + "%" }
                </div> }
                { this.props.rounds.map(function(iter) {
                    return (
                        <div>
                            <span>{iter}/{round_length}</span>
                        </div>
                    );
                }) }

            </div>
        ) : undefined;

        // lost / win
        const lost = (this.props.lost) ? "Loser" : "";
        const lostImage = (this.props.lost) ? (
            <img className="lost-image" src="https://icon-library.net/images/x-png-icon/x-png-icon-8.jpg" />
        ) : "";
        const winner = (this.props.winner) ? "Winner!" : "";

        return (
            <div className={"card" + (this.props.className ? " " + this.props.className : "")} onClick={this.props.onClick} style={this.props.style}>
                {lostImage}
                <div className="image">
                    <img src={picture} fallback={fallback_image} alt={this.props.name}/>
                </div>
                <div className="content">
                    <div className="header">{this.props.name}</div>
                    <div className="meta">
                        <a href="/">
                            {this.props.team}
                        </a>
                    </div>
                    <div className="description" dangerouslySetInnerHTML={{__html: details.join("<br/>")}}/>
                    {rounds}
                    {shoot}
                    {lost}
                    {winner}
                </div>
                <div className="extra content">
                    <span className="right floated">Joined in {debut_year}</span>
                    <span>
                    <i className="user icon"/>
                    Position: {this.props.position}
                </span>
                </div>
            </div>
        );
    }
};