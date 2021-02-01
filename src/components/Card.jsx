import React from "react";
import {Link} from "react-router-dom";

export default function Card(props) {
    let className = "card";
    if (props.className){
        className += ' ' + props.className;
    }

    let alt = props.name;

    let style = props.style || {};
    if (props.disabled){
        style.opacity = "0.5";
        className += " disabled";
        alt += " (not available yet)"
    }

    return (
        <div className={className}
             style={style}>
            <div className="image">
                <Link to={props.href} title={alt}  className={"image"} style={{ display: "block", width: "100%", position:"relative" }} disabled={props.disabled}>
                    <img src={props.picture} alt={alt} style={{ width: "60%" }} />
                </Link>
            </div>
            <div className="content">
                <Link to={props.href} disabled={props.disabled}><div className="description" dangerouslySetInnerHTML={{__html: props.name}} /></Link>
            </div>
        </div>
    );
}