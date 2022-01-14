import React from "react";
import {PLAYER_NO_PICTURE} from "@helpers/consts";
import ButtonInput from "./inputs/ButtonInput";
import PropTypes from "prop-types";

export default class SelectedPlayers extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    onError (event){
        event.target.src = PLAYER_NO_PICTURE;
    }

    teamDetails (team){
        return (
            <div>
                <div style={{margin: "20px"}}>

                    <ButtonInput
                        text={"+ Random"}
                        style={{ margin:"0px 5px" }}
                        disabled={!this.props.enabled}
                        onClick={this.props.onAddRandom}
                        />
                    <ButtonInput
                        text={"+ Computer"}
                        style={{ margin:"0px 5px" }}
                        disabled={!this.props.enabled}
                        onClick={this.props.onAddComputer}
                    />

                </div>
                <div style={{margin: "20px"}}>
                    <div className="ui ordered list">
                        {team.map((player) => (
                            <a key={player.name} className={"item"} title={"Click to remove"} onClick={() => (this.props.toggle) ? this.props.toggle(player) : undefined}>
                                <span style={{ width: "200px", display:"inline-block", textAlign: "left" }} >
                                    <img className={"ui avatar image"} style={{ height: "1.4em" }} src={player.picture} onError={this.onError.bind(this)}  />
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
        const selected = (
            <h2 className="ui header" style={{margin: "10px", width:"50%"}}>
                {this.props.title}
                <div className="sub header">Selected players for this team {this.teamDetails(this.props.team)}</div>
            </h2>
        );

        if (this.props.wrapper){
            return (
                <div className="ui centered selected-players" style={{ display: "flex", textAlign: "center", alignItems: "strech", margin: "auto", width: "80%", marginBottom: "10px" }}>
                    {selected}
                </div>
                )
        }

        return selected;
    }
}

SelectedPlayers.propTypes = {
    /**
     * Are the buttons enabled or not?
     */
    enabled: PropTypes.bool,
    /**
     * Title for this component.
     *
     * For example - The name of the team you are selecting players to.
     *
     * For example 'Team One', 'Team Two' (on 3pts contents)
     */
    title: PropTypes.string,
    /**
     * selected players objects. array of hashes.
     */
    team: PropTypes.arrayOf(PropTypes.object),
    /**
     * What should happen when clicking on add random button?
     */
    onAddRandom: PropTypes.func,
    /**
     * What should happen when clicking on add computer button?
     */
    onAddComputer: PropTypes.func,
    /**
     * Toggle function when clicking on already selected item from the list
     */
    toggle: PropTypes.func,
    /**
     * What should happen when clicking on clear list?
     */
    onClear: PropTypes.func,
    /**
     * should we wrap this component with a centered div?
     */
    wrapper: PropTypes.bool,
};

SelectedPlayers.defaultProps = {
    enabled: true,
    title: undefined,
    team: [],
    onAddRandom: undefined,
    onAddComputer: undefined,
    toggle: undefined,
    onClear: undefined,
    wrapper: false,
};