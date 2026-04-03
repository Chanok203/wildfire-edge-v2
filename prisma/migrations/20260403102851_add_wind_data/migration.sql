-- CreateTable
CREATE TABLE "WindData" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sensorId" TEXT NOT NULL,
    "speed" DOUBLE PRECISION NOT NULL,
    "direction" INTEGER NOT NULL,
    "sensorTs" INTEGER NOT NULL,

    CONSTRAINT "WindData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WindData_createdAt_idx" ON "WindData"("createdAt");
