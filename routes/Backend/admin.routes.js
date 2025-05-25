import express from "express";
import { SignUp, verifyOtp, SignIn } from "../../controller/Backend/Admin.Controller.js";
const route = express.Router();
import { body } from "express-validator";

route.post("/sign-up",
    body("name", "Name is required.").notEmpty(),                  // Sign-Up
    body("email", "Invalid email address.").isEmail(),
    body("email", "Email Is Required").notEmpty(),
    body("password", "Password is Required").notEmpty(),
    body("mobile", "Mobile Number is Required").notEmpty(),
    SignUp);


route.post("/verify",                                                // OTP Verify
    body("email", "Email is Required").notEmpty(),
    body("email", "Invalid email address").isEmail(),
    body("otp", "OTP is Required").notEmpty(),
    verifyOtp);


route.post("/sign-in",                                                // Sign-in
    body("email", "Invalid email address.").isEmail(),
    body("email", "Email Is Required").notEmpty(),
    body("password", "Password is Required").notEmpty(),
    SignIn);


export default route;
