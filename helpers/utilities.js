/*
* Title: 
* Description: 
* Author: Md Asif Joardar
* Date: 
*
*/

// dependencies
const crypto = require('crypto');
const environments = require('./environments');

// module scaffolding
const utilities = {};

// parse json string to object
utilities.parseJSON = (jsonString) => {
    let output;
    try{
        output = JSON.parse(jsonString);
    }catch {
        output = {};
    }
    return output;
};

// hash string
utilities.hash = (str) => {
    if(typeof str === 'string' && str.length > 0 ){
        const hash = crypto.createHmac('sha256', environments.secretKey)
                    .update(str)
                    .digest('hex');
        return hash;
    } else{
        return false;
    }
};

// create random string
utilities.createRandomString = (strLength) => {
    let length = strLength;
    length = typeof(strLength) === 'number' && strLength > 0 ? strLength : false;
    if(length){
        let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let output = '';
        for(let i=1; i<=length; i++){
            output += possibleCharacters.charAt(Math.floor(Math.random() * 35));
        }
        return output;
    } else{
        return false;
    }
};

module.exports = utilities;