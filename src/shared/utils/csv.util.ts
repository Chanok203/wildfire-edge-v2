import { parse } from 'json2csv';

export const toCSV = async (data: any[]) => {
    return parse(data);
};
