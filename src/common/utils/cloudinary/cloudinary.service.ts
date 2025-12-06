import { Injectable } from '@nestjs/common';
import { UploadApiResponse, UploadApiErrorResponse, v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
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
          resource_type: 'auto',
          overwrite: true,
          invalidate: true
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve(result);
        },
      );


      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  async deleteFile(publicId: string, type: 'image' | 'raw' = 'image'): Promise<any> {
    // publicId يكون زي: "uploads/avatar_123abc"
    // لاستخدام deleteFile على صورة يجب تحديد resource_type ك'image', وعلى غيره ك 'raw'
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: type,
      invalidate: true, // يجب تحديده عند حذف صورة من Cloudinary
    });
  }


  async deleteFilesMixed(
    items: { publicId: string; isPdf?: boolean }[],
  ): Promise<any> {
    // نفصل الصور عن الـ PDF
    const images = items
      .filter((item) => !item.isPdf)
      .map((item) => item.publicId);

    const pdfs = items
      .filter((item) => item.isPdf)
      .map((item) => item.publicId);

    const results = [];

    // نحذف الصور لو فيه
    if (images.length > 0) {
      await cloudinary.api.delete_resources(images, {
        resource_type: 'image',
      });

    }

    // نحذف الـ PDF لو فيه
    if (pdfs.length > 0) {
      await cloudinary.api.delete_resources(pdfs, {
        resource_type: 'raw',
      });

    }

    return results;
  }

  async deleteEntireFolder(folderPath: string): Promise<any> {
    const normalizedFolder = folderPath.endsWith('/') ? folderPath : `${folderPath}/`;
    return await cloudinary.api.delete_resources_by_prefix(normalizedFolder, {
      all: true,
      resource_type: 'image',
    })
      .then(() => cloudinary.api.delete_resources_by_prefix(normalizedFolder, {
        all: true,
        resource_type: 'raw',
      }))
      .then(() => {
        return cloudinary.api.delete_folder(normalizedFolder);
      });
  }


  getFileUrl(publicId: string, isPdf: boolean = false): string {
    if (isPdf) {
      return cloudinary.url(publicId, {
        resource_type: 'raw',
        secure: true,
      });
    }

    return cloudinary.url(publicId, {
      secure: true,
    });
  }
}