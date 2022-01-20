import React from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";

export default function Card(props) {
    let className = "card";
    if (props.className){
        className += ' ' + props.className;
    }

    let alt = props.name;

    let linkStyle = {display: "block", width: "100%", position: "relative"};

    let style = props.style || {};
    if (props.disabled){
        style = {...style, opacity:"0.5"};

        linkStyle = {...linkStyle, cursor:"default" };

        className += " disabled";
        if (props.disabledAltAddition) {
            alt += " " + props.disabledAltAddition;
        }

    }

    const testid = props["data-testid"] || props.name;

    const picture = (props.href) ? (
        <Link to={props.href} title={alt} data-testid={testid} className={"image"} style={linkStyle} disabled={props.disabled}>
            <img src={props.picture} alt={alt} style={{ width: "60%" }} />
        </Link>
    ) : (<div onClick={props.onClick} title={alt} data-testid={testid} className={"image"} style={linkStyle} disabled={props.disabled}>
            <img src={props.picture} alt={alt} style={{ width: "60%" }} />
        </div>);

    const content = (props.href) ? (
        <Link to={props.href} disabled={props.disabled}><div className="description" dangerouslySetInnerHTML={{__html: props.name}} /></Link>
    ) : (
        <div onClick={props.onClick} disabled={props.disabled}><div className="description" dangerouslySetInnerHTML={{__html: props.name}} /></div>
    )

    const card = (
        <div className={className}
             style={style}>
            <div className="image">
                {picture}
            </div>
            <div className="content" style={{ wordBreak: "break-word" }}>
                {content}
            </div>
        </div>
    );

    if (props.wrapper){
        return (
            <div className="ui link cards centered" style={{ margin: "auto", textAlign: "center" }}>
                {card}
            </div>
        )
    }

    return card;
}

Card.propTypes = {
    /**
     * picture for this card.
     *
     * for example game mode picture.
     */
    picture: PropTypes.string.isRequired,
    /**
     * name / title that describes this card.
     *
     * for example game mode name.
     */
    name: PropTypes.string,
    /**
     * option to pass specific class name in addition to the default "card" class.
     */
    className: PropTypes.string,
    /**
     * option to pass specific style for the wrapper div of this card.
     */
    style: PropTypes.object,
    /**
     * is this card disabled? if true, card will be displayed a bit grayed out
     */
    disabled: PropTypes.bool,
    /**
     * option to add suffix to image alt, when disabled.
     *
     * for example: "(not available yet)"
     */
    disabledAltAddition: PropTypes.string,
    /**
     * link to redirect to, when clicking on the image of this card.
     */
    href: PropTypes.string,
    /**
     * onClick function. optional.
     */
    onClick: PropTypes.func,
    /**
     * should we wrap this card with cards wrapper?
     *
     * default is false because usually we would like to print multiple cards under the same wrapper, so we will print the wrapper outside.
     */
    wrapper: PropTypes.bool,
};

Card.defaultProps = {
    // picture: required, no default value
    className: null,
    name: null,
    style: {},
    disabled: false,
    href: null,
    disabledAltAddition: null,
    wrapper: false,
};