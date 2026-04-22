-- CreateEnum
CREATE TYPE "AIStatus" AS ENUM ('PENDING', 'CREATE_INPUT', 'IN_QUEUE', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELED');

-- CreateEnum
CREATE TYPE "PushStatus" AS ENUM ('IDLE', 'PENDING', 'PUSHING', 'PUSHED', 'FAILED', 'CANCELED');

-- CreateTable
CREATE TABLE "wind_data" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sensorId" TEXT NOT NULL,
    "speed" DOUBLE PRECISION NOT NULL,
    "direction" INTEGER NOT NULL,
    "sensorTs" INTEGER NOT NULL,

    CONSTRAINT "wind_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forecast" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "drone_name" TEXT NOT NULL,
    "ai_status" "AIStatus" NOT NULL DEFAULT 'PENDING',
    "push_status" "PushStatus" NOT NULL DEFAULT 'IDLE',
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "input_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forecast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forecast_result" (
    "id" TEXT NOT NULL,
    "forecast_id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "minutes" INTEGER NOT NULL,
    "valid_at" TIMESTAMP(3) NOT NULL,
    "geojson_data" JSONB NOT NULL,

    CONSTRAINT "forecast_result_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "wind_data_sensorId_idx" ON "wind_data"("sensorId");

-- CreateIndex
CREATE INDEX "wind_data_createdAt_idx" ON "wind_data"("createdAt");

-- CreateIndex
CREATE INDEX "forecast_id_idx" ON "forecast"("id");

-- AddForeignKey
ALTER TABLE "forecast_result" ADD CONSTRAINT "forecast_result_forecast_id_fkey" FOREIGN KEY ("forecast_id") REFERENCES "forecast"("id") ON DELETE CASCADE ON UPDATE CASCADE;
