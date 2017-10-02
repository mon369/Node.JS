const mongoose = require('mongoose');
let Schema = mongoose.Schema;

var userSchema = new Schema({
    "user":{
        "type": String,
        "unique": true
    },
    "password" : String
})

let User;

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb://mlab_a7:pass@ds119223.mlab.com:19223/web322_a7");
        db.on('error', (err) => {
            reject(err.message); // reject the promise with the provided error
        });
        db.once('open', () => {
            User = db.model("user", userSchema);
            resolve();
        });
    });
};

module.exports.registerUser = function(userData){

    return new Promise((resolve, reject) =>{
        if(userData.password != userData.password2){
            reject("Passwords don't match");
        }else{
            let newUser = new User(userData);
            newUser.save((err) =>{
                if(err){
                    
                    if(err.code == 11000){
                        reject("Username already taken");
                    }else{
                        reject("Cannot create a new user: " + err.message);
                    }
                }else{
                    resolve();
                }
            })
        }
    })

}

module.exports.checkUser = function(userData){
    return new Promise((resolve, reject) => {
        User.find({"user" : userData.user})
        .exec()
        .then((users) =>{
            if(users.length == 0){
                reject (userData.user + " not found");
            }else if(userData.password != users[0].password){
                reject("Incorrect Password for: " + userData.user);
            }else{
                resolve();
            }
        })
        .catch((err) =>{
            reject("Unable to find " + userData.user);
        })
    })
}

