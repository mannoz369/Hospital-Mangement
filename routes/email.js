const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressErrors = require("../utils/ExpressErros.js")
const Email = require("../models/email.js");
const {validateEmail} = require("../middleware.js");


  router.post("/",validateEmail,wrapAsync(async (req, res,next) => {
    const { email } = req.body.email;
    
    // Check if the email is already in the database
    const existingEmail = await Email.findOne({ email });
    
    if (existingEmail) {
        // If the email already exists, flash a message and redirect
        req.flash("error", "You are already subscribed");
        return res.redirect("/listings");
    }

    // If the email does not exist, create a new one and save it
    const newEmail = new Email({ email });
    await newEmail.save();
    req.flash("success", "Subscribed");
    res.redirect("/listings");
 })
 );


  module.exports = router;