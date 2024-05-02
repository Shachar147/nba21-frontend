import React, {useState} from "react";
import Card from "../../../components/Card";
import {observer} from "mobx-react";
import ButtonInput from "../../../components/inputs/ButtonInput";
import NbaPage from "../../../components/NbaPage";
import TextInput from "../../../components/inputs/TextInput";
import SeasonApiService from "../services/SeasonApiService";
import {errorTestId, messageTestId} from "../../../pages/Login/Model";
import style from "../../../pages/Login/style";

function CreateSeason(){

    const [isSaving, setIsSaving] = useState(false);
    const [seasonName, setSeasonName] = useState(`Season ${new Date().getFullYear()}-${Number(new Date().getFullYear().toString().slice(2,4))+1}`);
    const [errorMessage, setErrorMessage] = useState<string|undefined>(undefined);
    const [teams, setTeams] = useState<number[]>([]);
    const [seasonCreated, setSeasonCreated] = useState(false);
    const [isNameError, setIsNameError] = useState(false);

    function goBack(){
        window.location.href = "/season";
    }

    function renderGoBack(){
        return (
            <ButtonInput
                text={"Go Back"}
                className={undefined}
                classList={"width-max-content"}
                onClick={goBack}
            />
        )
    }

    function renderForm() {
        return (
            <form className="flex-column gap-8 align-items-center" onSubmit={submitForm}>
                <TextInput
                    name={"name"}
                    type={"text"}
                    icon={"trophy"}
                    disabled={isSaving}
                    placeholder={"Set Season Name..."}
                    error={!!isNameError}
                    value={seasonName}
                    onChange={(e) => {
                        setSeasonName(e.target.value);
                        setIsNameError(false);
                        setErrorMessage(undefined)
                    }}
                    inputStyle={{
                        fontSize: 16,
                        height: 44
                    }}
                    // onKeyDown={e => onKeyDown(e.keyCode)}
                    data-testid={"automation-create-season-name-input"}
                />
                <ButtonInput
                    text={"Submit Form"}
                    className={"ui blue submit button width-max-content"}
                    onClick={submitForm}
                    classList={undefined}
                    disabled={isSaving}
                />
            </form>
        )
    }

    async function submitForm() {
        setIsSaving(true);
        try {
            await SeasonApiService.createSeason(seasonName, teams)
            setSeasonCreated(true);
            setTimeout(() => goBack(), 1000);
        }
        catch (error: any) {
            setErrorMessage(error?.response?.data?.message);
            setIsNameError(error?.response?.data?.message?.toLowerCase().includes("name"))
        } finally {
            setIsSaving(false);
        }
    }

    function renderMessageIfNeeded() {
        if (!seasonCreated) {
            return undefined;
        }
        return (
            <style.Message className={"field"} data-testid={messageTestId}>{"Season Created!"}</style.Message>
        )
    }

    function renderErrorIfNeeded() {
        if (!errorMessage) {
            return undefined;
        }
        return (
            <style.Error className={"field"} data-testid={errorTestId}>{errorMessage}</style.Error>
        )
    }

    function renderContent(){
        return (
            <div className="flex-column gap-16 align-items-center font-size-16">
                <div className="sub cards header content" style={{ width:"100%", bottom: "0px" }}>
                    Create a new season:
                    <br/><br/>
                    <div className="ui link cards centered" style={{ margin: "auto" }}>
                        <Card
                            name={`${seasonName}<br><span style="color:gray">${teams.length} teams</span>`}
                            picture={"/thumbnails/season.png"}
                            style={{ width: "160px" }}
                        />
                    </div>
                </div>
                {renderMessageIfNeeded()}
                {renderErrorIfNeeded()}
                {renderForm()}
                {renderGoBack()}
            </div>
        )
    }

    return (
        <NbaPage renderContent={renderContent} />
    );
}

export default observer(CreateSeason);