const mongoose = require("mongoose");
const mongoURI = "mongodb+srv://mayurmunje9:mmavenger9@cluster0.xgirilj.mongodb.net/";

async function connectToMongo() {
    await mongoose.connect(mongoURI)
        .then(() => console.log("Connected to Mongo Successfully"))
        .catch(err => console.log("Error occurred => " + err));
}

module.exports = connectToMongo;
