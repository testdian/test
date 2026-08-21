/**
 * 抓取可公开访问页面的原型截图（当前仅登录页）
 * 用法：先 npm run start，再 node scripts/capture-prototype-screenshots.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outputDir = path.join(root, 'public/prototype-requirements');
const baseUrl = process.env.PROTOTYPE_SCREENSHOT_BASE_URL || 'http://localhost:3005';

const captures = [
  {
    file: '登录页-Logo区域.png',
    url: `${baseUrl}/login`,
    waitMs: 1500,
  },
];

async function main() {
  await mkdir(outputDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  for (const item of captures) {
    const target = path.join(outputDir, item.file);
    try {
      await page.goto(item.url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(item.waitMs);
      await page.screenshot({ path: target, fullPage: true });
      console.log(`✓ ${item.file}`);
    } catch (error) {
      console.warn(`✗ ${item.file}:`, error instanceof Error ? error.message : error);
    }
  }

  await browser.close();
  console.log(`\n截图目录: ${outputDir}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
