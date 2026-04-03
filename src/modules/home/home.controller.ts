import { Request, Response } from 'express';

export const homeView = (req: Request, res: Response) => {
    res.render('home/home.html', {});
};
