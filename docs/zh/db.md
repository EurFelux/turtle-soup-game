# 数据库模块

此模块封装了所有数据库操作，基于 Dexie (IndexedDB) 实现。

## 架构设计

```
src/db/
├── database.ts     # 数据库实例定义（私有，仅供内部使用）
├── operations.ts   # 数据库操作函数实现
├── index.ts        # 公共 API 入口（重新导出所有操作函数）
├── README.md       # 文档（中文）
└── README.en.md    # 文档（英文）
```

### 文件职责

- **database.ts**: 定义 Dexie 数据库实例和表结构，**禁止外部导入**
- **operations.ts**: 实现所有 CRUD 操作函数
- **index.ts**: 作为模块的公共入口，重新导出 operations 中的所有函数

## 数据库结构

数据库采用关系型设计，具有正确的外键关系：

### 数据表

**soups** - 汤谜题记录
- `id` (主键)
- `title` - 谜题标题
- `surface` - 汤面（故事/场景）
- `truth` - 汤底（答案/真相）
- `createAt` - 创建时间戳
- `updateAt` - 最后更新时间戳

**tries** - 用户尝试记录
- `id` (主键)
- `soupId` (外键 → soups.id，已索引)
- `status` - "valid" 或 "invalid"
- `question` - 用户的问题
- `response` - AI 的回答（"yes", "no", "unrelated"），仅适用于有效尝试
- `reason` - 无效原因，仅适用于无效尝试
- `createAt` - 创建时间戳（已索引）
- `updateAt` - 最后更新时间戳（已索引）

### 关系设计

- **一对多关系**：一个汤谜题可以有多个尝试记录
- 通过 `tries.soupId` 外键建立关系
- 不在 soups 表中冗余存储 `tryIds` 数组
- 通过索引的 `soupId` 字段实现高效查询

## 使用规范

### ✅ 正确用法

```typescript
// 从 @/db 导入需要的函数
import { createSoup, getSoupById, updateSoup } from "@/db";

// 使用函数操作数据库
const soup = await getSoupById("123");
await updateSoup("123", { title: "新标题" });
```

### ❌ 错误用法

```typescript
// ❌ 禁止直接导入 database.ts
import db from "@/db/database";

// ❌ 禁止直接操作数据库表
await db.soups.add({ ... });
```

> **注意**: ESLint 已配置规则，直接导入 `@/db/database` 会报错。

## 设计原则

1. **封装性**: `db` 实例仅在 `operations.ts` 中使用，外部模块无法直接访问
2. **单一入口**: 所有数据库操作都通过 `operations.ts` 暴露的函数进行
3. **类型安全**: 所有函数都有完整的 TypeScript 类型定义
4. **运行时验证**: 所有创建和更新操作都使用 Zod 运行时验证，防止无效数据
5. **事务完整性**: 关键操作使用 Dexie 事务确保原子性和数据一致性
6. **易于维护**: 数据库逻辑集中管理，便于修改和测试

## 事务安全性

以下操作被包装在原子事务中，以防止竞态条件并确保数据一致性：

- **`addTryToSoup()`**: 原子性地验证汤谜题存在并创建尝试记录
- **`removeTryFromSoup()`**: 原子性地验证所有权并删除尝试记录
- **`deleteSoupWithTries()`**: 原子性地删除汤谜题及所有关联的尝试记录

这些事务保证要么所有操作都成功，要么全部失败，防止部分更新和数据不一致。

## 可用操作

### Soup 操作
- `createSoup(soup)` - 创建汤谜题
- `createSoups(soups)` - 批量创建
- `getDbSoupById(id)` - 查询单个汤谜题（数据库层）
- `getSoupById(id)` - 查询汤谜题及尝试记录（应用层）
- `getAllDbSoups()` - 查询所有汤谜题（数据库层）
- `getAllSoups()` - 查询所有汤谜题及尝试记录（应用层）
- `updateSoup(id, changes)` - 更新汤谜题
- `deleteSoup(id)` - 仅删除汤谜题
- `deleteSoupWithTries(id)` - 删除汤谜题及所有尝试记录（级联删除）
- `deleteAllSoups()` - 清空所有汤谜题

### Try 操作
- `getTryById(id)` - 查询单个尝试记录
- `getAllTries()` - 查询所有尝试记录
- `getTriesByDateRange(start, end)` - 按日期范围查询
- `getTriesBySoupId(soupId)` - 查询某个汤谜题的所有尝试
- `updateTry(id, changes)` - 更新尝试记录
- `deleteTry(id)` - 删除尝试记录
- `deleteTries(ids)` - 批量删除
- `deleteAllTries()` - 清空所有尝试记录

**注意**: 创建尝试记录请使用"关联操作"部分的 `addTryToSoup()`，该函数会确保正确验证汤谜题关联关系。

### 关联操作
- `getSoupById(soupId)` - 获取汤谜题及其所有尝试记录
- `getAllSoups()` - 获取所有汤谜题及尝试记录
- `addTryToSoup(soupId, tryRecord)` - 为汤谜题添加尝试（验证汤谜题存在）
- `removeTryFromSoup(soupId, tryId)` - 移除尝试记录（验证所有权）
- `deleteSoupWithTries(id)` - 级联删除汤谜题及所有尝试

## 扩展指南

需要添加新的数据库操作时：

1. 在 `operations.ts` 中添加新函数
2. 添加完整的 JSDoc 注释
3. 确保函数有正确的类型定义
4. 导出函数供外部使用

```typescript
/**
 * 根据标题搜索汤谜题
 */
export async function searchSoupsByTitle(keyword: string): Promise<DbSoup[]> {
	return await db.soups
		.filter((soup) => soup.title.includes(keyword))
		.toArray();
}
```

## 运行时验证

所有创建和更新操作都包含 Zod 运行时验证：

```typescript
// 创建汤谜题 - 自动验证
await createSoup({
	id: "123",
	title: "测试汤",
	surface: "一个人死了",
	truth: "他被谋杀了",
	tryIds: []
});
// ✅ 如果数据无效，会抛出 ZodError 并提供详细错误信息

// 更新汤谜题 - 自动验证（部分）
await updateSoup("123", {
	title: "更新的标题"
});
// ✅ 只验证提供的字段
```

**优势：**
- 防止无效数据进入数据库
- 捕获 TypeScript 可能遗漏的运行时类型错误（如来自外部 API 的数据）
- 提供详细的错误信息用于调试
- 即使绕过 TypeScript 类型检查（如使用 `any` 或 `@ts-ignore`）也能保证数据有效性
