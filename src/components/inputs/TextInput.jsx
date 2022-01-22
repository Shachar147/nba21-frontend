import React from "react";
import PropTypes from "prop-types";

const TextInput = (props) => {

    const {
        containerStyle,
        disabled,
        error,
        icon,
        inputStyle,
        label,
        name,
        onChange,
        onKeyDown,
        onKeyUp,
        placeholder,
        type,
        value,
    } = props;

    let {
        labelStyle
    } = props;

    // data-test-ids
    const inputTestId = props['data-testid'];
    const containerTestId = (inputTestId) ? `${inputTestId}-container` : undefined;
    const iconTestId = (inputTestId) ? `${inputTestId}-icon` : undefined;
    const labelTestId = (inputTestId) ? `${inputTestId}-label` : undefined;

    // styles
    const style = { width: "100%", border: (error) ? "1px solid #F10B45" : undefined, ...inputStyle};
    const defaultLabelStyle = { marginRight: "5px", lineHeight: "38px" };
    const subContainerStyle = { width: "100%", marginBottom: "10px" };
    labelStyle = {...labelStyle, ...defaultLabelStyle };

    // build blocks
    const icon_block = (!icon) ? undefined : (<i data-testid={iconTestId} className={`${icon} icon`} />);
    const label_block = (!label) ? undefined : (<label style={labelStyle} data-testid={labelTestId}>{label}</label>);

    const className = `ui left input ${ (icon) ? `icon` : '' }`;

    return (
        <div className="field" style={containerStyle} data-testid={containerTestId}>
            <div className={className} style={subContainerStyle}>
                {label_block}
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
                    data-testid={inputTestId}
                />
            </div>
        </div>
    );
}

export default TextInput;

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
    /**
     * optional inputStyle object for styling the input.
     */
    inputStyle: PropTypes.object,
    /**
     * optional containerStyle object for styling the container.
     */
    containerStyle: PropTypes.object,
    /**
     * optional labelStyle object for styling the label.
     */
    labelStyle: PropTypes.object,
};

TextInput.defaultProps = {
    disabled: false,
    type: "text",
    name: null,
    placeholder: null,
    error: false,
    value: '',
    onChange: null,
    onKeyDown: null,
    inputStyle: {},
    labelStyle: {},
    containerStyle: {},
};