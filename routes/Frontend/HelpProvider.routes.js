import express from "express";
const route = express.Router();
import { ApplyInHelp, Update, HelpRequest } from "../../controller/Frontend/HelpProvider.Controller.js";

// route.get("/get-provider", GetProvider);         // Get Provider

route.get("/help-request/:id", HelpRequest);           // Help Request Notifications

route.post("/apply", ApplyInHelp);                   // Help Apply

route.post("/change-status/:id", Update);               // Help Apply

export default route;