"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DroneService = void 0;
const axios_1 = __importDefault(require("axios"));
const configs_1 = require("../../configs");
class DroneService {
    baseUrl = `${configs_1.config.mediamtx.api}/v3`;
    async getDroneList() {
        try {
            let allItems = [];
            let currentPage = 0;
            let hasNextPage = true;
            while (hasNextPage) {
                const response = await axios_1.default.get(`${this.baseUrl}/paths/list`, {
                    params: {
                        page: currentPage,
                        itemsPerPage: 50,
                    },
                    timeout: 5000,
                });
                const { items, pageCount } = response.data;
                if (items && items.length > 0) {
                    allItems.push(...items);
                }
                if (pageCount === 0 || currentPage >= pageCount - 1) {
                    hasNextPage = false;
                }
                else {
                    currentPage++;
                }
            }
            return allItems
                .filter((path) => {
                return (!path.name.startsWith("AI")) && (path.ready === true);
            })
                .map((path) => ({
                id: path.name,
                url: `/drones/${encodeURIComponent(path.name)}/player`,
            }));
        }
        catch (error) {
            console.error(`[MEDIA_MTX] Error fetching active paths: ${error}`);
            return [];
        }
    }
}
exports.DroneService = DroneService;
//# sourceMappingURL=drone.service.js.map