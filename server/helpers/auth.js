const bcrypt = require('bcrypt');

const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(12, (err, salt) => {
            if(err){
                reject(err);
            } else {
                bcrypt.hash(password, salt, (err, hash) => {
                    if(err){
                        reject(err);
                    } else {
                        resolve(hash);
                    }
                });
            }
        });
    });
}

const comparePassword = (password, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, result) => {
            if(err){
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports = {
    hashPassword,
    comparePassword
}