import express from "express"
const route = express.Router();
import { body } from "express-validator";
import { ReviewGive,Delete } from "../../controller/Frontend/Review.controller.js";


route.post("/give",
    body("rating", "Rating is Required").notEmpty(),
    ReviewGive);

route.post("/delete/:id",Delete);

export default route;