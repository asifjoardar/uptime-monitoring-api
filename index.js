/*
* Title: 
* Description: 
* Author: Md Asif Joardar
* Date: 11/7/2021
*
*/

// dependencies
const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');
const data = require('./lib/data');
// app object - module scaffolding
const app = {};

// data.create('test', 'newFile', {'name': 'Asif', 'age': '23'}, function(err){
//     console.log(err);
// });
// data.read('test', 'newFile', function(err, result){
//     console.log(err, result);
// });
// data.update('test', 'newFile', {name: 'joardar', age: 24}, function(err){
//     console.log(err);
// });
// data.delete('test', 'newFile', function(err){
//     console.log(err);
// });

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`this is it = ${process.env.NODE_ENV}`);
        console.log(`listening to port ${environment.port}`);
    });
};

//handle request response
app.handleReqRes = handleReqRes;

// start the server
app.createServer();