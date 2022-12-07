const User = require("../model/user.model");
const nodemailer = require("nodemailer");
// const { v4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const _ = require("lodash");
const saltRounds = 10;

const Flutterwave = require("flutterwave-node-v3");
const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY
);
// const details = {
//   email: "developers@flutterwavego.com",
// };
// flw.VirtualAcct.create(details).then(console.log).catch(console.log);

// exports.VirtualAcct = async (req, res, next) =>{
//   try {
//     const { email, bvn,} = req.body;
//   } catch (error) {
    
//   }
// }

const transporter = nodemailer.createTransport({
  service: process.env.MAIL,
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

exports.userSignup = async (req, res, next) => {
  try {
    
      const {
      firstName,
      middleName,
      lastName,
      phoneNumber,
      email,
      password,
      confirmPassword,
    } = req.body;
    if (
      !firstName ||
      !middleName ||
      !lastName ||
      !phoneNumber ||
      !email ||
      !password ||
      !confirmPassword
    )
     {
      return res.status(400).json({ message: "please fill all fields" });
    }
        if (password != confirmPassword) {
          return res.status(409).json({
            message: "The entered passwords do not match!",
          });
        }

    const checkUserExist = await User.findOne({ email, phoneNumber });
    if (checkUserExist) {
      return res.status(409).json({ message: "user already exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      middleName,
      lastName,
      phoneNumber,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Email Already Exists" });
  }
};

exports.userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!(password && email)) {
      return res.status(400).json({ message: "complete the fields" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    const payload = {
      _id: user._id,
    };

    const token = await jwt.sign(payload, "secret key using", {
      expiresIn: "1d",
    });
    res.cookie("access-token", token);
    return res
      .status(202)
      .json({ message: "user logged in successfully", token: token });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: error.message, message: "internal server error" });
  }
};


exports.updateKyc= async (req, res) => {
  try {
    const {
      address,
      validMeansOfIdentification,
      number,
      bvn,
    } = req.body;
    const id = req.query.id;
      // const tx_ref = v4();
    if (
      !address ||
      !validMeansOfIdentification ||
      !number||
      !bvn 
    ) {
      return res.status(400).json({ message: "please fill all fields" });
    }
    

console.log (id)
    const updateKyc = await User.findByIdAndUpdate(
      
        id,
      {
        address,
        validMeansOfIdentification,
        number,
        bvn,
      },
      { new: true }
    );
    var axios = require("axios");
    var data = JSON.stringify({
      email: "hammedolalekan60@gmail.com",
      is_permanent: true,
      bvn: "22244540348",
      tx_ref: "trdw345678987654",
      phonenumber: "08165594823",
      firstname: "Harmed",
      lastname: "Olalekan",
      narration: "Angela Ashley-Osuzoka",
    });

    var config = {
      method: "post",
      url: "https://api.flutterwave.com/v3/virtual-account-numbers",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer FLWSECK_TEST-SANDBOXDEMOKEY-X",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });

    return res
      .status(200)
      .json(
        { message: "updated successfully", updateKyc }
      );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.transactionPin = async (req, res) => {
  try {
    const {
      transactionPin,
      confirmTransactionPin,
    } = req.body;
    const id = req.query.id;
    if (

      !transactionPin ||
      !confirmTransactionPin
    ) {
      return res.status(400).json({ message: "please fill all fields" });
    }
    if (transactionPin != confirmTransactionPin) {
      return res.status(409).json({
        message: "The entered pin do not match!",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedTransactionPin = await bcrypt.hash(transactionPin, salt);

    const updateTransPin = await User.findByIdAndUpdate(
      id,
      {
        transactionPin: hashedTransactionPin,
      },
      { new: true }
    );
    return res.status(200).json({ message: "updated successfully", updateTransPin });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};


exports.getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.find({ email:email });
    return res.status(200).json({ data: user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server error",
    });
  }
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  const user = User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json({ error: error.message, message: "user does not exist" });
  }
  const token = jwt.sign({ _id: user._id }, process.env.RESET_LINK_KEY, {
    expiresIn: process.env.RESET_LINK_KEY_TTL,
  });
  let OTP = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    digits: true,
  });
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_MAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: "compactpay22@gmail.com",
    to: email,
    subject: ` Your Forgot Password Mail `,
    html: `
    <h2> This is your reset Password OTP</h2>
    <p>Here is your otp: ${OTP}</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    }
    console.log("Email Sent to " + info.accepted);
  });
  return user.updateOne({ otp: OTP }, (err) => {
    if (err) {
      return res.status(400).json({ error: "reset password link error" });
    } else {
      return res.status(200).json({ message: "follow the instructions" });
    }
  });
};

exports.resetPassword = async(req, res, next) =>{
  const {newPassword, confirmPassword,email, otp }= req.body;
  
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(newPassword, salt);
      if (newPassword != confirmPassword) {
    console.log({message: "password does not match"});
          };
      User.findOne({ otp }, (err, user) => {
        if (err || !user) {
          return res
            .status(400)
            .json({ error: "user with this token or otp does not exist" });
        }

        const obj = {
          password: hash,
        };

        user = _.extend(user, obj);
        user.save((err) => {
          if (err) {
            return res.status(400).json({ error: "reset password error" });
          } else {
            return res.status(200).json({
              message: "your password has been changed succesfully",
            });
          }
        });
      });
  const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.USER_MAIL,
          pass: process.env.PASSWORD,
        },
      });

      const mailOptions = {
        from: "compactpay22@gmail.com",
        to: email,
        subject: ` Your Password has been updated `,
        html: `
      <h2> Here's your new password </h2>
      <p> new password: ${confirmPassword}</p>
      `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        }
        console.log("Email Sent to " + info.accepted);
      });
    // } else {
    //   return res.status(401).json({ error: "authentication error" });
    // }
  } catch (error) {
        next(error);
  }
}