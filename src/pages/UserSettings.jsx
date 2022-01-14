import React from "react";
import axios from "axios";
import Logo from "@components/layouts/Logo";
import {apiGet, apiPut} from "@helpers/api";
import Header from "@components/layouts/Header";
import {LOADING_DELAY, UNAUTHORIZED_ERROR} from "@helpers/consts";
import TextInput from "@components/inputs/TextInput";

export default class UserSettings extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            settings: {
                show_inactive_players: 0,
                auto_calc_ot: 0,
                auto_calc_ot_game_length: 0,
            },
            total_finished: 0,
            total_failed: 0,
            total_succeeded:0,
        };

        this.save = this.save.bind(this);
    }

    componentDidMount() {
        this.loadSettings();
    }

    loadSettings(){
        let self = this;
        apiGet(this,
            `/user/settings`,
            function(res) {
                let settings = res.data.data;

                const newState = {};
                settings.forEach((record) => {
                    newState[record.name.toLowerCase()] = record.value;
                })

                self.setState({ settings: newState });
            },
            function(error) {
                console.log(error);
                let req_error = error.message;
                if (error.message.indexOf("401") !== -1) { req_error = UNAUTHORIZED_ERROR; }
                if (error.message.indexOf("400") !== -1) { req_error = "Oops, it seems like no settings loaded :(<Br>It's probably related to a server error" }
                self.setState({ error: req_error });
            },
            function() {
                setTimeout(() => {
                    self.setState({ loaded: true });
                },
                LOADING_DELAY);
            }
        );
    }

    save() {
        const { settings } = this.state;
        const self = this;

        Object.keys(settings).forEach((setting) => {

            apiPut(this,
                `/user/settings/name/${setting.toUpperCase()}`,
                {
                    value: settings[setting],
                },
                function(res) {
                    // updated
                    self.setState({ total_succeeded: self.state.total_succeeded + 1 });
                },
                function(error) {
                    // failed
                    console.log(error);
                    let req_error = error.message;
                    if (error.message.indexOf("401") !== -1) { req_error = UNAUTHORIZED_ERROR; }
                    if (error.message.indexOf("400") !== -1) { req_error = "Oops, it seems like update failed :(<Br>It's probably related to a server error" }
                    self.setState({ error: req_error, total_failed: self.state.total_failed + 1 });
                },
                async function() {
                    await self.setState({ total_finished: self.state.total_finished + 1 });
                    if (self.state.total_finished === Object.keys(self.state.settings).length) {
                        alert ("saved!");
                        self.setState({ total_finished: 0, total_failed: 0, total_succeeded: 0 })
                    }
                }
            );

        });
    }

    render() {

        const settings = {...this.state.settings};
        const { show_inactive_players, auto_calc_ot, auto_calc_ot_game_length } = settings;

        return (
            <div>
                <Header nologo={true} />
                <div className={"ui header cards centered"} style={{ width: "100%", height: "100vh", backgroundColor: "#FAFAFB" }} >
                    <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                        <Logo />
                        <div className="sub cards header content" style={{ width:"100%", bottom: 0, textAlign: "center", fontSize: "20px", fontWeight: "bold" }}>
                            <div className="sub cards header content centered" style={{ width:"100%", bottom: "0px", margin: "auto" }}>
                                Hello! in this page you can configure your personal settings.
                                <br/><br/>

                                <form className="ui form" style={{ padding: "20px 0px", textAlign: "left" }}>
                                    <h4 className="ui dividing header">General Settings</h4>

                                    {/*Inactive Players*/}
                                    {/*<div className="field">*/}
                                    {/*    <div className="ui segment">*/}
                                    {/*        <div className="field">*/}
                                    {/*            <div className="ui toggle checkbox">*/}
                                    {/*                <input*/}
                                    {/*                    type="checkbox"*/}
                                    {/*                    name="do_not_include_inactive"*/}
                                    {/*                    tabIndex="0"*/}
                                    {/*                    checked={!Number(show_inactive_players)}*/}
                                    {/*                    onChange={(e) => {*/}
                                    {/*                        settings.show_inactive_players = (e.target.checked) ? 0 : 1;*/}
                                    {/*                        this.setState({*/}
                                    {/*                            settings*/}
                                    {/*                        })*/}
                                    {/*                    }}*/}
                                    {/*                />*/}
                                    {/*                <label>Do not include inactive players on game modes</label>*/}
                                    {/*            </div>*/}
                                    {/*        </div>*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}

                                    {/*Total Overtimes*/}
                                    <div className="field">
                                        <div className="ui segment">
                                            <div className="field">
                                                <div className="ui toggle checkbox">
                                                    <input
                                                        type="checkbox"
                                                        name="auto_calc_ot"
                                                        tabIndex="0"
                                                        checked={Number(auto_calc_ot)}
                                                        onChange={(e) => {
                                                            settings.auto_calc_ot = (e.target.checked) ? 1 : 0;
                                                            this.setState({
                                                                settings
                                                            })
                                                        }}
                                                    />
                                                    <label>Auto Calculate Total Overtimes</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/*Total Overtimes Game Length*/}
                                    <div className="field" style={{ display: (Number(auto_calc_ot)) ? "block" : "none" }}>
                                        <div className="ui segment">
                                            <label>Default Game Length (for OT calculation)</label>
                                            <div className="field"  style={{ top: "10px", position: "relative" }}>
                                                <div className="ui">

                                                    <TextInput
                                                        name={"auto_calc_ot_game_length"}
                                                        type={"number"}
                                                        inputStyle={{
                                                            width: "90px",
                                                        }}
                                                        value={auto_calc_ot_game_length}
                                                        onChange={(e) => {
                                                            settings.auto_calc_ot_game_length = Math.min(30,Math.max(4,e.target.value));
                                                            this.setState({
                                                                settings
                                                            });
                                                        }}
                                                    />

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>

                                <div className="ui fluid large blue submit button" onClick={this.save}>Save</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}