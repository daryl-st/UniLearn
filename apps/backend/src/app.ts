import express, { type Express } from "express";
import userRoute from "./modules/user/user.route.js";
import authRouter from "./modules/Auth/auth.route.js";
import resourceRouter from "./modules/resource/resource.route.js";
import aiRouter from "./modules/ai/ai.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const clientOrigin = process.env.CLIENT_ORIGIN;
const corsOptions: Parameters<typeof cors>[0] = {
    credentials: true,
    origin: clientOrigin
        ? clientOrigin.split(",").map((o) => o.trim()).filter(Boolean)
        : true,
};

const app: Express = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.get('/', (_req, res) => {
    res.send("Express API running...");
});

app.use("/users", userRoute);
app.use("/auth", authRouter);
app.use("/course", resourceRouter);
app.use("/ai", aiRouter);

export default app;