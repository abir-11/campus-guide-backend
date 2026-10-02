import { ResourceStatus } from "../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  IResourceCreatePayload,
  IResourceUpdatePayload,
  validateCreateResource,
  validateUpdateResource,
} from "./resource.interface";

const createResourceDB = async (payload: IResourceCreatePayload, userId: string) => {
  const data = validateCreateResource(payload);
  return prisma.resource.create({
    data: {
      ...data,
      uploadedBy: userId,
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
};

const getAllResourcesDB = async (params: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
  category?: string;
}) => {
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 20;
  const skip = (page - 1) * limit;

  const andConditions: any[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: [
        { title: { contains: params.searchTerm, mode: "insensitive" } },
        { description: { contains: params.searchTerm, mode: "insensitive" } },
      ],
    });
  }

  if (params.status) {
    andConditions.push({ status: params.status });
  }

  if (params.category) {
    andConditions.push({ category: params.category });
  }

  const where = andConditions.length ? { AND: andConditions } : {};

  const [resources, total] = await Promise.all([
    prisma.resource.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.resource.count({ where }),
  ]);

  return {
    meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
    data: resources,
  };
};

const getPublicResourcesDB = async () => {
  return prisma.resource.findMany({
    where: { status: ResourceStatus.APPROVED },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true } },
    },
  });
};

const getSingleResourceDB = async (id: string) => {
  const resource = await prisma.resource.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  if (!resource) throw new Error("Resource not found");
  return resource;
};

const updateResourceDB = async (id: string, payload: IResourceUpdatePayload) => {
  const resource = await prisma.resource.findUnique({ where: { id } });
  if (!resource) throw new Error("Resource not found");
  const data = validateUpdateResource(payload);
  return prisma.resource.update({
    where: { id },
    data,
    include: { user: { select: { id: true, name: true, email: true } } },
  });
};

const deleteResourceDB = async (id: string) => {
  const resource = await prisma.resource.findUnique({ where: { id } });
  if (!resource) throw new Error("Resource not found");
  await prisma.resource.delete({ where: { id } });
  return { message: "Resource deleted successfully" };
};

export const resourceService = {
  createResourceDB,
  getAllResourcesDB,
  getPublicResourcesDB,
  getSingleResourceDB,
  updateResourceDB,
  deleteResourceDB,
};
