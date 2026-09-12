import express from "express";

import { userController } from "./user.controller";
import { auth } from "../../middleware/auth";


const router = express.Router();

router.post(
    "/register",
    userController.createUser
);



router.get(
    "/me",
    auth(),
    userController.getMe
);




router.get(
    "/",
    auth("ADMIN"),
    userController.getAllUsers
);



router.get(
    "/:id",
    auth("ADMIN"),
    userController.getSingleUser
);




router.patch(
    "/:id",
    auth("ADMIN"),
    userController.updateUser
);



router.delete(
    "/:id",
    auth("ADMIN"),
    userController.deleteUser
);


export const userRoutes = router;