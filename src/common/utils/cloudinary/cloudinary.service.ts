import { Injectable } from '@nestjs/common';
import { UploadApiResponse, UploadApiErrorResponse, v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  // رفع ملف (صورة أو PDF) على Cloudinary
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads',
    public_id?: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id,
          resource_type: 'auto', // مهم جدًا: يسمح برفع PDF وصور وفيديو
          // لو عاوز تحدد أنواع معينة: allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'webp'],
          overwrite: true,
          invalidate: true
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      // تحويل buffer بتاع multer إلى stream ورفعه
      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  // حذف ملف من Cloudinary باستخدام public_id
  async deleteFile(publicId: string): Promise<any> {
    // publicId يكون زي: "uploads/avatar_123abc"
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image', // أو 'raw' للـ PDF
      // لو مش عارف النوع، استخدم invalidate: true و type: 'upload'
    });
  }

  // حذف متعدد (لو عاوز تحذف أكتر من واحد مرة واحدة)
  async deleteFiles(publicIds: string[]): Promise<any> {
    return await cloudinary.api.delete_resources(publicIds, {
      resource_type: 'image', // أو 'raw' للـ PDF
    });
  }

  // جلب الـ URL المباشر للملف (صورة أو PDF)
  getFileUrl(publicId: string, isPdf: boolean = false): string {
    if (isPdf) {
      // للـ PDF: raw file
      return cloudinary.url(publicId, {
        resource_type: 'raw',
        secure: true,
      });
    }
    // للصور: عادي image
    return cloudinary.url(publicId, {
      secure: true,
      // لو عاوز تحولات على الصورة زي resize
      // transformation: [{ width: 500, height: 500, crop: 'limit' }]
    });
  }
}