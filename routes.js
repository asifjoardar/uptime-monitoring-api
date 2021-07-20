/*
* Title: 
* Description: 
* Author: Md Asif Joardar
* Date: 11/7/2021
*
*/

// dependencies
const {sampleHandler} = require("./handlers/routeHandlers/sampleHandlers");
const {userHandler} = require("./handlers/routeHandlers/userHandler");
const {tokenHandler} = require("./handlers/routeHandlers/tokenHandler");

const routes = {
    'sample': sampleHandler,
    'user': userHandler,
    'token': tokenHandler,
};

module.exports = routes;