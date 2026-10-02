import { NewsStatus } from "../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  INewsCreatePayload,
  INewsUpdatePayload,
  validateCreateNews,
  validateUpdateNews,
} from "./campusNews.interface";

const createNewsDB = async (payload: INewsCreatePayload, userId: string) => {
  const data = validateCreateNews(payload);
  return prisma.news.create({
    data: { ...data, authorId: userId },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
};

const getAllNewsDB = async (params: {
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
        { content: { contains: params.searchTerm, mode: "insensitive" } },
      ],
    });
  }
  if (params.status) andConditions.push({ status: params.status });
  if (params.category) andConditions.push({ category: params.category });

  const where = andConditions.length ? { AND: andConditions } : {};

  const [news, total] = await Promise.all([
    prisma.news.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, name: true } } },
    }),
    prisma.news.count({ where }),
  ]);

  return {
    meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
    data: news,
  };
};

const getPublishedNewsDB = async (params: { category?: string } = {}) => {
  const where: any = { status: NewsStatus.PUBLISHED };
  if (params.category) where.category = params.category;

  return prisma.news.findMany({
    where,
    orderBy: { publishedAt: "desc" },
    include: { user: { select: { id: true, name: true } } },
  });
};

const getSingleNewsDB = async (id: string) => {
  const news = await prisma.news.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  if (!news) throw new Error("News not found");
  return news;
};

const updateNewsDB = async (id: string, payload: INewsUpdatePayload) => {
  const existing = await prisma.news.findUnique({ where: { id } });
  if (!existing) throw new Error("News not found");
  const data = validateUpdateNews(payload);
  return prisma.news.update({
    where: { id },
    data,
    include: { user: { select: { id: true, name: true } } },
  });
};

const deleteNewsDB = async (id: string) => {
  const existing = await prisma.news.findUnique({ where: { id } });
  if (!existing) throw new Error("News not found");
  await prisma.news.delete({ where: { id } });
  return { message: "News deleted successfully" };
};

export const campusNewsService = {
  createNewsDB,
  getAllNewsDB,
  getPublishedNewsDB,
  getSingleNewsDB,
  updateNewsDB,
  deleteNewsDB,
};
