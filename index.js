import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageroute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./socket/socket.js";
import path from "path";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: [
        "http://localhost:3000",
        "https://chat-app-backend-one-zeta.vercel.app",
        "https://wondrouschatapp.netlify.app"
    ],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
};
app.use(cors(corsOptions));

// Handle Preflight Requests
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

// Static Files (Optional for Frontend Deployment)
// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, "/frontend/dist")));
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// });

// Server Start
server.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
});

// Test Route
app.get("/", (req, res) => {
    return res.status(200).json({
        message: "I'm coming from the backend",
        success: true
    });
});
