// src/services/uploadService.ts
import COS from 'cos-js-sdk-v5';

interface UploadResult {
  success: boolean;
  data?: any;
  error?: any;
}

const now = new Date();
const year = now.getFullYear();// 年
const month = (now.getMonth() + 1).toString().padStart(2, '0');// 月
const day = now.getDate().toString().padStart(2, '0');// 日

export const uploadFileToCOS = (
    file: File,
    bucket: string,
    region: string,
    sessionToken: string,
    tmpSecretId: string,
    tmpSecretKey: string,
    token: string,
): Promise<UploadResult> => {
  return new Promise((resolve) => {
    console.log('tmpSecretId', tmpSecretId);
    const cos = new COS({
        SecretId: tmpSecretId,
        SecretKey: tmpSecretKey,
        SecurityToken: sessionToken,
    });
    console.log("cos", cos);
    const Key = `File/${year}/${month}/${day}/${Date.now()}-${file.name}`;
    cos.putObject(
      {
        Bucket: bucket,
        Region: region,
        Key: Key,
        Body: file,
      },
      (err, data) => {
        if (err) {
          resolve({ success: false, error: err });
        } else {
          resolve({ success: true, data });
        }
      }
    );
  });
};
