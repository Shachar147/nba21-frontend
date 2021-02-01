import {shuffle} from "./utils";

export const MIN_ROUND_LENGTH = 3;
export const MAX_ROUND_LENGTH = 100;
export const ROUND_DEFAULT_LENGTH = 3;
export const LOGIN_DELAY = 500;

// pictures and background
export const RANDOM_PLAYER_PICTURE = '/nopic.png';
export const PLAYER_NO_PICTURE = '/nopic.png';
export const LOST_X_IMAGE = '/x-png-icon-8.jpg';
export const APP_BACKGROUND_COLOR = '#FAFAFB';
export const LOGO_IMAGE = '/logo-new.png';

export const COMPUTER_PLAYER_PICTURE = '/computer.png';
export const DEFAULT_COMPUTER_LEVEL = 'Real Life'; // 'Normal';
export const DEFAULT_STATS_ORDER = 'Overall';

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
    'curry.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'Loader.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'LoaderHarden.gif': {
        backgroundColor: 'white',
        top: '0px',
    },
    'LoaderLebron.gif': {
        backgroundColor: 'white',
        top: '0px',
    }
}
export const LOADER_DETAILS = () => {
    const options = shuffle(Object.keys(LOADERS));
    let option = LOADERS[options[0]];
    option.loader = `loaders/${options[0]}`;
    return option;

}