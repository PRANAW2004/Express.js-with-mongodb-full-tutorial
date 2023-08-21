//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var lodash1 = require("lodash");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

mongoose.connect("mongodb://127.0.0.1:27017/BlogWebsite");

const StartingSchema = new mongoose.Schema({
  name: String,
  content: String,
})

const c1 = new mongoose.Schema({
  Title: String,
  Body: String
})

const ComposeSchema = new mongoose.Schema({
  Date: String,
  Content: [c1]
})

const BlogStarting = mongoose.model("blogStartingData", StartingSchema);
const compose = mongoose.model("Compose",ComposeSchema);

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// const startdata = new BlogStarting({
//   name: "Home",
//   content: homeStartingContent,
// })
// const aboutdata = new BlogStarting({
//   name: "About",
//   content: aboutContent,
// })
// const contactdata = new BlogStarting({
//   name: "Contact",
//   content: contactContent,
// })
// startdata.save()
// aboutdata.save()
// contactdata.save()


const app = express();

let posts = [{Title: "Hello",Body:"How are you"},{Title: "Buddy",Body:"What are you doing"}];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// _________________________________________________________________________________________________________________________//

app.get("/", (req,res)=>{
  const res1 = BlogStarting.find();
  var bool = false
  
  res1.then((d1)=>{
    res.render("home", {
      homePageContent: homeStartingContent,
      homePost: d1
    })
  })
})
//________________________________________________________________________________________________________________________________//


app.get("/contact", (req,res)=>{
  const res1 = BlogStarting.find();
  res1.then((d1)=>{
    d1.forEach((i)=>{
      if(i.name === "Contact"){
        res.render("contact", {contactPageContent: i.content,homePost:posts});
      }
    })
  }) 
})

app.get("/home", (req,res)=>{
  res.redirect("/");
})
app.get("/about", (req,res)=>{
  const res1 = BlogStarting.find();
  res1.then((d1)=>{
    d1.forEach((i)=>{
      if(i.name === "About"){
        res.render("about", {aboutPageContent: i.content,homePost:posts});
      }
    })
  }) 
})

app.get("/compose", (req,res)=>{
  res.render("compose");
})



app.get("/posts/:id", (req,res)=>{
  console.log(req.prams.id);
  // posts.forEach(function(i){
  //   if(lodash1.lowerCase(req.params.id) === lodash1.lowerCase(i.title)){
  //     res.render("post", {postTitle: i.title, postBody: i.post});
  //   }
  // })

  // console.log("inside id");
})

app.post("/view",(req,res)=>{
  console.log("Inside post view");
  var a=req.body.anchor;
  console.log(a);
})

app.post("/compose", (req,res)=>{
  var postTitle = req.body.newTitle;
  var postBody = req.body.newPost;
  const compose1 = {
    Title: postTitle,
    Body: postBody
  }
  var bool = false;
  const res2 = compose.find();
  res2.then((d1)=>{
    d1.forEach((i)=>{
      if (i.Date === date.getDate()){
        const res3 = compose.updateOne({Date: date.getDate()},{$push: {Content: compose1}})
        res3.then(()=>{})
        bool = true;
      }
    })
    if(bool === false){
      const compose2 = new compose({
        Date: date.getDate(),
        Content: [compose1]
      })
      compose2.save()
    }
  })
  const res4 = compose.find();
  res4.then((d1)=>{
  })
  // const post = {
  //   title: postTitle,
  //   post: postBody,
  // }
  // posts.push(post);
  // console.log(posts)
  res.redirect("/");
})



app.listen(3001, function() {
  console.log("Server started on port 3000");
});
