const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config({ path: './config.env' });







const userSchema = new mongoose.Schema({


  email: {
    type: String,
    required: true,
    unique: true
  },

  discordname: {
    type: String,
    required: true,

  },
  username: {
    type: String,
    required: true,
    unique: true

  },


  password: {
    type: String,
    required: true,
    minlength: 6
  },

  role:{

    type: String
  }
  ,

  isApproved: { type: Boolean, default: false }
,

  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
    console.log("here ", this.password)
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  try {
    let tokenss = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);

    this.tokens = this.tokens.concat({ token: tokenss })

    await this.save();
    return tokenss
  } catch (error) {

  }
};

const User = new mongoose.model('users', userSchema);

module.exports = User;
