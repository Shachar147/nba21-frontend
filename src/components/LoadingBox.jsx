import React from "react";

export default class LoadingBox extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {

        const title = this.props.title || "Loading";
        const message = this.props.message || "Please wait while loading...";

        return (
            <div className={"ui cards centered"} style={this.props.style} >
                <div className={"ui icon message"}  style={{width:"500px"}}>
                    <i className="notched circle loading icon" />
                    <div className="content">
                        <div className="header">
                            {title}
                        </div>
                        <p dangerouslySetInnerHTML={{ __html: message }} />
                    </div>
                </div>
            </div>
        );
    }
}