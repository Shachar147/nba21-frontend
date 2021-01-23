import React from "react";

export default class ErrorBox extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {

        const title = this.props.title || "Error";
        const message = this.props.message || "Oops, something wen't wrong";

        return (
            <div style={this.props.style} >
                <div className="ui negative message">
                    {/*<i className="close icon" />*/}
                    <div className="header">
                        {title}
                    </div>
                    <p dangerouslySetInnerHTML={{ __html: message }} />
                </div>
            </div>
        );
    }
}