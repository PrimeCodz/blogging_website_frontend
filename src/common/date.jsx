let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const getDates = (timestamp) => {
    let date = new Date(timestamp);

    if (!timestamp) return "N/A";
    return `${date.getDate()} ${months[date.getMonth()]} ${days[date.getDay()]}`
}

export const getFullDate = (timestamp) => {
    let date = new Date(timestamp);

    if (!timestamp) return "N/A";
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

export const getYear = (timestamp) => {
    let date = new Date(timestamp);

    if (!timestamp) return "N/A";
    return `${months[date.getMonth()]} ${date.getFullYear()}`
}

export const getDay = (timestamp) => {
    let date = new Date(timestamp);

    if (!timestamp) return "N/A";
    return `${date.getDate()} ${months[date.getMonth()]}`
}