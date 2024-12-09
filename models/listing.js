const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { date, string } = require("joi");
const patientSchema = new Schema({
    doctor: {
        type: String,
        required: true,
    },
    reason: String,
    Date: String,
    Phone_no: String,
    Name: String,
    Slot: String,
    Status: {
        type: Boolean,
        default: true,
    },
    cancel: {
        type: Boolean,
        default: false,
    },
});


const Listing = mongoose.model("patient",patientSchema);
module.exports = Listing;