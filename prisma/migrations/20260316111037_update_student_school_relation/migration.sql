/*
  Warnings:

  - Added the required column `school_id` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `student` ADD COLUMN `school_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `School`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
