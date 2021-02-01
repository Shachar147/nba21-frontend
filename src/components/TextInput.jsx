import React from "react";
import {isDefined} from "../helpers/utils";

export default function TextInput(props) {

    let { disabled, type, name, placeholder, error, value, onChange, onKeyDown} = props;

    if(!isDefined(type)) type = "text";


    const style = (error) ? { width: "100%", "border":"1px solid #F10B45"} : { width: "100%" };

    return (
        <div className="field">
            <div className="ui left icon input" style={{ width: "100%", marginBottom: "10px" }}>
                <i className="lock icon" />
                <input
                    disabled={disabled}
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    style={style}
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                />
            </div>
        </div>
    );
}