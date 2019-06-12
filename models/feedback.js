var mongoose = require('mongoose')
var Schema = mongoose.Schema
var feedbackSchema = new Schema({
  tweetid:{
    type:String
  },
  reaction:{
    type:String
  }
})
module.exports = mongoose.model('feedback',feedbackSchema)
