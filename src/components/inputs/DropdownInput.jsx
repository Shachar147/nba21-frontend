import React from "react";
import PropTypes from "prop-types";

const DropdownInput = (props) => {

    // params
    const {
        options,
        selectedOption,
        disabled,
        placeholder,
        sort,
        label,
        style,
        width,

        onChange,

        idKey,
        valueKey,
        nameKey,
        sortKey = nameKey,
    } = props;
    const dataTestId = props['data-testid'];

    // build options list, sorted.
    let renderOptions = [...options];
    const applySort = (a,b) => { if (a[sortKey] > b[sortKey]) return 1; else return -1; }
    renderOptions = renderOptions.sort(applySort);
    if (sort && sort === 'desc') renderOptions.reverse();

    // if placeholder, add it to options list.
    if (placeholder){
        const placeHolderOption = { [idKey]: 0, [nameKey]: placeholder, [valueKey]: placeholder };
        renderOptions = [placeHolderOption,...renderOptions];
    }

    // render label if option passed.
    let renderLabel = (!label) ? null : (
        <label style={{ marginRight: "5px" }}>
            {label}
        </label>
    );

    // to disable "console.error Warning useDefault..." message.
    // need this for the tests.
    console.error = () => {};

    const wrapperTestId = (dataTestId) ? `${dataTestId}-wrapper` : undefined;
    const selectedOpt = selectedOption || { [valueKey]: placeholder }
    const renderWidth = width || "100%";
    const renderStyle = {
        width: renderWidth,
        marginBottom:"5px",
        fontSize: "14px",
        cursor: (disabled) ? "default" : "pointer"
    };

    return (
        <div style={style} data-testid={wrapperTestId}>
            {renderLabel}
            <select className="ui search dropdown"
                    style={renderStyle}
                    defaultValue={selectedOpt[valueKey]}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (onChange && value !== placeholder){
                            let option = options.find(opt => (opt[valueKey]) === value);
                            onChange(option);
                        }
                    }}
                    disabled={disabled}
                    data-testid={dataTestId}>
                {
                    (renderOptions.length === 0) ?
                        <option>No Options</option>
                        :
                        renderOptions.map(option => (
                            <option
                                key={option[idKey]}
                                value={option[valueKey]}
                                selected={selectedOpt[valueKey] === option[valueKey]}>
                                    {option[nameKey]}
                            </option>
                        ))
                }
            </select>
        </div>
    );
}

export default DropdownInput;

DropdownInput.propTypes = {
    /**
     * Placeholder option for the dropdown, in case nothing was selected.
     */
    placeholder: PropTypes.string,
    /**
     * Array of hashes representing options for this dropdown.
     *
     * Example:
     * [{"id":"1","name":"Option1","value":"1"},{"id":"2","name":"Option2","value":"2"}]
     */
    options: PropTypes.array.isRequired,
    /**
     * the key of the name inside the option's hash.
     *
     * Example: "name"
     */
    nameKey: PropTypes.string.isRequired,
    /**
     * the key of the value inside the option's hash.
     *
     * Example: "value"
     */
    valueKey: PropTypes.string.isRequired,
    /**
     * the key of the id inside the option's hash.
     * example: "id"
     */
    idKey: PropTypes.string.isRequired,
    /**
     * an optional label that will appear near the dropdown to describe what it is,
     *
     * Example:
     * 'Select Player'
     */
    label: PropTypes.string,
    /**
     * an optional option to set dropdown side.
     */
    width: PropTypes.number,
    /**
     * Optional onChange function
     */
    onChange: PropTypes.func,
    /**
     * optional style property to apply on the wrapper div
     *
     */
    style: PropTypes.object,
    /**
     * should this dropdown be disabled?
     *
     */
    disabled: PropTypes.bool,
};

DropdownInput.defaultProps = {
    options: [],
    nameKey: "name",
    valueKey: "value",
    idKey: "id",
    disabled: false,
};