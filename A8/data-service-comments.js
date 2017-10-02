const mongoose = require('mongoose');
let Schema = mongoose.Schema;

var commentSchema = new Schema({
    authorName: String,
    authorEmail: String,
    subject: String,
    commentText: String,
    postedDate: Date,
    replies: [{
        comment_id: String,
        authorName: String,
        authorEmail: String,
        commentText: String,
        repliedDate: Date
    }]

});

let Comment; //To be defined on initialization

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb://mlab:pass@ds043027.mlab.com:43027/web322_a6");
        db.on('error', (err) => {
            reject(err); // reject the promise with the provided error
        });
        db.once('open', () => {
            Comment = db.model("comments", commentSchema);
            resolve();
        });
    });
};

module.exports.addComment = function(data){
    return new Promise((resolve, reject)=>{
        data.postedDate = Date.now();
        let newComment = new Comment(data);
        newComment.save((err) =>{
            if(err){
                reject("There was a problem saving the comment: " + err.messsage);
            }else{
                resolve(newComment._id);
            }
        });
    });
}

module.exports.getAllComments = function(){
    return new Promise((resolve, reject)=>{
        Comment.find({})
        .sort({postedDate: 1})
        .exec()
        .then((input) =>{
            //console.log("resolving comments");
            //console.log(input);
            resolve(input);
        })
        .catch((err) =>{
            reject("There was a problem retrieving all comments: " + err.messsage);
        })
    });
}

module.exports.addReply = function (data) {
    //console.log("Adding Reply " + JSON.stringify(data))
    return new Promise((resolve, reject) => {
        data.repliedDate = Date.now();
        Comment.update({ _id: data.comment_id },
            { $addToSet: { replies: data } },
            { multi: false } )
            .exec()
            .then(() => {
                resolve();
            }).catch((error) => {
                reject("There was a problem adding reply: " + error.messsage);
            }
        )
    })
}

