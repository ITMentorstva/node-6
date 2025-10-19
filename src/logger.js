
const fs = require("fs");

function logUserVisit(ip) {
    const log = ip+"\n";

    fs.appendFile('./visitors.txt', log, (err) => {
        if(err) {
            console.log('Error writting to file: '+err);
        }
    });
}

function sayHello() {
    console.log("Hello world");
}

module.exports = {
    logUserVisit, sayHello
};