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
}

function SeriesStandings({ rStats, stats, mode, teamsByName, store }: SeriesStandingsProps){

    const teamStats = {...rStats};
    Object.keys(teamStats).forEach((teamName) => {
        teamStats[teamName]["teamName"] = teamName;
    });
    const teamsByStanding = Object.values(teamStats).sort(winsAndMatchupsSort);
    const standingStats: Record<string, (number|string)[]> = {};

    const order = teamsByStanding.map((s) => s.teamName).slice(0, 8);
    const series: string[] = [];
    order.forEach((team, idx) => {
        if (idx <= 3) {
            series.push(`${team} vs ${order[order.length - 1 - idx]}`);
        }
    })

    series.forEach((seriesName, idx) => {
        const teams = seriesName.split(' vs ');
        const team1 = teams[0];
        const team2 = teams[1];

        const w_l = [];
        if (stats[team1]) {
            w_l.push(`${team1} &nbsp;<b><u>${stats[team1].total_wins}W</u></b>`);
        }
        if (stats[team2]) {
            w_l.push(`${team2} &nbsp;<b><u>${stats[team2].total_wins}W</u></b>`);
        }
        standingStats[`${idx+1}${nth(idx+1)} vs ${8-idx}${nth(8-idx)}`] = [
            seriesName,
            `<span class="font-weight-normal">${w_l.length == 0 ? 'Not started yet' : w_l.join("&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;")}</span>`,
            `${team1}<br/><span class="font-weight-normal">${getMvps(stats[team1]?.records ?? [], team1)}</span>`,
            `${team2}<br/><span class="font-weight-normal">${getMvps(stats[team2]?.records ?? [], team2)}</span>`
        ];
    });

    function isTeamWon(x: ISeasonGame, teamName: string) {
        return (x.score1 > x.score2 && x.team1_name == teamName) || (x.score2 > x.score1 && x.team2_name == teamName);
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