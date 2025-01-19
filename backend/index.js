import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import mediaRoute from "./routes/media.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";

dotenv.config({});

connectDB();
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.ORIGIN_URL,
    credentials: true
}));

//apis
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/progress", courseProgressRoute);



app.listen(PORT, (err) => {
    if (err) {
        console.error(`Failed to start server: ${err.message}`);
        process.exit(1);
    }
    console.log(`Server is running on port ${PORT}`);
})