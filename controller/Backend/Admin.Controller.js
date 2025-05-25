import bcrypt from "bcryptjs";
import Admin from "../../model/Admin.model.js";
import { validationResult } from "express-validator";
import { Helpers } from "../../Helpers/Helper.js";
import { Templete } from "../../Utils/templete.js";
import { Token } from "../../Utils/jwt.auth.js";



export const SignUp = async (req, res) => {                               // Sign-Up
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let { name, email, password, mobile } = req.body;

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const helper = new Helpers();
        const otp = helper.generateOtp(4);

        const newUser = new Admin({ name, email, password: hashedPassword, mobile, otp });
        const result = await newUser.save();

        let data = {
            otp: result.otp,
            year: new Date().getFullYear(),
            appName: process.env.APP_NAME,
            name: result.name,
            email: result.email,
            subject: "Send OTP Jaldi send kar yaar",
        };

        const templateData = new Templete().getOtpTemplete(data);
        helper.sendMail(data, templateData);

        return res.status(200).json({ msg: "Sign Up Successful", user: result });
    } catch (error) {
        console.error("Sign-Up Error:", error);
        return res.status(500).json({ msg: "ERROR SIGN-UP", error: error.message });
    }  //------------------------ Sign-Up ------------------------------
};



export const verifyOtp = async (req, res) => {                             // Verify OTP
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, otp } = req.body;
        let result = await Admin.findOne({ email });
        if (!result) {
            return res.status(404).json({ msg: "Email Is Wrong" });
        }

        if (result) {
            let OTP = result.otp;
            if (otp === OTP) {
                let token = new Token();
                let tokenObj = {
                    id: result.id,
                    name: result.name,
                    email: result.email,
                    mobile: result.mobile,
                }
                let data = token.tokenGanrate(tokenObj);
                res.cookie("admin", data);
                return res.status(200).json({ msg: "Sign-In Successfully : " });
            }
            return res.status(401).json({ msg: "WRONG OTP" });
        }
        return res.status(401).json({ msg: "Email Not Found" });
    } catch (error) {
        return res.status(500).json({ msg: "ERROR OTP Verify" });
    }//====================== Verify OTP ==========================================
}



export const SignIn = async (req, res) => {                                 // Sign - In
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        const result = await Admin.findOne({ email });
        if (result) {
            let status = bcrypt.compareSync(password, result.password);
            if (status) {
                let token = new Token();
                let tokenObj = {
                    id: result.id,
                    name: result.name,
                    email: result.email,
                    mobile: result.mobile,
                }
                let data = token.tokenGanrate(tokenObj);
                res.cookie("token", data);
                return res.status(200).json({ msg: "Sign-In Successfully : " });
            }
            return res.status(401).json({ msg: "Invalid Password" });
        } else {
            return res.status(401).json({ msg: "invalid Email" });
        }
    } catch (error) {
        return res.status(500).json({ msg: "ERROR SIGN-IN ", error });
    }
}//====================== Sign - In =====================================
