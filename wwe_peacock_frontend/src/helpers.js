const capitalizeFirstLetter = (s) => {
    return `${s[0].toUpperCase()}${s.slice(1)}`
}

const processName = (n) => {
    const splitName = n.split("-");
    // console.log(splitName.length);
    // const fieldName = splitName.length > 1 ? `${splitName[0]}${capitalizeFirstLetter(splitName[1])}`: n;
    // const displayName = splitName.length > 1 ? splitName.map(word => capitalizeFirstLetter(word)).join(" ") : capitalizeFirstLetter(n);
    // return [fieldName, displayName];
    return splitName.map(word => capitalizeFirstLetter(word)).join(" ");
}

// const formatDisplayName = (n) => {
//     const splitName = n.split("-");
//     return splitName.length > 1 ? splitName.map(word => capitalizeFirstLetter(word)).join(" ") : capitalizeFirstLetter(n);
// }

export { processName };