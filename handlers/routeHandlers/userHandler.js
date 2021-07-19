/*
* Title: 
* Description: 
* Author: Md Asif Joardar
* Date: 11/7/2021
*
*/

// dependencies
const data = require('../../lib/data');
const {hash} = require('../../helpers/utilities');
const { create } = require('../../lib/data');
const {parseJSON} = require('../../helpers/utilities');

// modules scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if(acceptedMethods.indexOf(requestProperties.method) > -1){
        handler._users[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._users = {};

handler._users.post = (requestProperties, callback) => {
    const firstName = typeof(requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
    const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;
    const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
    const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
    const toAgreement = typeof(requestProperties.body.toAgreement) === 'boolean' && requestProperties.body.toAgreement ? requestProperties.body.toAgreement : false;
    if(firstName && lastName && phone && password && toAgreement){
        // make sure that the user dosent already exist
        data.read('users', phone, (err) => {
            if(err){
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    toAgreement,
                };
                // store user to db
                data.create('users', phone, userObject, (err) => {
                    if(!err){
                        callback(200, {
                            message: 'user created successfully',
                        });
                    } else{
                        callback(500, {
                            error: 'could not create user',
                        });
                    }
                });
            } else{
                callback(500, {
                    error: 'There is a problem in server side',
                });
            }
        });
    } else {
        callback(400, {
            error: 'you have a problem in your request',
        });
    }
};
handler._users.get = (requestProperties, callback) => {
    const phone = typeof(requestProperties.queryStringObject.phone) === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;
    if(phone){
        data.read('users', phone, (err, u) => {
            const user = {...parseJSON(u)};
            if(!err && user){
                delete user.password;
                callback(200, user);
            } else{
                callback(404, {
                    error: 'requested user not found',
                });
            }
        });
    } else{
        callback(404, {
            error: 'requested user not found',
        });
    }

};
handler._users.put = (requestProperties, callback) => {
    const firstName = typeof(requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
    const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;
    const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
    const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
    if(phone){
        if(firstName || lastName || password){
            data.read('users', phone, (err, uData) => {
                let userData = {...parseJSON(uData)};
                if(!err && userData){
                    if(firstName){
                        userData.firstName = firstName;
                    }
                    if(firstName){
                        userData.lastName = lastName;
                    }
                    if(firstName){
                        userData.password = hash(password);
                    }
                    data.update('users', phone, userData, (err) => {
                        if(!err){
                            callback(200, {
                                message: 'user is updated successfully',
                            });
                        } else{
                            callback(500, {
                                error: 'there was a problem in your serverside',
                            });
                        }
                    });
                } else{
                    callback(400, {
                        error: 'you have a problem in your request',
                    });
                }
            });
        } else{
            callback(400, {
                error: 'you have a problem in your request',
            });
        }
    } else{
        callback(400, {
            error: 'invalid phone number, please try again',
        });
    }
};
handler._users.delete = (requestProperties, callback) => {
    const phone = typeof(requestProperties.queryStringObject.phone) === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;
    if(phone){
        data.read('users', phone, (err, userData) => {
            if(!err && userData){
                data.delete('users', phone, (err) => {
                    if(!err){
                        callback(200, {
                            message: 'user delete successfully',
                        });
                    } else{
                        callback(500, {
                            error: 'there is a server side error',
                        });
                    }
                });
            } else{
                callback(500, {
                    error: 'there is a server side error',
                });
            }
        });
    } else{
        callback(400, {
            error: 'there is a problem in your request',
        });
    }
};

module.exports = handler;