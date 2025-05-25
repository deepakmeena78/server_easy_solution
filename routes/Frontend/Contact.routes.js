import express from "express";
import { createContact } from "../../controller/Frontend/Contact.controller.js";
const route = express.Router();

route.post("/create", createContact);

export default route;
