"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotspotManagerService = void 0;
const axios_1 = __importDefault(require("axios"));
const configs_1 = require("../../configs");
class HotspotManagerService {
    baseUrl = `${configs_1.config.hotspotDetection.url}/api/v1/hotspot-detection`;
    async getList() {
        try {
            const url = `${this.baseUrl}`;
            const response = await axios_1.default.get(url);
            if (response.data.status != 'success') {
                throw new Error(`${response.data}`);
            }
            const { instances } = response.data.data;
            return instances.map((item) => ({
                ...item,
                start_time: new Date(item.start_time * 1000).toLocaleString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                }),
            }));
        }
        catch (error) {
            console.error('[HOTSPOT_DETECTION] Error fetching instances');
            return [];
        }
    }
    async create(id, input_url, output_url) {
        try {
            const url = `${this.baseUrl}`;
            const data = { id, input_url, output_url };
            const response = await axios_1.default.post(url, data);
            return response.data.status === 'success';
        }
        catch (error) {
            console.error('[HOTSPOT_DETECTION] Error create instance');
            return false;
        }
    }
    async deleteAll() {
        try {
            const url = `${this.baseUrl}`;
            const response = await axios_1.default.delete(url);
            return response.data.status === 'success';
        }
        catch (error) {
            console.error('[HOTSPOT_DETECTION] Error delete all instances');
            return false;
        }
    }
    async deleteById(id) {
        try {
            const url = `${this.baseUrl}/${id}`;
            const response = await axios_1.default.delete(url);
            return response.data.status === 'success';
        }
        catch (error) {
            console.error(`[HOTSPOT_DETECTION] Error delete an instance (${id})`);
            return false;
        }
    }
    async getById(id) {
        try {
            const url = `${this.baseUrl}/${id}`;
            const response = await axios_1.default.get(url);
            if (response.data.status !== 'success') {
                throw new Error(`[HOTSPOT_DETECTION] Error get an instance (${id})`);
            }
            else {
                return response.data.data;
            }
        }
        catch (error) {
            console.error(`[HOTSPOT_DETECTION] Error get an instance (${id})`);
        }
    }
    async extendTimeById(id) {
        try {
            const url = `${this.baseUrl}/${id}`;
            const response = await axios_1.default.patch(url);
            if (response.data.status !== 'success') {
                throw new Error(`[HOTSPOT_DETECTION] Error extendTime for an instance (${id})`);
            }
            else {
                return response.data.data;
            }
        }
        catch (error) {
            console.error(`[HOTSPOT_DETECTION] Error extendTime for an instance (${id})`);
        }
    }
    async getSnapShot(id) {
        try {
            const url = `${this.baseUrl}/${id}/snapshot`;
            const response = await axios_1.default.get(url, {
                responseType: 'arraybuffer',
            });
            const buffer = Buffer.from(response.data, 'binary');
            return buffer.toString('base64');
        }
        catch (error) {
            console.error(`[HOTSPOT_DETECTION] Error extendTime for an instance (${id})`);
        }
    }
    async getAnalysis(id) {
        try {
            const url = `${this.baseUrl}/${id}/analysis`;
            const response = await axios_1.default.get(url);
            if (response.data.status !== "success") {
                throw new Error(`${response.data}`);
            }
            return response.data.data;
        }
        catch (error) {
            console.error(`[HOTSPOT_DETECTION] Error extendTime for an instance (${id})`);
        }
    }
}
exports.HotspotManagerService = HotspotManagerService;
//# sourceMappingURL=hotspot-manager.service.js.map