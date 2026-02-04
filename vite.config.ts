import fs from 'fs';
import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import { visualizer } from 'rollup-plugin-visualizer';
import { compression } from 'vite-plugin-compression2';
import Autoprefixer from 'autoprefixer';
import PostCssPxToViewport from 'postcss-px-to-viewport';
import Tailwindcss from 'tailwindcss';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env: Record<string, string> = loadEnv(mode, process.cwd(), '');
  const isProd: boolean = env.VITE_APP_ENV === 'production';
  const isDev: boolean = env.VITE_APP_ENV === 'development';
  const isSit: boolean = env.VITE_APP_ENV === 'sit';

  if (!isDev && fs.existsSync('./dist')) {
    fs.rmSync('./dist', { recursive: true, force: true });
  }

  let publicPath: string = '';
  let outputDir: string = 'dist';

  if (isSit) {
    publicPath = env.VITE_APP_RESOURCE_URL as string;
  }

  if (isProd) {
    publicPath = env.VITE_APP_RESOURCE_URL;
  }

  const isAnalyze = mode === 'analyze';

  return {
    base: publicPath,

    plugins: [
      react(),
      svgr(),
      // Bundle 分析 - 仅在 analyze 模式启用
      isAnalyze &&
        visualizer({
          open: true,
          gzipSize: true,
          brotliSize: true,
          filename: 'dist/stats.html',
        }),
      // Gzip/Brotli 预压缩 - 生产环境启用
      isProd &&
        compression({
          algorithm: 'gzip',
          exclude: [/\.(br)$/, /\.(gz)$/],
        }),
      isProd &&
        compression({
          algorithm: 'brotliCompress',
          exclude: [/\.(br)$/, /\.(gz)$/],
        }),
    ].filter(Boolean),

    build: {
      outDir: outputDir,
      assetsDir: 'assets', // 指定生成静态文件目录 默认assets
      assetsInlineLimit: 1024 * 10, // 小于此阈值的导入或引用资源将内联为 base64 编码 默认4096
      cssCodeSplit: true, // 启用 CSS 代码拆分 默认true
      minify: 'esbuild', // 混淆器，terser构建后文件体积更小  // 默认esbuild 它比 terser 快 20-40 倍，压缩率只差 1%-2%
      // terserOptions: {
      //   compress: {
      //     // 生产环境时移除console.log调试代码 生产环境时移除
      //     drop_console: isHideLog,
      //     drop_debugger: isHideLog
      //   }
      // },
      rollupOptions: {
        output: {
          // 对打包的静态资源做处理
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          manualChunks(id) {
            // 超大静态资源拆分
            if (id.includes('node_modules')) {
              const list = id.toString().split('node_modules/');
              return list[list.length - 1].split('/')[0].toString();
            }
          },
        },
      },
    },

    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },

    server: {
      port: 7788,
      host: '0.0.0.0',
      open: false,
      strictPort: false,
      headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      proxy: {
        '/api': {
          target: env.VITE_APP_SERVE_URL,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },

    css: {
      postcss: {
        // vite内配置postcss后 postcss.config.js失效
        plugins: [
          Autoprefixer({
            overrideBrowserslist: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ff > 31', 'ie >= 8'],
          }),

          PostCssPxToViewport({
            unitToConvert: 'px', // 要转换的单位
            viewportWidth: 375, // 设计稿宽度（现在主流是 375px 基准）
            unitPrecision: 5, // 精度
            propList: ['*'], // 转换所有属性
            viewportUnit: 'vw', // 转换为 vw
            fontViewportUnit: 'vw', // 字体转换为 vw
            selectorBlackList: ['.ignore', '.hairlines', 'adm-'], // 忽略的类名
            minPixelValue: 1, // 最小转换值
            mediaQuery: false, // 不转换媒体查询
            replace: true, // 直接替换原值
            exclude: /node_modules/i, // 不转换 node_modules
            landscape: false, // 不处理横屏
          }),

          Tailwindcss(),
        ],
      },
    },
  };
});
