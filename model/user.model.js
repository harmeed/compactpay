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
    emailtoken: {
      type: String,
    },
    validMeansOfIdentification: {
      type: String,
      enum: ["Nin", "DriversLicense", "VotersCard", "InternationalPassport"],
      unique: true,
    },
    bvn: {
      type: String,
      unique: true,
    },
    transactionPin: {
      type: String,
      maxlength: 4,
      minlength: 4,
    },
    password: {
      type: String,
      required: true,
      unique: true,
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