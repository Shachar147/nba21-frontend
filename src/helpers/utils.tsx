// @ts-ignore
import _ from 'lodash';

export function deepClone(obj: any){
    return JSON.parse(JSON.stringify(obj));
}

export function shuffle(array: any[]) {
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

export function nth(d: number) {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
    }
}

export function uiError(error: string){

    if (error.indexOf("Network Error") !== -1){
        return "Oops, it seems like there was some kind of a network error." + '<br>' +
            "Please make sure your server is up and running."
    }
    return error;
}

export function isDefined(value: any){
    return typeof(value) !== 'undefined';
}

export function getRandomElement(arr: any[]) {
    let shuffled = shuffle(arr);
    return shuffled[0];
}

export function getPlayerShortenPosition(position: string){
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

export function toPascalCase(str: string) {
    return `${str}`
        .replace(new RegExp(/[-_]+/, 'g'), ' ')
        .replace(new RegExp(/[^\w\s]/, 'g'), '')
        .replace(
            new RegExp(/\s+(.)(\w+)/, 'g'),
            ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
        )
        .replace(new RegExp(/\s/, 'g'), '')
        .replace(new RegExp(/\w/), s => s.toUpperCase());
}

export function formatDate(dt: Date){
    return dt.toISOString().slice(0,10).split('-').reverse().join('/');
}

export function reFormatDate(dtString: string){
    return new Date(dtString.split('/').reverse().join("-"));
}

export function numberWithCommas(x?: string) {
    return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function calcPercents(number: number, total: number, toFixed = 2){
    return ((number / total) * 100).toFixed(toFixed);
}

export function swap(json: any){
    var ret = {};
    for(var key in json){
        // @ts-ignore
        ret[json[key]] = key;
    }
    return ret;
}

export async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

type AcceptableGetClassesType = string | boolean | undefined | null | 0;
export function getClasses(...args: Array<AcceptableGetClassesType | AcceptableGetClassesType[]>): string | undefined {
    return _.flatten(args).filter(Boolean).join(" ").trim() || undefined;
}