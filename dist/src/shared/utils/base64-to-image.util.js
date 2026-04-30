"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeBase64ToFile = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const writeBase64ToFile = async (imageBase64, savePath) => {
    try {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        await promises_1.default.writeFile(savePath, buffer);
    }
    catch (error) {
        console.error("[writeBase64ToFile] Error:", error);
        throw error;
    }
};
exports.writeBase64ToFile = writeBase64ToFile;
//# sourceMappingURL=base64-to-image.util.js.map