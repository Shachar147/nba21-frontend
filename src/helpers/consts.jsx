import {shuffle} from "./utils";

export const MIN_ROUND_LENGTH = 3;
export const MAX_ROUND_LENGTH = 100;
export const ROUND_DEFAULT_LENGTH = 3;
export const LOGIN_DELAY = 500;
export const LOADING_DELAY = 2000; // to be able to see the loader

export const _3PT_COMPUTER_SCORE_DELAY = 1000; // delay between computer's start turn until score submittion

// pictures and background
export const RANDOM_PLAYER_PICTURE = '/nopic.png';
export const PLAYER_NO_PICTURE = '/nopic.png';
export const LOST_X_IMAGE = '/x-png-icon-8.jpg';
export const APP_BACKGROUND_COLOR = '#FAFAFB';
export const LOGO_IMAGE = '/logo-new.png';

export const COMPUTER_PLAYER_PICTURE = '/computer.png';
export const DEFAULT_COMPUTER_LEVEL = 'Real Life'; // 'Normal';
export const DEFAULT_STATS_ORDER = 'Overall';
export const DEFAULT_REAL_STATS_ORDER = 'Career Win%';
export const DEFAULT_REAL_STATS_MIN_GAMES = 300;
export const DEFAULT_STOPWATCH_STATS_ORDER = 'Total Games';

export const DEFAULT_REAL_INJURED_ORDER = 'Injury Last Update';
export const DEFAULT_REAL_INACTIVE_ORDER = 'Joined In';

// 3pt contest
export const TEAM1_COLOR = 'lightseagreen';
export const TEAM2_COLOR = 'lightcoral';

// error messages
export const UNAUTHORIZED_ERROR = 'Oops, seems like you are unauthorized to view this content.';

// Tournament
export const MAX_TEAMS_IN_TOURNAMENT = 10;
export const MIN_TEAMS_IN_TOURNAMENT = 4;

// loaders
export const LOADERS = {
    'loading.gif': {
        backgroundColor: "#F0F0F0",
        top: '-100px',
    },
    'curry.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'Griffin.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'Harden.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'Lebron.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'Durant.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'Davis.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'Love.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'Howard.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'Westbrook.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'CP3.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'Simmons1.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'Simmons2.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'GPNt.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'CP3-2.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'Ja.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'Zion.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'DRose.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'Embid.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'Giannis.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'Kawaii.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'Klay.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'KD.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'Lebron2.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'Wall.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'PG13.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'Booker.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'Doncic.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'Embid2.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'MJ.gif': {
        backgroundColor: 'rgb(200,200,200)',
        top: '0px',
    },
    'Griffin3.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'cant.touch.this.gif': {
        backgroundColor: "#72AE71",
        top: '0px',
    },
    'cp3.fun.size.gif': {
        backgroundColor: "#FF6B4A",
        top: '0px',
    },
    'curry.lebron.gif': {
        backgroundColor: "#283D93",
        top: '10px',
        textColor: 'white',
    },
    'dunk.gif': {
        backgroundColor: "#101F33",
        top: '0px',
        textColor: 'white',
    },
    'harden-orange.gif': {
        backgroundColor: "#FBB24F",
        top: '0px',
    },
    'injured.gif': {
        backgroundColor: "white",
        top: '10px',
    },
    'jordan.gif': {
        backgroundColor: "#FF003C",
        top: '10px',
    },
    'knowhow.gif': {
        backgroundColor: "#FFAD4A",
        top: '10px',
    },
    'kobe.gif': {
        backgroundColor: "#FFD61B",
        top: '10px',
    },
    'legendary.gif': {
        backgroundColor: "#5E97DB",
        top: '30px',
        textColor: 'white',
    },
    'motion.gif': {
        backgroundColor: "#FFCE31",
        top: '10px',
    },
    'nba51.gif': {
        backgroundColor: "#64BAE9",
        top: '10px',
    },
    'pg-unlimited.gif': {
        backgroundColor: "#F8F7F8",
        top: '10px',
    },
    'say.it.to.my.face.gif': {
        backgroundColor: "#7BBD73",
        top: '0px',
    },
    'shaq.gif': {
        backgroundColor: "#FFFFFF",
        top: '0px',
    },
    'spin.gif': {
        backgroundColor: "#E7524A",
        top: '0px',
        textColor: "white",
    },
    'undersized.gif': {
        backgroundColor: "#FFB247",
        top: '10px',
    },
    'wilt.gif': {
        backgroundColor: "#102031",
        top: '20px',
        textColor: 'white',
    },
    'winner.gif': {
        backgroundColor: "#FF6342",
        top: '20px',
        textColor: 'white',
    },
}
export const LOADER_DETAILS = () => {
    const options = shuffle(Object.keys(LOADERS));
    let option = LOADERS[options[0]];
    option.loader = `/loaders/${options[0]}`;
    return option;

}

export const TOP_STATS_NUMBER = 3;
export const TOP_STATS_MAX_VIEW_MORE = 100;

export const ON_FIRE_STYLE = "width:16px; top: -4px; position: relative";
export const ON_FIRE_COLOR = "rgb(255,117,0)";
export const ON_FIRE_ICON = "/onfire.png";
export const ON_FIRE_THRESHOLD = 3;

export const ICE_COLD_STYLE = "width:16px; top: -2px; position: relative";
export const ICE_COLD_COLOR = "rgb(0,173,239)";
export const ICE_COLD_ICON = "/icecold.jpg";
export const ICE_COLD_THRESHOLD = 3;

export const PLAYER_STATS_SHOW_MORE_THRESHOLD = 5;

export const MIN_SHOOTOUT_ROUND_LENGTH = 1;
export const MAX_SHOOTOUT_ROUND_LENGTH = 10;