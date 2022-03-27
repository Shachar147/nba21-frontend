import React from "react";
import PropTypes from "prop-types";

const RadioButtonGroup = (props) => {
    const dataTestId = props["data-testid"] || undefined;

    const { options, onChange, label, selectedValue, name } = props;
    if (!options) return;

    const labelBlock = (label) ?
        (
            <label style={{ paddingInlineEnd: "15px" }}>{label + ":"}</label>
        ) : undefined;

    return (
        <div className="ui link cards" style={{ margin: "auto", marginBottom: "5px", justifyContent: "center", width: "100%" }}>
            {labelBlock}
            <div>
                {
                    options.map((option) => {
                            return (
                                <div style={{ display:"inline", paddingInlineEnd: "8px" }}>
                                    <input type="radio" name={name} value={option.value} checked={option.value === selectedValue} onChange={(e) => { onChange(e)}}/>
                                    <label style={{ paddingInlineStart: "5px", top: "-2px", position: "relative" }}>{option.label}</label>
                                </div>
                            );
                        }
                    )
                }
            </div>
        </div>
    );
}

const RadioButtonOption = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
};

RadioButtonGroup.propTypes = {
    /**
     * optional onChange callback for the radio button input, usually used to do something once value changes.
     */
    onChange: PropTypes.func,

    /**
     * required options array - for the radio inputs.
     */
    options: PropTypes.arrayOf(
        PropTypes.shape(RadioButtonOption)
    ).isRequired,

    /**
     * optional label to be displayed before the radio buttons group.
     */
    label: PropTypes.string,
};

RadioButtonGroup.defaultProps = {
};

export default RadioButtonGroup;