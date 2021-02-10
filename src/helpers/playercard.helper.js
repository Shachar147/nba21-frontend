import {formatDate, isDefined, nth, numberWithCommas} from "./utils";
import {
    ICE_COLD_COLOR, ICE_COLD_ICON, ICE_COLD_STYLE,
    ICE_COLD_THRESHOLD,
    ON_FIRE_COLOR,
    ON_FIRE_ICON,
    ON_FIRE_STYLE,
    ON_FIRE_THRESHOLD, PLAYER_STATS_SHOW_MORE_THRESHOLD
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
        MPG,
        PPG,
        RPG,
        APG,
        SPG,
        BPG,
        TPG,
        FGM,
        FGA,
        FGP,
        FTM,
        FTA,
        FTP,
        _3PM,
        _3PA,
        _3PP,
        MIN,
        PTS,
        REB,
        AST,
        STL,
        BLK,
        TOV,
        PF,
        PM,
        PFP,
        PMP,
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
        'Career Win%': `${WP}%`,
        'Career Games Played': numberWithCommas(GP),
        'Career Minutes Per Game': `${MPG}`,
        'Career Points Per Game': `${PPG}`,
        'Career Rebounds Per Game': `${RPG}`,
        'Career Assists Per Game': `${APG}`,
        'Career Steals Per Game': `${SPG}`,
        'Career Blocks Per Game': `${BPG}`,
        'Career Turnovers Per Game': `${TPG}`,
        'Career FG Made': `${FGM}`,
        'Career FG Attempts': `${FGA}`,
        'Career FG%': `${FGP}%`,
        'Career FT Made': `${FTM}`,
        'Career FT Attempts': `${FTA}`,
        'Career FT%': `${FTP}%`,
        'Career 3P Made': `${_3PM}`,
        'Career 3P Attempts': `${_3PA}`,
        'Career 3P%': `${_3PP}%`,
        'Career Total Minutes': `${numberWithCommas(MIN)}`,
        'Career Total Points': `${numberWithCommas(PTS)}`,
        'Career Total Rebounds': `${numberWithCommas(REB)}`,
        'Career Total Assists': `${numberWithCommas(AST)}`,
        'Career Total Steals': `${numberWithCommas(STL)}`,
        'Career Total Blocks': `${numberWithCommas(BLK)}`,
        'Career Total Turnovers': `${numberWithCommas(TOV)}`,
        'Career Total Personal Fouls': `${numberWithCommas(PF)}`,
        'Career Total +/-': `${numberWithCommas(PM)}`,

        'Personal Fouls Per Game': `${PFP}`,
        '+/- Per Game': `${PMP}`,
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

    const hr_style = 'border: 1px solid #eaeaea; border-bottom: 0px; top: 10px; position: relative; margin-bottom:20px';
    const divider = "<hr style='" + hr_style + "'/>";

    // stats
    let stats_arr = [];
    if (total_win_percents) stats_arr.push(`Total Wins Percents: ${settings['Total Wins Percents']} (${settings['Total Wins']} - ${settings['Total Lost']})`);
    if (total_games) stats_arr.push(`Total Games: ${settings['Total Games']}`);
    if (isDefined(win_streak)) { stats_arr.push(`Win Streak: ${settings['Current Win Streak']} ${settings['Max Win Streak']}` + onfire); }
    if (isDefined(lose_streak)) { stats_arr.push(`Lose Streak: ${settings['Current Lose Streak']} ${settings['Max Lose Streak']}` + icecold); }
    if (isDefined(total_home_games) && isDefined(total_away_games)) stats_arr.push(`Home/Road Games: ${settings['Total Home Games']} - ${settings['Total Road Games']}`);
    if (isDefined(total_diff)) stats_arr.push(`Total Diff: ${settings['Total Diff']} ${settings['Total Diff Per Game']}`);
    if (isDefined(total_scored)) stats_arr.push(`Total Scored/Suffered: ${settings['Total Scored']} - ${settings['Total Suffered']}`);
    if (isDefined(total_knockouts)) stats_arr.push(`Total Knockouts Did/Suffered: ${settings['Total Knockouts']} - ${settings['Total Suffered Knockouts']}`);

    // real stats
    if (isDefined(WP)) stats_arr.push(`Career Win%: ${settings['Career Win%']}`);
    if (isDefined(GP)) stats_arr.push(`Career Games Played: ${settings['Career Games Played']}`);
    if (isDefined(_3PP)) stats_arr.push(`Career 3P%: ${settings['Career 3P%']}`);
    if (isDefined(FGP)) stats_arr.push(`Career FG%: ${settings['Career FG%']}`);
    if (isDefined(FTP)) stats_arr.push(`Career FT%: ${settings['Career FT%']}`);
    if (isDefined(MPG)) stats_arr.push(`Career MPG: ${settings['Career Minutes Per Game']}`);
    if (isDefined(PPG)) stats_arr.push(`Career PPG: ${settings['Career Points Per Game']}`);
    if (isDefined(RPG)) stats_arr.push(`Career RPG: ${settings['Career Rebounds Per Game']}`);
    if (isDefined(APG)) stats_arr.push(`Career APG: ${settings['Career Assists Per Game']}`);
    if (isDefined(SPG)) stats_arr.push(`Career SPG: ${settings['Career Steals Per Game']}`);
    if (isDefined(BPG)) stats_arr.push(`Career BPG: ${settings['Career Blocks Per Game']}`);
    if (isDefined(TPG)) stats_arr.push(`Career TPG: ${settings['Career Turnovers Per Game']}`);
    if (isDefined(FGM)) stats_arr.push(`Career FGM: ${settings['Career FG Made']}`);
    if (isDefined(FGA)) stats_arr.push(`Career FGA: ${settings['Career FG Attempts']}`);
    if (isDefined(FTM)) stats_arr.push(`Career FTM: ${settings['Career FT Made']}`);
    if (isDefined(FTA)) stats_arr.push(`Career FTA: ${settings['Career FT Attempts']}`);
    if (isDefined(_3PM)) stats_arr.push(`Career 3PM: ${settings['Career 3P Made']}`);
    if (isDefined(_3PA)) stats_arr.push(`Career 3PA: ${settings['Career 3P Attempts']}`);
    if (isDefined(MIN)) stats_arr.push(`Career Total Minutes: ${settings['Career Total Minutes']}`);
    if (isDefined(PTS)) stats_arr.push(`Career Total Points: ${settings['Career Total Points']}`);
    if (isDefined(REB)) stats_arr.push(`Career Total Rebounds: ${settings['Career Total Rebounds']}`);
    if (isDefined(AST)) stats_arr.push(`Career Total Assists: ${settings['Career Total Assists']}`);
    if (isDefined(STL)) stats_arr.push(`Career Total Steals: ${settings['Career Total Steals']}`);
    if (isDefined(BLK)) stats_arr.push(`Career Total Blocks: ${settings['Career Total Blocks']}`);
    if (isDefined(TOV)) stats_arr.push(`Career Total Turnovers: ${settings['Career Total Turnovers']}`);
    if (isDefined(PF)) stats_arr.push(`Career Total Personal Fouls: ${settings['Career Total Personal Fouls']}`);
    if (isDefined(PM)) stats_arr.push(`Career Total +/-: ${settings['Career Total +/-']}`);
    if (isDefined(PFP)) stats_arr.push(`Personal Fouls Per Game: ${settings['Personal Fouls Per Game']}`);
    if (isDefined(PMP)) stats_arr.push(`+/- Per Game: ${settings['+/- Per Game']}`);

    // highlighted items first
    let first = [];
    stats_arr = stats_arr.filter((x) => {
        if (x.indexOf('<b>') !== -1){
            first.push(x);
            return false;
        }
        return true;
    });
    stats_arr = [...first,...stats_arr];

    details_arr.push(divider);

    // if(stats_arr.length > 3){
    //     details_arr.push(divider);
    // }

    const lastSync1 = (details.lastSyncAt) ? formatDate(new Date(details.lastSyncAt)) : undefined;
    const lastSync2 = (stats.lastSyncAt) ? formatDate(new Date(stats.lastSyncAt)) : undefined;

    if (lastSync1){
        details_arr.unshift(`<span style="opacity:0.6">Updated To: ${lastSync1}</span>`);
    }

    if (lastSync2 && lastSync1 !== lastSync2){
        stats_arr.unshift(`<span style="opacity:0.6">Updated To: ${lastSync2}</span>`);
    }

    // details_arr = [...details_arr,...stats_arr];

    return { details_arr, stats_arr };
}