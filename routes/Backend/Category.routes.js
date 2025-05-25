import express from "express";
const route = express.Router();
import {CategoryGet, Category, Update, Delete } from "../../controller/Backend/Category.controller.js";
import { body } from "express-validator";
import { upload } from "../../Helpers/multer.js";

route.get("/category-get",CategoryGet);

route.post("/category-create", upload.single("gallery"),                          // Category
    body("category", "Category is Required").notEmpty(),
    Category);


route.post("/category-update/:id",                                                // Update
    body("category", "Category is Required").notEmpty(),
    Update);


route.delete("/category-delete/:id", Delete);                                    // Delete


export default route;
