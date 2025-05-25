import bcrypt from "bcryptjs";
import Customer from "../../model/Customer.model.js";
import { validationResult } from "express-validator";
import { Helpers } from "../../Helpers/Helper.js";
import { Templete } from "../../Utils/templete.js";
import { Token } from "../../Utils/jwt.auth.js";

export const GetCustomer = async (req, res) => {
  try {
    const result = await Customer.find();
    if (!result) {
      return res.status(404).json({ msg: "Customer Data Not Available" });
    }
    return res.status(200).json({ msg: "Succcessfully Get Data", result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Get Data Customer", error });
  }
};
export const GetOne = async (req, res) => {
  try {
    const data = await Customer.findOne({ _id: req.params.id });
    if (!data) {
      return res.status(404).json({ msg: "Customer Data Not Available" });
    }
    return res.status(200).json({ msg: "Succcessfully Get Data", data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Get Data Customer", error });
  }
};

export const SignUp = async (req, res) => {
  try {
    console.log("============Sign up ", req.body);

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ msg: "Validation Error", errors: errors.array() });
    }

    let { name, email, password, mobile } = req.body;
    const salt = bcrypt.genSaltSync(10);
    password = bcrypt.hashSync(password, salt);

    const helper = new Helpers();
    const otp = helper.generateOtp(4);

    const existingUser = await Customer.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User already exists with this email" });
    }

    const newUser = new Customer({ name, email, password, otp, mobile });
    await newUser.save();

    let data = {
      otp: newUser.otp,
      year: new Date().getFullYear(),
      appName: process.env.APP_NAME,
      name: newUser.name,
      email: newUser.email,
      subject: "Send OTP Jaldi",
    };
    const templateData = new Templete().getOtpTemplete(data);
    helper.sendMail(data, templateData);
    return res.status(200).json({ msg: "Signup Successful", user: newUser });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ msg: "ERROR SIGN-UP", error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, otp } = req.body;
    let result = await Customer.findOne({ email });
    if (result) {
      let OTP = result.otp;
      if (otp === OTP) {
        let token = new Token();
        let tokenObj = {
          _id: result._id,
          name: result.name,
          email: result.email,
          mobile: result.mobile,
        };
        let tokenData = token.tokenGanrate(tokenObj);
        // res.cookie(process.env.COOKIE_PREFIX || 'easy_solution', data);
        // res.json({ success: true, message: "Cookie set" });
        return res
          .status(200)
          .json({ msg: "verify Successfully : ", token: tokenData, user: result });
      }
      return res.status(401).json({ msg: "WRONG OTP" });
    }
    return res.status(401).json({ msg: "Email Not Found" });
  } catch (error) {
    return res.status(500).json({ msg: "ERROR OTP Verify" });
  }
};

export const SignIn = async (req, res) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const result = await Customer.findOne({ email });
    if (result) {
      let status = bcrypt.compareSync(password, result.password);
      if (status) {
        let token = new Token();
        let tokenObj = {
          _id: result._id,
          name: result.name,
          email: result.email,
          mobile: result.mobile,
        };
        let data = token.tokenGanrate(tokenObj);
        res.cookie("costomer", data);
        return res
          .status(200)
          .json({ msg: "Sign-In Successfully : ", token: data, user: result });
      }
      return res.status(401).json({ msg: "Invalid Password" });
    } else {
      return res.status(401).json({ msg: "invalid Email" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "ERROR SIGN-IN ", error });
  }
};

export const ForgatePassword = async (req, res) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let { email } = req.body;
    const result = await Customer.findOne({ email });
    if (!result) {
      return res.status(404).json({ msg: "User not found" });
    }
    const helper = new Helpers();
    const otp = helper.generateOtp(4);
    result.otp = otp;
    await result.save();
    let data = {
      otp: otp,
      year: new Date().getFullYear(),
      appName: process.env.APP_NAME,
      name: result.name,
      email: result.email,
      subject: "Send OTP Jaldi Bhejo Yaar",
    };
    const templatedata = new Templete().forgatePassword(data);
    helper.sendMail(data, templatedata);
    return res.status(200).json({ msg: "OTP sent successfully", user: result });
  } catch (error) {
    console.error("Forgate Password Error:", error);
    return res
      .status(500)
      .json({ msg: "ERROR Forget Password", error: error.message });
  } //================ Forgot Password ==========================
};

export const ChangePassword = async (req, res) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let { email, newpassword, confirm_password } = req.body;
    if (newpassword !== confirm_password) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }
    const result = await Customer.findOne({ email });
    if (!result) {
      return res.status(404).json({ msg: "Email not found" });
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newpassword, salt);
    result.password = hashedPassword;
    await result.save();
    return res
      .status(200)
      .json({ msg: "Password changed successfully", user: result });
  } catch (error) {
    console.error("Change Password Error:", error);
    return res
      .status(500)
      .json({ msg: "ERROR Change Password", error: error.message });
  } //==================== Change Password ===================================================
};

export const UpdateProfile = async (req, res) => {
  try {
    const id = req.params.id;

    req.body.image = req.file.filename;

    const result = await Customer.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!result) {
      return res.status(404).json({ msg: "User does not exist" });
    }

    let image;
    if (req.files && req.files.image) {
      image = req.files.image.path;
    }

    return res
      .status(200)
      .json({ msg: "Profile updated successfully", user: result });
  } catch (error) {
    console.error(error);
    console.log(error);
    return res.status(500).json({ msg: "Error updating profile" });
  }
};
