/*
  Warnings:

  - You are about to drop the column `sobbrenome` on the `convidado` table. All the data in the column will be lost.
  - Added the required column `sobrenome` to the `Convidado` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `convidado` DROP COLUMN `sobbrenome`,
    ADD COLUMN `sobrenome` VARCHAR(191) NOT NULL;
