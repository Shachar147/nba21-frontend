export function deepClone(obj){
    return JSON.parse(JSON.stringify(obj));
}

export function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

export function nth(d) {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
    }
}

export function uiError(error){

    if (error.indexOf("Network Error") !== -1){
        return "Oops, it seems like there was some kind of a network error." + '<br>' +
            "Please make sure your server is up and running."
    }
    return error;
}

export function isDefined(value){
    return typeof(value) !== 'undefined';
}

export function getRandomElement(arr) {
    let shuffled = shuffle(arr);
    return shuffled[0];
}

export function getPlayerShortenPosition(position){
    switch (position)
    {
        case 'Center':
            return 'C';
            break;
        case 'Point Guard':
            return 'PG';
            break;
        case 'Forward':
            return 'F';
            break;
        case 'Guard':
            return 'G';
            break;
        case 'Power Forward':
            return 'PF';
            break;
        case 'Shooting Guard':
            return 'SG';
            break;
        case 'Center/Forward':
            return 'C/F';
            break;
        case 'Forward/Center':
            return 'C/F';
            break;
        case 'Guard/Forward':
            return 'F/G';
            break;
        case 'Forward/Guard':
            return 'F/G';
            break;
        default:
            return position;
            break;
    }
}

export function toPascalCase(string) {
    return `${string}`
        .replace(new RegExp(/[-_]+/, 'g'), ' ')
        .replace(new RegExp(/[^\w\s]/, 'g'), '')
        .replace(
            new RegExp(/\s+(.)(\w+)/, 'g'),
            ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
        )
        .replace(new RegExp(/\s/, 'g'), '')
        .replace(new RegExp(/\w/), s => s.toUpperCase());
}

export function formatDate(dt){
    return dt.toISOString().slice(0,10).split('-').reverse().join('/');
}

export function reFormatDate(dtString){
    return new Date(dtString.split('/').reverse().join("-"));
}

export function numberWithCommas(x) {
    return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function swap(json){
    var ret = {};
    for(var key in json){
        ret[json[key]] = key;
    }
    return ret;
}

export async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}