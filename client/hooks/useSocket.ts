import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL?.replace('http://', 'ws://') || 'ws://localhost:9091';

export interface Message {
  id: string;
  roomId: string;
  message: string;
  userId: string;
  userName: string;
  timestamp: string;
}

export interface Notification {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
}

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // 创建 Socket 连接
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    // 监听新消息
    socket.on('new-message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // 监听用户加入
    socket.on('user-joined', (data) => {
      console.log('User joined:', data);
    });

    // 监听用户离开
    socket.on('user-left', (data) => {
      console.log('User left:', data);
    });

    // 监听用户输入
    socket.on('user-typing', (data) => {
      console.log('User typing:', data);
    });

    // 监听停止输入
    socket.on('user-stopped-typing', (data) => {
      console.log('User stopped typing:', data);
    });

    // 监听通知
    socket.on('notification', (notification: Notification) => {
      console.log('Notification:', notification);
      // 可以在这里显示 toast 或其他通知
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // 加入房间
  const joinRoom = (roomId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('join-room', roomId);
    }
  };

  // 离开房间
  const leaveRoom = (roomId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('leave-room', roomId);
    }
  };

  // 发送消息
  const sendMessage = (roomId: string, message: string, userId: string, userName: string) => {
    if (socketRef.current) {
      socketRef.current.emit('send-message', {
        roomId,
        message,
        userId,
        userName,
      });
    }
  };

  // 输入状态
  const sendTyping = (roomId: string, userId: string, userName: string) => {
    if (socketRef.current) {
      socketRef.current.emit('typing', { roomId, userId, userName });
    }
  };

  // 停止输入
  const stopTyping = (roomId: string, userId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('stop-typing', { roomId, userId });
    }
  };

  // 清空消息
  const clearMessages = () => {
    setMessages([]);
  };

  return {
    isConnected,
    messages,
    joinRoom,
    leaveRoom,
    sendMessage,
    sendTyping,
    stopTyping,
    clearMessages,
  };
}
