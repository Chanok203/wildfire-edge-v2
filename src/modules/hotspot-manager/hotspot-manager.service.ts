import axios from 'axios';

import { config } from '@/configs';

export class HotspotManagerService {
    private readonly baseUrl = `${config.hotspotDetection.url}/api/v1/hotspot-detection`;

    async getList() {
        try {
            const url = `${this.baseUrl}`;
            const response = await axios.get(url);

            if (response.data.status != 'success') {
                throw new Error(`${response.data}`);
            }

            const { instances } = response.data.data;
            return instances.map((item: any) => ({
                ...item,
                start_time: new Date(item.start_time * 1000).toLocaleString(
                    'th-TH',
                    {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    },
                ),
            }));
        } catch (error) {
            console.error('[HOTSPOT_DETECTION] Error fetching instances');
            return [];
        }
    }

    async create(id: string, input_url: string, output_url: string) {
        try {
            const url = `${this.baseUrl}`;
            const data = { id, input_url, output_url };
            const response = await axios.post(url, data);
            return response.data.status === 'success';
        } catch (error) {
            console.error('[HOTSPOT_DETECTION] Error create instance');
            return false;
        }
    }

    async deleteAll() {
        try {
            const url = `${this.baseUrl}`;
            const response = await axios.delete(url);
            return response.data.status === 'success';
        } catch (error) {
            console.error('[HOTSPOT_DETECTION] Error delete all instances');
            return false;
        }
    }

    async deleteById(id: string) {
        try {
            const url = `${this.baseUrl}/${id}`;
            const response = await axios.delete(url);
            return response.data.status === 'success';
        } catch (error) {
            console.error(`[HOTSPOT_DETECTION] Error delete an instance (${id})`);
            return false;
        }
    }
}
