const User = require("../model/user.model");
const nodemailer = require("nodemailer");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


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

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(409).json({
        message: "Input your email",
      });
    }
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({
        message: "Invalid Email",
      });
    }

    const secret = process.env.JWT_SECRET + user.password;
    const payload = {
      email: user.email,
      id: user._id,
    };
    const token = jwt.sign(payload, secret, { expiresIn: "15m" });

    const mailOptions = {
      from:  '"Verify your email" <process.env.USER_MAIL>',
      to: user.email,
      subject: "compactpay - Reset your password",
      html: `<h2> ${user.firstname} ${user.lastname} </h2> 
              <h2> Thank you for using compactpay  </h2> 
             <h4> Please click on the link to continue..... </h4>
             <a href="${process.env.CLIENT_URL}/api/reset-password/${user._id}/${token}">Reset Your Password</a>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email Sent");
      }
    });
    const user_info = {
      message: "Reset password link is sent to your email",
    };
    return res.status(201).json(user_info);
  } catch (error) {
    next(error);
  }
};

exports.resetPasswordpage = async (req, res, next) => {
  try {
    const { id, token } = req.params;

    const user = await Client.findById({ _id: id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const secret = process.env.JWT_SECRET + user.password;
    const payload = jwt.verify(token, secret);
    res.render("reset-password", { email: user.email });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { id, token } = req.params;
    const { password, confirmPassword } = req.body;

    const user = await Client.findById({ _id: id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const secret = process.env.JWT_SECRET + user.password;
    const payload = jwt.verify(token, secret);
    if (!payload) {
      throw new Error();
    }
    req.user = payload;

    if (!password || !confirmPassword) {
      return res.status(409).json({
        message: "Please Fill All Fields",
      });
    }
    if (password != confirmPassword) {
      return res.status(409).json({
        message: "The entered passwords do not match!",
      });
    }
    const hashedPassword = await passwordHash(password);
    if (user) {
      user.password = hashedPassword;
      await user.save();
      const user_info = {
        message: "Reset Password Successful",
      };
      return res.status(201).json(user_info);
    } else {
      const no_reset = {
        message: "Reset Password Not Successful",
      };
      return res.status(409).json(no_reset);
    }
  } catch (error) {
    next(error);
  }
};



exports.updateKyc= async (req, res) => {
  try {
    const {  address,
        validMeansOfIdentification,
        bvn,
        transactionPin,
        confirmTransactionPin 
        }
         = req.body;
    const id = req.query.id;
    if (
      !address ||
      !validMeansOfIdentification ||
      !bvn ||
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

console.log (id)
// const user = await User.findById({ id });
// if (!user) {
//       return res.status(404).json({ message: "user does not exist" });
//     }
    const updateKyc = await User.findByIdAndUpdate(
      
        id,
      {
        address,
        validMeansOfIdentification,
        bvn,
        transactionPin: hashedTransactionPin,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "updated successfully", updateKyc });
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



