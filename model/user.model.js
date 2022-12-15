const mongoose = require ("mongoose");


const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,

    },
    middleName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      
    },
    address: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      
    },
    
    validMeansOfIdentification: {
      type: String,
      enum: ["Nin", "DriversLicense", "VotersCard", "InternationalPassport"],
      
    },
    number: {
      type: String,
    },
    bvn: {
      type: String,
      
      },
    transactionPin: {
      type: String,
      maxlength: 4,
      minlength: 4,
    },
    password: {
      type: String,
      required: true,
      
    },
    otp: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", userSchema);