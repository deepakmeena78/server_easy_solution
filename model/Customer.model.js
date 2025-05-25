import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    default: null,
  },
  mobile: {
    type: String,
    default: null,
    unique: false,
  },
  location: {
    type: String,
    default: null,
  },
  pincode: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  otp: {
    type: String,
    required: true,
  },
});

const Cunstomer = mongoose.model("Customer", userSchema);
export default Cunstomer;
