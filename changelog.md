# Changelog

## [v0.0.3] - 2026-04-22

- hotspot-manager
    - list
    - create
    - view (player)
    - delete
    - deleteAll

## [v0.0.2] - 2026-04-09

- wind
    - wind sensor
    - wind recording
- drones
    - drones list
    - drones player

## [v0.0.1] - 2026-04-08
- ทำ wind เสร็จแล้ว
    - GET /wind แสดง wind-data
        - export to csv
        - export to csv and delete
    - GET /wind/history แสดงข้อมูลที่ถูก export เป็น csv
        - download csv
        - delete csv

## [v0.0.0] - 2026-04-03

- `GET /wind-sensor`

    - latest (socketio + prisma)
    - findAll (prisma)
