import { config } from "dotenv";
config();
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import authRouter from "./routes/auth.route.js"
import noteRouter from "./routes/note.route.js"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));


app.options(/^\/.*$/, cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public"));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/note", noteRouter);

app.use(errorHandler);

export default app;
