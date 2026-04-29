-- ตรวจสอบว่ามี Extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- ลบอันเก่า (ถ้ามี) เพื่อความสะอาด
DROP VIEW IF EXISTS v_forecast_polygons;

CREATE OR REPLACE VIEW v_forecast_polygons AS
SELECT 
    -- 1. สร้าง Integer ID หลอกขึ้นมา (หัวใจสำคัญ)
    CAST(row_number() OVER () AS INTEGER) AS qgis_id, 
    -- 2. ข้อมูลเดิมยังอยู่ครบ
    fr.id AS original_uuid, 
    fr.forecast_id,
    fr.minutes,
    ST_SetSRID(
        ST_Force2D(
            ST_GeomFromGeoJSON((fr.geojson_data->'geometry')::text)
        ), 
        4326
    )::geometry(Geometry, 4326) AS geom,
    f.created_at,
    (f.created_at + (fr.minutes || ' minutes')::interval) AS target_time
FROM "forecast_result" fr
JOIN "forecast" f ON fr.forecast_id = f.id;