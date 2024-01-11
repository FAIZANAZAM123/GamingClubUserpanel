const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config({ path: './config.env' });


const adminSchema = new mongoose.Schema({
    adminname: { 
         type: String,
         required: true, 
         unique: true },
    email: {
        type: String, 
        required: true,
         unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    tokens: [
        {
          token: {
            type: String,
            required: true
          }
        }
      ]
});


adminSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 12);
      console.log("here ", this.password)
    }
    next();
  });
  
  adminSchema.methods.generateAuthToken = async function () {
    try {
      let tokenss = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
  
      this.tokens = this.tokens.concat({ token: tokenss })
  
      await this.save();
      return tokenss
    } catch (error) {
  
    }
  };

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
