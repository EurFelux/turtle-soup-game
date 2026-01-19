# 数据库模块

此模块封装了所有数据库操作，基于 Dexie (IndexedDB) 实现。

## 架构设计

```
src/db/
├── database.ts     # 数据库实例定义（私有，仅供内部使用）
├── operations.ts   # 数据库操作函数实现
├── index.ts        # 公共 API 入口（重新导出所有操作函数）
└── README.md       # 文档
```

### 文件职责

- **database.ts**: 定义 Dexie 数据库实例和表结构，**禁止外部导入**
- **operations.ts**: 实现所有 CRUD 操作函数
- **index.ts**: 作为模块的公共入口，重新导出 operations 中的所有函数

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
5. **易于维护**: 数据库逻辑集中管理，便于修改和测试

## 可用操作

### Soup 操作
- `createSoup(soup)` - 创建汤谜题
- `createSoups(soups)` - 批量创建
- `getSoupById(id)` - 查询单个
- `getAllSoups()` - 查询所有
- `updateSoup(id, changes)` - 更新
- `deleteSoup(id)` - 删除
- `deleteAllSoups()` - 清空

### Try 操作
- `createTry(tryRecord)` - 创建尝试记录
- `createTries(tries)` - 批量创建
- `getTryById(id)` - 查询单个
- `getAllTries()` - 查询所有
- `getTriesByDateRange(start, end)` - 按日期范围查询
- `updateTry(id, changes)` - 更新
- `deleteTry(id)` - 删除
- `deleteTries(ids)` - 批量删除
- `deleteAllTries()` - 清空

### 关联操作
- `getSoupWithTries(soupId)` - 获取汤谜题及其所有尝试
- `addTryToSoup(soupId, tryRecord)` - 添加尝试到汤谜题
- `removeTryFromSoup(soupId, tryId)` - 移除尝试记录

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
