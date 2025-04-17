// src/env.d.ts

/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_WS_URL: string;
    // 这里可以继续声明其他环境变量
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  