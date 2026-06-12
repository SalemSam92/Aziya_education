/*
  Warnings:

  - Made the column `classroom_id` on table `student` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_classroom_id_fkey`;

-- DropIndex
DROP INDEX `Student_classroom_id_fkey` ON `student`;

-- AlterTable
ALTER TABLE `student` MODIFY `classroom_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_classroom_id_fkey` FOREIGN KEY (`classroom_id`) REFERENCES `Classroom`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
