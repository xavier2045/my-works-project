// src/types/arco-upload.d.ts
declare module '@arco-design/web-vue/es/upload/interface' {
    export interface UploadFile {
      uid: string;
      name: string;
      status?: string;
      response?: any;
      url?: string;
      [key: string]: any;
    }
  
    export interface UploadChangeParam {
      file: UploadFile;
      fileList: UploadFile[];
    }
  }
  