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
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    emailtoken: {
      type: String,
    },
    validMeansOfIdentification: {
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
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", userSchema);