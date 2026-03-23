import { pgTable, serial, timestamp, text, varchar, jsonb, integer, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

// 用户表
export const users = pgTable("users", {
	id: varchar("id", { length: 100 }).primaryKey().default(sql`gen_random_uuid()`),
	username: varchar("username", { length: 50 }).notNull().unique(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	password: varchar("password", { length: 255 }).notNull(),
	avatar: varchar("avatar", { length: 500 }),
	bio: text("bio"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("users_username_idx").on(table.username),
	index("users_email_idx").on(table.email),
]);

export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const knowledgeArticles = pgTable("knowledge_articles", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	title: varchar("title", { length: 255 }).notNull(),
	category: varchar("category", { length: 50 }).notNull(),
	content: text("content").notNull(),
	coverImage: varchar("cover_image", { length: 500 }),
	readTime: integer("read_time").default(0),
	metadata: jsonb("metadata"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
  index("knowledge_category_idx").on(table.category),
]);

export const practiceProjects = pgTable("practice_projects", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	title: varchar("title", { length: 255 }).notNull(),
	level: varchar("level", { length: 20 }).notNull(),
	description: text("description").notNull(),
	tasks: jsonb("tasks").notNull(),
	coverImage: varchar("cover_image", { length: 500 }),
	metadata: jsonb("metadata"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
  index("practice_level_idx").on(table.level),
]);

export const communityPosts = pgTable("community_posts", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	author: varchar("author", { length: 100 }).notNull(),
	avatar: varchar("avatar", { length: 500 }),
	title: varchar("title", { length: 255 }).notNull(),
	content: text("content").notNull(),
	likes: integer("likes").default(0),
	comments: integer("comments").default(0),
	tags: jsonb("tags"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
  index("community_author_idx").on(table.author),
]);

export const knowledgeChains = pgTable("knowledge_chains", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	title: varchar("title", { length: 255 }).notNull(),
	description: text("description").notNull(),
	level: varchar("level", { length: 20 }).notNull(),
	category: varchar("category", { length: 50 }).notNull(),
	coverImage: varchar("cover_image", { length: 500 }),
	totalSteps: integer("total_steps").default(0),
	totalTime: integer("total_time").default(0),
	metadata: jsonb("metadata"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
  index("knowledge_chain_category_idx").on(table.category),
  index("knowledge_chain_level_idx").on(table.level),
]);

export const knowledgeChainSteps = pgTable("knowledge_chain_steps", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	chainId: varchar("chain_id", { length: 36 }).notNull().references(() => knowledgeChains.id, { onDelete: 'cascade' }),
	articleId: varchar("article_id", { length: 36 }).notNull(),
	stepOrder: integer("step_order").notNull(),
	stepTitle: varchar("step_title", { length: 255 }).notNull(),
	stepDescription: text("step_description"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
  index("chain_id_idx").on(table.chainId),
  index("step_order_idx").on(table.chainId, table.stepOrder),
]);

// 任务导向学习 - 学习任务表
export const tasks = pgTable("tasks", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	title: varchar("title", { length: 255 }).notNull(),
	description: text("description").notNull(),
	category: varchar("category", { length: 50 }).notNull(),
	difficulty: varchar("difficulty", { length: 20 }).notNull(),
	estimatedTime: integer("estimated_time").default(0), // 预计完成时间（分钟）
	totalSteps: integer("total_steps").default(0),
	coverImage: varchar("cover_image", { length: 500 }),
	metadata: jsonb("metadata"), // tags, objectives, skills
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
  index("task_category_idx").on(table.category),
  index("task_difficulty_idx").on(table.difficulty),
]);

// 任务步骤表 - 拆解任务的具体步骤
export const taskSteps = pgTable("task_steps", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	taskId: varchar("task_id", { length: 36 }).notNull().references(() => tasks.id, { onDelete: 'cascade' }),
	stepOrder: integer("step_order").notNull(),
	stepTitle: varchar("step_title", { length: 255 }).notNull(),
	stepDescription: text("step_description"),
	stepType: varchar("step_type", { length: 50 }).default('learning'), // learning, practice, review, milestone
	estimatedTime: integer("estimated_time").default(0),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
  index("task_id_idx").on(table.taskId),
  index("task_step_order_idx").on(table.taskId, table.stepOrder),
]);

// 任务步骤与知识链/文章的映射表
export const taskStepKnowledgeMap = pgTable("task_step_knowledge_map", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	taskStepId: varchar("task_step_id", { length: 36 }).notNull().references(() => taskSteps.id, { onDelete: 'cascade' }),
	knowledgeChainId: varchar("knowledge_chain_id", { length: 36 }), // 关联的知识链
	knowledgeArticleId: varchar("knowledge_article_id", { length: 36 }), // 关联的单篇文章
	learningTip: text("learning_tip"), // 学习提示
	relevanceScore: integer("relevance_score").default(0), // 相关性评分 0-100
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  index("task_step_id_idx").on(table.taskStepId),
  index("knowledge_chain_id_idx").on(table.knowledgeChainId),
  index("knowledge_article_id_idx").on(table.knowledgeArticleId),
]);

// 任务参与记录 - 用于统计任务热度
export const taskParticipants = pgTable("task_participants", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	taskId: varchar("task_id", { length: 36 }).notNull().references(() => tasks.id, { onDelete: 'cascade' }),
	userId: varchar("user_id", { length: 100 }).notNull(), // 用户标识（可以来自 Auth）
	joinedAt: timestamp("joined_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	progress: integer("progress").default(0), // 学习进度 0-100
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  index("task_participants_task_id_idx").on(table.taskId),
  index("task_participants_user_id_idx").on(table.userId),
  index("task_participants_task_user_unique_idx").on(table.taskId, table.userId),
]);

// 学习搭子关系表
export const studyBuddies = pgTable("study_buddies", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	taskId: varchar("task_id", { length: 36 }).notNull().references(() => tasks.id, { onDelete: 'cascade' }),
	userId1: varchar("user_id_1", { length: 100 }).notNull(),
	userId2: varchar("user_id_2", { length: 100 }).notNull(),
	status: varchar("status", { length: 20 }).default('active'), // active, completed, cancelled
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
  index("study_buddies_task_id_idx").on(table.taskId),
  index("study_buddies_user1_idx").on(table.userId1),
  index("study_buddies_user2_idx").on(table.userId2),
  index("study_buddies_unique_idx").on(table.taskId, table.userId1, table.userId2),
]);

// 产品模型表 - 数据制作生态
export const models = pgTable("models", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	title: varchar("title", { length: 255 }).notNull(),
	description: text("description").notNull(),
	category: varchar("category", { length: 50 }).notNull(), // 新能源、稀土、芯片、3D打印、新材料
	format: varchar("format", { length: 20 }).notNull(), // STL, OBJ, 3MF, AMF, PLY
	isFree: varchar("is_free", { length: 10 }).notNull().default('true'), // 'true' or 'false'
	price: integer("price").default(0), // 价格（分）
	coverImage: varchar("cover_image", { length: 500 }),
	modelFileUrl: varchar("model_file_url", { length: 1000 }).notNull(),
	thumbnailUrls: jsonb("thumbnail_urls"), // 缩略图数组
	authorId: varchar("author_id", { length: 100 }).notNull(),
	authorName: varchar("author_name", { length: 100 }).notNull(),
	authorAvatar: varchar("author_avatar", { length: 500 }),
	downloads: integer("downloads").default(0),
	likes: integer("likes").default(0),
	shares: integer("shares").default(0),
	viewCount: integer("view_count").default(0),
	tags: jsonb("tags"), // 标签数组
	specifications: jsonb("specifications"), // 模型规格（尺寸、材质等）
	printingSettings: jsonb("printing_settings"), // 3D打印设置建议
	isPlatformSponsored: varchar("is_platform_sponsored", { length: 10 }).default('false'), // 是否平台赞助（平台购买分享到免费）
	status: varchar("status", { length: 20 }).default('published'), // draft, published, removed
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
  index("model_category_idx").on(table.category),
  index("model_format_idx").on(table.format),
  index("model_author_idx").on(table.authorId),
  index("model_is_free_idx").on(table.isFree),
  index("model_status_idx").on(table.status),
]);

// 模型下载记录表
export const modelDownloads = pgTable("model_downloads", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	modelId: varchar("model_id", { length: 36 }).notNull().references(() => models.id, { onDelete: 'cascade' }),
	userId: varchar("user_id", { length: 100 }).notNull(),
	downloadedAt: timestamp("downloaded_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  index("model_downloads_model_id_idx").on(table.modelId),
  index("model_downloads_user_id_idx").on(table.userId),
  index("model_downloads_model_user_unique_idx").on(table.modelId, table.userId),
]);

// 模型点赞记录表
export const modelLikes = pgTable("model_likes", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	modelId: varchar("model_id", { length: 36 }).notNull().references(() => models.id, { onDelete: 'cascade' }),
	userId: varchar("user_id", { length: 100 }).notNull(),
	likedAt: timestamp("liked_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  index("model_likes_model_id_idx").on(table.modelId),
  index("model_likes_user_id_idx").on(table.userId),
  index("model_likes_model_user_unique_idx").on(table.modelId, table.userId),
]);

// 模型分享记录表
export const modelShares = pgTable("model_shares", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	modelId: varchar("model_id", { length: 36 }).notNull().references(() => models.id, { onDelete: 'cascade' }),
	userId: varchar("user_id", { length: 100 }).notNull(),
	platform: varchar("platform", { length: 20 }), // wechat, weibo, link, etc
	sharedAt: timestamp("shared_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  index("model_shares_model_id_idx").on(table.modelId),
  index("model_shares_user_id_idx").on(table.userId),
]);

// 任务步骤完成记录表
export const taskStepCompletions = pgTable("task_step_completions", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	taskId: varchar("task_id", { length: 36 }).notNull().references(() => tasks.id, { onDelete: 'cascade' }),
	taskStepId: varchar("task_step_id", { length: 36 }).notNull().references(() => taskSteps.id, { onDelete: 'cascade' }),
	userId: varchar("user_id", { length: 100 }).notNull(),
	completedAt: timestamp("completed_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  index("task_step_completions_task_id_idx").on(table.taskId),
  index("task_step_completions_task_step_id_idx").on(table.taskStepId),
  index("task_step_completions_user_id_idx").on(table.userId),
  index("task_step_completions_task_user_unique_idx").on(table.taskId, table.userId, table.taskStepId),
]);

// 宠物类型表
export const petTypes = pgTable("pet_types", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	name: varchar("name", { length: 50 }).notNull(),
	description: text("description"),
	avatarUrl: varchar("avatar_url", { length: 500 }),
	baseMood: integer("base_mood").default(80),
	baseHunger: integer("base_hunger").default(50),
	baseEnergy: integer("base_energy").default(80),
	baseExperience: integer("base_experience").default(0),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

// 宠物表
export const pets = pgTable("pets", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	userId: varchar("user_id", { length: 100 }).notNull(),
	petTypeId: varchar("pet_type_id", { length: 36 }).notNull().references(() => petTypes.id, { onDelete: 'cascade' }),
	name: varchar("name", { length: 50 }).notNull(),
	mood: integer("mood").default(80),
	hunger: integer("hunger").default(50),
	energy: integer("energy").default(80),
	experience: integer("experience").default(0),
	level: integer("level").default(1),
	lastFedAt: timestamp("last_fed_at", { withTimezone: true, mode: 'string' }),
	lastPlayedAt: timestamp("last_played_at", { withTimezone: true, mode: 'string' }),
	lastTrainedAt: timestamp("last_trained_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
  index("pets_user_id_idx").on(table.userId),
  index("pets_user_id_unique_idx").on(table.userId),
]);

// 宠物互动记录表
export const petInteractions = pgTable("pet_interactions", {
	id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
	petId: varchar("pet_id", { length: 36 }).notNull().references(() => pets.id, { onDelete: 'cascade' }),
	interactionType: varchar("interaction_type", { length: 20 }).notNull(),
	result: text("result"),
	moodChange: integer("mood_change").default(0),
	hungerChange: integer("hunger_change").default(0),
	energyChange: integer("energy_change").default(0),
	experienceGain: integer("experience_gain").default(0),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  index("pet_interactions_pet_id_idx").on(table.petId),
  index("pet_interactions_type_idx").on(table.interactionType),
]);

