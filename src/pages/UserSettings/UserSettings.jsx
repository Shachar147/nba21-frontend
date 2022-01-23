import React, {useState, useEffect} from "react";
import axios from "axios";
import Logo from "@components/layout/Logo";
import {apiGet, apiPut} from "@helpers/api";
import Header from "@components/layout/Header";
import {LOADING_DELAY, UNAUTHORIZED_ERROR} from "@helpers/consts";
import TextInput from "@components/inputs/TextInput";

const UserSettings = () => {

    const defaultSettings = {
        show_inactive_players: 0,
        auto_calc_ot: 0,
        auto_calc_ot_game_length: 0,
    };

    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(undefined);
    const [settings, setSettings] = useState(defaultSettings);
    const [totalFinished, setTotalFinished] = useState(0);
    const [totalFailed, setTotalFailed] = useState(0);
    const [totalSucceeded, setTotalSucceedded] = useState(0);

    useEffect(() => {
        loadSettings();
    },[])

    const loadSettings = () => {
        apiGet(this,
            `/user/settings`,
            function(res) {
                let settings = res.data.data;
                const loadedSettings = {};
                settings.forEach((record) => {
                    loadedSettings[record.name.toLowerCase()] = record.value;
                })
                setSettings(loadedSettings);
            },
            function(error) {
                console.log(error);
                let req_error = error.message;
                if (error.message.indexOf("401") !== -1) { req_error = UNAUTHORIZED_ERROR; }
                if (error.message.indexOf("400") !== -1) { req_error = "Oops, it seems like no settings loaded :(<Br>It's probably related to a server error" }
                setError(req_error);
            },
            function() {
                setTimeout(() => { setLoaded(true); }, LOADING_DELAY);
            }
        );
    }

    const save = () => {

        Object.keys(settings).forEach((setting) => {

            apiPut(this,
                `/user/settings/name/${setting.toUpperCase()}`,
                {
                    value: settings[setting],
                },
                function(res) {
                    // updated
                    setTotalSucceedded(totalSucceeded + 1);
                },
                function(error) {
                    // failed
                    console.log(error);
                    let req_error = error.message;
                    if (error.message.indexOf("401") !== -1) { req_error = UNAUTHORIZED_ERROR; }
                    if (error.message.indexOf("400") !== -1) { req_error = "Oops, it seems like update failed :(<Br>It's probably related to a server error" }
                    setError(req_error);
                    setTotalFailed(totalFailed + 1);
                },
                async function() {
                    setTotalFinished(totalFinished + 1);
                    if (totalFinished === Object.keys(settings).length) {
                        alert ("saved!");
                        setTotalFinished(0);
                        setTotalFailed(0);
                        setTotalSucceedded(0);
                    }
                }
            );

        });
    }

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
                                <h4 className="ui dividing header" data-testid={"general-settings"}>General Settings</h4>

                                {/*Total Overtimes*/}
                                <div className="field">
                                    <div className="ui segment">
                                        <div className="field">
                                            <div className="ui toggle checkbox">
                                                <input
                                                    type="checkbox"
                                                    name="auto_calc_ot"
                                                    tabIndex="0"
                                                    checked={Number(settings.auto_calc_ot) === 1}
                                                    onChange={(e) => {
                                                        setSettings({
                                                            ...settings,
                                                            auto_calc_ot: (e.target.checked) ? 1 : 0
                                                        });
                                                    }}
                                                    data-testid={"auto-calc-ot"}
                                                />
                                                <label>Auto Calculate Total Overtimes</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/*Total Overtimes Game Length*/}
                                <div className="field" style={{ display: (Number(settings.auto_calc_ot)) ? "block" : "none" }}>
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
                                                    value={settings.auto_calc_ot_game_length}
                                                    onChange={(e) => {
                                                        setSettings({
                                                            ...settings,
                                                            auto_calc_ot_game_length: Math.min(30,Math.max(4,e.target.value))
                                                        });

                                                    }}
                                                    data-testid={"default-game-length"}
                                                />

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>

                            <div data-testid={"submit"} className="ui fluid large blue submit button" onClick={save}>Save</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserSettings;