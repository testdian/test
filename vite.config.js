/**
 * @description vite config
 * 向下兼容插件 https://github.com/vitejs/vite/tree/main/packages/plugin-legacy
 */
import react from '@vitejs/plugin-react-swc';
import dayjs from 'dayjs';
import { compact } from 'lodash';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import zipPack from 'vite-plugin-zip-pack';
import tsConfigPaths from 'vite-tsconfig-paths';
import tsAlias from './tsconfig.path.json';
import { codeInspectorPlugin } from 'code-inspector-plugin';

const path = require('path');
const fs = require('fs');
const packageJson = fs.readFileSync('package.json');
const packageJsonObj = JSON.parse(packageJson);
const packageName = packageJsonObj?.name;

const isProduction = process.env.NODE_ENV === 'production' ? true : false;

const outDir = path.resolve(__dirname, './build');

const isPre = process.argv.some(
  (arg, i) => arg === '--mode' && process.argv[i + 1] === 'pre',
);

export default defineConfig(env => {
  const mode = env.mode || 'dev';
  return {
    mode,
    base: process.env.REACT_APP_PUBLIC_BASE || '/',
    build: {
      manifest: false, // 安全修复：禁用 manifest 文件生成，避免暴露项目结构
      outDir,
      target: ['es2019'],
      sourcemap: false, // 安全修复：生产环境禁用 sourcemap
      minify: !(isProduction || isPre) ? false : 'esbuild',
      reportCompressedSize: true,
      emptyOutDir: true,
    },
    assetsInclude: [path.resolve(__dirname, './public')],
    server: {
      /** https://cn.vitejs.dev/config/server-options.html#server-https */
      host: '0.0.0.0',
      port: 3005,
      watch: true,
      hrm: true,
      open: true,
    },
    resolve: {
      alias: [
        {
          find: /^~/,
          replacement: '',
        },
        ...Object.entries(tsAlias.compilerOptions.paths).map(([key, value]) => {
          const r = {
            find: new RegExp(`${key.slice(0, -1)}`),
            replacement: path.join(__dirname, value[0].slice(0, -1)),
          };
          return r;
        }),
      ],
    },
    css: {
      devSourcemap: true,
      modules: {
        /** 'global' | 'local' */
        scopeBehaviour: 'local',
        generateScopedName: '[name]_[local]_[contenthash:base64:6]',
      },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {
            hack: `true; @import "./src/styles/var.less";`,
          },
        },
      },
    },
    envPrefix: 'REACT_APP',
    plugins: compact([
      zipPack({
        inDir: 'build',
        outDir: `${packageName}_zip`,
        outFileName: `${packageName}_${mode}_fe_${dayjs().format(
          'YYYYMMDD_HHmm',
        )}.zip`,
      }),
      tsConfigPaths(),
      react(),
      env.command === 'serve' && checker({
        overlay: false,
        typescript: true,
        eslint: {
          lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
          dev: {
            logLevel: ['error'],
            overlay: false,
          },
        },
        terminal: true,
        enableBuild: true,
      }),
      codeInspectorPlugin({
        bundler: 'vite',
      }),
    ]),
    define: {
      'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`,
    },
    compilerOptions: {
      types: ['vitest/globals'], // Add this line
    },
    include: ['./src'],
    logLevel: isPre || isProduction ? 'silent' : 'info',
    appType: 'spa',
    clearScreen: false,
  };
});
