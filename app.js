import express from "express";
import CustomerRoute from "./routes/Frontend/Customer.routes.js";
import AdminRoute from "./routes/Backend/admin.routes.js";
import HelpRoute from "./routes/Frontend/Help.routes.js";
import HelpProvider from "./routes/Frontend/HelpProvider.routes.js";
import CategoryRoute from "./routes/Backend/Category.routes.js";
import Review from "./routes/Frontend/Review.routes.js";
import connectDB from "./db/db.config.js";
import DashboardRoute from "./routes/Frontend/DashBoard.routes.js";
import ContactRoute from "./routes/Frontend/Contact.routes.js";
import http from "http";
import 'dotenv/config'

const app = express();
import socketHandler from "./Helpers/Chatbot.js";
const server = http.createServer(app);
socketHandler(server);
connectDB();

import cors from "cors";
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/admin", AdminRoute);
app.use("/category", CategoryRoute);
app.use("/customer", CustomerRoute);
app.use("/help", HelpRoute);
app.use("/help-provider", HelpProvider);
app.use("/review", Review);
app.use("/dashboard", DashboardRoute);
app.use("/contact", ContactRoute);

const Port = process.env.PORT || 3200;
app.listen(Port, () => {
  console.log("Server Started" + Port);
});
