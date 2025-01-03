const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport")
const {saveRedirectUrl} = require("../middleware.js")

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});
// signup for admin to create admin

router.post("/signup", wrapAsync(async(req,res)=>{
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Blessing-Well Clinic!");
            res.redirect("/listings");
        });
        
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));


router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
    if(currUser) {
        res.render("/admin");
    }
    
});


router.post("/login",passport.authenticate("local", { failureRedirect: "/login", failureFlash: true}) , async(req,res)=>{
    req.flash("success","Welcome to Blessing-Well Beign Clinic ! You are logged in as Admin.");
    res.redirect("/admin");
    
});

router.get("/logout",( req, res, next) => {
    req.logOut((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "You are Logged out!");
        res.redirect("/listings")
    })
})
module.exports = router;