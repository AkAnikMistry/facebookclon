var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const passport = require("passport");
const upload = require("./multer")

const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));


/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.render('index', { error: req.flash("error") });
});
// router.get('/login', function(req,res){
//   console.log(req.flash("error")); 
//   res.render("/");
// });

router.get('/profile',IsLoggedIn, async function(req,res){
  const user = await userModel.findOne({
    username: req.session.passport.user
  }).populate("posts")
  res.render("profile", {user});
});

router.post("/upload",IsLoggedIn ,upload.single("file"),async function(req,res,next){
  if(!req.file){
    return res.status(404).send("no file were given");
  }
  const user = await userModel.findOne({username: req.session.passport.user});
  const post = await postModel.create({
    image: req.file.filename,
    user: user._id
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
  

})

router.post('/register', function(req,res){
  var userdata = new userModel({
    username: req.body.username,
    fastName: req.body.fastName,
    lastName: req.body.lastName
    

  });
  userModel.register(userdata, req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res, function(){
      res.redirect('/profile');
    });
  });
});

router.post('/login', passport.authenticate("local",{
  successRedirect: "/profile",
  failureRedirect: "/",
  failureFlash: true
}), function(req,res){});


function IsLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
};

module.exports = router;
