// eventBus.ts
// 事件总线 用于上传文件
import mitt from 'mitt';

type Events = {
    registerUpload: number; // 传递number类型的参数
    uploadComplete: string; // 传递string类型的参数
    startUpload: void; // 不传递参数
};

const emitter = mitt<Events>();

export default emitter;

