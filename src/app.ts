import { Application, Request, Response } from "express";
import express from "express"
import cors from "cors"
import config from "./config";
import cookieParser from "cookie-parser";
import { authRouter } from "./modules/auth/auth.router";
import { EventRoutes } from "./modules/eventss/events.router";
import { DepartmentRoutes } from "./modules/departments/departments.router";
import { userRoutes } from "./modules/user/user.router";

const app:Application=express();

app.use(cors({
   origin:config.app_url,
   credentials:true
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.get("/",async(req:Request,res:Response)=>{
    res.send("Hello world!");
});

app.use("/api/auth",userRoutes);
app.use("/api/auth",authRouter);
app.use("/api/events",EventRoutes);
app.use("/api/departments",DepartmentRoutes);
export default app;