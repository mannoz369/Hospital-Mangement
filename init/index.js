const mongoose = require("mongoose");

const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://localhost:27017/blessingClinic";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}


