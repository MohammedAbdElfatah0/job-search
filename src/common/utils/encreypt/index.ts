import { ConflictException } from '@nestjs/common';
import * as crypto from 'crypto';

export class CryptoHelper {
  private static readonly algorithm = 'aes-256-cbc';
  private static getKey(): Buffer {
    const keyHex = process.env.ENCRYPTION_KEY_ENCREYPT;
    if (!keyHex) throw new Error('ENCRYPTION_KEY_ENCREYPT not set in env');
    const key = Buffer.from(keyHex, 'hex');
    if (key.length !== 32) throw new ConflictException('ENCRYPTION_KEY_ENCREYPT must be 32 bytes (hex)');
    return key;
  }

  static encrypt(text: string) {
    const key = this.getKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
      iv: iv.toString('hex'),
      content: encrypted,
    };
  }

  static decrypt({ iv, content }: { iv: string; content: string }) {
    const key = this.getKey();
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      key,
      Buffer.from(iv, 'hex'),
    );

    let decrypted = decipher.update(content, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
