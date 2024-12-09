const mongoose = require("mongoose");
const Schema = mongoose.Schema;
    
const { date, string } = require("joi");

const emailSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
   
});
const Email= mongoose.model("emailids", emailSchema)
module.exports = Email;