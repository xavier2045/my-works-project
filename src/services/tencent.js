import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const TENCENT_SECRET_ID = process.env.TENCENT_SECRET_ID;
const TENCENT_SECRET_KEY = process.env.TENCENT_SECRET_KEY;

export async function getTencentCredential() {
  const policy = {
    version: "2.0",
    statement: [{
      action: ["asr:AsyncRecognition"],
      effect: "allow",
      resource: "*"
    }]
  };

  const params = {
    SecretId: TENCENT_SECRET_ID,
    SecretKey: TENCENT_SECRET_KEY,
    Region: 'ap-guangzhou',
    DurationSeconds: 7200,
    Name: 'ASR_Temporary',
    Policy: encodeURIComponent(JSON.stringify(policy))
  };

  try {
    const response = await axios.get(
      'https://sts.tencentcloudapi.com/',
      { params }
    );
    
    return {
      Token: response.data.Credentials.Token,
      TmpSecretId: response.data.Credentials.TmpSecretId,
      TmpSecretKey: response.data.Credentials.TmpSecretKey,
      ExpiredTime: response.data.ExpiredTime
    };
  } catch (error) {
    console.error('Tencent STS Error:', error);
    throw new Error('Failed to get credentials');
  }
}