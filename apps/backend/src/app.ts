import express, { type Express } from "express";
import userRoute from "./modules/user/user.route.js";
import cors from "cors";

const app: Express = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("Express API running...");
});

app.use("/users", userRoute);

export default app;