/*
* Title: 
* Description: 
* Author: Md Asif Joardar
* Date: 
*
*/

// dependencies

// module scaffolding
const environments = {};

environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'asdf',
    maxChecks: 5,
};

environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'hjkl',
    maxChecks: 5,
};

// dtermine which env was passed
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding object
const environmentToExport = typeof(environments[currentEnvironment] === 'object') ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport;