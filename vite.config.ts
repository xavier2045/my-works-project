import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // 导入 path 模块
import { fileURLToPath, URL } from 'node:url'
// import { terser } from 'rollup-plugin-terser';
import { visualizer } from 'rollup-plugin-visualizer' // 打包分析
import Inspect from 'vite-plugin-inspect'; // 状态可视化
import ViteRestart from 'vite-plugin-restart' // 监听文件变化重启服务
import postCssPxToRem from 'postcss-pxtorem';  // px转rem
// 减少打包文件体积
import viteCompression from 'vite-plugin-compression'
import WindiCSS from 'vite-plugin-windicss'

import Components from 'unplugin-vue-components/vite' // 自动按需引入组件
// ui库解析器，也可以自定义，需要安装相关UI库，unplugin-vue-components/resolvers
import { VantResolver } from 'unplugin-vue-components/resolvers'
import minipic from 'vite-plugin-minipic' // 压缩图片

import cssnano from 'cssnano'; // css压缩

import legacy from '@vitejs/plugin-legacy'; // 兼容IE

// import ElementPlus from 'unplugin-element-plus/vite';

// 获取环境变量中的端口配置，优先级：VITE_PORT > npm_config_port > 8080
const port = process.env.port || process.env.npm_config_port || 8888 // dev port

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  server: {
    host: '0.0.0.0', // 设置为允许外部访问
    port: Number(port),  // 设置开发服务器端口号
    open: false, // 启动时自动在浏览器中打开
    proxy: {
      // 配置代理
      '/api': {
        target: 'http://192.168.77.20:8888',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
        rewrite: (path) => {
          const newPath = path.replace(/^\/api/, '');
          console.log(`Rewriting path from "${path}" to "${newPath}"`);
          return newPath;
        },
        configure: (proxy, options) => {
          // 配置自定义中间件
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Proxy Request Path:', req.url);
          });

          proxy.on('proxyRes', (proxyRes, req, res) => {
            let body = [];
            proxyRes.on('data', (chunk) => {
              body.push(chunk);
            });
            proxyRes.on('end', () => {
              body = Buffer.concat(body).toString();
              console.log('Proxy Response Body:', body);
            });
          });

          proxy.on('error', (err, req, res) => {
            console.error('Proxy Error:', err);
          });
        },
      },
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    hmr: {
      overlay: true, // 显示错误覆盖层
      clientPort: 'auto' // 自动选择可用端口
    },
    watch: {
      usePolling: true, // 在某些系统上更可靠
      interval: 100 // 降低轮询间隔以提高响应速度
    }
  },
  plugins: [
    vue({
      template: {
        compilerOptions: { 
          isCustomElement: (tag) => tag.startsWith('wc-'),
          // 兼容旧版语法
          whitespace: 'preserve'
        }
      },
    }),
    // ElementPlus(),
    minipic({
      exclude: ['node_modules', 'public'], // 排除 node_modules 和 public 文件夹中的图片
    }),
    viteCompression({
      verbose: true, // 是否在控制台中输出压缩结果
      disable: false,
      threshold: 10240, // 如果体积大于阈值，将被压缩，单位为b，体积过小时请不要压缩，以免适得其反
      algorithm: 'gzip', // 压缩算法，可选['gzip'，' brotliccompress '，'deflate '，'deflateRaw']
      ext: '.gz', // 压缩后的文件扩展名
      deleteOriginFile: false // 源文件压缩后是否删除
    }),
    WindiCSS(),
    visualizer({
      filename: 'dist/report.html', // 打包分析报告的输出路径
      open: false, // 打包后自动打开报告
    }),
    Inspect(),
    ViteRestart({
      restart: [
        'my.config.[jt]s',
      ]
    }),
    Components({
      dirs: ['src/components'], // 目标文件夹
      extensions: ['vue','jsx'], // 文件类型
      dts: 'src/components.d.ts', // 输出文件，里面都是一些import的组件键值对
      // ui库解析器，也可以自定义，需要安装相关UI库
      resolvers: [
        VantResolver(),
        // ElementPlusResolver(),
        // AntDesignVueResolver(),
        // HeadlessUiResolver(),
        // ElementUiResolver()
      ],
    }),
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@assets': path.resolve(__dirname, 'src/assets'),
      // 确保 Vanta 和 Three 正确解析
      'three': 'three',
      'vanta/dist/vanta.fog.min': path.resolve(__dirname, 'node_modules/vanta/dist/vanta.fog.min.js'), // 明确指向文件
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'static',
    target: 'es2015',
    terserOptions: {
      compress: {
        // 打包的时候可以移除console和debugger
        drop_console: true,
        drop_debugger: true,
      },
      mangle: true,
    },
    rollupOptions: {
      treeshake: true,
      input: {
        main: 'index.html',
      },
      output: {
        /**
         * 自定义拆分代码块的函数。
         * 该函数用于确定如何将特定的模块ID拆分到不同的代码块中。
         * 特别是，它针对node_modules目录中的模块做了特殊处理，
         * 以优化大型应用程序的初始加载时间。
         * 
         * @param id 模块的ID，这是一个字符串，表示模块在项目中的路径。
         * @returns {string} 返回一个字符串，表示根据特定规则拆分后的代码块名称。
         * 如果模块ID包含'node_modules'，则返回从'node_modules'开始到第一个斜杠为止的字符串，
         * 作为代码块的名称。否则，返回空字符串，表示不进行拆分。
         */
        manualChunks(id) {
          // 检查模块ID是否包含'node_modules'，以优化对第三方库的拆分
          if (id.includes('node_modules')) {
            // 使用字符串分割方法将模块ID拆分为多个部分
            // 并返回从'node_modules'开始到第一个斜杠为止的字符串
            // 作为代码块的名称
            // return id.toString().split('node_modules/')[1].split('/')[0].toString();

            const parts = id.split('node_modules/')[1].split('/');
            if (parts[0] === 'some-large-library') {
              return 'vendor-some-large-library';
            }
            return parts[0];
          }
        },
        assetFileNames: assetInfo => {
          const name = assetInfo.name || 'unknown';
          if (/\.(gif|jpe?g|png|svg|webp)$/.test(name)) {
            return 'images/[name]-[hash][extname]';
          }
          if (/\.css$/.test(name)) {
            return 'styles/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
      },
    },
    chunkSizeWarningLimit: 500,  // chunk 大小警告的限制
    commonjsOptions: {
      transformMixedEsModules: true, // 处理 CommonJS 模块
      include: [/node_modules/]
    },
  },
  optimizeDeps: {
    include: [
      '@vue/reactivity', 
      'vue', 
      'axios', 
      'three', 
      'vanta',
      'eve',
      'raphael',
      'raphael-svg',
      'raphael-vml',
      'treant-js/Treant',
    ],
    exclude: ['treant-js']
  },
  css: {
    preprocessorOptions: {
      // scss全局文件引入
      scss: {
        additionalData: '@use "@/styles/global.scss" as *;'
      },
    },
    postcss:{
      plugins:[
        cssnano({
          preset: 'default',
        }),
        postCssPxToRem({
          rootValue: 192, // 基准值，根据设计稿进行调整
          propList: ['*'], // 需要转换的属性，['*'] 表示所有属性
          unitPrecision: 5, // 转换后保留的小数位
          selectorBlackList: [], // 不进行转换的选择器
          replace: true,
          mediaQuery: false, // 允许在媒体查询中转换 px
          minPixelValue: 1, // 最小转换数值
        })
      ]
    }
  },
})