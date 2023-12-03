const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/facebook");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  fastName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  
  password: {
    type: String
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "post"
  }]
});

userSchema.plugin(plm);
module.exports = mongoose.model("user", userSchema);