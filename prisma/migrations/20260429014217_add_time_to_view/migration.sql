-- ตรวจสอบว่ามี Extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- ลบอันเก่า (ถ้ามี) เพื่อความสะอาด
DROP VIEW IF EXISTS v_forecast_polygons;

CREATE OR REPLACE VIEW v_forecast_polygons AS
SELECT 
    CAST(row_number() OVER () AS INTEGER) AS id,
    fr.id AS original_uuid,
    fr.minutes,
    -- target_time คือเวลาที่พยากรณ์ไว้ (เวลาที่สร้าง + นาทีที่บวกเพิ่ม)
    (f.created_at + (fr.minutes || ' minutes')::interval) AS target_time,
    ST_SetSRID(ST_Force2D(ST_GeomFromGeoJSON((fr.geojson_data->'geometry')::text)), 4326)::geometry(Geometry, 4326) AS geom
FROM "forecast_result" fr
JOIN "forecast" f ON fr.forecast_id = f.id;