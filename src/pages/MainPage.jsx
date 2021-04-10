import React from "react";
import Header from "../components/layouts/Header";
import Logo from "../components/layouts/Logo";
import Card from "../components/Card";

export default class MainPage extends React.Component {

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
                                    name={"Three Points Contest"}
                                    picture={"/thumbnails/3pointsContest.png"}
                                    style={{ width: "160px" }}
                                    href={"/three-points"}
                                />
                                <Card
                                    name={"Season"}
                                    picture={"/thumbnails/season.png"}
                                    style={{ width: "160px" }}
                                    href={"/"} // todo complete
                                    disabled={true}
                                    disabledAltAddition={"(not available yet)"}
                                />
                                <Card
                                    name={"Tournament"}
                                    picture={"/thumbnails/tournament.png"}
                                    style={{ width: "160px" }}
                                    href={"/"} // todo complete
                                    disabled={true}
                                    disabledAltAddition={"(not available yet)"}
                                />
                                <Card
                                    name={"Random"}
                                    picture={"/thumbnails/random.png"}
                                    style={{ width: "160px" }}
                                    href={"/random"}
                                />
                                <Card
                                    name={"One on One"}
                                    picture={"/thumbnails/1on1.png"}
                                    style={{ width: "160px" }}
                                    href={"/1on1"}
                                />
                                <Card
                                    name={"Stopwatch Shootout"}
                                    picture={"/thumbnails/stopwatch.png"}
                                    style={{ width: "160px" }}
                                    href={"/shootout"} // todo complete
                                    // disabled={true}
                                    disabledAltAddition={"(not available yet)"}
                                />
                                <Card
                                    name={"View Teams & Players"}
                                    picture={"/thumbnails/teamsNplayers.png"}
                                    style={{ width: "160px" }}
                                    href={"/"} // todo complete
                                    disabled={true}
                                    disabledAltAddition={"(not available yet)"}
                                />

                                <Card
                                    name={"AllStar Weekend"}
                                    picture={"/thumbnails/allstar.png"}
                                    style={{ width: "160px" }}
                                    href={"/"} // todo complete
                                    disabled={true}
                                    disabledAltAddition={"(not available yet)"}
                                />
                                <Card
                                    name={"Space Jam Eddition"}
                                    picture={"/thumbnails/tunesquad.png"}
                                    style={{ width: "160px" }}
                                    href={"/"} // todo complete
                                    disabled={true}
                                    disabledAltAddition={"(not available yet)"}
                                />

                                <Card
                                    name={"View Real Data"}
                                    picture={"/thumbnails/real.png"}
                                    style={{ width: "160px" }}
                                    href={"/real"}
                                />

                                {/*<Card*/}
                                {/*    name={"Sync"}*/}
                                {/*    picture={"/thumbnails/sync.png"}*/}
                                {/*    style={{ width: "160px" }}*/}
                                {/*    href={"/sync"}*/}
                                {/*/>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

MainPage.propTypes = {

};

MainPage.defaultProps = {

};