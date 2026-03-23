-- DropIndex
DROP INDEX `Classroom_name_key` ON `classroom`;

-- AddForeignKey
ALTER TABLE `Classroom` ADD CONSTRAINT `Classroom_professor_id_fkey` FOREIGN KEY (`professor_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
