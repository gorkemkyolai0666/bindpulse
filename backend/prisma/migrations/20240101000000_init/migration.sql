-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('intake', 'assessment', 'in_progress', 'awaiting_materials', 'quality_check', 'ready', 'delivered', 'quoted');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('restoration', 'rebinding', 'gilding', 'conservation', 'custom_binding', 'repair');

-- CreateEnum
CREATE TYPE "VolumeCondition" AS ENUM ('excellent', 'good', 'fair', 'poor', 'critical');

-- CreateEnum
CREATE TYPE "VolumeStatus" AS ENUM ('in_workshop', 'awaiting_materials', 'in_restoration', 'completed', 'returned');

-- CreateEnum
CREATE TYPE "MaterialCategory" AS ENUM ('leather', 'paper', 'thread', 'adhesive', 'gold_leaf', 'cloth', 'board', 'tool', 'chemical');

-- CreateTable
CREATE TABLE "Firm" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "state" TEXT NOT NULL DEFAULT '',
    "zipCode" TEXT NOT NULL DEFAULT '',
    "totalWorkbenches" INTEGER NOT NULL DEFAULT 2,
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Istanbul',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Firm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'artisan',
    "firmId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestorationProject" (
    "id" TEXT NOT NULL,
    "projectNumber" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "projectType" "ProjectType" NOT NULL,
    "volumeCount" INTEGER NOT NULL DEFAULT 1,
    "status" "ProjectStatus" NOT NULL DEFAULT 'intake',
    "benchName" TEXT,
    "notes" TEXT,
    "dueDate" TIMESTAMP(3),
    "firmId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestorationProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VolumeItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "condition" "VolumeCondition" NOT NULL DEFAULT 'fair',
    "status" "VolumeStatus" NOT NULL DEFAULT 'in_workshop',
    "estimatedHours" DOUBLE PRECISION,
    "projectId" TEXT,
    "firmId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VolumeItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialStock" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "materialCategory" "MaterialCategory" NOT NULL,
    "pricePerUnit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stockQty" INTEGER NOT NULL DEFAULT 0,
    "leadDays" INTEGER NOT NULL DEFAULT 7,
    "status" TEXT NOT NULL DEFAULT 'active',
    "firmId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaterialStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppointmentJob" (
    "id" TEXT NOT NULL,
    "appointmentName" TEXT NOT NULL,
    "appointmentType" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "benchName" TEXT,
    "volumeCount" INTEGER,
    "projectId" TEXT,
    "notes" TEXT,
    "firmId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppointmentJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workbench" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "artisan" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "maxSlots" INTEGER NOT NULL DEFAULT 4,
    "booked" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "firmId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workbench_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES "Firm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestorationProject" ADD CONSTRAINT "RestorationProject_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES "Firm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolumeItem" ADD CONSTRAINT "VolumeItem_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES "Firm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialStock" ADD CONSTRAINT "MaterialStock_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES "Firm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentJob" ADD CONSTRAINT "AppointmentJob_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES "Firm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workbench" ADD CONSTRAINT "Workbench_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES "Firm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
