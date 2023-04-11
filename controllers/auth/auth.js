const createError = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/user/user");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const errorFormatter = require("../../utils/validationErrorFormatter");

const signup = async (req, res, next) => {
  try {
    let errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: 0,
        status: 400,
        message: errors.mapped(),
      });
    }
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const generatedURL = crypto.randomBytes(10).toString("hex");
    alreadyExist = await User.find({ email: email });
    let add = [];
    if (alreadyExist === null || alreadyExist.length == 0) {
      add = new User({
        name: name,
        email: email,
        password: hashedPassword,
        url: generatedURL,
        tag: uuidv4(),
      });
    } else {
      return next(createError(400, "user already exist"));
    }
    const user = await add.save();
    return res.status(201).json({ success: 1 });
  } catch (error) {
    return next(createError(error));
  }
};

const login = async (req, res, next) => {
  try {
    let errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: 0,
        status: 400,
        message: errors.mapped(),
      });
    }
    const { email, password } = req.body;
    user = await User.findOne({ email: email });
    if (user === null || (user.length == 0 && !password)) {
      return next(createError(401, "please provide valid credential"));
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) {
      const access_token = jwt.sign(
        {
          name: user.name,
          email: user.email,
          id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "84600s",
        }
      );
      return res.status(200).json({
        success: 1,
        status: 200,
        message: "Successfully, Login",
        access_token: access_token,
      });
    } else {
      return next(createError(401, "please provide valid credential"));
    }
  } catch (error) {
    return next(createError(error));
  }
};

module.exports = {
  signup,
  login,
};
