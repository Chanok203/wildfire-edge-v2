import axios from 'axios';

import { config } from '@/configs';

export class DroneService {
    private readonly baseUrl = `${config.mediamtx.api}/v3`;

    async getDroneList() {
        try {
            let allItems = [];
            let currentPage = 0;
            let hasNextPage = true;

            while (hasNextPage) {
                const response = await axios.get(`${this.baseUrl}/paths/list`, {
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
                } else {
                    currentPage++;
                }
            }
            return allItems
                .filter((path: any) => {
                    return (!path.name.startsWith("AI")) && (path.ready === true);
                })
                .map((path: any) => ({
                    id: path.name,
                    url: `/drones/${encodeURIComponent(path.name)}/player`,
                }));
        } catch (error) {
            console.error(`[MEDIA_MTX] Error fetching active paths: ${error}`);
            return [];
        }
    }

}
