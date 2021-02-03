import React from "react";


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

        const placeholder = this.props.placeholder;

        const selected = this.state.selectedOption || { [this.props.valueKey]: placeholder };

        let options = [];

        if (this.props.placeholder){
            options = [{
                [this.props.idKey]: null,
                [this.props.nameKey]: placeholder,
                [this.props.valueKey]: placeholder
            }]
        }
        options = options.concat(...this.props.options.sort((a,b) => {  if (a[this.props.nameKey] > b[this.props.nameKey]) return 1; else return -1; }));
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
            <div>
                {label}
                <select className="ui search dropdown" style={{ width: width, marginBottom:"5px", fontSize: "14px" }} onChange={this.onChange}>
                    {
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
                        }
                        )
                    }
                </select>
            </div>
        );
    }
}