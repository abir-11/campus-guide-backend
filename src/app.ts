import { Application, Request, Response } from "express";
import express from "express"
import cors from "cors"
import config from "./config";
import cookieParser from "cookie-parser";
import { authRouter } from "./modules/auth/auth.router";
import { EventRoutes } from "./modules/eventss/events.router";
import { DepartmentRoutes } from "./modules/departments/departments.router";
import { userRoutes } from "./modules/user/user.router";
import { mentorRoutes } from "./modules/mentor/mentor.router";
import { bookingRoutes } from "./modules/booking/booking.router";
import { storyRoutes } from "./modules/story/story.router";
import { homeContentRoutes } from "./modules/homeContent/homeContent.router";
import { mentorServiceRoutes } from "./modules/mentorService/mentorService.router";
import { mentorProfileRoutes } from "./modules/mentorProfile/mentorProfile.router";

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
app.use("/api/mentor-services", mentorServiceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/mentors", mentorRoutes); 
app.use("/api/mentors-apply",mentorProfileRoutes); 
app.use("/api/stories", storyRoutes);
app.use("/api/home-content", homeContentRoutes);

export default app;