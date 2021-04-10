import React from "react";
import Header from "../../components/layouts/Header";
import Logo from "../../components/layouts/Logo";
import Card from "../../components/Card";

export default class Real extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {

        return (
            <div>
                <Header nologo={true} />
                <div className={"ui header cards centered"} style={{ width: "100%", height: "100vh", backgroundColor: "#FAFAFB" }} >
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                        <Logo />
                        <div className="sub cards header content" style={{ width:"100%", bottom: "0px" }}>
                            Hello! Choose the activity you want to use:
                            <br/><br/>
                            <div className="ui link cards centered" style={{ margin: "auto" }}>

                                <Card
                                    name={"View Teams & Players"}
                                    picture={"/thumbnails/teamsNplayers.png"}
                                    style={{ width: "160px" }}
                                    href={"/real"} // todo complete
                                    disabled={true}
                                    disabledAltAddition={"(not available yet)"}
                                />

                                <Card
                                    name={"Inactive Players"}
                                    picture={"/thumbnails/inactive2.png"}
                                    style={{ width: "160px" }}
                                    href={"/real/inactive"}
                                />

                                <Card
                                    name={"Injured Players"}
                                    picture={"/thumbnails/injured.png"}
                                    style={{ width: "160px" }}
                                    href={"/real/injured"}
                                />

                                <Card
                                    name={"View Real Stats"}
                                    picture={"/thumbnails/stats.png"}
                                    style={{ width: "160px" }}
                                    href={"/real/stats"}
                                />

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Real.propTypes = {

};

Real.defaultProps = {

};