# 原型需求说明截图

PNG 文件放在此目录，供「需求说明」抽屉展示。

## 命名约定

`{菜单}-{功能}.png`

与 `src/config/prototypeRequirementScreenshots.ts` 中 `requirementScreenshotSlug()` 生成规则一致。

示例：

- `登录页-Logo区域.png`
- `供应链碳管理-进度追踪看板-组织碳搜索.png`

## 补充方式

1. 在对应页面定位黄色标注位置，截取包含该区域的界面
2. 按上述命名保存到此目录
3. 或在 `prototypeRequirements.ts` 条目上设置 `screenshot: '/prototype-requirements/自定义.png'`
4. 同一菜单多条需求可先在 `MENU_DEFAULT_SCREENSHOTS` 配置整页默认图

## 批量生成（可选）

登录页可执行：

```bash
npm run start
node scripts/capture-prototype-screenshots.mjs
```

其余需登录页面请手动截图后按命名放入本目录。
