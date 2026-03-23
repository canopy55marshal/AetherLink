import { Server } from 'socket.io';

let io: Server | null = null;

/**
 * 初始化 Socket.io 服务器
 */
export function initializeSocketServer(server: any) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // 用户加入房间
    socket.on('join-room', (roomId: string) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room: ${roomId}`);
      socket.to(roomId).emit('user-joined', {
        userId: socket.id,
        roomId,
        timestamp: new Date().toISOString(),
      });
    });

    // 用户离开房间
    socket.on('leave-room', (roomId: string) => {
      socket.leave(roomId);
      console.log(`User ${socket.id} left room: ${roomId}`);
      socket.to(roomId).emit('user-left', {
        userId: socket.id,
        roomId,
        timestamp: new Date().toISOString(),
      });
    });

    // 发送消息
    socket.on('send-message', (data: {
      roomId: string;
      message: string;
      userId: string;
      userName: string;
    }) => {
      const messageData = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...data,
        timestamp: new Date().toISOString(),
      };

      // 发送给房间内的所有用户（包括发送者）
      io!.to(data.roomId).emit('new-message', messageData);
      console.log(`Message sent to room ${data.roomId}:`, messageData);
    });

    // 输入状态
    socket.on('typing', (data: {
      roomId: string;
      userId: string;
      userName: string;
    }) => {
      socket.to(data.roomId).emit('user-typing', data);
    });

    // 停止输入
    socket.on('stop-typing', (data: {
      roomId: string;
      userId: string;
    }) => {
      socket.to(data.roomId).emit('user-stopped-typing', data);
    });

    // 断开连接
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
}

/**
 * 获取 Socket.io 实例
 */
export function getSocketIO(): Server {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}

/**
 * 向指定房间发送通知
 */
export function sendNotificationToRoom(roomId: string, notification: {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
}) {
  const ioInstance = getSocketIO();
  ioInstance.to(roomId).emit('notification', {
    ...notification,
    timestamp: new Date().toISOString(),
  });
}

/**
 * 向指定用户发送通知
 */
export function sendNotificationToUser(userId: string, notification: {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
}) {
  const ioInstance = getSocketIO();
  ioInstance.to(userId).emit('notification', {
    ...notification,
    timestamp: new Date().toISOString(),
  });
}

/**
 * 广播通知给所有连接的用户
 */
export function broadcastNotification(notification: {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
}) {
  const ioInstance = getSocketIO();
  ioInstance.emit('notification', {
    ...notification,
    timestamp: new Date().toISOString(),
  });
}
