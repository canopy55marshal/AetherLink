-- 创建消息表
CREATE TABLE IF NOT EXISTS messages (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id VARCHAR(100) NOT NULL,
  user_id VARCHAR(100) NOT NULL,
  user_name VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 创建索引
CREATE INDEX IF NOT EXISTS messages_room_id_idx ON messages(room_id);
CREATE INDEX IF NOT EXISTS messages_user_id_idx ON messages(user_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at DESC);

-- 创建未读消息计数视图
CREATE OR REPLACE VIEW unread_messages_count AS
SELECT 
  room_id,
  user_id AS recipient_id,
  COUNT(*) AS unread_count
FROM messages
WHERE is_read = FALSE
GROUP BY room_id, user_id;

-- 添加注释
COMMENT ON TABLE messages IS '消息表';
COMMENT ON VIEW unread_messages_count IS '未读消息计数视图';
