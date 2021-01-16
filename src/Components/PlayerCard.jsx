import React from "react";

const PlayerCard = (props) => {

    const details = [];
    if (props.percents) details.push("3Pt Percents: " + props.percents);
    if (props.height_meters) details.push("Height: " + props.height_meters + " meters");
    if (props.weight_kgs) details.push("Weight: " + props.weight_kgs + " kgs")

    const fallback_image = 'https://nba-players.herokuapp.com/players/' + props.name.replace(".","").split(' ').reverse().join('/');
    const picture = props.picture || fallback_image;

    const debut_year = props.debut_year || "N/A";

    function addDefaultSrc(ev){
        ev.target.src = ev.target.fallback;
    }

    return (
        <div className="card">
            <div className="image">
                <img src={picture} fallback={fallback_image} onError={addDefaultSrc} alt={props.name} />
            </div>
            <div className="content">
                <div className="header">{props.name}</div>
                <div className="meta">
                    <a href="/">
                        {props.team}
                    </a>
                </div>
                <div className="description" dangerouslySetInnerHTML={{ __html: details.join("<br/>")}} />
            </div>
            <div className="extra content">
                <span className="right floated">Joined in {debut_year}</span>
                <span>
                    <i className="user icon" />
                    Position: {props.position}
                </span>
            </div>
        </div>
    );
};

export default PlayerCard;