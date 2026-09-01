import express from "express";

import { userController } from "./user.controller";
import { auth } from "../../middleware/auth";


const router = express.Router();

router.post(
    "/register",
    userController.createUser
);

// ======================================================
// GET MY PROFILE
// ======================================================

router.get(
    "/me",
    auth(),
    userController.getMe
);



// ======================================================
// GET ALL USERS
// ======================================================

router.get(
    "/",
    auth("ADMIN"),
    userController.getAllUsers
);


// ======================================================
// GET SINGLE USER
// ======================================================

router.get(
    "/:id",
    auth("ADMIN"),
    userController.getSingleUser
);




// ======================================================
// UPDATE USER
// ======================================================

router.patch(
    "/:id",
    auth("ADMIN"),
    userController.updateUser
);


// ======================================================
// DELETE USER
// ======================================================

router.delete(
    "/:id",
    auth("ADMIN"),
    userController.deleteUser
);


export const userRoutes = router;