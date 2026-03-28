import express from "express";
import cors from "cors";
import { createServer } from "http";
import fetchDocumentRouter from './routes/fetch-document';
import aiChatRouter from './routes/ai-chat';
import knowledgeRouter from './routes/knowledge';
import knowledgeChainsRouter from './routes/knowledge-chains';
import tasksRouter from './routes/tasks';
import communityRouter from './routes/community';
import modelsRouter from './routes/models';
import authRouter from './routes/auth';
import storageRouter from './routes/storage';
import messagesRouter from './routes/messages';
import petsRouter from './routes/pets';
import wikipediaRouter from './routes/wikipedia';
import { initializeSocketServer } from './services/socket';

const app = express();
const port = process.env.PORT || 9091;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/api/v1/health', (req, res) => {
  console.log('Health check success');
  res.status(200).json({ status: 'ok' });
});

// 获取文档内容路由
app.use('/api/v1/fetch-document', fetchDocumentRouter);

// AI 聊天路由
app.use('/api/v1/ai-chat', aiChatRouter);

// 知识文章路由
app.use('/api/v1/knowledge', knowledgeRouter);

// 知识链路由
app.use('/api/v1/knowledge-chains', knowledgeChainsRouter);

// 任务分析路由
app.use('/api/v1/tasks', tasksRouter);

// 社区文章路由
app.use('/api/v1/community', communityRouter);

// 产品模型路由
app.use('/api/v1/models', modelsRouter);

// 认证路由
app.use('/api/v1/auth', authRouter);

// 文件存储路由
app.use('/api/v1/storage', storageRouter);

// 消息路由
app.use('/api/v1/messages', messagesRouter);

// 宠物路由
app.use('/api/v1/pets', petsRouter);

// 维基百科路由
app.use('/api/v1/wikipedia', wikipediaRouter);

// 创建 HTTP 服务器
const server = createServer(app);

// 初始化 Socket.io
const io = initializeSocketServer(server);

server.listen(Number(port), '0.0.0.0', () => {
  console.log(`Server listening at http://localhost:${port}/`);
  console.log(`WebSocket server initialized`);
});
