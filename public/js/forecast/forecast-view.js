// element
const initForecastId = window.initForecastId;
const refTimeInput = document.getElementById('ref_time');
const pastMinsInput = document.getElementById('past_mins');
const futureMinsInput = document.getElementById('future_mins');
const submitBtn = document.getElementById('submitBtn');

const formatToLocalISO = (date) => {
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
};

// init value
const now = new Date();
refTimeInput.value = formatToLocalISO(now);
pastMinsInput.value = 30;
futureMinsInput.value = 60;

const defaultCenter = [100.213579, 18.684905]; // [lng, lat]
const defaultZoom = 14;

// สร้างตัวแปร map ไว้ที่ global scope (นอกฟังก์ชัน) เพื่อให้ปุ่มยืนยันเรียกใช้ได้
let map = new maplibregl.Map({
    container: 'map', // ต้องตรงกับ id="map" ใน HTML
    style: {
        version: 8,
        sources: {
            'base-tiles': {
                type: 'raster',
                tiles: [
                    'http://localhost:8001/ows/?MAP=/data/edge.qgs&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=map&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&FORMAT=image/png&TRANSPARENT=TRUE',
                ],
                tileSize: 256,
                attribution: '&copy; Mae Yom National Park',
            },
        },
        layers: [
            {
                id: 'base-layer',
                type: 'raster',
                source: 'base-tiles',
                minzoom: 0,
                maxzoom: 18,
            },
        ],
    },
    center: defaultCenter,
    zoom: defaultZoom,
});

function applyFireFilter(shouldFetch = false) {
    const refDate = new Date(refTimeInput.value);
    const past = parseInt(pastMinsInput.value) || 0;
    const future = parseInt(futureMinsInput.value) || 0;

    const startTime = new Date(refDate.getTime() - past * 60000).toISOString();
    const endTime = new Date(refDate.getTime() + future * 60000).toISOString();

    const source = map.getSource('fire-source');

    // ถ้าสั่งให้ Fetch ใหม่ (เช่น ตอนกดปุ่ม)
    if (shouldFetch && source) {
        console.log('Fetching fresh data...');
        const freshWfsUrl = `http://localhost:8001/ows/?MAP=/data/edge.qgs&SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAME=fire_forecast&OUTPUTFORMAT=application/json`;
        source.setData(freshWfsUrl);

        // รอให้ข้อมูลใหม่มาค่อยกรอง
        map.once('data', (e) => {
            if (
                e.sourceId === 'fire-source' &&
                map.isSourceLoaded('fire-source')
            ) {
                executeFilter(startTime, endTime);
            }
        });
    } else {
        // ถ้าเป็นการกรองปกติ (เช่น ตอนโหลดหน้าเว็บครั้งแรก)
        executeFilter(startTime, endTime);
    }
}

function executeFilter(start, end) {
    const filter = [
        'all',
        ['>=', ['to-string', ['get', 'target_time']], start],
        ['<=', ['to-string', ['get', 'target_time']], end],
    ];

    // กรอง Layer สีพื้น
    if (map.getLayer('fire-layer-fill')) {
        map.setFilter('fire-layer-fill', filter);
    }

    // กรอง Layer เส้นขอบ
    if (map.getLayer('fire-layer-outline')) {
        map.setFilter('fire-layer-outline', filter);
    }

    console.log('Filter Applied to both layers:', start, 'to', end);
}

// เพิ่มปุ่มควบคุม (Zoom In/Out)
map.addControl(new maplibregl.NavigationControl(), 'top-left');

function setupFireLayers() {
    // เพิ่ม Source โดยใช้ initForecastId ใน CQL_FILTER ตั้งแต่แรก
    map.addSource('fire-source', {
        type: 'geojson',
        data: `http://localhost:8001/ows/?MAP=/data/edge.qgs&SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAME=fire_forecast&OUTPUTFORMAT=application/json`,
    });

    map.addLayer({
        id: 'fire-layer-outline',
        type: 'line',
        source: 'fire-source',
        paint: {
            'line-color': '#ffffff', // เส้นขอบสีขาว ตัดกับทุกสี
            'line-width': 2.5, // ความหนาเส้น
            'line-opacity': 0.9, // ความเข้มของเส้นขอบ
        },
    });

    // 3. Layer สำหรับสีพื้น (Fill) - ปรับสีให้แดงสว่างขึ้น
    map.addLayer({
        id: 'fire-layer-fill',
        type: 'fill',
        source: 'fire-source',
        paint: {
            'fill-color': '#ff1a1a', // แดงสดสว่าง (สว่างกว่าเดิมเยอะ)
            'fill-opacity': 0.5, // โปร่งแสงนิดหน่อยเพื่อให้เห็นแผนที่ข้างล่าง
        },
    });

    // เมื่อทุกอย่างพร้อม (Idle) ให้เริ่มกรองครั้งแรก
    map.on('idle', function initialFilter() {
        if (map.getSource('fire-source') && map.isSourceLoaded('fire-source')) {
            applyFireFilter(false);
            map.off('idle', initialFilter);
        }
    });
}

function setupRouteLayers() {
    // กำหนด Mapping ระหว่างค่าใน Select กับ ID ของ Layer และสี
    const routeMapping = [
        {
            value: 'patrol_car',
            layerId: 'car-layer',
            sourceId: 'car-source',
            typeName: 'car',
            color: '#ffff00',
            width: 3,
        },
        {
            value: 'patrol_motorcycle',
            layerId: 'bike-layer',
            sourceId: 'bike-source',
            typeName: 'bike',
            color: '#00ffff',
            width: 2,
        },
        {
            value: 'patrol_walking',
            layerId: 'walk-layer',
            sourceId: 'walk-source',
            typeName: 'walk',
            color: '#33ff33',
            width: 2,
        },
    ];

    const patrolSelect = $('#patrol-select'); // ใช้ jQuery เพราะเป็น bootstrap-select

    routeMapping.forEach((route) => {
        // 1. เพิ่ม Source
        map.addSource(route.sourceId, {
            type: 'geojson',
            data: `http://localhost:8001/ows/?MAP=/data/edge.qgs&SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAME=${route.typeName}&OUTPUTFORMAT=application/json`,
        });

        // 2. เพิ่ม Layer
        map.addLayer({
            id: route.layerId,
            type: 'line',
            source: route.sourceId,
            layout: {
                'line-join': 'round',
                'line-cap': 'round',
                // เช็คค่าเริ่มต้นจาก Select ว่าให้โชว์เลยไหม
                visibility: patrolSelect.val().includes(route.value)
                    ? 'visible'
                    : 'none',
            },
            paint: {
                'line-color': route.color,
                'line-width': route.width,
                'line-opacity': 0.8,
            },
        });
    });

    // 3. ดักจับ Event การเปลี่ยนค่า (รองรับทั้งเลือกรายตัว และ Select All)
    patrolSelect.on('change', function () {
        const selectedValues = $(this).val() || []; // ดึงค่าที่ถูกเลือกทั้งหมดออกมาเป็น Array

        routeMapping.forEach((route) => {
            const isVisible = selectedValues.includes(route.value);
            map.setLayoutProperty(
                route.layerId,
                'visibility',
                isVisible ? 'visible' : 'none',
            );
        });

        console.log('Updated Routes Visibility:', selectedValues);
    });
}

map.on('load', async () => {
    if (initForecastId) {
        try {
            const url = `/api/forecast/${initForecastId}`;

            const response = await axios.get(url);
            if (response.data.status !== 'success') {
                throw new Error(`[GET] Error: เกิดข้อผลพลาด`);
            }
            const forecast = response.data.data.forecast;

            // --- เริ่มต้นเติม TODO ---

            // 1. เลื่อนแผนที่ไปที่ตำแหน่งพิกัดของ Forecast นี้
            if (forecast.longitude && forecast.latitude) {
                map.jumpTo({
                    center: [forecast.longitude, forecast.latitude],
                    zoom: 14, // หรือระยะซูมที่คุณต้องการ
                });
                console.log(
                    `Map moved to: ${forecast.longitude}, ${forecast.latitude}`,
                );
            }

            // 2. เซตเวลา 'เวลาที่ตรวจสอบ' (refTimeInput) ให้เป็นเวลาที่สร้าง Forecast
            if (forecast.createdAt) {
                const createdDate = new Date(forecast.createdAt);
                // ใช้ฟังก์ชัน formatToLocalISO ที่คุณเขียนไว้ด้านบน
                refTimeInput.value = formatToLocalISO(createdDate);
                console.log(`Input time set to: ${refTimeInput.value}`);
            }
        } catch (error) {
            console.error('Failed to fetch initial forecast data:', error);
        }
    }

    // 4. หลังจากเซตค่า Metadata เสร็จแล้ว ค่อยเพิ่ม Source และ Layer ข้อมูลไฟ
    setupRouteLayers();
    setupFireLayers();
});

// ดักจับ Event เมื่อปุ่มถูกกด
submitBtn.addEventListener('click', () => {
    console.log('--- Manual Update Triggered ---');
    applyFireFilter(true); // สั่ง fetch ใหม่
});
