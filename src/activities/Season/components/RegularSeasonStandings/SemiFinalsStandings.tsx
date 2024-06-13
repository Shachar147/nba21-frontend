import React from "react";
import {observer} from "mobx-react";
import {ISeasonGame, NextGameDataResponse, SeasonMode, SeasonStats, Team} from "../../utils/interfaces";
import {winsAndMatchupsSort} from "../../../../helpers/sort";
import StatsTableInner from "../../../../components/StatsTableInner";
import {nth} from "../../../../helpers/utils";
import SeasonGameStore from "../../stores/SeasonGameStore";
import {ON_FIRE_COLOR} from "../../../../helpers/consts";

interface SemiFinalsStandingsProps {
    stats: SeasonStats;
    teamsByName: Record<string, Team>;
    mode: SeasonMode;
    store: SeasonGameStore;
    max?: number;
    teamsData: NextGameDataResponse
}

function SemiFinalsStandings({ stats, teamsData, mode, teamsByName, store, max=8 }: SemiFinalsStandingsProps){

    // get regular season top8 teams:
    const teamStats = {...store.regularSeasonStats};
    Object.keys(teamStats).forEach((teamName) => {
        teamStats[teamName]["teamName"] = teamName;
    });
    const teamsByStanding = Object.values(teamStats).sort(winsAndMatchupsSort);
    const standingStats: Record<string, (number|string)[]> = {};

    // @ts-ignore
    let order: string[] = teamsByStanding.map((s) => s.teamName).slice(0, 8);
    const rOrder = [...order];

    const p = {...store.playoffStats};
    const pSeries = [];
    for (let i = 0; i < 4; i++) {
        if (p[order[i]].total_wins == 4) {
            pSeries.push(p[order[i]].teamName);
        } else {
            pSeries.push(p[order[8-1-i]].teamName);
        }
    }

    // @ts-ignore

    order = pSeries;

    const series: string[] = [];
    const seriesWithLogos: string[] = [];
    pSeries.forEach((team, idx) => {
        if (idx <= max/2 - 1) {

            const team1 = team;
            const team2 = order[order.length - 1 - idx];

            series.push(`${team} vs ${team2}`);
            // @ts-ignore
            // seriesWithLogos.push(`<div style="position:relative;"><div style="position:absolute; top:12.5px;">vs</div><div class="flex-col gap-4" style="position:relative; left:20px;">${getTeamCell(team)}${getTeamCell(team2)}</div></div>`)
            seriesWithLogos.push(`<div style="position:relative;"><div style="position:absolute; top:12.5px;">vs</div><div class="flex-col gap-4" style="position:relative; left:20px;">${getTeamCell(team, stats[team]?.total_wins ?? 0, stats[team2]?.total_wins ?? 0)}${getTeamCell(team2, stats[team2]?.total_wins ?? 0, stats[team]?.total_wins ?? 0)}</div></div>`)
        }
    })

    series.forEach((seriesName, idx) => {
        const teams = seriesName.split(' vs ');
        const team1 = teams[0];
        const team2 = teams[1];

        let w_l = [];
        if (stats[team1]) {
            w_l.push(`${team1} &nbsp;<b><u>${stats[team1].total_wins}W</u></b>`);
        }
        if (stats[team2]) {
            w_l.push(`${team2} &nbsp;<b><u>${stats[team2].total_wins}W</u></b>`);
        }

        if ((stats[team2]?.total_wins ?? 0) > (stats[team1]?.total_wins ?? 0)) {
            w_l = w_l.reverse();
        }

        let sweepBlock = '';
        let gameSevenBlock = '';
        if (stats[team1]?.total_wins == 4 || stats[team2]?.total_wins == 4) {
            w_l[1] = `<span class='strike-through nba-red-color'>${w_l[1]}</span>`;

            if (w_l[1].includes("0W")){
                // w_l[1] += '&nbsp;&nbsp; <span class="color-brown">Sweep! &nbsp;🧹</span>';
                sweepBlock = '<span class="color-brown">Sweep! &nbsp;🧹</span>';
            } else if (w_l[1].includes("3W")) {
                // w_l[1] += '&nbsp;&nbsp; <span class="color-yellow">Game 7! &nbsp;💪</span>';
                gameSevenBlock = '<span class="color-yellow">Game 7! &nbsp;💪</span>';

                const teamData = getTeamData()?.find((t: any) => t.teamName == team1);
                const team2Data = getTeamData()?.find((t: any) => t.teamName == team2);
                if (teamData?.is_3_0_comeback || team2Data?.is_3_0_comeback) {
                    gameSevenBlock += `<span style="color:${ON_FIRE_COLOR}">Comeback from 3-0!! &nbsp;🔥🔥🔥 </span>`;
                } else if (teamData?.is_3_1_comeback || team2Data?.is_3_1_comeback) {
                    gameSevenBlock += `<span style="color:${ON_FIRE_COLOR}">Comeback from 3-1!! &nbsp;🔥 </span>`;
                }
            }
        }

        const _idx = rOrder.findIndex((s) => s == team1);
        const _idx2 = rOrder.findIndex((s) => s == team2);
        standingStats[`${_idx+1}${nth(_idx+1)} vs ${_idx2 + 1}${nth(_idx2 + 1)}`] = [
            // standingStats[`${idx+1}${nth(idx+1)} vs ${8-idx}${nth(8-idx)}`] = [
            seriesWithLogos[idx],
            `<span class="font-weight-normal flex-column">${w_l.length == 0 ? 'Not started yet' : sweepBlock.length + gameSevenBlock.length == 0 ? '-' : `${sweepBlock}${gameSevenBlock}`}</span>`,
            `${team1}<br/><span class="font-weight-normal">${w_l.length == 0 ? "-" : getMvps(stats[team1]?.records ?? [], team1)}</span>`,
            `${team2}<br/><span class="font-weight-normal">${w_l.length == 0 ? "-" : getMvps(stats[team2]?.records ?? [], team2)}</span>`
        ];
    });

    function getTeamData() {
        if (mode == "Finals") {
            return teamsData.finalsStats;
        }
        else if (mode == "SemiFinals") {
            return teamsData.semiFinalsStats;
        }
        else if (mode == "Playoff") {
            return teamsData.playoffStats;
        }
        return teamsData.stats;
    }


    function isTeamWon(x: ISeasonGame, teamName: string) {
        return (x.score1 > x.score2 && x.team1_name == teamName) || (x.score2 > x.score1 && x.team2_name == teamName);
    }

    function isTeamWonMvp(teamName: string, mvpType: 'regularSeason' | 'finals' | 'postSeason'){
        const rMvp = mvpType === 'regularSeason' ? teamsData.regularSeasonMvpName : mvpType === 'postSeason' ? teamsData.postSeasonMvpName : teamsData.finalsMvpName;
        if (!rMvp) {
            return false;
        }
        return !!teamsByName[teamName].players.find((player) => player.name == rMvp);
    }

    function getTeamCell(teamName: string, totalWins: number, otherTeamWins: number): string {
        const teamLogo = teamsByName[teamName].logo;

        const awards = [];
        if (isTeamWonMvp(teamName, 'regularSeason')) {
            awards.push(`<img src="/trophies/mvp.png" width="16" height="16" />`);
        }
        if (isTeamWonMvp(teamName, 'postSeason')) {
            awards.push(`<img src="/trophies/post-season.png" width="16" height="16" />`);
        }
        if (isTeamWonMvp(teamName, 'finals')) {
            awards.push(`<img src="/trophies/fmvp.png" width="16" height="16" />`);
        }
        if (teamsData.winner && teamsData.isSeasonOver && teamsData.winner === teamName) {
            awards.push(`<img src="/trophies/championship.png" width="16" height="16" />`);
        }
        const awardsBlock = awards.length > 0 ? `<span class='flex-row gap-4 margin-inline-start-4'>${awards.join("")}</span>` : "";

        const teamCell = `<div class="flex-row align-items-center"><img src=${teamLogo} width="24" height="24" class="border-50-percents"/> ${teamName} (${totalWins}W)${awardsBlock}</div>`;
        if (otherTeamWins == 4){
            return `<span class='strike-through nba-red-color'>${teamCell}</span>`;
        }

        return teamCell;
    }

    function getMvps(records: ISeasonGame[], teamName: string): string{
        const mvps: Record<string, number> = {};
        records.forEach((game) => {
            if (isTeamWon(game, teamName) && game.mvp_player_name) {
                mvps[game.mvp_player_name] = mvps[game.mvp_player_name] || 0;
                mvps[game.mvp_player_name] += 1;
            }
        });
        const bestMvps = Object.keys(mvps).sort((a, b) => mvps[b] - mvps[a]);
        const mvp = bestMvps?.[0];
        const secondMvp = bestMvps?.[1];
        if (!mvp) {
            return "-";
        }
        if (bestMvps.length == 1) {
            return `${mvp} - ${mvps[mvp]}`;
        } else {
            return `${mvp} - ${mvps[mvp]},<br/>${secondMvp} - ${mvps[secondMvp]}`;
        }
    }

    function getPlayerCell(playerName: string): React.ReactNode {
        const allPlayers = Object.values(teamsByName).map((teamData) => teamData.players).flat();
        const playerLogo = allPlayers.find((player) => player.name == playerName)?.picture;

        return (
            <div className="flex-row align-items-center justify-content-center width-100-percents gap-4">
                <b>Regular Season MVP:</b>
                <img src={playerLogo} width="36" height="24" className="border-50-percents"/>
                <u><b><span>{playerName}</span></b></u>
            </div>
        );
    }

    function getMvpContenders() {
        if (mode === "SemiFinals") {
            let mvpBlock = null;
            if (teamsData.postSeasonMvpName) {
                mvpBlock = getPlayerCell(teamsData.postSeasonMvpName);
            }
            const mvps = store.postSeasonMvpContenders?.mvps ?? {};
            const sorted_mvps = store.postSeasonMvpContenders?.sorted_mvps ?? [];
            const details = store.postSeasonMvpContenders?.details ?? {};
            return (
                <div className="flex-column">
                    {mvpBlock}
                    <div className="flex-row width-100-percents justify-content-center"><b>Post Season MVP
                        Contenders:</b> &nbsp;{sorted_mvps.map((x) => x === "None" ? x : `${x} (${mvps[x]} pts)`).slice(0, 3).join(", ")}
                    </div>
                    <div className="flex-row width-100-percents justify-content-center opacity-06">
                        <b>Details:</b> &nbsp;{
                        sorted_mvps.map((playerName) => `${playerName} (${details[playerName]['mvps']}w / ${details[playerName]['diff']}+- / ${details[playerName]['comebacks']}cb / ${details[playerName]['overtimes']}ot / ${details[playerName]['knockouts']}ko)`).slice(0, 3).join(", ")}
                    </div>
                </div>
            )
        }
        return null;
    }

    return (
        <div>
            <div className="ui header margin-top-10">{mode.replace("SemiFinals","Semi Finals")} Standings</div>
            {getMvpContenders()}
            <StatsTableInner
                cols={['#', 'Series', 'Notes', 'MVPs 1', 'MVPs 2']}
                stats={standingStats}
                showMoreOpened={true}
                switchMaxNumber={10}
            />
        </div>
    );
}

export default observer(SemiFinalsStandings);