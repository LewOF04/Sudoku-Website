/**
 * Return decimal representation of value's position between min and max.
 * @param {*} value value we want to know the position of
 * @param {*} min minimum possible value
 * @param {*} max maximum possible value
 * @returns value's position as a decimal (0.0-1.0)
 */
export function revLerp(value, min, max){
    if(min > max){ //failsafe converter
        let temp = max;
        max = min;
        min = temp;
    }

    if(value <= min) return 0.0;
    if(value >= max) return 1.0;

    let zerodVal = value - min;
    let zerodMax = max - min;

    return zerodVal / zerodMax;
}

/**
 * Given a decimal for the position between min and max, return the value for that position
 * @param {*} decimal decimal position between min and max
 * @param {*} min minimum value possible
 * @param {*} max maximum value possible
 * @returns value at decimal position between min and max
 */
export function lerp(decimal, min, max){
    if(min > max){ //failsafe converter
        let temp = max;
        max = min;
        min = temp;
    }

    let zerodMax = max - min;

    return (zerodMax * decimal) + min;
}