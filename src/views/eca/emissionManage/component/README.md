# 手动同步功能接口文档

## 接口列表

### 1. 获取左侧同步列表（核算列表）

**接口地址：** `GET /computation/emissionSource/getLeftSyncList`

**请求参数：**
```typescript
{
  pageNum: number;      // 页码
  pageSize: number;     // 每页数量
  emissionSourceId?: number;  // 排放源ID
}
```

**响应数据：**
```typescript
{
  code: string;
  data: {
    list: Array<{
      id: number;           // 主键ID
      sourceName: string;   // 排放源名称
      period: string;       // 周期
      orgName: string;      // 核算组织名称
    }>;
    total: number;          // 总数
  };
}
```

---

### 2. 获取右侧同步列表（模型列表）

**接口地址：** `GET /computation/emissionSource/getRightSyncList`

**请求参数：**
```typescript
{
  pageNum: number;      // 页码
  pageSize: number;     // 每页数量
  emissionSourceId?: number;  // 排放源ID
}
```

**响应数据：**
```typescript
{
  code: string;
  data: {
    list: Array<{
      id: number;           // 主键ID
      sourceName: string;   // 排放源名称
      period: string;       // 周期
      orgName: string;      // 核算组织名称
    }>;
    total: number;          // 总数
  };
}
```

---

### 3. 提交手动同步

**接口地址：** `POST /computation/emissionSource/manualSync`

**请求参数：**
```typescript
{
  emissionSourceId?: number;    // 排放源ID
  leftIdList?: number[];        // 左侧列表（核算列表）选中的ID数组
  rightIdList?: number[];       // 右侧列表（模型列表）选中的ID数组
}
```

**响应数据：**
```typescript
{
  code: string;
  message: string;
  data: any;
}
```

---

## 使用说明

1. 用户在排放源管理列表页面，点击操作列的"手动同步"按钮
2. 打开手动同步弹窗，弹窗内分左右两列：
   - 左侧：核算列表
   - 右侧：模型列表
3. 用户可以在两个列表中分别勾选需要同步的数据
4. 点击"确认"按钮，提交选中的数据ID
5. 同步成功后，弹窗关闭，表格刷新

## 权限控制

- 权限标识：`/emissionManagInfo/Edit`
- 只有具有该权限的用户才能看到"手动同步"按钮
