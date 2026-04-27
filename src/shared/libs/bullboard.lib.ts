import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';

import { aiQueue } from '@/queues/queue';

export const bullBoardAdapter = new ExpressAdapter();

bullBoardAdapter.setBasePath('/admin/queues');

createBullBoard({
    queues: [
        new BullMQAdapter(aiQueue),
        // new BullMQAdapter(pushQueue),
    ],
    serverAdapter: bullBoardAdapter,
});
