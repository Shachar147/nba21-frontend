import React from "react";

export default class PlayerCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            players: [],
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

        const input_style= { height: "38px", width: "30%", border: "1px solid #eaeaea", padding:"0px 5px" }
        const shoot = (this.props.shoot) ? (
            <div style={{display: "inline-block", paddingTop: "10px", marginTop: "10px", borderTop: "1px solid #eaeaea"}}>
                <input type={"number"} value={this.state.shoot_score || 0} min={0} max={this.props.round_length} onChange={(e) => { this.setState({ shoot_score: Math.min(this.props.round_length,e.target.value) }) }} style={input_style}/>
                <span style={{ margin: "0px 5px" }} > / </span>
                <input type={"number"} value={this.props.round_length} disabled style={input_style}/>
                <div className={"ui basic buttons"} style={{ marginLeft: "10px" }}>
                    <input type={"button"} className={"ui basic button"} value={"Go"} />
                </div>
            </div>
        ) : undefined;

        return (
            <div className="card" onClick={this.props.onClick} style={this.props.style}>
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
                    {shoot}
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