
# 基克纳-组织碳核算

### 项目运行
- pnpm i 
- npm run start

### 部署相关
- 默认['dev', 'development', 'test']环境使用env配置的接口地址。可在src/api/request.ts中useEnvUrl处修改。
- 其他环境的接口地址取public/config.json文件中的baseUrl，打包命令 npm run build，只变更接口地址，不更新其他代码，则让运维更改baseUrl即可，无需重新打包

### 开发工具
#### code-inspector-plugin
- 使用 DOM 源码定位功能的方式：
在页面上按住组合键时，鼠标在页面移动即会在 DOM 上出现遮罩层并显示相关信息，点击一下将自动打开 IDE 并将光标定位到元素对应的代码位置。
 (Mac 系统默认组合键是 Option + Shift；Window 的默认组合键是 Alt + Shift，在浏览器控制台会输出相关组合键提示)