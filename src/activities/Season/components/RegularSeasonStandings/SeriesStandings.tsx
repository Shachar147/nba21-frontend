import React from "react";
import {observer} from "mobx-react";
import {ISeasonGame, SeasonMode, SeasonStats, Team} from "../../utils/interfaces";
import {winsAndMatchupsSort} from "../../../../helpers/sort";
import StatsTableInner from "../../../../components/StatsTableInner";
import {nth} from "../../../../helpers/utils";
import SeasonGameStore from "../../stores/SeasonGameStore";

interface SeriesStandingsProps {
    stats: SeasonStats;
    rStats: SeasonStats;
    teamsByName: Record<string, Team>;
    mode: SeasonMode;
    store: SeasonGameStore;
    max?: number;
}

function SeriesStandings({ rStats, stats, mode, teamsByName, store, max=8 }: SeriesStandingsProps){

    // get regular season top8 teams:
    const rTeamStats = {...store.regularSeasonStats};
    Object.keys(rTeamStats).forEach((teamName) => {
        rTeamStats[teamName]["teamName"] = teamName;
    });
    const rTeamsByStanding = Object.values(rTeamStats).sort(winsAndMatchupsSort);
    const rOrder: string[] = rTeamsByStanding.map((s) => s.teamName).slice(0, 8);


    const teamStats = {...rStats};
    Object.keys(teamStats).forEach((teamName) => {
        teamStats[teamName]["teamName"] = teamName;
    });
    const teamsByStanding = Object.values(teamStats).sort(winsAndMatchupsSort);
    const standingStats: Record<string, (number|string)[]> = {};

    // @ts-ignore
    const order: string[] = teamsByStanding.map((s) => s.teamName).slice(0, max);
    const series: string[] = [];
    const seriesWithLogos: string[] = [];
    order.forEach((team, idx) => {
        if (idx <= max/2 - 1) {
            series.push(`${team} vs ${order[order.length - 1 - idx]}`);
            // @ts-ignore
            seriesWithLogos.push(`<div style="position:relative;"><div style="position:absolute; top:12.5px;">vs</div><div class="flex-col gap-4" style="position:relative; left:20px;">${getTeamCell(team)}${getTeamCell(order[order.length - 1 - idx])}</div></div>`)
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

        if (stats[team1]?.total_wins == 4 || stats[team2]?.total_wins == 4) {
            w_l[1] = `<span class='strike-through nba-red-color'>${w_l[1]}</span>`;

            if (w_l[1].includes("0W")){
                w_l[1] += '&nbsp;&nbsp; <span class="color-brown">Sweep! &nbsp;🧹</span>';
            } else if (w_l[1].includes("3W")) {
                w_l[1] += '&nbsp;&nbsp; <span class="color-yellow">Game 7! &nbsp;💪</span>';
            }
        }

        const _idx = rOrder.findIndex((s) => s == team1);
        const _idx2 = rOrder.findIndex((s) => s == team2);
        standingStats[`${_idx+1}${nth(_idx+1)} vs ${_idx2 + 1}${nth(_idx2 + 1)}`] = [
        // standingStats[`${idx+1}${nth(idx+1)} vs ${8-idx}${nth(8-idx)}`] = [
            seriesWithLogos[idx],
            `<span class="font-weight-normal">${w_l.length == 0 ? 'Not started yet' : w_l.join("&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;")}</span>`,
            `${team1}<br/><span class="font-weight-normal">${w_l.length == 0 ? "-" : getMvps(stats[team1]?.records ?? [], team1)}</span>`,
            `${team2}<br/><span class="font-weight-normal">${w_l.length == 0 ? "-" : getMvps(stats[team2]?.records ?? [], team2)}</span>`
        ];
    });

    function isTeamWon(x: ISeasonGame, teamName: string) {
        return (x.score1 > x.score2 && x.team1_name == teamName) || (x.score2 > x.score1 && x.team2_name == teamName);
    }

    function getTeamCell(teamName: string): string {
        const teamLogo = teamsByName[teamName].logo;

        return `<div class="flex-row align-items-center"><img src=${teamLogo} width="24" height="24" class="border-50-percents"/> ${teamName}</div>`;
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

    return (
        <div>
            <div className="ui header margin-top-10">{mode} Standings</div>
            <StatsTableInner
                cols={['#', 'Series', 'Standing', 'MVPs 1', 'MVPs 2']}
                stats={standingStats}
                showMoreOpened={true}
                switchMaxNumber={10}
            />
        </div>
    );
}

export default observer(SeriesStandings);