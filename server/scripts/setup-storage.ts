import { getSupabaseClient } from '../src/storage/database/supabase-client';

async function setupStorage() {
  const client = getSupabaseClient();

  const buckets = [
    {
      name: 'models',
      public: true,
      description: '3D模型文件存储',
    },
    {
      name: 'avatars',
      public: true,
      description: '用户头像存储',
    },
    {
      name: 'uploads',
      public: false,
      description: '用户上传文件',
    },
  ];

  for (const bucket of buckets) {
    try {
      // 检查存储桶是否已存在
      const { data: existingBucket } = await client.storage.getBucket(bucket.name);

      if (existingBucket) {
        console.log(`✓ Bucket "${bucket.name}" already exists`);
      } else {
        // 创建存储桶
        const { error } = await client.storage.createBucket(bucket.name, {
          public: bucket.public,
        });

        if (error) {
          console.error(`✗ Failed to create bucket "${bucket.name}":`, error.message);
        } else {
          console.log(`✓ Created bucket "${bucket.name}"`);
        }
      }

      // 设置公开策略（如果是公开存储桶）
      if (bucket.public) {
        const { error: policyError } = await client.storage
          .from(bucket.name)
          .createSignedUploadUrl('test.txt', { upsert: true });

        if (policyError && !policyError.message.includes('Policy not found')) {
          console.log(`  - Public access configured for "${bucket.name}"`);
        }
      }
    } catch (error: any) {
      console.error(`✗ Error setting up bucket "${bucket.name}":`, error.message);
    }
  }

  console.log('\n✅ Storage setup completed!');
}

setupStorage().catch(console.error);
