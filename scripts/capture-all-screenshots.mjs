/**
 * 批量抓取原型需求说明截图
 * 用法：npm run start 后执行 node scripts/capture-all-screenshots.mjs
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outputDir = path.join(root, 'public/prototype-requirements');
const baseUrl = process.env.PROTOTYPE_SCREENSHOT_BASE_URL || 'http://localhost:3005';

const USER_KEY = 'React-ant-Admin-user';
const ROLE_KEY = 'carbon_user_role';
const DEMO_STORAGE_KEY = 'carbon_platform_demo_data';
const SIDEBAR_KEY = 'React-ant-Admin-SideBar-Opened';

/** 侧边栏菜单依赖 /system/permission/router；空数组会导致菜单不渲染 */
const PERMISSION_ROUTER_MOCK = [
  { perms: '/dataDashboard', permissionName: '数据看板', orderNum: 2 },
  { perms: '/carbonAccounting', permissionName: '企业碳核算', orderNum: 3 },
  { perms: '/ecaReport', permissionName: '报告', orderNum: 4 },
  { perms: '/sys', permissionName: '系统管理', orderNum: 800 },
  { perms: '/sys/user', permissionName: '用户管理', orderNum: 801 },
  { perms: '/sys/user/internal', permissionName: '内部用户', orderNum: 802 },
  { perms: '/sys/user/external', permissionName: '外部用户', orderNum: 803 },
];

const MOCK_USER = {
  accessToken: 'prototype-screenshot-token',
  username: '管理员',
  realName: '管理员',
  permissions: ['*'],
  userType: 0,
  lang: '1',
};

const MOCK_ORG_TREE = {
  code: 200,
  data: {
    tree: [
      {
        code: 'GVO',
        name: '国轩高科',
        children: [
          { code: 'BASE-HF', name: '合肥基地', children: [] },
          { code: 'BASE-NJ', name: '南京基地', children: [] },
          { code: 'BASE-QD', name: '青岛基地', children: [] },
        ],
      },
    ],
  },
  msg: '成功',
};

/** 文件名 -> [路径, 角色, 额外操作] */
const CAPTURE_ROUTES = {
  '登录页-Logo区域.png': { route: '/login', role: 'none' },
  '全局布局-侧边栏Logo.png': { route: '/home', role: 'admin' },
  '全局布局-需求说明抽屉.png': { route: '/home', role: 'admin' },
  '主页-主页菜单.png': { route: '/home', role: 'admin' },
  '数据看板-图表展示.png': {
    route: '/dataDashboard',
    role: 'admin',
    waitUntil: 'networkidle',
    settleMs: 3500,
  },
  '系统管理-外部用户-列表与搜索.png': {
    route: '/sys/user/external',
    role: 'admin',
  },
  '排放目标-页面整体.png': { route: '/emissionTarget', role: 'admin' },
  '减排措施-页面整体.png': { route: '/reductionMeasures', role: 'admin' },
  '供应链碳管理-模块说明.png': {
    route: '/sys/supplyChainCarbon/targetMgmt',
    role: 'admin',
  },
  '供应链碳管理-调研填报任务-列表-状态与操作.png': {
    route: '/sys/supplyChainCarbon/questionnaire',
    role: 'admin',
  },
  '供应链碳管理-减排目标管理-列表搜索.png': {
    route: '/sys/supplyChainCarbon/targetMgmt',
    role: 'admin',
  },
  '供应链碳管理-计划审核-页面说明.png': {
    route: '/sys/supplyChainCarbon/plans',
    role: 'admin',
  },
  '供应链碳管理-进度追踪看板-组织碳搜索.png': {
    route: '/sys/supplyChainCarbon/progress',
    role: 'admin',
  },
  '供应链碳管理-碳资质认证-模块说明.png': {
    route: '/sys/supplyChainCarbon/certificates',
    role: 'admin',
  },
  '供应商门户-角色切换.png': {
    route: '/home',
    role: 'admin',
    beforeShot: async page => {
      await page.locator('.layout--side-bar [class*="menuUser"]').click();
      await page.waitForSelector('text=切换身份', { timeout: 5000 });
      await page.waitForTimeout(300);
    },
  },
  '供应商门户-主页-培训资料列表.png': {
    route: '/sys/supplierPortal/workbench',
    role: 'supplierA',
  },
  '供应商门户-减排目标-目标确认.png': {
    route: '/sys/supplierPortal/targets',
    role: 'supplierA',
  },
  '供应商门户-减排计划-计划编制.png': {
    route: '/sys/supplierPortal/plans',
    role: 'supplierA',
  },
  '供应商门户-进度上报-进度填报.png': {
    route: '/sys/supplierPortal/workbench',
    role: 'supplierA',
  },
  '供应商门户-调研填报任务-问卷填报.png': {
    route: '/sys/supplierPortal/questionnaire',
    role: 'supplierA',
  },
  '供应商门户-资质证书-证书管理.png': {
    route: '/sys/supplierPortal/certificates',
    role: 'supplierA',
  },
  '供应商门户-培训中心-培训浏览.png': {
    route: '/sys/supplierPortal/workbench',
    role: 'supplierA',
  },
  '基础配置-线上培训管理-列表页.png': {
    route: '/sys/basicConfig/training',
    role: 'admin',
  },
  '基础配置-调研表单配置-列表页.png': {
    route: '/sys/basicConfig/formTemplates',
    role: 'admin',
  },
  '基础配置-线上培训管理-新增编辑页.png': {
    route: '/sys/basicConfig/training/add/0',
    role: 'admin',
  },
  '基础配置-调研表单配置-新增页.png': {
    route: '/sys/basicConfig/formTemplates/create',
    role: 'admin',
  },
  '基础配置-调研表单配置-配置字段页.png': {
    route: '/sys/basicConfig/formTemplates/1',
    role: 'admin',
  },
  '供应链碳管理-调研填报任务-新增页.png': {
    route: '/sys/supplyChainCarbon/questionnaire/create',
    role: 'admin',
  },
  '供应链碳管理-减排目标管理-新增编辑页.png': {
    route: '/sys/supplyChainCarbon/targetMgmt/add/0',
    role: 'admin',
  },
};

function jsonResponse(body) {
  return {
    status: 200,
    contentType: 'application/json; charset=utf-8',
    body: JSON.stringify(body),
  };
}

function resolveMockApi(url, method = 'GET') {
  if (url.includes('/system/permission/router')) {
    return { code: 200, data: PERMISSION_ROUTER_MOCK, msg: '成功' };
  }
  if (url.includes('/system/org/tree')) {
    return MOCK_ORG_TREE;
  }
  if (url.includes('/computation/enums/')) {
    return {
      code: 200,
      data: [{ name: '国标温室气体核算标准', code: 1, score: '1' }],
      msg: '成功',
    };
  }
  if (url.includes('/computation/')) {
    if (url.includes('carbonSummary') || url.includes('carbonStrength')) {
      return {
        code: 200,
        data: {
          currentYear: '125000',
          baseYear: '118000',
          compareValue: '7000',
          yoy: '5.9%',
        },
        msg: '成功',
      };
    }
    if (url.includes('trendAnalysis')) {
      return {
        code: 200,
        data: [
          {
            year: '2025',
            total: 125000,
            totalChangePercent: 4.2,
            baseLineValue: 118000,
            items: [
              { name: '范围一', value: 42000 },
              { name: '范围二', value: 52000 },
            ],
          },
        ],
        msg: '成功',
      };
    }
    if (url.includes('orgTop5EmissionType')) {
      return {
        code: 200,
        data: [
          {
            orgCode: 'BASE-HF',
            orgName: '合肥基地',
            items: [{ name: '外购电力', value: 32000 }],
          },
        ],
        msg: '成功',
      };
    }
    if (url.includes('top5EmissionType')) {
      return {
        code: 200,
        data: [{ name: '外购电力', value: 32000 }],
        msg: '成功',
      };
    }
    if (url.includes('categoryRatio')) {
      return {
        code: 200,
        data: {
          total: 100000,
          items: [
            { name: '范围一', value: 40000, ratio: '40%' },
            { name: '范围二', value: 60000, ratio: '60%' },
          ],
        },
        msg: '成功',
      };
    }
    if (url.includes('orgEmissionCategory')) {
      return {
        code: 200,
        data: [
          {
            orgName: '合肥基地',
            total: 45000,
            items: [{ name: '范围一', value: 15000, ratio: '33%' }],
          },
        ],
        msg: '成功',
      };
    }
    if (url.includes('listIndex')) {
      return {
        code: 200,
        data: [{ id: 1, indexName: '产量', indexCode: 'output', unitDesc: '吨' }],
        msg: '成功',
      };
    }
    return { code: 200, data: method === 'GET' ? [] : {}, msg: '成功' };
  }
  if (url.includes('/auth/token/lang') || url.includes('/auth/token/switch')) {
    return { code: 200, data: 1, msg: '成功' };
  }
  if (url.includes('/auth/token/logout')) {
    return { code: 200, data: null, msg: '成功' };
  }
  if (url.includes('/system/user/page') || url.includes('/system/user/list')) {
    return { code: 200, data: { list: [], total: 0 }, msg: '成功' };
  }
  return { code: 200, data: method === 'GET' ? [] : {}, msg: '成功' };
}

async function setupApiMock(context) {
  await context.route('**/*', async route => {
    const request = route.request();
    const url = request.url();
    const type = request.resourceType();

    const isApi =
      /carbonstop\.com|gateway-api/.test(url) ||
      ((type === 'xhr' || type === 'fetch') &&
        /\/system\/|\/auth\/|\/computation\//.test(url));

    if (isApi && !url.startsWith(baseUrl + '/@') && !url.includes('/src/')) {
      await route.fulfill(
        jsonResponse(resolveMockApi(url, request.method())),
      );
      return;
    }

    await route.continue();
  });
}

async function seedStorage(page, role) {
  await page.evaluate(
    ([userKey, roleKey, demoKey, sidebarKey, user, roleValue]) => {
      localStorage.setItem(userKey, JSON.stringify(user));
      localStorage.setItem(roleKey, roleValue);
      localStorage.setItem(sidebarKey, 'true');
      if (!localStorage.getItem(demoKey)) {
        // 保留默认 demo 数据，不覆盖已有数据
      }
    },
    [
      USER_KEY,
      ROLE_KEY,
      DEMO_STORAGE_KEY,
      SIDEBAR_KEY,
      MOCK_USER,
      role === 'admin' ? 'admin' : role,
    ],
  );
}

async function dismissOverlays(page) {
  await page.evaluate(() => {
    document
      .querySelectorAll('.ant-modal-root, .ant-modal-wrap, .ant-modal-mask')
      .forEach(el => el.remove());
    document.body.classList.remove('ant-scrolling-effect');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });
}

async function waitForPageReady(page, role, config = {}) {
  if (role === 'none') {
    await page.waitForSelector('input[aria-label="username"]', {
      timeout: 15000,
    });
    return;
  }
  if (config.waitFor) {
    await page.waitForSelector(config.waitFor, { timeout: 30000 });
  } else {
    await page
      .waitForSelector('.layout--side-bar, .layout__side-bar', { timeout: 15000 })
      .catch(() => {});
    await page
      .waitForFunction(
        () => {
          const menu = document.querySelector('.layout__side-bar .ant-menu');
          return menu && menu.textContent && menu.textContent.trim().length > 15;
        },
        { timeout: 20000 },
      )
      .catch(() => {});
  }
  await page.waitForTimeout(config.settleMs ?? 1200);
  await dismissOverlays(page);
}

async function prepareAuth(page, role) {
  if (role === 'none') {
    return;
  }
  await page.goto(`${baseUrl}/login`, { waitUntil: 'load', timeout: 30000 });
  await seedStorage(page, role);
}

async function main() {
  const files = process.argv.slice(2);
  const targets =
    files.length > 0
      ? Object.fromEntries(
          files.filter(f => CAPTURE_ROUTES[f]).map(f => [f, CAPTURE_ROUTES[f]]),
        )
      : CAPTURE_ROUTES;

  await mkdir(outputDir, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
    extraHTTPHeaders: {
      'Accept-Language': 'zh-CN,zh;q=0.9',
    },
  });

  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'language', {
      get: () => 'zh-CN',
    });
    Object.defineProperty(navigator, 'languages', {
      get: () => ['zh-CN', 'zh'],
    });
  });

  await setupApiMock(context);
  const page = await context.newPage();

  for (const [file, config] of Object.entries(targets)) {
    const { route, role, beforeShot } = config;
    const target = path.join(outputDir, file);
    try {
      if (role === 'none') {
        await page.goto(`${baseUrl}/login`, {
          waitUntil: 'load',
          timeout: 30000,
        });
        await waitForPageReady(page, role, config);
      } else {
        await prepareAuth(page, role);
        await page.goto(`${baseUrl}${route}`, {
          waitUntil: config.waitUntil ?? 'load',
          timeout: 60000,
        });
        await waitForPageReady(page, role, config);
      }
      if (beforeShot) {
        await beforeShot(page);
      }
      await dismissOverlays(page);
      await page.waitForTimeout(500);
      const textLen = await page.evaluate(
        () => document.body?.innerText?.length ?? 0,
      );
      if (role !== 'none' && textLen < 50) {
        throw new Error(`页面内容过少（${textLen} 字符），可能未加载完成`);
      }
      if (role === 'none') {
        const loginCard = page.locator('[class*="mainContainer"]').first();
        if (await loginCard.count()) {
          await loginCard.screenshot({ path: target });
        } else {
          await page.screenshot({ path: target, fullPage: false });
        }
      } else {
        await page.screenshot({
          path: target,
          fullPage: false,
        });
      }
      console.log(`✓ ${file}`);
    } catch (error) {
      console.warn(
        `✗ ${file}:`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  await browser.close();
  console.log(`\n截图目录: ${outputDir}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
