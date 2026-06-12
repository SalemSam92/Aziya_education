-- CreateTable
CREATE TABLE `classroom` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(10) NOT NULL,
    `nbMaxStudent` INTEGER NOT NULL,
    `school_id` INTEGER NOT NULL,
    `professor_id` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `imputation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dateTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isPresent` BOOLEAN NOT NULL,
    `student_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `school` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `siret` VARCHAR(14) NOT NULL,
    `name` VARCHAR(40) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `school_siret_key`(`siret`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lastname` VARCHAR(45) NOT NULL,
    `firstname` VARCHAR(40) NOT NULL,
    `birthday` DATETIME(3) NOT NULL,
    `classroom_id` INTEGER NULL,
    `school_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lastname` VARCHAR(45) NOT NULL,
    `firstname` VARCHAR(40) NOT NULL,
    `mail` VARCHAR(40) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('DIRECTOR', 'PROFESSOR') NOT NULL DEFAULT 'DIRECTOR',
    `school_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_mail_key`(`mail`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `classroom` ADD CONSTRAINT `classroom_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `school`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classroom` ADD CONSTRAINT `classroom_professor_id_fkey` FOREIGN KEY (`professor_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `imputation` ADD CONSTRAINT `imputation_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student` ADD CONSTRAINT `student_classroom_id_fkey` FOREIGN KEY (`classroom_id`) REFERENCES `classroom`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student` ADD CONSTRAINT `student_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `school`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `school`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
