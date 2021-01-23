import React from "react";
import {Link} from "react-router-dom";
// import PropTypes from 'prop-types';

export default class Card extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};

    }

    render() {
        let className = "card";
        if (this.props.className){
            className += ' ' + this.props.className;
        }

        let alt = this.props.name;

        let style = this.props.style || {};
        if (this.props.disabled){
            style.opacity = "0.5";
            className += " disabled";
            alt += " (not available yet)"
        }

        return (
            <div className={className}
                 style={style}>
                <div className="image">
                    <Link to={this.props.href} title={alt}  className={"image"} style={{ display: "block", width: "100%", position:"relative" }} disabled={this.props.disabled}>
                        <img src={this.props.picture} alt={alt} style={{ width: "60%" }} />
                    </Link>
                </div>
                <div className="content">
                    <Link to={this.props.href} disabled={this.props.disabled}><div className="description" dangerouslySetInnerHTML={{__html: this.props.name}} /></Link>
                </div>
            </div>
        );
    }
}

// Card.propTypes = {
//     name: PropTypes.string,
//     picture: PropTypes.string,
//     description: PropTypes.string,
//
//     className: PropTypes.string,
//     onClick: PropTypes.function,
// };