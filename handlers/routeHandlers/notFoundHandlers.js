/*
* Title: 
* Description: 
* Author: Md Asif Joardar
* Date: 11/7/2021
*
*/

// modules scaffolding
const handler = {};

handler.notFoudHandlers = (requestProperties, callback) => {
    callback(404, {
        message: 'your requested url was not found!',
    });
};

module.exports = handler;