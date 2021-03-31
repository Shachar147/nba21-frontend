import React from "react";
import PropTypes from "prop-types";

export default class DropdownInput extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedOption: null
        };

        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        if (this.props.selectedOption){
            this.setState({ selectedOption: this.props.selectedOption });
        }
    }

    onChange(e){
        const placeholder = this.props.placeholder || "Select...";
        if (e.target.value !== placeholder){

            // find selected option
            let option = null;
            this.props.options.map((opt) => {
                if (opt[this.props.valueKey] === e.target.value){
                    option = opt;
                    return opt;
                }
            })

            // trigger onChange on parent
            if (this.props.onChange) this.props.onChange(option);
        }
    }

    render() {

        const { style, disabled } = this.props;
        const placeholder = this.props.placeholder;

        const selected = this.state.selectedOption || { [this.props.valueKey]: placeholder };

        const propsOptions = this.props.options || [];

        let options = [];

        if (this.props.placeholder){
            options = [{
                [this.props.idKey]: null,
                [this.props.nameKey]: placeholder,
                [this.props.valueKey]: placeholder
            }]
        }

        const sortKey = this.props.sortKey || this.props.nameKey;
        const sort = this.props.sort || "asc";

        options = options.concat(...propsOptions);

        if (sort === "asc"){
            options = options.sort((a,b) => {  if (a[sortKey] > b[sortKey]) return 1; else return -1; });
        } else {
            options = options.sort((a,b) => {  if (b[sortKey] > a[sortKey]) return 1; else return -1; });
        }

        const width = this.props.width || "100%";

        let label = null;
        if(this.props.label){
            label = (
                <label style={{ marginRight: "5px" }}>
                    {this.props.label}
                </label>
            );
        }

        return (
            <div style={style}>
                {label}
                <select className="ui search dropdown" style={{ width: width, marginBottom:"5px", fontSize: "14px", cursor: (disabled) ? "default" : "pointer" }} defaultValue={selected[this.props.valueKey]} defaultValue={selected[this.props.valueKey]} onChange={this.onChange} disabled={disabled}>
                    {
                        (options.length === 0) ?
                            <option>No Options</option>
                            :
                        options.map((option) => {

                            const key = option[this.props.idKey];
                            const value = option[this.props.valueKey];
                            const name = option[this.props.nameKey];

                            return (
                                <option
                                    key={key}
                                    value={value}
                                    selected={selected[this.props.valueKey] === value}
                                >
                                    {name}
                                </option>
                            )
                        })
                    }
                </select>
            </div>
        );
    }
}

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
    options: PropTypes.object.isRequired,
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
    styles: PropTypes.object,
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