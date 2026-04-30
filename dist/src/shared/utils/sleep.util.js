"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = void 0;
const sleep = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));
exports.sleep = sleep;
//# sourceMappingURL=sleep.util.js.map