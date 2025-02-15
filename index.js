// const express = require('express')// method-1
import express from "express"; // method-2
import dotenv from "dotenv"; 
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageroute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app,server } from "./socket/socket.js";
import path from "path"

dotenv.config({});

 
const PORT = process.env.PORT || 5000;

// const __dirname = path.resolve();

// middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json()); 
app.use(cookieParser());
app.use(cors(corsOption)); 
const corsOption={
    origin: [
        "http://localhost:3000",
        "http://chat-app-backend-one-zeta.vercel.app",
        "https://wondrouschatapp.netlify.app"
    ],
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
};


// routes
app.use("/api/v1/user",userRoute); 
app.use("/api/v1/message",messageRoute);


// app.use(express.static(path.join(__dirname, "/frontend/dist")));
// app.get('*',(__,res)=>{

//     res.sendFile(path.resolve(__dirname, "frontend","dist", "index.html"))
// })
 

app.listen(PORT, ()=>{
    connectDB();
    console.log(`Server listen at prot ${PORT}`);
});
// server.listen(PORT, ()=>{
//     connectDB();
//     console.log(`Server listen at prot ${PORT}`);
// });

app.get("/",(req,res) => {
    return res.status(200).json({
        message:"I'm coming from backend",
        success: true
    });
})