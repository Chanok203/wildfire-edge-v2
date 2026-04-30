"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bullBoardAdapter = void 0;
const api_1 = require("@bull-board/api");
const bullMQAdapter_1 = require("@bull-board/api/bullMQAdapter");
const express_1 = require("@bull-board/express");
const queue_1 = require("../../queues/queue");
exports.bullBoardAdapter = new express_1.ExpressAdapter();
exports.bullBoardAdapter.setBasePath('/admin/queues');
(0, api_1.createBullBoard)({
    queues: [
        new bullMQAdapter_1.BullMQAdapter(queue_1.aiQueue),
        // new BullMQAdapter(pushQueue),
    ],
    serverAdapter: exports.bullBoardAdapter,
});
//# sourceMappingURL=bullboard.lib.js.map