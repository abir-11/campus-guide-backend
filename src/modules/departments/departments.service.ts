import { Prisma } from "../../../prisma/generated/prisma/browser";
import { DepartmentStatus } from "../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IDepartment } from "./departments.interface";



const createDepartmentDB = async (
    payload: IDepartment
) => {

    const existingDepartment =
        await prisma.department.findUnique({
            where: {
                departmentName: payload.departmentName,
            },
        });

    if (existingDepartment) {
        throw new Error(
            "Department with this name already exists"
        );
    }

    const department = await prisma.department.create({
        data: {
            departmentName: payload.departmentName,
            description: payload.description,
            status: payload.status ?? DepartmentStatus.ACTIVE,
        },
    });

    return department;
};



const getAllDepartmentsDB = async (params: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    status?: DepartmentStatus;
}) => {

    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;

    const skip = (page - 1) * limit;

    const { searchTerm, status } = params;

    const andConditions: Prisma.DepartmentWhereInput[] = [];


    // Search
    if (searchTerm) {
        andConditions.push({
            OR: [
                {
                    departmentName: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    description: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
            ],
        });
    }


    // Status filter
    if (status) {
        andConditions.push({
            status,
        });
    }


    const where: Prisma.DepartmentWhereInput = {
        AND: andConditions,
    };


    const [departments, total] = await Promise.all([

        prisma.department.findMany({
            where,

            skip,

            take: limit,

            orderBy: {
                createdAt: "desc",
            },

            include: {
                _count: {
                    select: {
                        users: true,
                    },
                },
            },
        }),

        prisma.department.count({
            where,
        }),

    ]);


    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },

        data: departments,
    };
};




const getSingleDepartmentDB = async (
    departmentId: string
) => {

    const department =
        await prisma.department.findUnique({
            where: {
                id: departmentId,
            },

            include: {
                _count: {
                    select: {
                        users: true,
                    },
                },
            },
        });


    if (!department) {
        throw new Error("Department not found");
    }


    return department;
};



const updateDepartmentDB = async (
    departmentId: string,
    payload: IDepartment
) => {

    // Check department exists
    const department =
        await prisma.department.findUnique({
            where: {
                id: departmentId,
            },
        });


    if (!department) {
        throw new Error("Department not found");
    }


    // Check duplicate department name
    if (payload.departmentName) {

        const existingDepartment =
            await prisma.department.findFirst({
                where: {
                    departmentName: payload.departmentName,

                    NOT: {
                        id: departmentId,
                    },
                },
            });


        if (existingDepartment) {
            throw new Error(
                "Another department with this name already exists"
            );
        }
    }


    const updatedDepartment =
        await prisma.department.update({
            where: {
                id: departmentId,
            },

            data: {
                ...(payload.departmentName && {
                    departmentName:
                        payload.departmentName,
                }),

                ...(payload.description !== undefined && {
                    description:
                        payload.description,
                }),

                ...(payload.status && {
                    status: payload.status,
                }),
            },

            include: {
                _count: {
                    select: {
                        users: true,
                    },
                },
            },
        });


    return updatedDepartment;
};




const deleteDepartmentDB = async (
    departmentId: string
) => {

    // Check department exists
    const department =
        await prisma.department.findUnique({
            where: {
                id: departmentId,
            },
        });


    if (!department) {
        throw new Error("Department not found");
    }


    // Delete department
    await prisma.department.delete({
        where: {
            id: departmentId,
        },
    });


    return null;
};


export const DepartmentService = {
    createDepartmentDB,
    getAllDepartmentsDB,
    getSingleDepartmentDB,
    updateDepartmentDB,
    deleteDepartmentDB,
};