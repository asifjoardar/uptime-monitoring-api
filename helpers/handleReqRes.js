/*
* Title: 
* Description: 
* Author: Md Asif Joardar
* Date: 11/7/2021
*
*/

// dependencies
const url = require('url');
const {StringDecoder} = require('string_decoder');
const routes = require('../routes');
const {notFoudHandlers} = require('../handlers/routeHandlers/notFoundHandlers');
const {parseJSON} = require('../helpers/utilities');
// module scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
    // request handling
    // get the url and pase it
    const parseUrl = url.parse(req.url, true);
    const path = parseUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parseUrl.query;
    const headersObject = req.headers;

    const requestProperties = {
        parseUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headersObject,
    };

    const decoder = new StringDecoder('utf-8');
    let realData = '';

    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoudHandlers;

    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });
    req.on('end', () => {
        realData += decoder.end();
        requestProperties.body = parseJSON(realData);

        chosenHandler(requestProperties, (statusCode, payLoad) => {
            statusCode = typeof statusCode === 'number' ? statusCode : 500;
            payLoad = typeof payLoad === 'object' ? payLoad : {};
    
            const payLoadString = JSON.stringify(payLoad);
    
            // console.log(`amar status = ${statusCode}`);
            res.writeHead(statusCode);
            res.end(payLoadString);
        });
    });
};

module.exports = handler;
