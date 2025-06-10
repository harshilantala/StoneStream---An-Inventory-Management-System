// // models/register.js
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');


// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   mobileNo: {
//     type: String,
//     required: true,
//   },
//   shopName: {
//     type: String,
//     required: true,
//   },
//   address: {
//     type: String,
//     required: true,
//   },
//   photo: {
//     type: String,
//     required: false,
//   }
// });


// UserSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) {
//     return next(); 
//   }
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt); 
//     next();
//   } catch (error) {
//     next(error); 
//   }
// });


// UserSchema.methods.comparePassword = async function(enteredPassword) {
//   const ans = enteredPassword == this.password ? true:false;
//   console.log("entered pass = "+enteredPassword);
//   console.log("old password = "+this.password);
  
  
//   console.log(ans);
  
//   return ans;
// };


// module.exports = mongoose.model('User', UserSchema);
// models/register.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: String,
    required: true,
  },
  shopName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: false,
  }
});




module.exports = mongoose.model('User', UserSchema);
