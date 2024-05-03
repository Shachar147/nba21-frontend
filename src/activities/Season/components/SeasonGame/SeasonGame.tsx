import React, {useEffect, useState} from "react";
import {observer} from "mobx-react";
import NbaPage, {renderSmallLogo} from "../../../../components/NbaPage";
import LoadingPage from "../../../../pages/LoadingPage";
import {apiGet} from "../../../../helpers/apiV2";
import {errorTestId} from "../../../../pages/Login/Model";
import style from "../../../../pages/Login/style";
import {Player, SeasonGameTeam, Team} from "../../utils/interfaces";
import PlayerCard from "../../../../components/PlayerCard";
import {styles} from "../../../Tournament/Tournament";
import {PLAYER_NO_PICTURE} from "../../../../helpers/consts";
import {getClasses, getPlayerShortenPosition} from "../../../../helpers/utils";
import ButtonInput from "../../../../components/inputs/ButtonInput";
import './SeasonGame.scss';
import TextInput from "../../../../components/inputs/TextInput";

function SeasonGame({ match }: any){

    // Access the parameter from the URL
    const { seasonId } = match.params;

    const [settings, setSettings] = useState(undefined);

    const [showStats, setShowStats] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [allTeamsById, setAllTeamsById] = useState<Record<number, Team>>({})
    const [teamsData, setTeamsData] = useState<Record<string, any> | undefined>(undefined);

    const [scores, setScores] = useState({});
    const [totalOvertimes, setTotalOvertimes] = useState(false);
    const [isComeback, setIsComeback] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => { init(); }, [])

    async function init() {
        setIsLoading(true);
        await Promise.all([loadNextTeams(), loadAllTeams(), loadUserSettings()]);
        setIsLoading(false);
    }

    async function loadAllTeams() {
        const teamsResponse = await apiGet("/team");
        const _teams: Team[] = teamsResponse.data.data;
        const allTeamsById: Record<number, Team> = {};
        _teams.forEach((team: Team) => {
            allTeamsById[team.id] = team;
        })
        setAllTeamsById(allTeamsById);
    }

    async function loadNextTeams() {
        const nextTeamsResponse = await apiGet(`/records/season/${seasonId}/next-game`);
        setTeamsData(nextTeamsResponse.data);

        const team1Name = nextTeamsResponse.data.team1.teamName;
        const team2Name = nextTeamsResponse.data.team2.teamName;
        scores[team1Name] = 0;
        scores[team2Name] = 0;
        setScores(scores);
    }

    async function loadUserSettings(){
        const res = await apiGet('/user/settings');
        const data = res.data.data;
        let settings = {};
        data.forEach((setting) => {
            settings[setting.name.toLowerCase()] = setting.value;
        });
        // console.log(settings);
        setSettings(settings)
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

    function calcOT(){
        const { auto_calc_ot_game_length } = settings;

        const { team1, team2 } = teamsData;

        let val = Math.max(scores[team1.teamName], scores[team2.teamName]);
        let total_overtimes = 0;
        while (val >= Number(auto_calc_ot_game_length) + 2) {
            val -= 2;
            total_overtimes++;
        }
        // console.log("total overtimes: ",total_overtimes);
        setTotalOvertimes(total_overtimes)
    }

    function renderSeasonGame(){
        if (!teamsData) {
            return null;
        }

        const team1: SeasonGameTeam = teamsData.team1;
        const team2: SeasonGameTeam = teamsData.team2;

        if (!team1 || !team2 || teamsData.isSeasonOver){
            return (
                <style.Error className={"field"} data-testid={errorTestId}>It seems like this season is already over!</style.Error>
            );
        }
        const blocks =
            [team1, team2].map((seasonGameTeam, idx) => {
                const { teamId } = seasonGameTeam;
                const team: Team = allTeamsById[teamId];

                const _2k_rating = team['_2k_rating'] || 'N/A';
                let custom_details: string[] = [];
                const original_custom_title = "<div style='border-top:1px solid #eaeaea; width:100%; margin: 10px 0; padding-top: 10px;'>Players:</div>";
                const curr_custom_details_title = `2K Rating: ${_2k_rating}` + original_custom_title;

                team.players.forEach((player) => {
                    player["rate"] = (player["_2k_rating"]) ? Number(player["_2k_rating"]) : "N/A";;
                })

                const arr = team.players.sort((a,b) => {

                    let rate1 = (a["rate"] === "N/A") ? 0 : Number(a["rate"]);
                    let rate2 = (b["rate"] === "N/A") ? 0 : Number(b["rate"]);

                    return rate2 - rate1;
                }).map((x: Player) => {
                    return (
                        `<div>
                            <img class="ui avatar image" src=${x.picture} onError="this.src='${PLAYER_NO_PICTURE}';" style="width: 39px;" />
                            <span>${x.name} <span style='opacity:0.6;'>(${getPlayerShortenPosition(x.position)})</span> <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: ${x.rate}</span></span>
                        </div>`
                    )
                });
                custom_details = [custom_details.concat(...arr).join("")];

                return (
                    <PlayerCard
                        Key={idx}
                        className={"in-game"}
                        style={{ cursor: "default", textAlign: "left" }}
                        styles={styles}
                        name={team.name}
                        picture={team.logo}
                        team_division={(team.conference && team.division) ? team.division + " (" + team.conference + ")" : undefined}
                        custom_details_title={curr_custom_details_title}
                        custom_details={custom_details}
                        // stats={{
                        //     win_streak: stats[team.name]?.win_streak || "0",
                        //     max_win_streak: stats[team.name]?.max_win_streak || "0",
                        //     lose_streak: stats[team.name]?.lose_streak || "0",
                        //     max_lose_streak: stats[team.name]?.max_lose_streak || "0",
                        // }}

                        onChange={async (e) => {
                            scores[team.name] = Number(Math.max(0,e.target.value));
                            setScores({...scores});

                            if (Number(settings.auto_calc_ot)) {
                                calcOT();
                            }
                        }}
                        singleShot={scores[team.name]}

                        // todo complete:
                        // lost={(this.state.saved && this.state.loser === team.name)}
                        // winner={(this.state.saved && this.state.winner === team.name)}

                        // todo complete:
                        // all_players={this.state.players}
                        // curr_players={[this.state.player1.name, this.state.player2.name]}

                        // todo complete:
                        // onImageClick={(e) => {
                        //
                        //     const target = e.target;
                        //     const html = $(e.target).wrap("<p>").parent().html();
                        //     // console.log(html);
                        //     // to avoid clicking on 'replace' or 'specific rpelace' from openning stats page.
                        //     if (html.indexOf('View Stats') !== -1 && get_stats_specific_route) {
                        //         this.setState({
                        //             selected_player: team.name,
                        //         })
                        //     }
                        //
                        // }}
                    />
                );
            });

        return (
            <div className="ui link cards centered stats-container font-size-14 margin-top-20 position-relative flex-row gap-8">
                {renderHomeGuestHeaders()}
                <div className="ui link cards centered display-flex gap-4">
                    {blocks[0]}
                    {renderSaveButton()}
                    {blocks[1]}
                </div>
                {renderPreSaveBlocks()}
            </div>
        )
    }

    function renderSaveButton(){
        return (
            <ButtonInput
                text={"Save"}
                classList={"save-button"}
                onClick={() => {
                    alert("todo complete");
                }}
            />
        );
    }

    function renderHeaderButtons() {
        return (
            <>
                <ButtonInput
                    text={"Different Game"}
                    style={{marginLeft: "5px"}}
                    onClick={() => {
                        window.location.reload();
                    }}
                />
                <ButtonInput
                    text={"View Stats"}
                    style={{marginLeft: "5px"}}
                    onClick={() => {
                        alert("todo complete");
                        // use stats not window.location.reload, to allow looking at stats while playing without loosing current game.
                    }}
                />
            </>
        )
    }

    function renderStats(){
        return (
            <div className="ui link cards centered stats-container font-size-14 margin-top-20 position-relative">
                {!!teamsData && <span><b>Mode:</b> {teamsData.mode}</span>}
                <br/><br/>
                <a className="show-hide-stats" onClick={() => setShowStats(!showStats)}>{showStats ? "Hide Stats" : "Show Stats"}</a>
                <div className={getClasses("width-100-percents", showStats ? 'display-block' : 'display-none')}>
                    stats
                    {/*<div style="width: 100%; text-align: center; margin-bottom: 10px;">*/}
                    {/*    <div className="ui header"*/}
                    {/*         style="width: 100%; text-align: center; margin-bottom: 0px;">Tournament Stats*/}
                    {/*    </div>*/}
                    {/*    <div style="display: block; width: 100%; text-align: center;">*/}
                    {/*        <ul style="padding: 0px;">*/}
                    {/*            <li style="list-style: none;"><b>Today: </b>Games: 0 | Points: 0<br><b>Totals: </b>Games:*/}
                    {/*                6 | Points: 52</li>*/}
                    {/*            <table className="ui celled table">*/}
                    {/*                <thead>*/}
                    {/*                <tr>*/}
                    {/*                    <th></th>*/}
                    {/*                    <th>Days with most games</th>*/}
                    {/*                    <th>Days with most points</th>*/}
                    {/*                </tr>*/}
                    {/*                </thead>*/}
                    {/*                <tbody>*/}
                    {/*                <tr>*/}
                    {/*                    <td style="font-weight: bold;">#1</td>*/}
                    {/*                    <td>24/04/2024 - 3</td>*/}
                    {/*                    <td>24/04/2024 - 33</td>*/}
                    {/*                </tr>*/}
                    {/*                <tr>*/}
                    {/*                    <td style="font-weight: bold;">#2</td>*/}
                    {/*                    <td>23/04/2024 - 3</td>*/}
                    {/*                    <td>23/04/2024 - 19</td>*/}
                    {/*                </tr>*/}
                    {/*                </tbody>*/}
                    {/*            </table>*/}
                    {/*        </ul>*/}
                    {/*    </div>*/}
                    {/*</div>*/}


                    {/*<div style="width: 100%; text-align: center; margin-bottom: 10px;">*/}
                    {/*    <div className="ui header"*/}
                    {/*         style="width: 100%; text-align: center; margin-bottom: 0px; margin-top: 10px;">Previous*/}
                    {/*        Matchups Stats*/}
                    {/*    </div>*/}
                    {/*    <div style="display: block; width: 100%; text-align: center;">*/}
                    {/*        <ul style="padding: 0px;">*/}
                    {/*            <li style="list-style: none;">These teams met each other 1 time.</li>*/}
                    {/*            <table className="ui celled table">*/}
                    {/*                <thead>*/}
                    {/*                <tr>*/}
                    {/*                    <th></th>*/}
                    {/*                    <th>Miami Heat</th>*/}
                    {/*                    <th>LA Clippers</th>*/}
                    {/*                </tr>*/}
                    {/*                </thead>*/}
                    {/*                <tbody>*/}
                    {/*                <tr>*/}
                    {/*                    <td style="font-weight: bold;">Wins</td>*/}
                    {/*                    <td>1</td>*/}
                    {/*                    <td>0</td>*/}
                    {/*                </tr>*/}
                    {/*                <tr>*/}
                    {/*                    <td style="font-weight: bold;">Total Scored</td>*/}
                    {/*                    <td>10</td>*/}
                    {/*                    <td>0</td>*/}
                    {/*                </tr>*/}
                    {/*                </tbody>*/}
                    {/*            </table>*/}
                    {/*            <a style="cursor: pointer;">Show More</a></ul>*/}
                    {/*    </div>*/}
                    {/*</div>*/}


                    {/*<div style="width: 100%; text-align: center; margin-bottom: 10px;">*/}
                    {/*    <div className="ui header"*/}
                    {/*         style="width: 100%; text-align: center; margin-bottom: 0px; margin-top: 10px;">Teams*/}
                    {/*        Individual Stats*/}
                    {/*    </div>*/}
                    {/*    <div style="display: block; width: 100%; text-align: center;">*/}
                    {/*        <ul style="padding: 0px;">*/}
                    {/*            <li style="list-style: none;"></li>*/}
                    {/*            <table className="ui celled table">*/}
                    {/*                <thead>*/}
                    {/*                <tr>*/}
                    {/*                    <th></th>*/}
                    {/*                    <th>Miami Heat</th>*/}
                    {/*                    <th>LA Clippers</th>*/}
                    {/*                </tr>*/}
                    {/*                </thead>*/}
                    {/*                <tbody>*/}
                    {/*                <tr>*/}
                    {/*                    <td style="font-weight: bold;">Total Played Games</td>*/}
                    {/*                    <td>2</td>*/}
                    {/*                    <td>1</td>*/}
                    {/*                </tr>*/}
                    {/*                <tr>*/}
                    {/*                    <td style="font-weight: bold;">Standing</td>*/}
                    {/*                    <td>2W 0L 100.00%</td>*/}
                    {/*                    <td>0W 1L 0.00%</td>*/}
                    {/*                </tr>*/}
                    {/*                <tr>*/}
                    {/*                    <td style="font-weight: bold;">Current Win Streak</td>*/}
                    {/*                    <td>2</td>*/}
                    {/*                    <td>0</td>*/}
                    {/*                </tr>*/}
                    {/*                </tbody>*/}
                    {/*            </table>*/}
                    {/*            <a style="cursor: pointer;">Show More</a></ul>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                </div>
            </div>
        )
    }

    function renderHomeGuestHeaders(){
        const titleStyle = {
            margin: 0,
            padding: 0,
            backgroundColor: "transparent",
            boxShadow: "none",
            fontWeight: "bold",
            fontSize: "18px",
        }

        return (
            <div className="ui link cards centered flex-row align-items-center margin-top-20">
                <div className={"card in-game"} style={titleStyle}>Guest</div>
                {/*<div style={{ width: 110 }} />*/}
                <div className={"card in-game"} style={titleStyle}>Home</div>
            </div>
        )
    }

    function renderPreSaveBlocks(){
        // <!-- todo complete: remove disabled condition once we will implement update -->

        // comeback
        const comeback_block = (
            <div style={{ paddingBottom: "20px", paddingTop: "20px" }}>
                <div
                    className="ui checkbox"
                >
                    <input type="checkbox" checked={isComeback} onChange={() => setIsComeback(!isComeback)} disabled={isSaved}  />
                    <label>Comeback?</label>
                </div>
            </div>
        );

        // overtime
        const overtime_block = (
            <div style={{ width: "100%", display:"flex", paddingBottom: "10px", }}>
                <label style={{ display: "inline-block", fontWeight:"bold", marginRight: "7px", lineHeight: "38px" }}>Number of Overtimes:</label>
                <div style={{ flexGrow: "100", display: "inline-block" }}>
                    <TextInput
                        name={'total_overtimes'}
                        type={'number'}
                        value={totalOvertimes}
                        placeholder={"0"}
                        disabled={isSaved}
                        onChange={(e) => {
                            setTotalOvertimes(Math.min(20,Math.max(0,Number(e.target.value)) || 0))
                        }}
                    />
                </div>
            </div>
        );

        // mvp
        const mvp_block_html = "";
        // const { player1, player2 } = this.state;
        // const options = (scores[player1.name] > scores[player2.name]) ? player1.players : (scores[player2.name] > scores[player1.name]) ? player2.players : [];
        // mvp_block_html = (
        //     <div className="ui link cards centered" style={{ position:"relative", display: "flex", textAlign: "center", alignItems: "strech", margin: "auto" }}>
        //         <DropdownInput
        //             options={(options)}
        //             name={"select_mvp"}
        //             placeholder={"Select MVP..."}
        //             nameKey={"name"}
        //             sortKey={"rate"}
        //             sort={"desc"}
        //             valueKey={"name"}
        //             idKey={"id"}
        //             style={{ width: "710px", paddingBottom: "15px" }}
        //             disabled={options.length === 0 || this.state.finished}
        //             onChange={(player) => {
        //                 this.setState({ mvp_player: player.name });
        //             }}
        //         />
        //     </div>
        // );

        return (
            <>
                <div className="ui link cards centered" style={{
                    position:"relative", display: "flex", textAlign: "center",
                    width: "710px", alignItems: "strech", margin: "auto"
                }}>
                    {comeback_block}
                </div>

                {mvp_block_html}

                <div className="ui link cards centered" style={{
                    position:"relative", display: "flex", textAlign: "center", alignItems: "strech", margin: "auto", paddingBottom: "20px",
                    width: "710px",
                }}>
                    {overtime_block}
                </div>
            </>
        )
    }

    function renderContent(){
        const team1 = teamsData?.team1?.teamName;
        const team2 = teamsData?.team2?.teamName;
        if (!teamsData) {
            return null;
        }

        if (!team1 || !team2 || teamsData.isSeasonOver){
            return (
                <style.Error className={"field"} data-testid={errorTestId}>It seems like this season is already over!</style.Error>
            );
        } else {
            const home_team_background = allTeamsById[teamsData?.team1?.teamId]?.logo;
            return (
                <>
                    <div className="content flex-column gap-8">
                        {renderSmallLogo()}
                        {renderHeaderButtons()}
                        <div className="display-flex-important flex-column align-items-center">
                            {renderStats()}
                            {renderSeasonGame()}
                        </div>
                    </div>
                    <div className="bg-container" style={{ backgroundImage: `url("${home_team_background}")` }} />
                </>
            )

            // return (
            //     <div className="flex-col gap-4">
            //         <span><b>Total Teams:</b> {teamsData.totals.totalTeams} {renderTotals()}</span>
            //         <div>
            //             {`${team1} vs ${team2}`}
            //         </div>
            //
            //         <div className="ui link cards centered" style={{ margin: "auto" }}>
            //             {renderSeasonGame()}
            //         </div>
            //     </div>
            // )
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
        <div className="season-game">
            <NbaPage renderContent={renderContent} />
        </div>
    );
}

export default observer(SeasonGame);