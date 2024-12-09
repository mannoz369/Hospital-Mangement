const Listing = require("./models/listing.js");
const Review = require("./models/email.js");
const ExpressErrors = require("./utils/ExpressErros.js");
const { patientSchema, emailSchema } = require("./schema.js");


module.exports.isLoggedin = (req , res, next) => {
    if(!req.isAuthenticated()){
        //redirect info
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","Only Admin Login!");
        return res.redirect("/login");
      }
      next();
};







module.exports.validateListing = (req,res,next)=>{
  let {error} = patientSchema.validate(req.body); 
  
  if (error) {
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressErrors(400, result,errMsg)
    
  }else{
    next();
  }
};

module.exports.validateEmail = (req,res,next)=>{
  let {error} = emailSchema.validate(req.body); 
  
  if (error) {
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressErrors(400, result,errMsg)
    
  }else{
    next();
  }
};

