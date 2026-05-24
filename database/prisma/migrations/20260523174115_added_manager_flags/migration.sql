-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "madeByManager" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "isManager" BOOLEAN NOT NULL DEFAULT false;
