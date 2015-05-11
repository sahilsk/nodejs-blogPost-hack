var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');

/* Post collecton
*  - uid
*  - threads: 
     [ {  
          thread_id,
          content, 
          commentable: true/false, 
          comments: [
              {username, added_on }  
              }
            ]
     ]
*/

var postSchema = new mongoose.Schema({
  uid: { type: mongoose.Schema.Types.ObjectId },
  title: String,
  threads: [
    { content: String, commentable: Boolean, 
      thread_id: { type: mongoose.Schema.ObjectId, default: mongoose.Schema.Types.ObjectId() },
      comments: [ { username: String, comment: String , added_on: Date}] }
  ],
  created_at: { type: Date, default: Date.now}
});


postSchema.methods.threadStr = function(){
   var content = "";
   var threads = this.threads;
    for(var i=0; i < threads.length; i++){
      var p = threads[i];
      content+= p.content;
    }
    return content;
}

module.exports = mongoose.model('Post', postSchema);
