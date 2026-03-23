import { Router } from 'express';
import multer from 'multer';
import { fileStorageService } from '../services/file-storage';
import path from 'path';

const router = Router();

// 配置 multer 用于处理文件上传（内存存储）
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

/**
 * POST /api/v1/storage/upload
 * 上传文件
 * Body: multipart/form-data with 'file' field
 * Query: bucket=models|avatars|uploads
 */
router.post('/upload', upload.single('file'), async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const bucket = req.query.bucket || 'uploads';
    const allowedBuckets = ['models', 'avatars', 'uploads'];

    if (!allowedBuckets.includes(bucket)) {
      return res.status(400).json({
        error: 'Invalid bucket. Must be one of: models, avatars, uploads',
      });
    }

    // 上传文件
    const result = await fileStorageService.uploadFile(
      bucket,
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    res.json({
      data: result,
      message: 'File uploaded successfully',
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/v1/storage/:bucket/:filename
 * 下载文件
 */
router.get('/:bucket/:filename(*)', async (req: any, res: any) => {
  try {
    const { bucket, filename } = req.params;
    const allowedBuckets = ['models', 'avatars', 'uploads'];

    if (!allowedBuckets.includes(bucket)) {
      return res.status(404).json({ error: 'Bucket not found' });
    }

    // 下载文件
    const result = await fileStorageService.downloadFile(bucket, filename);

    if (!result) {
      return res.status(404).json({ error: 'File not found' });
    }

    // 设置响应头
    res.setHeader('Content-Type', result.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);

    // 发送文件
    res.send(result.file);
  } catch (error: any) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/v1/storage/info/:bucket/:filename
 * 获取文件信息
 */
router.get('/info/:bucket/:filename(*)', async (req: any, res: any) => {
  try {
    const { bucket, filename } = req.params;
    const allowedBuckets = ['models', 'avatars', 'uploads'];

    if (!allowedBuckets.includes(bucket)) {
      return res.status(404).json({ error: 'Bucket not found' });
    }

    const result = await fileStorageService.getFileInfo(bucket, filename);

    if (!result?.exists) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json({
      data: result,
    });
  } catch (error: any) {
    console.error('Error getting file info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/v1/storage/:bucket/:filename
 * 删除文件
 */
router.delete('/:bucket/:filename(*)', async (req: any, res: any) => {
  try {
    const { bucket, filename } = req.params;
    const allowedBuckets = ['models', 'avatars', 'uploads'];

    if (!allowedBuckets.includes(bucket)) {
      return res.status(404).json({ error: 'Bucket not found' });
    }

    const success = await fileStorageService.deleteFile(bucket, filename);

    if (!success) {
      return res.status(404).json({ error: 'File not found or delete failed' });
    }

    res.json({
      message: 'File deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
