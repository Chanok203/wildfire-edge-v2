"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCSV = void 0;
const json2csv_1 = require("json2csv");
const toCSV = async (data) => {
    if (data.length == 0)
        return "";
    return (0, json2csv_1.parse)(data);
};
exports.toCSV = toCSV;
//# sourceMappingURL=csv.util.js.map