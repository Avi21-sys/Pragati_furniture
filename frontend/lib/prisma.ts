// lib/prisma.ts — single shared PrismaClient instance.
// Never instantiate PrismaClient inside a route file: that causes connection
// pool exhaustion in serverless environments (Vercel). Always import this one.
// See docs/CONVENTIONS.md §2 "Database Access".

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;