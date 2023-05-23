export const numDifferentiation = (val: number) => {
    let val_string = ''
    if (val >= 10000000) val_string = (val / 10000000).toFixed(2) + " Cr";
    else if (val >= 100000) val_string = (val / 100000).toFixed(2) + " Lac";
    else if (val >= 1000) val_string = (val / 1000).toFixed(2) + " K";
    return val_string;
};
