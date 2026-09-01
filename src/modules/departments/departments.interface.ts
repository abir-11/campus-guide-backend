import { DepartmentStatus } from "../../../prisma/generated/prisma/enums";

export interface IDepartment {
    departmentName: string;
    description?: string;
    status?: DepartmentStatus;
}