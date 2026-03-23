-- 创建任务步骤完成记录表
CREATE TABLE IF NOT EXISTS task_step_completions (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id VARCHAR(36) NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  task_step_id VARCHAR(36) NOT NULL REFERENCES task_steps(id) ON DELETE CASCADE,
  user_id VARCHAR(100) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 创建索引
CREATE INDEX IF NOT EXISTS task_step_completions_task_id_idx ON task_step_completions(task_id);
CREATE INDEX IF NOT EXISTS task_step_completions_task_step_id_idx ON task_step_completions(task_step_id);
CREATE INDEX IF NOT EXISTS task_step_completions_user_id_idx ON task_step_completions(user_id);
CREATE INDEX IF NOT EXISTS task_step_completions_task_user_unique_idx ON task_step_completions(task_id, user_id, task_step_id);

-- 添加注释
COMMENT ON TABLE task_step_completions IS '任务步骤完成记录表';
