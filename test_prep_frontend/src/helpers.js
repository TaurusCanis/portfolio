export function validateForm(fields) {
    console.log("fields: ", fields)
    for (const value in fields) {
        if (fields[value].length === 0) return false;
    }
    return true;
  }

export function formatSection(name) {
    const sectionNameSplit = name.split("_");
    let formattedName = "";
    formattedName = sectionNameSplit[0][0].toUpperCase() + sectionNameSplit[0].slice(1) 
    if (sectionNameSplit[1]) {
        formattedName += " " + sectionNameSplit[1];
    }
    return formattedName;
}