import StatsTable from "../../components/StatsTable";
import {TOP_STATS_NUMBER} from "../../helpers/consts";
import {formatDate} from "../../helpers/utils";
import React from "react";

export const statsStyle = {
    margin: "30px auto 20px",
    width: "40%",
    minWidth: "700px",
    backgroundColor: "rgba(255,255,255,0.6)",
    padding: "20px",
    border: "1px solid #eaeaea",
    borderRadius: "20px",
}

export function BuildStatsTable(general_stats, wrap) {

    let general_stats_block = null;
    if (general_stats['total_games'] > 0) {

        const general_stats_lines = [];
        const dtToday = formatDate(new Date());
        const total_games_today = general_stats['total_games_per_day'][dtToday] || 0;
        const total_points_today = general_stats['total_points_per_day'][dtToday] || 0;
        general_stats_lines.push(`Total Games: ${general_stats['total_games']}`);
        general_stats_lines.push(`Total Points: ${general_stats['total_points']}`);
        general_stats_lines.push(`Total Games Today: ${total_games_today}`);
        general_stats_lines.push(`Total Points Today: ${total_points_today}`);

        const ppd = Object.keys(general_stats['total_points_per_day']).sort((a, b) => {
            return general_stats['total_points_per_day'][b] - general_stats['total_points_per_day'][a];
        });

        const gpd = Object.keys(general_stats['total_games_per_day']).sort((a, b) => {
            return general_stats['total_games_per_day'][b] - general_stats['total_games_per_day'][a];
        });

        general_stats_lines.push("----");
        general_stats_lines.push(`Days with most games:`);
        if (gpd.length === 0) {
            general_stats_lines.push('-');
        }
        for (let i = 0; i < gpd.length && i <= TOP_STATS_NUMBER; i++) {
            general_stats_lines.push(`${gpd[i]} - ${general_stats['total_games_per_day'][gpd[i]]}`);
        }

        general_stats_lines.push("----");
        general_stats_lines.push(`Days with most points:`);
        if (ppd.length === 0) {
            general_stats_lines.push('-');
        }
        for (let i = 0; i < ppd.length && i <= TOP_STATS_NUMBER; i++) {
            general_stats_lines.push(`${ppd[i]} - ${general_stats['total_points_per_day'][ppd[i]]}`);
        }

        general_stats_block = (
            <StatsTable
                title={"One on One Stats"}
                description={general_stats_lines}
                hidden={true}
            />
        );

        if (wrap){
            general_stats_block = (
                <div className="ui link cards centered" style={statsStyle}>
                    {general_stats_block}
                </div>
            );
        }
    }

    return general_stats_block;
}