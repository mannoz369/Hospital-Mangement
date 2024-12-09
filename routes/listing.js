const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedin,validateListing} = require("../middleware.js");




//index route
router.get("/", wrapAsync(async(req,res) =>{
    const allListings = await Listing.find({});
    res.render("\listings/index.ejs",{allListings});
}));


  //Create Route
  router.post("/",validateListing,wrapAsync(async (req, res,next) => {
    const newListing = new Listing(req.body.listing);
    
    await newListing.save();
    
    res.redirect("/confirmation");
 })
 );


//Delete Route
router.post('/:id/cancel',isLoggedin,wrapAsync(async (req, res) => {
  
  const appointmentId = req.params.id;
  await Listing.updateOne({ _id: appointmentId }, { $set: { cancel: true } });
  req.flash("success", "Appointmnet Canceled!");
  res.redirect("/admin");
}));

router.post('/:id/done',isLoggedin,wrapAsync(async(req, res) => {
  const appointmentId = req.params.id;
  await Listing.updateOne({ _id: appointmentId }, { $set: { Status: false } });
  req.flash("success", "Patient Consulted");
  res.redirect('/admin'); 
  
}));



module.exports = router;