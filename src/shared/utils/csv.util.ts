import { parse } from 'json2csv';

export const toCSV = async (data: any[]) => {
    if (data.length == 0) return "";
    return parse(data);
};
