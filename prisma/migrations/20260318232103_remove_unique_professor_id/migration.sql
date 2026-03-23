-- DropForeignKey
ALTER TABLE `classroom` DROP FOREIGN KEY `Classroom_professor_id_fkey`;

-- DropIndex
DROP INDEX `Classroom_professor_id_key` ON `classroom`;


