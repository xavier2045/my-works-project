// src/stores/uploadStore.ts
import { defineStore } from 'pinia';

interface UploadState {
  coverImage: File | null;  // 封面图片
  coverImages: CoverFile[];  // 批量的封面图片
  mainFiles: File[]; // 主要文件
  detailFiles: File[]; // 详情文件
  nodeFiles: CoverFile[]; // 任务节点标准文件
  popFiles: CoverFile[]; // 任务节点标准文件
}

export interface CoverFile {
  file: File | null;
  isprevious: number;
}

export const useUploadStore = defineStore('upload', {
  state: (): UploadState => ({
    coverImage: null,
    coverImages: [] as CoverFile[],
    mainFiles: [],
    detailFiles: [],
    nodeFiles: [] as CoverFile[],
    popFiles: [] as CoverFile[],
  }),
  persist: {
    key: 'publish',
    storage: sessionStorage, // 你可以选择 localStorage 或 sessionStorage
  },
  actions: {
    setCoverImage(file: File) {
      this.coverImage = file;
    },
    addCoversFile(file: CoverFile) {
      this.coverImages.push(file);
    },
    removeCoversFile(index: number) {
      this.coverImages.splice(index, 1);
    },
    updateCoversFile(index: number, file: File) {
      if (index >= 0 && index < this.coverImages.length) {
        // this.coverImages[index] = file;
        this.coverImages[index].file = file;  // 更新文件
      }
    },
    addMainFile(file: File) {
      this.mainFiles.push(file);
    },
    removeMainFile(index: number) {
      this.mainFiles.splice(index, 1);
    },
    updateMainFile(index: number, file: File) {
      if (index >= 0 && index < this.mainFiles.length) {
        this.mainFiles[index] = file;
      }
    },
    addDetailFile(isprevious: number, index: number, file: File) {
      this.detailFiles.push({isprevious: isprevious, id: index, file: file});
    },
    removeDetailFile(index: number) {
      this.detailFiles.splice(index, 1);
    },
    updateDetailFile(index: number, file: File) {
      if (index >= 0 && index < this.detailFiles.length) {
        this.detailFiles[index] = file;
      }
    },
    addNodeFile(file: CoverFile) {
      this.nodeFiles.push(file);
    },
    removeNodeFile(index: number) {
      this.nodeFiles[index].file = null;
    },
    updateNodeFile(index: number, file: File) {
      if (index >= 0 && index < this.nodeFiles.length) {
        // this.coverImages[index] = file;
        this.nodeFiles[index].file = file;  // 更新文件
      }
    },
    addPopFile(file: CoverFile) {
      this.popFiles.push(file);
    },
    removePopFile(index: number) {
      this.popFiles.splice(index, 1);
    },
    updatePopFile(index: number, file: File) {
      if (index >= 0 && index < this.popFiles.length) {
        // this.coverImages[index] = file;
        this.popFiles[index].file = file;  // 更新文件
      }
    },
    clearAllFiles() {
      this.coverImage = null;
      this.coverImages = [];
      this.mainFiles = [];
      this.detailFiles = [];
      this.nodeFiles = [];
      this.popFiles = [];
      // 清除持久化存储中的数据
      sessionStorage.removeItem('upload'); // 假设 store 的 key 为 'upload'
    },
  },
});
