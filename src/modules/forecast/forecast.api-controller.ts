import { Request, Response } from 'express';

export const createForcast = (req: Request, res: Response) => {
    // TODO: implement queue (bull)
    res.json({ status: 'success', data: {} });
};
