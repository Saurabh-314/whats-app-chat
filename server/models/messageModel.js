const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  to: { type: String, required: true },
  from: { type: String, required: true },
  author: { type: String, required: true },
  message: { type: String, required: true },
  time: { type: String, required: true },

});

module.exports = mongoose.model("Messages", messageSchema);