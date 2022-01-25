import React from "react";
import {LOGO_IMAGE} from "@helpers/consts";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import DropdownInput from "../inputs/DropdownInput";

const Logo = ({ maxWidth = 400 }) => (
    <div>
        <Link to={"/"}>
            <img src={LOGO_IMAGE} style={{ width: "80%", maxWidth: maxWidth }} />
        </Link>
    </div>
);

DropdownInput.propTypes = {
    /**
     * Optional option to set max width for logo
     */
    maxWidth: PropTypes.number,
};

DropdownInput.defaultProps = {
};

export default Logo;