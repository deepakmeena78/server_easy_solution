import express from "express";
import {
  GetCustomer,
  SignUp,
  verifyOtp,
  SignIn,
  ForgatePassword,
  ChangePassword,
  UpdateProfile,
  
  GetOne,
} from "../../controller/Frontend/Customer.controller.js";
const route = express.Router();
import { body } from "express-validator";
import { upload } from "../../Helpers/multer.js";

route.get("/get-customer", GetCustomer); // Get Customer
route.get("/show/:id", GetOne); // Get Customer

route.post(
  "/sign-up", //  Sign-Up
  body("name", "Name is required.").notEmpty(),
  body("email", "Invalid email address.").isEmail(),
  body("email", "Email is Required").notEmpty(),
  body("password", "Password Is Required").notEmpty(),
  SignUp
);

route.post(
  "/verify", // OTP Verify
  body("email", "Invalid email address.").isEmail(),
  body("email", "Email is Required").notEmpty(),
  body("otp", "OTP Is Required").notEmpty(),
  verifyOtp
);

route.post(
  "/sign-in",
  body("email", "Invalid email address.").isEmail(), // Sign-in
  body("email", "email is address.").notEmpty(),
  body("password", "Password Is Required").notEmpty(),
  SignIn
);

route.post(
  "/forgate-password",
  body("email", "Invalid email address.").isEmail(), // Forgate Password
  body("email", "Email Is Required.").notEmpty(),
  ForgatePassword
);

route.post(
  "/change-password", // Password Change
  body("email", "Invalid email address.").isEmail(),
  body("email", "Email is Required").notEmpty(),
  body("newpassword", "Password Is Required"),
  body("confirm_password", "Password Is Required"),
  ChangePassword
);

route.post(
  "/update-profile/:id",
  upload.single("image"),
  UpdateProfile
);

export default route;
