import { getSupabaseClient } from '../src/storage/database/supabase-client';

const sampleModels = [
  {
    id: 'model-001',
    title: '风力发电机叶片模型',
    description: '高精度风力发电机叶片3D模型，适用于新能源教学和展示。模型包含详细的叶片结构和表面纹理，适合3D打印制作教学模型。',
    category: '新能源',
    format: 'STL',
    is_free: 'true',
    price: 0,
    cover_image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80',
    model_file_url: 'https://example.com/models/wind-turbine-blade.stl',
    author_id: 'user-001',
    author_name: '绿色能源工作室',
    author_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    downloads: 234,
    likes: 89,
    shares: 45,
    view_count: 567,
    tags: ['风力发电', '叶片', '教学'],
    specifications: {
      size: '1500mm x 200mm x 50mm',
      material: 'PLA/PETG',
      resolution: '0.2mm'
    },
    printing_settings: {
      layer_height: '0.2mm',
      infill: '20%',
      supports: true
    },
    is_platform_sponsored: 'true',
    status: 'published'
  },
  {
    id: 'model-002',
    title: '稀土永磁体磁环',
    description: '精密稀土永磁体磁环模型，用于教学展示稀土材料在新能源领域的应用。模型展示了钕铁硼磁体的典型环状结构。',
    category: '稀土',
    format: 'OBJ',
    is_free: 'true',
    price: 0,
    cover_image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
    model_file_url: 'https://example.com/models/rare-earth-magnet.obj',
    author_id: 'user-002',
    author_name: '新材料实验室',
    author_avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100',
    downloads: 189,
    likes: 67,
    shares: 32,
    view_count: 432,
    tags: ['稀土', '永磁体', '磁环'],
    specifications: {
      size: '100mm x 100mm x 20mm',
      material: 'PLA',
      resolution: '0.15mm'
    },
    printing_settings: {
      layer_height: '0.15mm',
      infill: '100%',
      supports: false
    },
    is_platform_sponsored: 'true',
    status: 'published'
  },
  {
    id: 'model-003',
    title: 'CPU芯片模型 - 7nm工艺展示',
    description: '高精度CPU芯片3D模型，展示7nm工艺制程的芯片结构。包含芯片基板、晶体管阵列、引脚等细节，适合芯片制造教学。',
    category: '芯片',
    format: '3MF',
    is_free: 'false',
    price: 29900, // 299元
    cover_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    model_file_url: 'https://example.com/models/cpu-7nm.3mf',
    author_id: 'user-003',
    author_name: '半导体设计工作室',
    author_avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100',
    downloads: 56,
    likes: 34,
    shares: 12,
    view_count: 234,
    tags: ['CPU', '芯片', '7nm', '教学'],
    specifications: {
      size: '50mm x 50mm x 5mm',
      material: '树脂',
      resolution: '0.05mm'
    },
    printing_settings: {
      layer_height: '0.05mm',
      infill: '100%',
      supports: true
    },
    is_platform_sponsored: 'false',
    status: 'published'
  },
  {
    id: 'model-004',
    title: '3D打印无人机框架',
    description: '轻量化3D打印无人机框架模型，采用碳纤维复合材料设计思路。适合学习和实践3D打印技术在航空航天领域的应用。',
    category: '3D打印',
    format: 'STL',
    is_free: 'true',
    price: 0,
    cover_image: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&q=80',
    model_file_url: 'https://example.com/models/drone-frame.stl',
    author_id: 'user-004',
    author_name: '3D打印创客空间',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    downloads: 312,
    likes: 145,
    shares: 67,
    view_count: 789,
    tags: ['无人机', '框架', '碳纤维'],
    specifications: {
      size: '300mm x 300mm x 80mm',
      material: 'Carbon Fiber PA12',
      resolution: '0.2mm'
    },
    printing_settings: {
      layer_height: '0.2mm',
      infill: '40%',
      supports: true
    },
    is_platform_sponsored: 'false',
    status: 'published'
  },
  {
    id: 'model-005',
    title: '石墨烯复合材料结构',
    description: '石墨烯复合材料微观结构模型，展示石墨烯层状排列和复合材料界面。适合新材料科学教学和研究展示。',
    category: '新材料',
    format: 'AMF',
    is_free: 'true',
    price: 0,
    cover_image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80',
    model_file_url: 'https://example.com/models/graphene-composite.amf',
    author_id: 'user-005',
    author_name: '纳米材料研究所',
    author_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    downloads: 178,
    likes: 76,
    shares: 38,
    view_count: 445,
    tags: ['石墨烯', '复合材料', '纳米'],
    specifications: {
      size: '80mm x 80mm x 40mm',
      material: '透明树脂',
      resolution: '0.1mm'
    },
    printing_settings: {
      layer_height: '0.1mm',
      infill: '30%',
      supports: false
    },
    is_platform_sponsored: 'true',
    status: 'published'
  }
];

async function insertSampleModels() {
  const client = getSupabaseClient();

  // 先删除旧数据
  await client.from('models').delete().neq('id', '');

  // 插入示例数据
  for (const model of sampleModels) {
    const { error } = await client.from('models').insert(model);
    if (error) {
      console.error('Failed to insert model:', model.title, error);
    } else {
      console.log('Inserted model:', model.title);
    }
  }

  console.log('Sample models insertion completed!');
}

insertSampleModels().catch(console.error);
