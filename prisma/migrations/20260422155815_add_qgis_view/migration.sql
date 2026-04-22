CREATE EXTENSION IF NOT EXISTS postgis;

CREATE OR REPLACE VIEW v_forecast_polygons AS
SELECT 
    fr.id,
    fr.forecast_id,
    fr.minutes,
    -- แบบหลังที่เพิ่มความชัวร์เรื่อง Type และ SRID
    ST_SetSRID(
        ST_Force2D(
            ST_GeomFromGeoJSON(fr.geojson_data->'geometry')
        ), 
        4326
    )::geometry(Geometry, 4326) AS geom,
    -- ข้อมูลเวลาสำหรับ Filter
    f.created_at,
    (f.created_at + (fr.minutes || ' minutes')::interval) AS target_time
FROM "forecast_result" fr
JOIN "forecast" f ON fr.forecast_id = f.id;