const User = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.userSignup = async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      surname,
      gender,
      phone_number,
      address,
      email,
      password,
    } = req.body;
    if (
      !first_name ||
      !last_name ||
      !surname ||
      !email ||
      !phone_number ||
      !password
    ) {
      return res.status(400).json({ message: "please fill all fields" });
    }
    const checkUserExist = await User.findOne({ email, phone_number});
    if (checkUserExist) {
      return res.status(409).json({ message: "user already exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      first_name,
      last_name,
      surname,
      gender,
      phone_number,
      address,
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
