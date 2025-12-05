// src/common/utils/multer-options.factory.ts
import { BadRequestException } from '@nestjs/common';
import type { Request } from 'express';
import type { FileFilterCallback } from 'multer';

export const createMulterOptions = (
    maxSize: number = 10 * 1024 * 1024,
    allowedMimes: string[] = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/pdf',
    ],
) => ({
    
    limits: { fileSize: maxSize },
    fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        console.log({file});
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new BadRequestException(`invalid Type file`));
        }
    },
});