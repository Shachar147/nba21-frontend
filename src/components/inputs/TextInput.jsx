import React from "react";
import {isDefined} from "@helpers/utils";
import PropTypes from "prop-types";

export default function TextInput(props) {

    let { disabled, type, name, placeholder, error, value, onChange, onKeyDown, icon, containerStyle, label, inputStyle, labelStyle, onKeyUp, testid = name} = props;

    if(!isDefined(type)) type = "text";

    const icon_block = (icon) ? (<i className={`${icon} icon`} />) : null;
    let style = (error) ? { width: "100%", "border":"1px solid #F10B45"} : { width: "100%" };
    if (inputStyle) { style = {...style, ...inputStyle }; }
    let className = "ui left";
    if (icon) className += " icon";
    className += " input"; // must be last, otherwise icon will be right

    labelStyle = labelStyle || {};
    labelStyle = {...{ marginRight: "5px", lineHeight: "38px" }, ...labelStyle};

    if(label){
        label = (
            <label style={labelStyle}>
                {label}
            </label>
        );
    }

    return (
        <div className="field" style={containerStyle}>
            <div className={className} style={{ width: "100%", marginBottom: "10px" }}>
                {label}
                {icon_block}
                <input
                    disabled={disabled}
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    style={style}
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    onKeyUp={onKeyUp}
                    data-testid={testid}
                />
            </div>
        </div>
    );
}

TextInput.propTypes = {
    /**
     * name for this input. for forms for example.
     */
    name: PropTypes.string,
    /**
     * the type of the input
     */
    type: PropTypes.oneOf(['text', 'password', 'number']).isRequired,
    /**
     * is this input disabled?
     */
    disabled: PropTypes.bool,
    /**
     * semantic ui icon to be displayed in the input.
     * use one of these:
     * https://semantic-ui.com/elements/icon.html
     */
    icon: PropTypes.string,
    /**
     * placeholder for this input, for example 'Please enter text...'
     */
    placeholder: PropTypes.string,
    /**
     * should we mark this input with error red border?
     */
    error: PropTypes.bool,
    /**
     * optional onChange callback for the input.
     */
    onChange: PropTypes.func,
    /**
     * optional onKeyDown callback for the input.
     */
    onKeyDown: PropTypes.func,
};

TextInput.defaultProps = {
    disabled: false,
    type: "text",
    name: null,
    placeholder: null,
    error: false,
    value: null,
    onChange: null,
    onKeyDown: null
};