import express from "express";


import { auth } from "../../middleware/auth";
import { DepartmentController } from "./departments.controller";

const router = express.Router();



router.get(
    "/",
    DepartmentController.getAllDepartments
);



router.get(
    "/:id",
    DepartmentController.getSingleDepartment
);



router.post(
    "/create",
    auth("ADMIN"),
    DepartmentController.createDepartment
);




router.patch(
    "/:id",
    auth("ADMIN"),
    DepartmentController.updateDepartment
);


router.delete(
    "/:id",
    auth("ADMIN"),
    DepartmentController.deleteDepartment
);


export const DepartmentRoutes = router;