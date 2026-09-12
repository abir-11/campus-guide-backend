import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { IUser } from "./user.interface";
import { Role } from "../../../prisma/generated/prisma/enums";
import { Prisma } from "../../../prisma/generated/prisma/browser";



const createUserDB = async (payload: IUser) => {

    const {
        name,
        email,
        password,
        profilePhoto,
        phoneNumber,
        gender,
        role,
        departmentId,
    } = payload;




    const normalizedEmail = email.trim().toLowerCase();

    const normalizedName = name.trim();



    const isUserExist = await prisma.user.findUnique({
        where: {
            email: normalizedEmail,
        },
    });


    if (isUserExist) {
        throw new Error("User already exists");
    }


    // --------------------------------------------------
    // Check Department
    // --------------------------------------------------

    if (departmentId) {

        const department = await prisma.department.findUnique({
            where: {
                id: departmentId,
            },
        });


        if (!department) {
            throw new Error("Department not found");
        }


        if (department.status !== "ACTIVE") {
            throw new Error(
                "Selected department is inactive"
            );
        }
    }



    const hashedPassword = await bcrypt.hash(
        password,
        Number(config.bcrypt_salt_rounds)
    );




    const user = await prisma.$transaction(
        async (transaction) => {

            // Create User
            const createUser =
                await transaction.user.create({
                    data: {
                        name: normalizedName,

                        email: normalizedEmail,

                        password: hashedPassword,

                        phoneNumber,

                        role: role ?? Role.STUDENT,

                        departmentId,
                    },
                });


            // Create Profile
            await transaction.profile.create({
                data: {
                    userId: createUser.id,

                    profilePhoto,

                    gender,
                },
            });


            // Get User without password
            const result =
                await transaction.user.findUniqueOrThrow({
                    where: {
                        id: createUser.id,
                    },

                    omit: {
                        password: true,
                    },

                    include: {
                        profiles: true,

                        department: {
                            select: {
                                id: true,

                                departmentName: true,

                                status: true,
                            },
                        },
                    },
                });


            return result;
        }
    );


    return user;
};




const getMe = async (userId: string) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId,
        },

        omit: {
            password: true,
        },

        include: {
            profiles: true,

            department: {
                select: {
                    id: true,
                    departmentName: true,
                    status: true,
                },
            },
        },
    });

    return user;
};




const getAllUsersDB = async (params: {
    page?: number | string;
    limit?: number | string;
    searchTerm?: string;
    role?: Role;
    departmentId?: string;
}) => {

    // --------------------------------------------------
    // Pagination
    // --------------------------------------------------

    const page = Math.max(
        Number(params.page) || 1,
        1
    );

    const limit = Math.min(
        Math.max(Number(params.limit) || 10, 1),
        100
    );

    const skip = (page - 1) * limit;


    // --------------------------------------------------
    // Parameters
    // --------------------------------------------------

    const searchTerm =
        typeof params.searchTerm === "string"
            ? params.searchTerm.trim()
            : undefined;

    const role = params.role;

    const departmentId =
        typeof params.departmentId === "string"
            ? params.departmentId.trim()
            : undefined;


    // --------------------------------------------------
    // Where Conditions
    // --------------------------------------------------

    const andConditions: Prisma.UserWhereInput[] = [];


    // --------------------------------------------------
    // Search
    // Name / Email / Phone
    // --------------------------------------------------

    if (searchTerm) {

        andConditions.push({
            OR: [
                {
                    name: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },

                {
                    email: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },

                {
                    phoneNumber: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
            ],
        });
    }


    // --------------------------------------------------
    // Role Filter
    // --------------------------------------------------

    if (role) {

        andConditions.push({
            role: role,
        });
    }


    // --------------------------------------------------
    // Department Filter
    // --------------------------------------------------

    if (departmentId) {

        andConditions.push({
            departmentId: departmentId,
        });
    }


    // --------------------------------------------------
    // Final Where
    // --------------------------------------------------

    const where: Prisma.UserWhereInput = {
        AND: andConditions,
    };


    // --------------------------------------------------
    // Get Users + Total Count
    // --------------------------------------------------

    const [users, total] = await Promise.all([

        prisma.user.findMany({

            where,

            skip,

            take: limit,

            orderBy: {
                createdAt: "desc",
            },

            omit: {
                password: true,
            },

            include: {

                // Profile
                profiles: true,

                // Department
                department: {
                    select: {
                        id: true,
                        departmentName: true,
                        status: true,
                    },
                },
            },
        }),


        prisma.user.count({
            where,
        }),

    ]);


    // --------------------------------------------------
    // Response
    // --------------------------------------------------

    return {

        meta: {
            page,
            limit,
            total,

            totalPage: Math.ceil(
                total / limit
            ),
        },

        data: users,
    };
};





const getSingleUserDB = async (
    userId: string
) => {

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },

        omit: {
            password: true,
        },

        include: {
            profiles: true,

            department: {
                select: {
                    id: true,
                    departmentName: true,
                    status: true,
                },
            },
        },
    });


    if (!user) {
        throw new Error("User not found");
    }


    return user;
};


const updateUserDB = async (
    userId: string,
    payload: Partial<IUser>
) => {

    // Check user
    const existingUser = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });


    if (!existingUser) {
        throw new Error("User not found");
    }


    // Check email duplicate
    if (payload.email) {

        const emailExist = await prisma.user.findFirst({
            where: {
                email: payload.email,

                NOT: {
                    id: userId,
                },
            },
        });


        if (emailExist) {
            throw new Error(
                "This email is already registered"
            );
        }
    }


    // Prepare user data
    const userData: Prisma.UserUpdateInput = {};


    if (payload.name !== undefined) {
        userData.name = payload.name;
    }


    if (payload.email !== undefined) {
        userData.email = payload.email;
    }


    if (payload.phoneNumber !== undefined) {
        userData.phoneNumber = payload.phoneNumber;
    }


    if (payload.role !== undefined) {
        userData.role = payload.role;
    }


    if (payload.departmentId !== undefined) {

        userData.department = {
            connect: {
                id: payload.departmentId,
            },
        };
    }


    // Password update
    if (payload.password) {

        userData.password = await bcrypt.hash(
            payload.password,
            Number(config.bcrypt_salt_rounds)
        );
    }


    // Update user
    const updatedUser = await prisma.user.update({
        where: {
            id: userId,
        },

        data: userData,

        omit: {
            password: true,
        },

        include: {
            profiles: true,

            department: {
                select: {
                    id: true,
                    departmentName: true,
                    status: true,
                },
            },
        },
    });


    // Update Profile
    if (
        payload.profilePhoto !== undefined ||
        payload.gender !== undefined
    ) {

        await prisma.profile.updateMany({
            where: {
                userId,
            },

            data: {
                ...(payload.profilePhoto !== undefined && {
                    profilePhoto: payload.profilePhoto,
                }),

                ...(payload.gender !== undefined && {
                    gender: payload.gender,
                }),
            },
        });
    }


    // Get final updated user
    const result = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId,
        },

        omit: {
            password: true,
        },

        include: {
            profiles: true,

            department: {
                select: {
                    id: true,
                    departmentName: true,
                    status: true,
                },
            },
        },
    });


    return result;
};



const deleteUserDB = async (
    userId: string
) => {

    // Check user
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });


    if (!user) {
        throw new Error("User not found");
    }


    // Delete user
    await prisma.user.delete({
        where: {
            id: userId,
        },
    });


    return null;
};




export const userService = {

    createUserDB,

    getMe,

    getAllUsersDB,

    getSingleUserDB,

    updateUserDB,

    deleteUserDB,
};