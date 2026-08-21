import type { PrototypeRequirementItem } from './prototypeRequirements';

/** 将菜单/功能名转为截图文件名（不含扩展名） */
export function requirementScreenshotSlug(
  menu: string,
  feature: string,
): string {
  return `${menu}-${feature}`
    .replace(/[/\\>|：:?*"<>]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** 按约定生成的截图 public 路径 */
export function requirementScreenshotPath(
  menu: string,
  feature: string,
): string {
  return `/prototype-requirements/${requirementScreenshotSlug(menu, feature)}.png`;
}

/**
 * 功能点级截图覆盖（优先于约定路径）
 * key: `${menu}::${feature}`
 */
export const REQUIREMENT_SCREENSHOT_OVERRIDES: Record<string, string> = {
  // 登录页各功能点暂共用登录页截图，后续可替换为裁切图
  '登录页::Logo区域': '/prototype-requirements/登录页-Logo区域.png',
  '登录页::左侧图案': '/prototype-requirements/登录页-Logo区域.png',
  '登录页::平台标题': '/prototype-requirements/登录页-Logo区域.png',
  '登录页::账号登录': '/prototype-requirements/登录页-Logo区域.png',
  '登录页::验证码': '/prototype-requirements/登录页-Logo区域.png',
};

/** 菜单级默认截图（同一菜单下多条需求共用整页截图） */
export const MENU_DEFAULT_SCREENSHOTS: Partial<Record<string, string>> = {
  登录页: '/prototype-requirements/登录页-Logo区域.png',
  全局布局: '/prototype-requirements/全局布局-侧边栏Logo.png',
  主页: '/prototype-requirements/主页-主页菜单.png',
  数据看板: '/prototype-requirements/数据看板-图表展示.png',
  '系统管理-外部用户': '/prototype-requirements/系统管理-外部用户-列表与搜索.png',
  排放目标: '/prototype-requirements/排放目标-页面整体.png',
  减排措施: '/prototype-requirements/减排措施-页面整体.png',
  '供应链碳管理-调研填报任务':
    '/prototype-requirements/供应链碳管理-调研填报任务-列表-状态与操作.png',
  供应链碳管理: '/prototype-requirements/供应链碳管理-模块说明.png',
  '供应链碳管理-减排目标管理':
    '/prototype-requirements/供应链碳管理-减排目标管理-列表搜索.png',
  '供应链碳管理-计划审核':
    '/prototype-requirements/供应链碳管理-计划审核-页面说明.png',
  '供应链碳管理-进度追踪看板':
    '/prototype-requirements/供应链碳管理-进度追踪看板-组织碳搜索.png',
  '供应链碳管理-碳资质认证':
    '/prototype-requirements/供应链碳管理-碳资质认证-模块说明.png',
  供应商门户: '/prototype-requirements/供应商门户-角色切换.png',
  '供应商门户-主页': '/prototype-requirements/供应商门户-主页-培训资料列表.png',
  '供应商门户-减排目标':
    '/prototype-requirements/供应商门户-减排目标-目标确认.png',
  '供应商门户-减排计划':
    '/prototype-requirements/供应商门户-减排计划-计划编制.png',
  '供应商门户-进度上报':
    '/prototype-requirements/供应商门户-进度上报-进度填报.png',
  '供应商门户-调研填报任务':
    '/prototype-requirements/供应商门户-调研填报任务-问卷填报.png',
  '供应商门户-资质证书':
    '/prototype-requirements/供应商门户-资质证书-证书管理.png',
  '供应商门户-培训中心':
    '/prototype-requirements/供应商门户-培训中心-培训浏览.png',
  '基础配置-线上培训管理':
    '/prototype-requirements/基础配置-线上培训管理-列表页.png',
  '基础配置-调研表单配置':
    '/prototype-requirements/基础配置-调研表单配置-列表页.png',
};

/** 需规文档：同一菜单涉及多个页面时，按页面分别配图 */
export const MENU_DOC_SCREENSHOTS: Partial<
  Record<string, { caption: string; path: string }[]>
> = {
  '基础配置-线上培训管理': [
    {
      caption: '列表页',
      path: '/prototype-requirements/基础配置-线上培训管理-列表页.png',
    },
    {
      caption: '新增/编辑页',
      path: '/prototype-requirements/基础配置-线上培训管理-新增编辑页.png',
    },
  ],
  '基础配置-调研表单配置': [
    {
      caption: '列表页',
      path: '/prototype-requirements/基础配置-调研表单配置-列表页.png',
    },
    {
      caption: '新增模板页',
      path: '/prototype-requirements/基础配置-调研表单配置-新增页.png',
    },
    {
      caption: '配置字段页',
      path: '/prototype-requirements/基础配置-调研表单配置-配置字段页.png',
    },
  ],
  '供应链碳管理-调研填报任务': [
    {
      caption: '列表页',
      path: '/prototype-requirements/供应链碳管理-调研填报任务-列表-状态与操作.png',
    },
    {
      caption: '新增任务页',
      path: '/prototype-requirements/供应链碳管理-调研填报任务-新增页.png',
    },
  ],
  '供应链碳管理-减排目标管理': [
    {
      caption: '列表页',
      path: '/prototype-requirements/供应链碳管理-减排目标管理-列表搜索.png',
    },
    {
      caption: '新增/编辑表单页',
      path: '/prototype-requirements/供应链碳管理-减排目标管理-新增编辑页.png',
    },
  ],
};

export function resolveRequirementScreenshot(
  item: PrototypeRequirementItem,
): string | undefined {
  if (item.screenshot) {
    return item.screenshot;
  }
  const override =
    REQUIREMENT_SCREENSHOT_OVERRIDES[`${item.menu}::${item.feature}`];
  if (override) {
    return override;
  }
  return (
    MENU_DEFAULT_SCREENSHOTS[item.menu] ??
    requirementScreenshotPath(item.menu, item.feature)
  );
}
