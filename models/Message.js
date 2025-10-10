const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: String,
  text: String,
}, { timestamps: true });  // <-- this auto adds createdAt, updatedAt

module.exports = mongoose.model("Message", messageSchema);


