import React from "react";
import PropTypes from "prop-types";

const SearchInput = (props) => {
    const dataTestId = props["data-testid"] || undefined;

    return (
        <div className="ui link cards" style={{ margin: "auto", marginBottom: "5px" }}>
            <div className="ui icon input" style={{ margin: "auto", width: "40%" }}>
                <input type="text" placeholder="Search..." onKeyUp={props.onKeyUp} data-testid={dataTestId} />
                <i className="search icon" />
            </div>
        </div>
    );
}

SearchInput.propTypes = {
    /**
     * optional onKeyUp callback for the search input, usually used to do something with the search keyword.
     */
    onKeyUp: PropTypes.func,
};

SearchInput.defaultProps = {
};

export default SearchInput;