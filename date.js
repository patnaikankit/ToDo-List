
module.exports.getDate = getDate;
function getDate(){
let day = new Date();
    let options = {
        weekday : 'long',
        day : 'numeric',
        month : 'long'
    };
    let today = day.toLocaleDateString("en-US",options);
    return today;
}

module.exports.getDay = getDay;
function getDay(){
let day = new Date();
    let options = {
        weekday : 'long'
    };
    let today = day.toLocaleDateString("en-US",options);
    return today;
}
console.log(module.exports);