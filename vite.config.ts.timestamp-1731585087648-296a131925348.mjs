// vite.config.ts
import { defineConfig } from "file:///D:/project/AETRIX/aetrix/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/project/AETRIX/aetrix/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import { fileURLToPath, URL } from "node:url";
import { visualizer } from "file:///D:/project/AETRIX/aetrix/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import Inspect from "file:///D:/project/AETRIX/aetrix/node_modules/vite-plugin-inspect/dist/index.mjs";
import ViteRestart from "file:///D:/project/AETRIX/aetrix/node_modules/vite-plugin-restart/dist/index.js";
import postCssPxToRem from "file:///D:/project/AETRIX/aetrix/node_modules/postcss-pxtorem/index.js";
import viteCompression from "file:///D:/project/AETRIX/aetrix/node_modules/vite-plugin-compression/dist/index.mjs";
import WindiCSS from "file:///D:/project/AETRIX/aetrix/node_modules/vite-plugin-windicss/dist/index.mjs";
import Components from "file:///D:/project/AETRIX/aetrix/node_modules/unplugin-vue-components/dist/vite.js";
import { VantResolver } from "file:///D:/project/AETRIX/aetrix/node_modules/unplugin-vue-components/dist/resolvers.js";
import minipic from "file:///D:/project/AETRIX/aetrix/node_modules/vite-plugin-minipic/dist/index.mjs";
import legacy from "file:///D:/project/AETRIX/aetrix/node_modules/@vitejs/plugin-legacy/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\project\\AETRIX\\aetrix";
var __vite_injected_original_import_meta_url = "file:///D:/project/AETRIX/aetrix/vite.config.ts";
var port = process.env.port || process.env.npm_config_port || 8888;
var vite_config_default = defineConfig({
  base: "/",
  server: {
    host: "0.0.0.0",
    // 设置为允许外部访问
    port: Number(port),
    // 设置开发服务器端口号
    open: false,
    // 启动时自动在浏览器中打开
    proxy: {
      // 配置代理
      "/api": {
        target: "http://192.168.77.20:8888",
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
        rewrite: (path2) => {
          const newPath = path2.replace(/^\/api/, "");
          console.log(`Rewriting path from "${path2}" to "${newPath}"`);
          return newPath;
        },
        configure: (proxy, options) => {
          proxy.on("proxyReq", (proxyReq, req, res) => {
            console.log("Proxy Request Path:", req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, res) => {
            let body = [];
            proxyRes.on("data", (chunk) => {
              body.push(chunk);
            });
            proxyRes.on("end", () => {
              body = Buffer.concat(body).toString();
              console.log("Proxy Response Body:", body);
            });
          });
          proxy.on("error", (err, req, res) => {
            console.error("Proxy Error:", err);
          });
        }
      }
    },
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    hmr: {
      // 热重载配置
      protocol: "ws",
      // WebSocket 协议
      host: "localhost",
      // 本地主机名或你的本地 IP 地址
      port: 3e3
      // HMR 端口
    }
  },
  plugins: [
    vue({
      template: {
        compilerOptions: { isCustomElement: (tag) => tag.startsWith("wc-") }
      }
    }),
    // ElementPlus(),
    minipic(),
    viteCompression({
      verbose: true,
      // 是否在控制台中输出压缩结果
      disable: false,
      threshold: 10240,
      // 如果体积大于阈值，将被压缩，单位为b，体积过小时请不要压缩，以免适得其反
      algorithm: "gzip",
      // 压缩算法，可选['gzip'，' brotliccompress '，'deflate '，'deflateRaw']
      ext: ".gz",
      // 压缩后的文件扩展名
      deleteOriginFile: false
      // 源文件压缩后是否删除
    }),
    WindiCSS(),
    visualizer({
      filename: "dist/report.html",
      // 打包分析报告的输出路径
      open: false
      // 打包后自动打开报告
    }),
    Inspect(),
    ViteRestart({
      restart: [
        "my.config.[jt]s"
      ]
    }),
    Components({
      dirs: ["src/components"],
      // 目标文件夹
      extensions: ["vue", "jsx"],
      // 文件类型
      dts: "src/components.d.ts",
      // 输出文件，里面都是一些import的组件键值对
      // ui库解析器，也可以自定义，需要安装相关UI库
      resolvers: [
        VantResolver()
        // ElementPlusResolver(),
        // AntDesignVueResolver(),
        // HeadlessUiResolver(),
        // ElementUiResolver()
      ]
    }),
    legacy({
      targets: ["defaults", "not IE 11"]
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)),
      "@assets": path.resolve(__vite_injected_original_dirname, "src/assets")
    }
  },
  build: {
    outDir: "dist",
    assetsDir: "static",
    target: "es2015",
    terserOptions: {
      compress: {
        // 打包的时候可以移除console和debugger
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      treeshake: true,
      input: {
        main: "index.html"
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
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
        },
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || "unknown";
          if (/\.(gif|jpe?g|png|svg|webp)$/.test(name)) {
            return "images/[name]-[hash][extname]";
          }
          if (/\.css$/.test(name)) {
            return "styles/[name]-[hash][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js"
      }
    },
    chunkSizeWarningLimit: 500
    // chunk 大小警告的限制
  },
  optimizeDeps: {
    include: ["@vue/reactivity", "vue", "axios"]
  },
  css: {
    preprocessorOptions: {
      // scss全局文件引入
      scss: {
        additionalData: '@use "@/styles/global.scss" as *;'
      }
    },
    postcss: {
      plugins: [
        postCssPxToRem({
          rootValue: 192,
          // 基准值，根据设计稿进行调整
          propList: ["*"],
          // 需要转换的属性，['*'] 表示所有属性
          unitPrecision: 5,
          // 转换后保留的小数位
          selectorBlackList: [],
          // 不进行转换的选择器
          replace: true,
          mediaQuery: false,
          // 允许在媒体查询中转换 px
          minPixelValue: 1
          // 最小转换数值
        })
      ]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxwcm9qZWN0XFxcXEFFVFJJWFxcXFxhZXRyaXhcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHByb2plY3RcXFxcQUVUUklYXFxcXGFldHJpeFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovcHJvamVjdC9BRVRSSVgvYWV0cml4L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCcgLy8gXHU1QkZDXHU1MTY1IHBhdGggXHU2QTIxXHU1NzU3XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcbi8vIGltcG9ydCB7IHRlcnNlciB9IGZyb20gJ3JvbGx1cC1wbHVnaW4tdGVyc2VyJztcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tICdyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXInIC8vIFx1NjI1M1x1NTMwNVx1NTIwNlx1Njc5MFxuaW1wb3J0IEluc3BlY3QgZnJvbSAndml0ZS1wbHVnaW4taW5zcGVjdCc7IC8vIFx1NzJCNlx1NjAwMVx1NTNFRlx1ODlDNlx1NTMxNlxuaW1wb3J0IFZpdGVSZXN0YXJ0IGZyb20gJ3ZpdGUtcGx1Z2luLXJlc3RhcnQnIC8vIFx1NzZEMVx1NTQyQ1x1NjU4N1x1NEVGNlx1NTNEOFx1NTMxNlx1OTFDRFx1NTQyRlx1NjcwRFx1NTJBMVxuaW1wb3J0IHBvc3RDc3NQeFRvUmVtIGZyb20gJ3Bvc3Rjc3MtcHh0b3JlbSc7ICAvLyBweFx1OEY2Q3JlbVxuLy8gXHU1MUNGXHU1QzExXHU2MjUzXHU1MzA1XHU2NTg3XHU0RUY2XHU0RjUzXHU3OUVGXG5pbXBvcnQgdml0ZUNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJ1xuaW1wb3J0IFdpbmRpQ1NTIGZyb20gJ3ZpdGUtcGx1Z2luLXdpbmRpY3NzJ1xuXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJyAvLyBcdTgxRUFcdTUyQThcdTYzMDlcdTk3MDBcdTVGMTVcdTUxNjVcdTdFQzRcdTRFRjZcbi8vIHVpXHU1RTkzXHU4OUUzXHU2NzkwXHU1NjY4XHVGRjBDXHU0RTVGXHU1M0VGXHU0RUU1XHU4MUVBXHU1QjlBXHU0RTQ5XHVGRjBDXHU5NzAwXHU4OTgxXHU1Qjg5XHU4OEM1XHU3NkY4XHU1MTczVUlcdTVFOTNcdUZGMEN1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnNcbi8vIFx1NjNEMFx1NEY5Qlx1NEU4Nlx1NEVFNVx1NEUwQlx1OTZDNlx1NEUyRFx1ODlFM1x1Njc5MFx1NTY2OFx1RkYwQ1x1NEY3Rlx1NzUyOFx1NzY4NFx1NjVGNlx1NTAxOVx1RkYwQ1x1OTcwMFx1ODk4MVx1NUI4OVx1ODhDNVx1NUJGOVx1NUU5NFx1NzY4NFVJXHU1RTkzXHVGRjBDXHU4RkQ5XHU5MUNDXHU0RUU1dmFudFx1NzkzQVx1NEY4QlxuLy8gXHU2Q0U4XHU5MUNBXHU3Njg0XHU2NjJGXHU1MzA1XHU1NDJCXHU3Njg0XHU1MTc2XHU0RUQ2XHU0RTAwXHU0RTlCXHU1RTM4XHU3NTI4XHU3RUM0XHU0RUY2XHU1RTkzXHVGRjBDXHU0RjlCXHU1M0MyXHU4MDAzXG5pbXBvcnQgeyBWYW50UmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXG5pbXBvcnQgbWluaXBpYyBmcm9tICd2aXRlLXBsdWdpbi1taW5pcGljJyAvLyBcdTUzOEJcdTdGMjlcdTU2RkVcdTcyNDdcblxuaW1wb3J0IGxlZ2FjeSBmcm9tICdAdml0ZWpzL3BsdWdpbi1sZWdhY3knOyAvLyBcdTUxN0NcdTVCQjlJRVxuXG4vLyBpbXBvcnQgRWxlbWVudFBsdXMgZnJvbSAndW5wbHVnaW4tZWxlbWVudC1wbHVzL3ZpdGUnO1xuXG4vLyBcdTgzQjdcdTUzRDZcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdTRFMkRcdTc2ODRcdTdBRUZcdTUzRTNcdTkxNERcdTdGNkVcdUZGMENcdTRGMThcdTUxNDhcdTdFQTdcdUZGMUFWSVRFX1BPUlQgPiBucG1fY29uZmlnX3BvcnQgPiA4MDgwXG5jb25zdCBwb3J0ID0gcHJvY2Vzcy5lbnYucG9ydCB8fCBwcm9jZXNzLmVudi5ucG1fY29uZmlnX3BvcnQgfHwgODg4OCAvLyBkZXYgcG9ydFxuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYmFzZTogJy8nLFxuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiAnMC4wLjAuMCcsIC8vIFx1OEJCRVx1N0Y2RVx1NEUzQVx1NTE0MVx1OEJCOFx1NTkxNlx1OTBFOFx1OEJCRlx1OTVFRVxuICAgIHBvcnQ6IE51bWJlcihwb3J0KSwgIC8vIFx1OEJCRVx1N0Y2RVx1NUYwMFx1NTNEMVx1NjcwRFx1NTJBMVx1NTY2OFx1N0FFRlx1NTNFM1x1NTNGN1xuICAgIG9wZW46IGZhbHNlLCAvLyBcdTU0MkZcdTUyQThcdTY1RjZcdTgxRUFcdTUyQThcdTU3MjhcdTZENEZcdTg5QzhcdTU2NjhcdTRFMkRcdTYyNTNcdTVGMDBcbiAgICBwcm94eToge1xuICAgICAgLy8gXHU5MTREXHU3RjZFXHU0RUUzXHU3NDA2XG4gICAgICAnL2FwaSc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovLzE5Mi4xNjguNzcuMjA6ODg4OCcsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgLy8gcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sICcnKSxcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHtcbiAgICAgICAgICBjb25zdCBuZXdQYXRoID0gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgJycpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGBSZXdyaXRpbmcgcGF0aCBmcm9tIFwiJHtwYXRofVwiIHRvIFwiJHtuZXdQYXRofVwiYCk7XG4gICAgICAgICAgcmV0dXJuIG5ld1BhdGg7XG4gICAgICAgIH0sXG4gICAgICAgIGNvbmZpZ3VyZTogKHByb3h5LCBvcHRpb25zKSA9PiB7XG4gICAgICAgICAgLy8gXHU5MTREXHU3RjZFXHU4MUVBXHU1QjlBXHU0RTQ5XHU0RTJEXHU5NUY0XHU0RUY2XG4gICAgICAgICAgcHJveHkub24oJ3Byb3h5UmVxJywgKHByb3h5UmVxLCByZXEsIHJlcykgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1Byb3h5IFJlcXVlc3QgUGF0aDonLCByZXEudXJsKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHByb3h5Lm9uKCdwcm94eVJlcycsIChwcm94eVJlcywgcmVxLCByZXMpID0+IHtcbiAgICAgICAgICAgIGxldCBib2R5ID0gW107XG4gICAgICAgICAgICBwcm94eVJlcy5vbignZGF0YScsIChjaHVuaykgPT4ge1xuICAgICAgICAgICAgICBib2R5LnB1c2goY2h1bmspO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwcm94eVJlcy5vbignZW5kJywgKCkgPT4ge1xuICAgICAgICAgICAgICBib2R5ID0gQnVmZmVyLmNvbmNhdChib2R5KS50b1N0cmluZygpO1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUHJveHkgUmVzcG9uc2UgQm9keTonLCBib2R5KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcHJveHkub24oJ2Vycm9yJywgKGVyciwgcmVxLCByZXMpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1Byb3h5IEVycm9yOicsIGVycik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJyxcbiAgICB9LFxuICAgIGhtcjoge1xuICAgICAgLy8gXHU3MEVEXHU5MUNEXHU4RjdEXHU5MTREXHU3RjZFXG4gICAgICBwcm90b2NvbDogJ3dzJywgIC8vIFdlYlNvY2tldCBcdTUzNEZcdThCQUVcbiAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnLCAvLyBcdTY3MkNcdTU3MzBcdTRFM0JcdTY3M0FcdTU0MERcdTYyMTZcdTRGNjBcdTc2ODRcdTY3MkNcdTU3MzAgSVAgXHU1NzMwXHU1NzQwXG4gICAgICBwb3J0OiAzMDAwLCAvLyBITVIgXHU3QUVGXHU1M0UzXG4gICAgfVxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgdnVlKHtcbiAgICAgIHRlbXBsYXRlOiB7XG4gICAgICAgIGNvbXBpbGVyT3B0aW9uczogeyBpc0N1c3RvbUVsZW1lbnQ6ICh0YWcpID0+IHRhZy5zdGFydHNXaXRoKCd3Yy0nKSB9XG4gICAgICB9LFxuICAgIH0pLFxuICAgIC8vIEVsZW1lbnRQbHVzKCksXG4gICAgbWluaXBpYygpLFxuICAgIHZpdGVDb21wcmVzc2lvbih7XG4gICAgICB2ZXJib3NlOiB0cnVlLCAvLyBcdTY2MkZcdTU0MjZcdTU3MjhcdTYzQTdcdTUyMzZcdTUzRjBcdTRFMkRcdThGOTNcdTUxRkFcdTUzOEJcdTdGMjlcdTdFRDNcdTY3OUNcbiAgICAgIGRpc2FibGU6IGZhbHNlLFxuICAgICAgdGhyZXNob2xkOiAxMDI0MCwgLy8gXHU1OTgyXHU2NzlDXHU0RjUzXHU3OUVGXHU1OTI3XHU0RThFXHU5NjA4XHU1MDNDXHVGRjBDXHU1QzA2XHU4OEFCXHU1MzhCXHU3RjI5XHVGRjBDXHU1MzU1XHU0RjREXHU0RTNBYlx1RkYwQ1x1NEY1M1x1NzlFRlx1OEZDN1x1NUMwRlx1NjVGNlx1OEJGN1x1NEUwRFx1ODk4MVx1NTM4Qlx1N0YyOVx1RkYwQ1x1NEVFNVx1NTE0RFx1OTAwMlx1NUY5N1x1NTE3Nlx1NTNDRFxuICAgICAgYWxnb3JpdGhtOiAnZ3ppcCcsIC8vIFx1NTM4Qlx1N0YyOVx1N0I5N1x1NkNENVx1RkYwQ1x1NTNFRlx1OTAwOVsnZ3ppcCdcdUZGMEMnIGJyb3RsaWNjb21wcmVzcyAnXHVGRjBDJ2RlZmxhdGUgJ1x1RkYwQydkZWZsYXRlUmF3J11cbiAgICAgIGV4dDogJy5neicsIC8vIFx1NTM4Qlx1N0YyOVx1NTQwRVx1NzY4NFx1NjU4N1x1NEVGNlx1NjI2OVx1NUM1NVx1NTQwRFxuICAgICAgZGVsZXRlT3JpZ2luRmlsZTogZmFsc2UgLy8gXHU2RTkwXHU2NTg3XHU0RUY2XHU1MzhCXHU3RjI5XHU1NDBFXHU2NjJGXHU1NDI2XHU1MjIwXHU5NjY0XG4gICAgfSksXG4gICAgV2luZGlDU1MoKSxcbiAgICB2aXN1YWxpemVyKHtcbiAgICAgIGZpbGVuYW1lOiAnZGlzdC9yZXBvcnQuaHRtbCcsIC8vIFx1NjI1M1x1NTMwNVx1NTIwNlx1Njc5MFx1NjJBNVx1NTQ0QVx1NzY4NFx1OEY5M1x1NTFGQVx1OERFRlx1NUY4NFxuICAgICAgb3BlbjogZmFsc2UsIC8vIFx1NjI1M1x1NTMwNVx1NTQwRVx1ODFFQVx1NTJBOFx1NjI1M1x1NUYwMFx1NjJBNVx1NTQ0QVxuICAgIH0pLFxuICAgIEluc3BlY3QoKSxcbiAgICBWaXRlUmVzdGFydCh7XG4gICAgICByZXN0YXJ0OiBbXG4gICAgICAgICdteS5jb25maWcuW2p0XXMnLFxuICAgICAgXVxuICAgIH0pLFxuICAgIENvbXBvbmVudHMoe1xuICAgICAgZGlyczogWydzcmMvY29tcG9uZW50cyddLCAvLyBcdTc2RUVcdTY4MDdcdTY1ODdcdTRFRjZcdTU5MzlcbiAgICAgIGV4dGVuc2lvbnM6IFsndnVlJywnanN4J10sIC8vIFx1NjU4N1x1NEVGNlx1N0M3Qlx1NTc4QlxuICAgICAgZHRzOiAnc3JjL2NvbXBvbmVudHMuZC50cycsIC8vIFx1OEY5M1x1NTFGQVx1NjU4N1x1NEVGNlx1RkYwQ1x1OTFDQ1x1OTc2Mlx1OTBGRFx1NjYyRlx1NEUwMFx1NEU5QmltcG9ydFx1NzY4NFx1N0VDNFx1NEVGNlx1OTUyRVx1NTAzQ1x1NUJGOVxuICAgICAgLy8gdWlcdTVFOTNcdTg5RTNcdTY3OTBcdTU2NjhcdUZGMENcdTRFNUZcdTUzRUZcdTRFRTVcdTgxRUFcdTVCOUFcdTRFNDlcdUZGMENcdTk3MDBcdTg5ODFcdTVCODlcdTg4QzVcdTc2RjhcdTUxNzNVSVx1NUU5M1xuICAgICAgcmVzb2x2ZXJzOiBbXG4gICAgICAgIFZhbnRSZXNvbHZlcigpLFxuICAgICAgICAvLyBFbGVtZW50UGx1c1Jlc29sdmVyKCksXG4gICAgICAgIC8vIEFudERlc2lnblZ1ZVJlc29sdmVyKCksXG4gICAgICAgIC8vIEhlYWRsZXNzVWlSZXNvbHZlcigpLFxuICAgICAgICAvLyBFbGVtZW50VWlSZXNvbHZlcigpXG4gICAgICBdLFxuICAgIH0pLFxuICAgIGxlZ2FjeSh7XG4gICAgICB0YXJnZXRzOiBbJ2RlZmF1bHRzJywgJ25vdCBJRSAxMSddXG4gICAgfSlcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICAgICdAYXNzZXRzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9hc3NldHMnKSxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIG91dERpcjogJ2Rpc3QnLFxuICAgIGFzc2V0c0RpcjogJ3N0YXRpYycsXG4gICAgdGFyZ2V0OiAnZXMyMDE1JyxcbiAgICB0ZXJzZXJPcHRpb25zOiB7XG4gICAgICBjb21wcmVzczoge1xuICAgICAgICAvLyBcdTYyNTNcdTUzMDVcdTc2ODRcdTY1RjZcdTUwMTlcdTUzRUZcdTRFRTVcdTc5RkJcdTk2NjRjb25zb2xlXHU1NDhDZGVidWdnZXJcbiAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLFxuICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIHRyZWVzaGFrZTogdHJ1ZSxcbiAgICAgIGlucHV0OiB7XG4gICAgICAgIG1haW46ICdpbmRleC5odG1sJyxcbiAgICAgIH0sXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFx1ODFFQVx1NUI5QVx1NEU0OVx1NjJDNlx1NTIwNlx1NEVFM1x1NzgwMVx1NTc1N1x1NzY4NFx1NTFGRFx1NjU3MFx1MzAwMlxuICAgICAgICAgKiBcdThCRTVcdTUxRkRcdTY1NzBcdTc1MjhcdTRFOEVcdTc4NkVcdTVCOUFcdTU5ODJcdTRGNTVcdTVDMDZcdTcyNzlcdTVCOUFcdTc2ODRcdTZBMjFcdTU3NTdJRFx1NjJDNlx1NTIwNlx1NTIzMFx1NEUwRFx1NTQwQ1x1NzY4NFx1NEVFM1x1NzgwMVx1NTc1N1x1NEUyRFx1MzAwMlxuICAgICAgICAgKiBcdTcyNzlcdTUyMkJcdTY2MkZcdUZGMENcdTVCODNcdTk0ODhcdTVCRjlub2RlX21vZHVsZXNcdTc2RUVcdTVGNTVcdTRFMkRcdTc2ODRcdTZBMjFcdTU3NTdcdTUwNUFcdTRFODZcdTcyNzlcdTZCOEFcdTU5MDRcdTc0MDZcdUZGMENcbiAgICAgICAgICogXHU0RUU1XHU0RjE4XHU1MzE2XHU1OTI3XHU1NzhCXHU1RTk0XHU3NTI4XHU3QTBCXHU1RThGXHU3Njg0XHU1MjFEXHU1OUNCXHU1MkEwXHU4RjdEXHU2NUY2XHU5NUY0XHUzMDAyXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcGFyYW0gaWQgXHU2QTIxXHU1NzU3XHU3Njg0SURcdUZGMENcdThGRDlcdTY2MkZcdTRFMDBcdTRFMkFcdTVCNTdcdTdCMjZcdTRFMzJcdUZGMENcdTg4NjhcdTc5M0FcdTZBMjFcdTU3NTdcdTU3MjhcdTk4NzlcdTc2RUVcdTRFMkRcdTc2ODRcdThERUZcdTVGODRcdTMwMDJcbiAgICAgICAgICogQHJldHVybnMge3N0cmluZ30gXHU4RkQ0XHU1NkRFXHU0RTAwXHU0RTJBXHU1QjU3XHU3QjI2XHU0RTMyXHVGRjBDXHU4ODY4XHU3OTNBXHU2ODM5XHU2MzZFXHU3Mjc5XHU1QjlBXHU4OUM0XHU1MjE5XHU2MkM2XHU1MjA2XHU1NDBFXHU3Njg0XHU0RUUzXHU3ODAxXHU1NzU3XHU1NDBEXHU3OUYwXHUzMDAyXG4gICAgICAgICAqIFx1NTk4Mlx1Njc5Q1x1NkEyMVx1NTc1N0lEXHU1MzA1XHU1NDJCJ25vZGVfbW9kdWxlcydcdUZGMENcdTUyMTlcdThGRDRcdTU2REVcdTRFQ0Unbm9kZV9tb2R1bGVzJ1x1NUYwMFx1NTlDQlx1NTIzMFx1N0IyQ1x1NEUwMFx1NEUyQVx1NjU5Q1x1Njc2MFx1NEUzQVx1NkI2Mlx1NzY4NFx1NUI1N1x1N0IyNlx1NEUzMlx1RkYwQ1xuICAgICAgICAgKiBcdTRGNUNcdTRFM0FcdTRFRTNcdTc4MDFcdTU3NTdcdTc2ODRcdTU0MERcdTc5RjBcdTMwMDJcdTU0MjZcdTUyMTlcdUZGMENcdThGRDRcdTU2REVcdTdBN0FcdTVCNTdcdTdCMjZcdTRFMzJcdUZGMENcdTg4NjhcdTc5M0FcdTRFMERcdThGREJcdTg4NENcdTYyQzZcdTUyMDZcdTMwMDJcbiAgICAgICAgICovXG4gICAgICAgIG1hbnVhbENodW5rcyhpZCkge1xuICAgICAgICAgIC8vIFx1NjhDMFx1NjdFNVx1NkEyMVx1NTc1N0lEXHU2NjJGXHU1NDI2XHU1MzA1XHU1NDJCJ25vZGVfbW9kdWxlcydcdUZGMENcdTRFRTVcdTRGMThcdTUzMTZcdTVCRjlcdTdCMkNcdTRFMDlcdTY1QjlcdTVFOTNcdTc2ODRcdTYyQzZcdTUyMDZcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XG4gICAgICAgICAgICAvLyBcdTRGN0ZcdTc1MjhcdTVCNTdcdTdCMjZcdTRFMzJcdTUyMDZcdTUyNzJcdTY1QjlcdTZDRDVcdTVDMDZcdTZBMjFcdTU3NTdJRFx1NjJDNlx1NTIwNlx1NEUzQVx1NTkxQVx1NEUyQVx1OTBFOFx1NTIwNlxuICAgICAgICAgICAgLy8gXHU1RTc2XHU4RkQ0XHU1NkRFXHU0RUNFJ25vZGVfbW9kdWxlcydcdTVGMDBcdTU5Q0JcdTUyMzBcdTdCMkNcdTRFMDBcdTRFMkFcdTY1OUNcdTY3NjBcdTRFM0FcdTZCNjJcdTc2ODRcdTVCNTdcdTdCMjZcdTRFMzJcbiAgICAgICAgICAgIC8vIFx1NEY1Q1x1NEUzQVx1NEVFM1x1NzgwMVx1NTc1N1x1NzY4NFx1NTQwRFx1NzlGMFxuICAgICAgICAgICAgcmV0dXJuIGlkLnRvU3RyaW5nKCkuc3BsaXQoJ25vZGVfbW9kdWxlcy8nKVsxXS5zcGxpdCgnLycpWzBdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBhc3NldEZpbGVOYW1lczogYXNzZXRJbmZvID0+IHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gYXNzZXRJbmZvLm5hbWUgfHwgJ3Vua25vd24nO1xuICAgICAgICAgIGlmICgvXFwuKGdpZnxqcGU/Z3xwbmd8c3ZnfHdlYnApJC8udGVzdChuYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuICdpbWFnZXMvW25hbWVdLVtoYXNoXVtleHRuYW1lXSc7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICgvXFwuY3NzJC8udGVzdChuYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuICdzdHlsZXMvW25hbWVdLVtoYXNoXVtleHRuYW1lXSc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAnYXNzZXRzL1tuYW1lXS1baGFzaF1bZXh0bmFtZV0nO1xuICAgICAgICB9LFxuICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2pzL1tuYW1lXS1baGFzaF0uanMnLFxuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2pzL1tuYW1lXS1baGFzaF0uanMnLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogNTAwLCAgLy8gY2h1bmsgXHU1OTI3XHU1QzBGXHU4QjY2XHU1NDRBXHU3Njg0XHU5NjUwXHU1MjM2XG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGluY2x1ZGU6IFsnQHZ1ZS9yZWFjdGl2aXR5JywgJ3Z1ZScsICdheGlvcyddLFxuICB9LFxuICBjc3M6IHtcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAvLyBzY3NzXHU1MTY4XHU1QzQwXHU2NTg3XHU0RUY2XHU1RjE1XHU1MTY1XG4gICAgICBzY3NzOiB7XG4gICAgICAgIGFkZGl0aW9uYWxEYXRhOiAnQHVzZSBcIkAvc3R5bGVzL2dsb2JhbC5zY3NzXCIgYXMgKjsnXG4gICAgICB9LFxuICAgIH0sXG4gICAgcG9zdGNzczp7XG4gICAgICBwbHVnaW5zOltcbiAgICAgICAgcG9zdENzc1B4VG9SZW0oe1xuICAgICAgICAgIHJvb3RWYWx1ZTogMTkyLCAvLyBcdTU3RkFcdTUxQzZcdTUwM0NcdUZGMENcdTY4MzlcdTYzNkVcdThCQkVcdThCQTFcdTdBM0ZcdThGREJcdTg4NENcdThDMDNcdTY1NzRcbiAgICAgICAgICBwcm9wTGlzdDogWycqJ10sIC8vIFx1OTcwMFx1ODk4MVx1OEY2Q1x1NjM2Mlx1NzY4NFx1NUM1RVx1NjAyN1x1RkYwQ1snKiddIFx1ODg2OFx1NzkzQVx1NjI0MFx1NjcwOVx1NUM1RVx1NjAyN1xuICAgICAgICAgIHVuaXRQcmVjaXNpb246IDUsIC8vIFx1OEY2Q1x1NjM2Mlx1NTQwRVx1NEZERFx1NzU1OVx1NzY4NFx1NUMwRlx1NjU3MFx1NEY0RFxuICAgICAgICAgIHNlbGVjdG9yQmxhY2tMaXN0OiBbXSwgLy8gXHU0RTBEXHU4RkRCXHU4ODRDXHU4RjZDXHU2MzYyXHU3Njg0XHU5MDA5XHU2MkU5XHU1NjY4XG4gICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICBtZWRpYVF1ZXJ5OiBmYWxzZSwgLy8gXHU1MTQxXHU4QkI4XHU1NzI4XHU1QTkyXHU0RjUzXHU2N0U1XHU4QkUyXHU0RTJEXHU4RjZDXHU2MzYyIHB4XG4gICAgICAgICAgbWluUGl4ZWxWYWx1ZTogMSwgLy8gXHU2NzAwXHU1QzBGXHU4RjZDXHU2MzYyXHU2NTcwXHU1MDNDXG4gICAgICAgIH0pXG4gICAgICBdXG4gICAgfVxuICB9LFxufSkiXSwKICAibWFwcGluZ3MiOiAiO0FBQWtRLFNBQVMsb0JBQW9CO0FBQy9SLE9BQU8sU0FBUztBQUNoQixPQUFPLFVBQVU7QUFDakIsU0FBUyxlQUFlLFdBQVc7QUFFbkMsU0FBUyxrQkFBa0I7QUFDM0IsT0FBTyxhQUFhO0FBQ3BCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sb0JBQW9CO0FBRTNCLE9BQU8scUJBQXFCO0FBQzVCLE9BQU8sY0FBYztBQUVyQixPQUFPLGdCQUFnQjtBQUl2QixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLGFBQWE7QUFFcEIsT0FBTyxZQUFZO0FBcEJuQixJQUFNLG1DQUFtQztBQUFzSCxJQUFNLDJDQUEyQztBQXlCaE4sSUFBTSxPQUFPLFFBQVEsSUFBSSxRQUFRLFFBQVEsSUFBSSxtQkFBbUI7QUFHaEUsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsTUFBTTtBQUFBLEVBQ04sUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBO0FBQUEsSUFDTixNQUFNLE9BQU8sSUFBSTtBQUFBO0FBQUEsSUFDakIsTUFBTTtBQUFBO0FBQUEsSUFDTixPQUFPO0FBQUE7QUFBQSxNQUVMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQTtBQUFBLFFBRWQsU0FBUyxDQUFDQSxVQUFTO0FBQ2pCLGdCQUFNLFVBQVVBLE1BQUssUUFBUSxVQUFVLEVBQUU7QUFDekMsa0JBQVEsSUFBSSx3QkFBd0JBLEtBQUksU0FBUyxPQUFPLEdBQUc7QUFDM0QsaUJBQU87QUFBQSxRQUNUO0FBQUEsUUFDQSxXQUFXLENBQUMsT0FBTyxZQUFZO0FBRTdCLGdCQUFNLEdBQUcsWUFBWSxDQUFDLFVBQVUsS0FBSyxRQUFRO0FBQzNDLG9CQUFRLElBQUksdUJBQXVCLElBQUksR0FBRztBQUFBLFVBQzVDLENBQUM7QUFFRCxnQkFBTSxHQUFHLFlBQVksQ0FBQyxVQUFV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
