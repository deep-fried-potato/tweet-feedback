const express = require('express');
var router = express.Router()
const fs = require('fs')
const csv = require('csv-parser')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

let feedback = require("./models/feedback")
router.get("/",(req,res)=>{
  res.render("main.twig",{})
})
router.get("/tweetpage",(req,res)=>{
  var tweetdata = {tweets:[]}
  fs.createReadStream("tweet-data.csv").pipe(csv()).on('data',(data)=>{
    tweetdata.tweets.push(data);

  }).on('end',()=>{
    console.log(tweetdata)
    if(tweetdata.tweets.length>0 && tweetdata.tweets[0].id ){
        var selectedtweet = tweetdata.tweets[Math.floor(Math.random() * tweetdata.tweets.length)];
    }
    else{
      var selectedtweet = ""
    }
    res.render("tweetPage.twig",{workerid:req.query.workerid,tweet:selectedtweet})
  })
})

router.post("/feedback",(req,res)=>{
  const csvWriter = createCsvWriter({
    path: 'tweet-data.csv',
    header: [
        {id: 'id', title: 'id'},
        {id: 'tweettext', title: 'tweettext'}
    ]
});

let newFeedback = new feedback();
newFeedback.tweetid = req.body.tweetid;
newFeedback.reaction = req.body.reaction
newFeedback.save((err,result)=>{
  if(err){
    console.log(err)
    res.redirect("/")
  }
  else{
    var tweetdata = {tweets:[]}
    fs.createReadStream("tweet-data.csv").pipe(csv()).on('data',(data)=>{
      tweetdata.tweets.push(data);
    }).on('end',()=>{
        feedback.find({tweetid:req.body.tweetid}).exec((err,result)=>{
          if(result.length>0){
            var index = tweetdata.tweets.indexOf(tweetdata.tweets.find((tweet)=>{
              return tweet.id == req.body.tweetid
            }))
            tweetdata.tweets.splice(index,1)
          }
          console.log("Spliced Data: ")
          console.log(tweetdata)
          csvWriter.writeRecords(tweetdata.tweets).then(()=>{
            var workerid = encodeURIComponent(req.body.workerid);
            res.redirect("/tweetpage?workerid="+workerid)
          })
        })
    })


  }
})

})

router.post('/')
module.exports = router
