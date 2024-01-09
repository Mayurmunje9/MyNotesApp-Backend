const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotesSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    unique: true
  },
  tag: {
    type: String,
    default: "A Tag"
  },
  user: {
    type: Schema.Types.ObjectId,  // or type: String, depending on your setup
    ref: "User"  // Replace "User" with the actual model name for users
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("notes", NotesSchema);
