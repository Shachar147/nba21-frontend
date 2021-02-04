import React from "react";
import PropTypes from "prop-types";

export default function ButtonInput(props) {
    let { style, text, onClick, disabled } = props;

    return (
        <button className={"ui button basic blue"} style={style} onClick={onClick} disabled={disabled}>
            {text}
        </button>
    );
}

ButtonInput.propTypes = {
    /**
     * Which text should we display for this button?
     */
    text: PropTypes.string.isRequired,
    /**
     * Custom style for this button. could be margin settings, fontSize or any other style setting.
     */
    style: PropTypes.object,
    /**
     * Is this button disabled?
     */
    disabled: PropTypes.bool,
    /**
     * Optional click handler
     */
    onClick: PropTypes.func,
};

ButtonInput.defaultProps = {
    style: undefined,
    disabled: false,
    onClick: undefined,
};