# 互相帮助 Web MVP 设计

## 目标
构建一个响应式 Web MVP，用于发布求助与提供帮助。求助者可在与帮助者线下沟通后选择一人完成匹配；系统通知负责状态变化提示。未来 Flutter / 微信小程序可复用同一套 API。

## 非目标（MVP）
- 不做城市/小区管理后台（仅种子数据）。
- 不做用户私信聊天（仅系统通知）。
- 不做支付或担保。

## 用户与角色
- **普通用户**：注册/登录、完善资料、发布求助、提供帮助、选择帮助者、完成求助。

## 功能需求
### 认证与资料
- 用户名 + 密码注册/登录。
- 登录后提示完善资料（姓名/电话/微信），可跳过。
- 资料可后续更新。

### 发现与筛选
- 帮助广场按 **城市 + 小区**筛选。
- 城市/小区为预置数据。

### 发布求助
- 字段：时间、标题、分类、详情、联系电话、联系微信、城市、小区。
- 分类初始值：陪诊、喂猫、遛狗（可扩展）。
- 发布者不能帮助自己。

### 提供帮助
- 登录用户可对 OPEN 求助发起帮助。
- 帮助需要填写联系方式；默认带出个人资料，可修改。
- 若个人资料为空，必须填写联系方式后才能提交。
- 同一求助允许多人提供帮助。

### 选择帮助者与完成
- 发布者选择一个帮助者后，求助进入 **MATCHED（待完成）**。
- 被选中 offer 变为 **SELECTED**；其他 offer 变为 **REJECTED** 并收到通知。
- 双方均可取消匹配；取消后求助回到 **OPEN**。
- 发布者可标记 **COMPLETED**。

### 通知（系统通知）
- 提交帮助、被选中、被拒绝、取消匹配、求助完成、求助取消。

## 状态模型
- **HelpRequest.status**：OPEN → MATCHED → COMPLETED（或 CANCELED）
- **HelpOffer.status**：PENDING → SELECTED / REJECTED / CANCELED

## 数据模型（建议）
- **User**：id, username, password_hash, created_at
- **Profile**：user_id, name, phone, wechat（可空）
- **City**：id, name
- **Community**：id, city_id, name
- **HelpRequest**：id, user_id, city_id, community_id, time, title, category, detail, contact_phone, contact_wechat, status, created_at
- **HelpOffer**：id, request_id, helper_user_id, name, phone, wechat, status, created_at
- **Notification**：id, user_id, type, payload(json), read_at, created_at

## API 范围（MVP）
- 认证：`POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`
- 资料：`GET /api/profile`, `PUT /api/profile`
- 基础数据：`GET /api/cities`, `GET /api/cities/:id/communities`
- 求助：`POST /api/requests`, `GET /api/requests`, `GET /api/requests/:id`, `POST /api/requests/:id/cancel`, `POST /api/requests/:id/complete`
- 帮助：`POST /api/requests/:id/offers`, `POST /api/offers/:id/select`, `POST /api/offers/:id/cancel`, `POST /api/offers/:id/cancel-by-owner`
- 通知：`GET /api/notifications`, `POST /api/notifications/:id/read`

## 前端页面
- 认证页：注册/登录
- 资料补全弹窗（首次登录提示，可跳过）
- 帮助广场：城市/小区筛选 + 卡片列表 + 状态标签
- 发布求助页：表单
- 求助详情页：详情 + “帮助”弹窗（填写联系方式）
- 我的求助：OPEN/MATCHED/COMPLETED
- 我的帮助：PENDING/SELECTED/REJECTED/CANCELED
- 通知中心：系统通知列表

**设计要求：** 实现阶段使用 `frontend-design` skill，做高质量、有辨识度的响应式界面（排版、配色、渐变/纹理、动效）。

## 技术栈（已选）
- **前端/后端**：Next.js（App Router）+ API Routes
- **数据库**：PostgreSQL
- **ORM**：Prisma
- **认证**：Cookie 会话 + 密码哈希（bcrypt）
- **样式**：Tailwind CSS（或等价工具）

## 种子数据
- 预置热门城市，并为每个城市预置少量小区。

## 未来扩展
- Flutter / 微信小程序复用 REST API。
- 增加城市/小区/分类管理后台。
