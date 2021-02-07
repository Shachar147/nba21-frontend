import React from "react";
import PropTypes from "prop-types";
import {LOST_X_IMAGE} from "../../helpers/consts";

export default function LostImage(props) {
    let { show, alt, style, className } = props;

    style = style || { position: "absolute", top: "-30px", zIndex:"9999999"};
    alt = alt || "lost";
    const classNames = `lost-image ${className}`;

    if (!show){
        return "";
    }

    return (
        <img className={classNames} style={style} alt={alt} title={alt} src={LOST_X_IMAGE} />
    )
}

LostImage.propTypes = {
    /**
     * Should we show this component?
     */
    show: PropTypes.bool.isRequired,
    /**
     * Optional alt value
     */
    alt: PropTypes.string,
    /**
     * Custom style for this component. could be margin settings, sizing or any other style setting.
     */
    style: PropTypes.object,
    /**
     * optional className property to add to the default 'lost-image' className.
     */
    className: PropTypes.string,
};

LostImage.defaultProps = {
    show: true,
    alt: "lost"
};