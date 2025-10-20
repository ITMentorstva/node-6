

const http = require('http');
const fs = require('fs');
const path = require('path');
const {logUserVisit, sayHello} = require('./src/logger');

const server = http.createServer((req, res) => {

    /**
     * Bilo koji fajl ako se ucitava iz foldera /public/js
     *
     * putanja mora biti "/public/js/*****.js"
     */
    if (req.url.startsWith('/public/js/') && req.url.endsWith('.js')) {

        const jsPath = path.join(__dirname, req.url);

        fs.readFile(jsPath, 'utf8', (err, data) => {
            if(err) {
                res.writeHead(404, { 'Content-Type' : 'text/plain' });
                return res.end('JS file not found!');
            }

            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            return res.end(data);
        });

        return;
    }

    if (req.url.startsWith('/api/products')) {

        /**
         * /api/products/available => status: 'available'
         * /api/products/not-available => status: 'not available'
         * /api/products/all => status: sve
         */

        const jsonPath = path.join(__dirname+"/data", "products.json");

        fs.readFile(jsonPath, 'utf8', (err, jsonResponse) => {

            if(err) {
                res.writeHead(404, { 'Content-Type' : 'text/plain' });
                return res.end('JSON file not found!');
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });

            const status = req.url.includes('available') ? req.url.split("/").pop() : null;

            const response = status ?
                JSON.parse(jsonResponse).filter(service => service.status === status) :
                JSON.parse(jsonResponse);


            return res.end(JSON.stringify(response));
        });

        return;
    }

    // mojauto.com, mojauto.com/test, mojauto.com/nesto/nesto
    const filePath = path.join(__dirname+"/public", 'index.html');
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
