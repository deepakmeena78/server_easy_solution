import express from "express";
import { globalSearch } from "../../controller/Frontend/Dashboard.controller.js";
const route = express.Router();

route.get("/global-search", globalSearch);


export default route;