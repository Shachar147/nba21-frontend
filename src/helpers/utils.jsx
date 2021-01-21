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