/*
  Warnings:

  - A unique constraint covering the columns `[startDate]` on the table `Budget` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Budget_startDate_key" ON "Budget"("startDate");
