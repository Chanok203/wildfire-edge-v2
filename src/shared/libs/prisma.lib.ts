import { PrismaClient } from '@generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

import { config } from '@/configs';

const adapter = new PrismaPg({
    connectionString: config.db.url,
});

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        adapter: adapter,
    });

if (config.app.isDev) {
    globalForPrisma.prisma = prisma;
}
