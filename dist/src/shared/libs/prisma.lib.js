"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("../../../generated/prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const configs_1 = require("../../configs");
const adapter = new adapter_pg_1.PrismaPg({
    connectionString: configs_1.config.db.url,
});
const globalForPrisma = globalThis;
exports.prisma = globalForPrisma.prisma ||
    new client_1.PrismaClient({
        adapter: adapter,
    });
if (configs_1.config.app.isDev) {
    globalForPrisma.prisma = exports.prisma;
}
//# sourceMappingURL=prisma.lib.js.map