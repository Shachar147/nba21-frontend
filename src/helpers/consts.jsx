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
export const DEFAULT_REAL_STATS_ORDER = 'Career Win%, 300 Games or more';

// 3pt contest
export const TEAM1_COLOR = 'lightseagreen';
export const TEAM2_COLOR = 'lightcoral';

// error messages
export const UNAUTHORIZED_ERROR = 'Oops, seems like you are unauthorized to view this content.';

// loaders
export const LOADERS = {
    'loading.gif': {
        backgroundColor: "#F0F0F0",
        top: '-100px',
    },
    'Curry.gif': {
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
}
export const LOADER_DETAILS = () => {
    const options = shuffle(Object.keys(LOADERS));
    let option = LOADERS[options[0]];
    option.loader = `/loaders/${options[0]}`;
    return option;

}

export const TOP_STATS_NUMBER = 3;

export const ON_FIRE_STYLE = "width:16px; top: -4px; position: relative";
export const ON_FIRE_COLOR = "rgb(255,117,0)";
export const ON_FIRE_ICON = "/onfire.png";
export const ON_FIRE_THRESHOLD = 3;

export const ICE_COLD_STYLE = "width:16px; top: -2px; position: relative";
export const ICE_COLD_COLOR = "rgb(0,173,239)";
export const ICE_COLD_ICON = "/icecold.jpg";
export const ICE_COLD_THRESHOLD = 3;

export const PLAYER_STATS_SHOW_MORE_THRESHOLD = 5;