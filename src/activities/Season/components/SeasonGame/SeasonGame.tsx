import React, {useEffect, useState} from "react";
import {observer} from "mobx-react";
import NbaPage from "../../../../components/NbaPage";
import LoadingPage from "../../../../pages/LoadingPage";
import {apiGet} from "../../../../helpers/apiV2";
import {errorTestId} from "../../../../pages/Login/Model";
import style from "../../../../pages/Login/style";

function SeasonGame({ match }: any){

    // Access the parameter from the URL
    const { seasonId } = match.params;

    const [isLoading, setIsLoading] = useState(false);
    const [teamsData, setTeamsData] = useState<Record<string, any> | undefined>(undefined);

    useEffect(() => { loadNextTeams() }, []);

    async function loadNextTeams() {
        setIsLoading(true);
        const nextTeamsResponse = await apiGet(`/records/season/${seasonId}/next-game`);
        setTeamsData(nextTeamsResponse.data);
        setIsLoading(false);
    }

    function goBack(){
        window.location.href = "/season";
    }

    function renderTotals(){
        if (!teamsData?.totals?.totalGames) {
            return null;
        }

        return (
            <span> | <b>Total Played Games:</b> {teamsData.totals.totalPlayedGames}/{teamsData.totals.totalGames} | <b>Remaining Games:</b> {teamsData.totals.remainingGames}</span>
        )
    }

    function renderContent(){
        const team1 = teamsData?.team1?.teamName;
        const team2 = teamsData?.team2?.teamName;
        if (!teamsData) {
            return null;
        }

        console.log("teamsData", teamsData);
        if (!team1 || !team2 || teamsData.isSeasonOver){
            return (
                <style.Error className={"field"} data-testid={errorTestId}>It seems like this season is already over!</style.Error>
            );
        } else {
            return (
                <div className="flex-col gap-4">
                    <span><b>Mode:</b> {teamsData.mode}</span>
                    <span><b>Total Teams:</b> {teamsData.totals.totalTeams} {renderTotals()}</span>
                    <div>
                        {`${team1} vs ${team2}`}
                    </div>
                </div>
            )
        }
        // return (
        //     <div className="flex-column gap-16 align-items-center font-size-16">
        //         <div className="sub cards header content" style={{ width:"100%", bottom: "0px" }}>
        //             Create a new season:
        //             <br/><br/>
        //             <div className="ui link cards centered" style={{ margin: "auto" }}>
        //                 <Card
        //                     name={`${seasonName}<br><span style="color:gray">${teams.length} teams</span>`}
        //                     picture={"/thumbnails/season.png"}
        //                     style={{ width: "160px" }}
        //                 />
        //             </div>
        //         </div>
        //         {renderMessageIfNeeded()}
        //         {renderErrorIfNeeded()}
        //         {renderForm()}
        //         {renderGoBack()}
        //     </div>
        // )
    }

    if (isLoading) {
        return (
            <LoadingPage />
        )
    }

    return (
        <NbaPage renderContent={renderContent} />
    );
}

export default observer(SeasonGame);