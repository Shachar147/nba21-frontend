import React from "react";
import PropTypes from "prop-types";
import {LOST_X_IMAGE} from "@helpers/consts";

const LostImage = ({ show, alt, style, className }) => {

    if (!show) return "";

    // defaults
    style = style || { position: "absolute", top: "-30px", zIndex:"9999999"};
    alt = alt || "lost";

    return (
        <img className={`lost-image ${className}`} style={style} alt={alt} title={alt} src={LOST_X_IMAGE} data-testid={"lost-image"} />
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

export default LostImage;