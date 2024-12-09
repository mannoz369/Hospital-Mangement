if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressErrors = require("./utils/ExpressErros.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport")
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")
const Listing = require("./models/listing.js");
const Email= require("./models/email.js")

const listingRoute = require("./routes/listing.js");
const emailRoute = require("./routes/email.js");
const userRoute = require("./routes/user.js");
const { cookie } = require("express/lib/response.js");

const {isLoggedin ,validateListing} = require("./middleware.js");
const wrapAsync = require("./utils/wrapAsync.js");


const mongo_url = "mongodb://localhost:27017/blessingClinic";
main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(mongo_url);
}
//middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const sessionOptions={
    secret: "blessingsecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.get("/",(req,res)=>{
    res.send("HI, I AM ROOT ");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currUser = req.user;
    next();
});




app.use("/listings",listingRoute);
app.use("/email",emailRoute);
app.use("/",userRoute);

app.use("/appointment",(req,res)=>{
    res.render("\listings/appointment.ejs");
});

app.use("/about",(req,res)=>{
    res.render("\listings/about.ejs");
});

app.use("/treatment",(req,res)=>{
    res.render("\listings/treatment.ejs");
});

app.use("/fertility",(req,res)=>{
    res.render("\listings/fertility.ejs");
});

app.use("/surgical",(req,res)=>{
    res.render("\listings/surgical.ejs");
});

app.use("/specialized",(req,res)=>{
    res.render("\listings/specialized.ejs");
});

app.use("/service",(req,res)=>{
    res.render("\listings/service.ejs");
});

app.use("/preventive",(req,res)=>{
    res.render("\listings/preventive.ejs");
});

app.use("/admin",isLoggedin,wrapAsync(async(req,res)=>{
    
    const patient = await Listing.find({});
    res.render("\listings/show.ejs",{patient});
}));


app.use("/diagnostic",(req,res)=>{
    res.render("\listings/diagnostic.ejs");
});

app.use("/doctor_single",(req,res)=>{
    res.render("\listings/doctor_single.ejs");
});

app.use("/doctor",(req,res)=>{ 
    res.render("\listings/doctor.ejs");
});

app.use("/department",(req,res)=>{
    res.render("\listings/department.ejs");
});

app.use("/department_single",(req,res)=>{
    res.render("\listings/department_single.ejs");
});

app.use("/confirmation",(req,res)=>{
    res.render("\listings/confirmation.ejs");
});

app.use("/contact",(req,res)=>{
    res.render("\listings/contact.ejs");
});

app.use("/all",isLoggedin,wrapAsync(async(req,res)=>{
    
    const patient = await Listing.find({});
    res.render("\listings/allappointments.ejs",{patient});
}));

app.get('/search', isLoggedin, wrapAsync(async (req, res) => {
    const { date, from, to } = req.query;
    let patient = [];

    if (date) {
        patient = await Listing.find({ Date: date });
    } else if (from && to) {
        patient = await Listing.find({ Date: { $gte: from, $lte: to } });
    }

    res.render("listings/allappointments.ejs", { currUser: req.user, patient });
}));




app.all("*",(req,res,next)=>{
  next(new ExpressErrors(404,"Page not Found!!"));
});
app.use((err,req,res,next)=>{
  let {statusCode=500,message="Something went wrong"} = err;
  res.status(statusCode).render("listings/error.ejs", {message});
  // res.status(statusCode).send(message);
});
app.listen(8080,()=>{
    console.log("server is listing");
});
