import React from "react";

export default class SelectedPlayers extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    onError (event){
        event.target.src = './nopic.png';
    }

    teamDetails (team){
        return (
            <div>
                <div style={{margin: "20px"}}>

                    <button className={"ui button basic tiny blue"} style={{ margin:"0px 5px" }} onClick={this.props.onAddRandom}>
                        + Random
                    </button>

                    <button className={"ui button basic tiny blue"} style={{ margin:"0px px" }} onClick={this.props.onAddComputer}>
                        + Computer
                    </button>
                </div>
                <div style={{margin: "20px"}}>
                    <div className="ui ordered list">
                        {team.map((player) => (
                            <a key={player.name} className={"item"} title={"Click to remove"} onClick={() => (this.props.toggle) ? this.props.toggle(player) : undefined}>
                                <span style={{ width: "200px", display:"inline-block", textAlign: "left" }} >
                                    <img className={"ui avatar image"} src={player.picture} onError={this.onError.bind(this)}  />
                                    {player.name}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
                { (team.length > 0) ? <a className={"item"} style={{color: "#2d2d2d", cursor: "pointer"}} onClick={this.props.onClear}><span style={{ marginRight: "5px", top: "-4px", position: "relative", fontSize: "8px" }}>x</span>Clear</a> : ""}
            </div>
        );
    }

    render(){
        return (
            <h2 className="ui header" style={{margin: "10px", width:"50%"}}>
                {this.props.title}
                <div className="sub header">Selected players for this team {this.teamDetails(this.props.team)}</div>
            </h2>
        );
    }
}