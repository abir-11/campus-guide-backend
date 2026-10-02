import { CampusAlertStatus } from "../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  IAlertCreatePayload,
  IAlertUpdatePayload,
  validateCreateAlert,
  validateUpdateAlert,
} from "./campusAlert.interface";

const createAlertDB = async (payload: IAlertCreatePayload, userId: string) => {
  const data = validateCreateAlert(payload);
  return prisma.campusAlert.create({
    data: { ...data, userId },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
};

const getAllAlertsDB = async (params: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
  priority?: string;
  alertType?: string;
}) => {
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 20;
  const skip = (page - 1) * limit;

  const andConditions: any[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: [
        { title: { contains: params.searchTerm, mode: "insensitive" } },
        { message: { contains: params.searchTerm, mode: "insensitive" } },
      ],
    });
  }
  if (params.status) andConditions.push({ status: params.status });
  if (params.priority) andConditions.push({ priority: params.priority });
  if (params.alertType) andConditions.push({ alertType: params.alertType });

  const where = andConditions.length ? { AND: andConditions } : {};

  const [alerts, total] = await Promise.all([
    prisma.campusAlert.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, name: true } } },
    }),
    prisma.campusAlert.count({ where }),
  ]);

  return {
    meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
    data: alerts,
  };
};

const getActiveAlertsDB = async () => {
  return prisma.campusAlert.findMany({
    where: { status: CampusAlertStatus.ACTIVE },
    orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
    include: { user: { select: { id: true, name: true } } },
  });
};

const getSingleAlertDB = async (id: string) => {
  const alert = await prisma.campusAlert.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  if (!alert) throw new Error("Alert not found");
  return alert;
};

const updateAlertDB = async (id: string, payload: IAlertUpdatePayload) => {
  const existing = await prisma.campusAlert.findUnique({ where: { id } });
  if (!existing) throw new Error("Alert not found");
  const data = validateUpdateAlert(payload);
  return prisma.campusAlert.update({
    where: { id },
    data,
    include: { user: { select: { id: true, name: true } } },
  });
};

const deleteAlertDB = async (id: string) => {
  const existing = await prisma.campusAlert.findUnique({ where: { id } });
  if (!existing) throw new Error("Alert not found");
  await prisma.campusAlert.delete({ where: { id } });
  return { message: "Alert deleted successfully" };
};

export const campusAlertService = {
  createAlertDB,
  getAllAlertsDB,
  getActiveAlertsDB,
  getSingleAlertDB,
  updateAlertDB,
  deleteAlertDB,
};
