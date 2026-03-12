import express, { type Express } from "express";
import userRoute from "./modules/user/user.route.js";
import authRouter from "./modules/Auth/auth.route.js";
import resourceRouter from "./modules/resource/resource.route.js";
import cors from "cors";
import cookieParser from "cookie-parser"

const app: Express = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("Express API running...");
});

app.use("/users", userRoute);
app.use("/auth", authRouter);
app.use("/course", resourceRouter);

export default app;