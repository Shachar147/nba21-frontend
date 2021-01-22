import React from "react";

export default class LoadingPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {

        const title = this.props.title || "Loading";
        const message = this.props.message || "Please wait while loading...";

        return (
            <div className={"ui header cards centered"} style={{ width: "100%", height: "100vh", backgroundColor: "#F0F0F0" }} >
                <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundImage: `url("/loading.gif")`, width: "800px", height: "600px" }}>
                    <div className="sub header content" style={{ width:"100%", bottom: "20%", textAlign: "center", position: "absolute", fontSize: "20px", fontWeight: "bold" }}>
                        <div className="header">
                            {title}
                        </div>
                        <p style={{ fontWeight: "normal" }} dangerouslySetInnerHTML={{ __html: message }} />
                    </div>
                </div>
            </div>
        );
    }
}