import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';

export const NOTIFICATION_IMAGE_MAX_BYTES = 1 * 1024 * 1024; // 1MB, matches the admin form's client-side check

export const notificationImageMulterOptions = {
  // Buffered in memory, not written to local disk — the file goes straight to Firebase Storage
  // from the buffer (see NotificationsService.uploadImage).
  storage: memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new BadRequestException('Only image uploads are allowed'), false);
      return;
    }
    cb(null, true);
  },
  limits: { fileSize: NOTIFICATION_IMAGE_MAX_BYTES },
};
