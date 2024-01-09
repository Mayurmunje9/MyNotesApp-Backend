const mongoose = require("mongoose");
const mongoURI = "mongodb://127.0.0.1:27017/CWH";

async function connectToMongo() {
    await mongoose.connect(mongoURI)
        .then(() => console.log("Connected to Mongo Successfully"))
        .catch(err => console.log("Error occurred => " + err));
}

module.exports = connectToMongo;
