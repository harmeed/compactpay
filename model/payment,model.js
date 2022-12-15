const mongoose = require('mongoose');


const paymentSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  first_name: {
    type: String,
  },
  middle_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  phone: {
    type: String,
  },
  preferred_bank: {
    type: String,
  },
  country: {
    type: String,
  },
  account_number: {
    type: String,
  },
  bvn: {
    type: String,
  },
  bank_code: {
    type: String,
  },
},
{
    timestamps: true
}
);




module.exports = mongoose.model('Payment', paymentSchema);