if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");

const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");



// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

async function main(){
    await mongoose.connect(dbUrl);
}
main()
.then(() => {
    console.log("connected to DB")
})
.catch((err) => {
    console.log(err);
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
// app.engine('ejs', engine);
//or
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

//session - npm i express-session , flash - npm i connect-flash
const sessionOptions = {
    secret : "mysupersecretcode",
    resave : false,
    saveUninitialzied : true,
    cookie : {
    //if we set cookie expired within a week    
        //presentDate + daysIn1week*hoursIn1day*minIn1hour*secIn1min*miliSecIn1sec
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,//these are 1 week miliSeconds
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
};

// app.get("/", (req,res) => {
//     res.send("Hi I am Iphat");
// });

app.use(session(sessionOptions));
app.use(flash());

//to implement passport session is required
//A middleware that initializes passport
app.use(passport.initialize());
//A web application needs the ability to identify users as they browse from page to page.this series of reqs & resps, each associated with the same user, is known as a session
app.use(passport.session());
//authenticate() Generates a function that is used in Passport's LocalStrategy
passport.use(new localStrategy(User.authenticate()));
//serializeUser() Generates a function that is used by Passport to serialize(user related info saved in session) users into the session
passport.serializeUser(User.serializeUser());
//deserializeUser() Generates a function that is used by Passport to deserialize users into the session
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // console.log(res.locals.success);
    next();
});

// app.use("/demouser",async(req,res) => {
//    let fakeUser = new User({
//     email : "iphat05@gmail.com",
//     username : "iphat",//in schema only email is define but passportLocalMongoose add username automatically
//   });
//    //register(user, password, callback) Convenience method to register a new user instance with a given password.Checks if username is unique
//    const registeredUser = await User.register(fakeUser,"hello123");
//    res.send(registeredUser);
// });
//use flash before the routes required
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


//install - npm i ejs-mate - It helps in creating templete 


// app.get("/testListing",async (req,res) => {
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute, Goa",
//         contry:"India"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

app.all("*",(req,res,next) => {
    next(new ExpressError(404,"Page not found!"));
});

//custom error handling
app.use((err,req,res,next) => {
    let{statusCode = 500, message = "something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{message});
    // res.render("error.ejs",{err});
});

app.listen(8080, () => {
  console.log("app is listening to the port 8080");
});

//nmp init,express,mongoose,ejs
