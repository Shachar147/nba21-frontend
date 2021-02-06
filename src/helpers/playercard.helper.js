import {isDefined, nth} from "./utils";
import {
    ICE_COLD_COLOR, ICE_COLD_ICON, ICE_COLD_STYLE,
    ICE_COLD_THRESHOLD,
    ON_FIRE_COLOR,
    ON_FIRE_ICON,
    ON_FIRE_STYLE,
    ON_FIRE_THRESHOLD
} from "./consts";

export function buildDetails(details, stats){

    const {
        _2k_rating,
        place,
        percents, // 3pt percents
        height_meters,
        weight_kgs,
    } = details;

    let {
        // stats details
        total_win_percents,
        total_wins,
        total_lost,
        total_games,
        win_streak,
        lose_streak,
        total_diff,
        total_diff_per_game,
        avg_opponent_2k_rating,
        total_home_games,
        total_away_games,
        total_scored,
        total_suffered,
        total_knockouts,
        total_suffered_knockouts,
        max_win_streak,
        max_lose_streak,

        // order by highlightes
        highlights,

        // real stats
        WP,
        GP,

    } = stats;

    total_diff_per_game = total_diff_per_game || 'N/A';

    let settings = {
        '2K Rating': _2k_rating,

        'Total Wins Percents': total_win_percents,
        'Total Wins': `${total_wins}W`,
        'Total Lost': `${total_lost}L`,
        'Total Games': total_games,
        'Current Win Streak': win_streak,
        'Current Lose Streak': lose_streak,
        'Total Diff': total_diff,

        'Average Opponent 2K Rating': avg_opponent_2k_rating?.toFixed(0),

        'Total Diff Per Game': `(${total_diff_per_game} per game)`,
        'Total Home Games': total_home_games,
        'Total Road Games': total_away_games,
        'Total Scored': total_scored,
        'Total Suffered': total_suffered,
        'Total Knockouts': total_knockouts,
        'Total Suffered Knockouts': total_suffered_knockouts,
        'Max Win Streak': `(Max: ${isDefined(max_win_streak) ? max_win_streak : 'N/A'})`,
        'Max Lose Streak': `(Max: ${isDefined(max_lose_streak) ? max_lose_streak : 'N/A'})`,

        // real stats
        'Career Win Percents': `${WP}%`,
        'Career Games Played': GP,
    };

    // on fire / ice cold
    let onfire = "";
    let icecold = "";
    if (win_streak >= ON_FIRE_THRESHOLD){
        onfire = ` <span style="color:${ON_FIRE_COLOR}">On Fire! <img style="${ON_FIRE_STYLE}" src="${ON_FIRE_ICON}" /></span>`
    }
    if (lose_streak >= ICE_COLD_THRESHOLD){
        icecold = ` <span style="color:${ICE_COLD_COLOR}">Ice Cold <img style="${ICE_COLD_STYLE}" src="${ICE_COLD_ICON}" /></span>`
    }

    // order by highlights
    if (highlights) {
        Object.keys(settings).map((name) => {
            if(highlights.indexOf(name) !== -1){
                settings[name] = `<b><u>${settings[name]}</u></b>`
            }
        });
    }

    let details_arr = [];

    // general details
    if (place) details_arr.push(place + nth(place));
    if (percents) details_arr.push("3Pt Percents: " + percents);
    if (_2k_rating) details_arr.push(`2K Rating: ${settings['2K Rating']}`);
    if (avg_opponent_2k_rating) details_arr.push(`Average Opponent 2K Rating: ${settings['Average Opponent 2K Rating']}`);
    if (height_meters) details_arr.push("Height: " + height_meters + " meters");
    if (weight_kgs) details_arr.push("Weight: " + weight_kgs + " kgs");

    const hr_style = 'border: 1px solid #eaeaea; border-bottom: 0px; top: 10px; position: relative;';
    const divider = "<hr style='" + hr_style + "'/>";

    // stats
    const status_arr = [];
    if (total_win_percents) status_arr.push(`Total Wins Percents: ${settings['Total Wins Percents']} (${settings['Total Wins']} - ${settings['Total Lost']})`);
    if (total_games) status_arr.push(`Total Games: ${settings['Total Games']}`);
    if (isDefined(total_home_games) && isDefined(total_away_games)) status_arr.push(`Home/Road Games: ${settings['Total Home Games']} - ${settings['Total Road Games']}`);
    if (isDefined(win_streak)) { status_arr.push(`Win Streak: ${settings['Current Win Streak']} ${settings['Max Win Streak']}` + onfire); }
    if (isDefined(lose_streak)) { status_arr.push(`Lose Streak: ${settings['Current Lose Streak']} ${settings['Max Lose Streak']}` + icecold); }
    if (isDefined(total_diff)) status_arr.push(`Total Diff: ${settings['Total Diff']} ${settings['Total Diff Per Game']}`);
    if (isDefined(total_scored)) status_arr.push(`Total Scored/Suffered: ${settings['Total Scored']} - ${settings['Total Suffered']}`);
    if (isDefined(total_knockouts)) status_arr.push(`Total Knockouts Did/Suffered: ${settings['Total Knockouts']} - ${settings['Total Suffered Knockouts']}`);

    // real stats
    if (isDefined(WP)) status_arr.push(`Career Win Percents: ${settings['Career Win Percents']}`);
    if (isDefined(GP)) status_arr.push(`Career Games Played: ${settings['Career Games Played']}`);

    if(status_arr.length > 3){
        details_arr.push(divider);
    }
    details_arr = [...details_arr,...status_arr];

    return details_arr;
}