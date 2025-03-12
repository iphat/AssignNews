const User = require("../models/user");

//signUp
module.exports.renderSignupForm = (req,res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res) => {
   try{
        let {username,email,password} = req.body;//extrct this from users body
    const newUser = new User({email,username});
    //".register" is used to register the user in DB
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    // passport.authenticate() middleware invokes req.login() automatically. This function is primarily used when users sign up, during which req.login() can be invoked to automatically login the newly registered user
    req.login(registeredUser, (err) => {
      if(err) {
        return next(err);
      }
      req.flash("success","welcome to wanderlust");
      res.redirect("/listings");
    });
  }catch(err){
    req.flash("error",err.message);
    res.redirect("/signup");
  }
};

//login

module.exports.login =  (req,res) => {
    res.render("users/login.ejs");
};

module.exports.renderLoginForm = async(req,res) => {
    req.flash("success","welcome to wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);//define in middleware.js
};

//loggedout
module.exports.logout = (req,res) => {
    req.logout((err) => {
      if(err) {
        return next(err);
      }
      req.flash("success", "you are logged out!");
      res.redirect("/listings");
    })
  };