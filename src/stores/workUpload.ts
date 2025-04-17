// src/stores/workUpload.ts
import { defineStore } from 'pinia';

interface workUpload {
  coverImage: File | null;  // 封面图片
  mainFiles: File[]; // 简介文件
  worksFile: File[]; // 作品文件
  attsFiles: File[]; // 附件文件
  patentFiles: File[]; // 专利文件
}

export interface CoverFile {
  file: File | null;
  isprevious: number;
}

export const useWorkUpload = defineStore('workUpload', {
  state: (): workUpload => ({
    coverImage: null,
    mainFiles: [],
    attsFiles: [],
    worksFile: [],
    patentFiles: [],
  }),
  persist: {
    key: 'publish',
    storage: sessionStorage, // 你可以选择 localStorage 或 sessionStorage
  },
  actions: {
    setCoverImage(file: File) {
      this.coverImage = file;
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

    addWorksFile(file: File) {
      this.worksFile.push(file);
    },
    removeWorksFile(index: number) {
      this.worksFile.splice(index, 1);
    },
    updateWorksFile(index: number, file: File) {
      if (index >= 0 && index < this.worksFile.length) {
        this.worksFile[index] = file;
      }
    },

    addAttsFile(file: File) {
      this.attsFiles = [];
      this.attsFiles.push(file);
    },
    removeAttsFile(index: number) {
      this.attsFiles.splice(index, 1);
    },
    updateAttsFile(index: number, file: File) {
      if (index >= 0 && index < this.attsFiles.length) {
        this.attsFiles[index] = file;
      }
    },

    addPatentFile(file: File) {
      this.patentFiles = [];
      this.patentFiles = [file];
    },
    removePatentFile(index: number) {
      this.patentFiles.splice(index, 1);
    },
    updatePatentFile(index: number, file: File) {
      if (index >= 0 && index < this.patentFiles.length) {
        this.patentFiles[index] = file;
      }
    },

    clearAllFiles() {
      this.coverImage = null;
      this.mainFiles = [];
      this.attsFiles = [];
      this.worksFile = [];
      this.patentFiles = [];
      // 清除持久化存储中的数据
      sessionStorage.removeItem('workUpload'); // 假设 store 的 key 为 'workUpload'
    },
  },
});
