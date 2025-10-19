
const http = require('http');
const fs = require('fs');
const path = require('path');
const {logUserVisit, sayHello} = require('./src/logger');

const server = http.createServer((req, res) => {

    // mojauto.com, mojauto.com/test, mojauto.com/nesto/nesto
    const filePath = path.join(__dirname, 'index.html');
    const navPath = path.join("./html/components", 'navigation.html');
    const footerPath = path.join("./html/components", 'footer.html');

    fs.readFile(filePath, 'utf8', (err, html) => {

        const nav = fs.readFileSync(navPath, "utf8");
        const footer = fs.readFileSync(footerPath, "utf8");

        if(err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            return res.end('Error loading index.html');
        }

        const variables = {
            name: 'Toma',
            age: 32,
            height: 181.5,
            weight: 90
        };

        let result = html;

        for(const key in variables) {
            const htmlKey = "{{ "+key+" }}";
            result = result.replace(htmlKey, variables[key]);
        }

        result = result.replace("{{ navigation }}", nav);
        result = result.replace("{{ footer }}", footer);

        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        logUserVisit(ip);
        sayHello();

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(result);

    });

});

server.listen(3000, () => {
    console.log("Server runing at http://localhost:3000");
});

/**
 * html/components
 *  -> navigation.html
 *  -> footer.html
 *
 *  Prikazati footer u index.htmlu
 *  Ispraviti navigation.html tako da se ucivata iz components foldera
 */