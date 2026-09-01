import { Gender, Role } from "../../../prisma/generated/prisma/enums";

export interface IUser {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
    role?: Role;
    profilePhoto?: string;
    gender?: Gender;
    departmentId?: string;
}