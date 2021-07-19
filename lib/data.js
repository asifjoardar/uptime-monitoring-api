/*
* Title: 
* Description: 
* Author: Md Asif Joardar
* Date: 
*
*/

// dependencies
const fs = require('fs');
const path = require('path');

const lib = {};

// base dir of the data folder
lib.basedir = path.join(__dirname, '/../.data/');

// write data to file
lib.create = function(dir, file, data, callback){
    // open file for writing
    fs.open(lib.basedir+ dir+ '/'+ file+ '.json', 'wx', function(err, fileDescriptor){
        if(!err && fileDescriptor){
            // cnvert data to string
            const stringData = JSON.stringify(data);

            // write data to file
            fs.writeFile(fileDescriptor, stringData, function(err){
                if(!err){
                    fs.close(fileDescriptor, function(err){
                        if(!err){
                            callback(false);
                        } else{
                            callback('Error closing the file!')
                        }
                    });
                } else {
                    callback('Error writing to new file');
                }
            });
        } else {
            callback('could not create new file, it may already exist!');
        }
    });
};

// read data from file
lib.read = function(dir, file, callback){
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', function(err, data){
        callback(err, data);
    });
};

// update existing file
lib.update = function(dir, file, data, callback){
    // file open for writing
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', function(err, fileDescriptor){
        if(!err && fileDescriptor){
            // convert the data to string
            const stringData = JSON.stringify(data);

            // truncate the file
            fs.ftruncate(fileDescriptor, function(err){
                if(!err){
                    fs.writeFile(fileDescriptor, stringData, function(err){
                        if(!err){
                            fs.close(fileDescriptor, function(err){
                                if(!err){
                                    callback(false)
                                } else{
                                    callback(`Error cloding fiel!`);
                                }
                            });
                        } else{
                            callback(`Error writing file`);
                        }
                    });
                } else{
                    callback(`Error truncating file`);
                }
            });
        } else {
            callback(`Error updating File may not exist!`);
        }
    });

};

// delete existing file
lib.delete = function(dir, file, callback){
    fs.unlink(`${lib.basedir + dir}/${file}.json`, function(err){
        if(!err){
            callback(false);
        } else{
            callback(`Error deleting file!`);
        }
    });
};

module.exports = lib;