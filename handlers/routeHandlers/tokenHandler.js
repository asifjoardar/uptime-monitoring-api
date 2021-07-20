/*
* Title: 
* Description: 
* Author: Md Asif Joardar
* Date: 
*
*/

// dependencies
const data = require('../../lib/data');
const {hash} = require('../../helpers/utilities');
const {createRandomString} = require('../../helpers/utilities');
const {parseJSON} = require('../../helpers/utilities');

// modules scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if(acceptedMethods.indexOf(requestProperties.method) > -1){
        handler._token[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._token = {};

handler._token.post = (requestProperties, callback) => {
    const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
    const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
    if(phone && password){
        data.read('users', phone, (err, userData) => {
            let hashedPassword = hash(password);
            if(hashedPassword === parseJSON(userData).password){
                let tokenID = createRandomString(20);
                let expires = Date.now() + 60 *60 * 1000;
                let tokenObject = {
                    phone,
                    'id': tokenID,
                    expires,
                };
                // store the token
                data.create('token', tokenID, tokenObject, (err) => {
                    if(!err){
                        callback(200, tokenObject);
                    } else{
                        callback(500, {
                            error: 'there is a problem in server side!'
                        });
                    }
                });
            } else{
                callback(400, {
                    error: 'password is not valid!',
                });
            }
        });
    } else{
        callback(400, {
            error: 'invalid phone number, please try again',
        });
    }
};
handler._token.get = (requestProperties, callback) => {
    const id = typeof(requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;
    if(id){
        data.read('token', id, (err, tokenData) => {
            const token = {...parseJSON(tokenData)};
            if(!err && token){
                callback(200, token);
            } else{
                callback(404, {
                    error: 'requested token not found',
                });
            }
        });
    } else{
        callback(404, {
            error: 'requested token not found',
        });
    }
};
handler._token.put = (requestProperties, callback) => {
    const id =
        typeof requestProperties.body.id === 'string' &&
        requestProperties.body.id.trim().length === 20
            ? requestProperties.body.id
            : false;
    const extend = !!(
        typeof requestProperties.body.extend === 'boolean' && requestProperties.body.extend === true
    );

    if (id && extend) {
        data.read('token', id, (err, tokenData) => {
            const tokenObject = parseJSON(tokenData);
            if (tokenObject.expires > Date.now()) {
                tokenObject.expires = Date.now() + 60 * 60 * 1000;
                // store the updated token
                data.update('token', id, tokenObject, (err) => {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, {
                            error: 'There was a server side error!',
                        });
                    }
                });
            } else {
                callback(400, {
                    error: 'Token already expired!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'There was a problem in your request',
        });
    }
};
handler._token.delete = (requestProperties, callback) => {
    // check the token if valid
    const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 20
            ? requestProperties.queryStringObject.id
            : false;

    if (id) {
        // lookup the user
        data.read('token', id, (err, tokenData) => {
            if (!err && tokenData) {
                data.delete('token', id, (err) => {
                    if (!err) {
                        callback(200, {
                            message: 'Token was successfully deleted!',
                        });
                    } else {
                        callback(500, {
                            error: 'There was a server side error!',
                        });
                    }
                });
            } else {
                callback(500, {
                    error: 'There was a server side error!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'There was a problem in your request!',
        });
    }
};

handler._token.verify = (id, phone, callback) => {
    data.read('token', id, (err, tokenData) => {
        if (!err && tokenData) {
            if (parseJSON(tokenData).phone === phone && parseJSON(tokenData).expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};

module.exports = handler;