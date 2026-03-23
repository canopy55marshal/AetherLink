import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export class FileStorageService {
  private storageDir: string;

  constructor() {
    // 使用 /tmp 目录作为存储根目录
    this.storageDir = '/tmp/storage';
    this.ensureStorageDir();
  }

  /**
   * 确保存储目录存在
   */
  private async ensureStorageDir(): Promise<void> {
    const directories = [
      path.join(this.storageDir, 'models'),
      path.join(this.storageDir, 'avatars'),
      path.join(this.storageDir, 'uploads'),
    ];

    for (const dir of directories) {
      try {
        await fs.access(dir);
      } catch {
        await fs.mkdir(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      }
    }
  }

  /**
   * 生成唯一文件名
   */
  private generateFileName(originalName: string): string {
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext);
    const hash = crypto.randomBytes(8).toString('hex');
    return `${baseName}-${hash}${ext}`;
  }

  /**
   * 上传文件
   */
  async uploadFile(
    bucket: string,
    file: Buffer | Uint8Array,
    originalName: string,
    mimeType: string
  ): Promise<{
    path: string;
    url: string;
    size: number;
  }> {
    const fileName = this.generateFileName(originalName);
    const filePath = path.join(this.storageDir, bucket, fileName);

    // 写入文件
    await fs.writeFile(filePath, file);

    // 返回文件信息
    return {
      path: `/${bucket}/${fileName}`,
      url: `/api/v1/storage/${bucket}/${fileName}`,
      size: file.length,
    };
  }

  /**
   * 下载文件
   */
  async downloadFile(bucket: string, fileName: string): Promise<{
    file: Buffer;
    mimeType: string;
  } | null> {
    const filePath = path.join(this.storageDir, bucket, fileName);

    try {
      const file = await fs.readFile(filePath);

      // 根据扩展名确定 MIME 类型
      const ext = path.extname(fileName).toLowerCase();
      const mimeTypes: { [key: string]: string } = {
        '.stl': 'model/stl',
        '.obj': 'model/obj',
        '.3mf': 'model/3mf',
        '.amf': 'model/amf',
        '.ply': 'model/ply',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.pdf': 'application/pdf',
      };

      return {
        file,
        mimeType: mimeTypes[ext] || 'application/octet-stream',
      };
    } catch (error) {
      console.error('File not found:', filePath);
      return null;
    }
  }

  /**
   * 删除文件
   */
  async deleteFile(bucket: string, fileName: string): Promise<boolean> {
    const filePath = path.join(this.storageDir, bucket, fileName);

    try {
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      console.error('Failed to delete file:', filePath);
      return false;
    }
  }

  /**
   * 获取文件信息
   */
  async getFileInfo(bucket: string, fileName: string): Promise<{
    size: number;
    exists: boolean;
  } | null> {
    const filePath = path.join(this.storageDir, bucket, fileName);

    try {
      const stats = await fs.stat(filePath);
      return {
        size: stats.size,
        exists: true,
      };
    } catch (error) {
      return {
        size: 0,
        exists: false,
      };
    }
  }

  /**
   * 获取存储目录路径
   */
  getStoragePath(): string {
    return this.storageDir;
  }
}

// 导出单例实例
export const fileStorageService = new FileStorageService();
