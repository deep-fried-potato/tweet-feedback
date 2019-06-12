var mongoose = require('mongoose')
var Schema = mongoose.Schema
var tweetSchema = new Schema({
  tweetid:{
    type:String
  },
  tweettext:{
    type:String
  }
})
module.exports = mongoose.model('tweet',tweetSchema)
