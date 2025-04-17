import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { aeUseStore } from '@/stores/user';
import { setItem, getItem } from './index';
import router from '@/router';
import { refreshTokenUrl } from '@/api/user';
import { showPopup } from '@/utils/usePopup';
import { ref } from 'vue';

const userStore = aeUseStore();
const userInfo = userStore.getUserInfo;

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 防重复请求管理
const pendingRequests = new Map<string, Promise<AxiosResponse>>();

// token 刷新状态
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// 生成唯一的请求标识符
const generateRequestKey = (config: InternalAxiosRequestConfig): string => {
  if (!config) {
    console.error('Config is undefined in generateRequestKey');
    return 'undefined-request';
  }
  const { url, method, params, data } = config;
  let key = `${method || 'GET'}-${url || ''}`;
  if (params) key += `-params-${JSON.stringify(params)}`;
  if (data) key += `-data-${JSON.stringify(data)}`;
  return key;
};

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    let token = userInfo.token || getItem('token');
    let uuid = userInfo.uuid || getItem('uuid');
    let refreshToken = userInfo.refreshToken || getItem('refreshToken');

    if (config.url && !['login', 'send-code', 'home/index'].some((path) => config.url!.includes(path))) {
      if (config.url.includes('logout')) {
        config.headers['Refresh-Token'] = refreshToken;
      }
      if (token) {
        config.headers['Authorization'] = token;
        config.headers['Uuid'] = uuid;
      }
    }

    const requestKey = generateRequestKey(config);
    if (pendingRequests.has(requestKey)) {
      console.log(`Request ${requestKey} is pending, reusing existing promise`);
      return pendingRequests.get(requestKey)!; // 返回已有的 Promise
    }

    const requestPromise = new Promise<AxiosResponse>((resolve, reject) => {
      config._resolve = resolve;
      config._reject = reject;
    });
    pendingRequests.set(requestKey, requestPromise);
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const requestKey = generateRequestKey(response.config);
    pendingRequests.delete(requestKey);
    const res = response.data;
    const code = Number(res.code);

    if (code === 401) {
      return handleTokenRefresh(response.config);
    } else if (code !== 200) {
      const errMsg = res.message || '请求失败';
      showPopup(errMsg, 'error', 3000);
      return Promise.reject(new Error(errMsg));
    }
    return res;
  },
  (error: AxiosError) => {
    const originalRequest = error.config;
    const requestKey = generateRequestKey(originalRequest);
    pendingRequests.delete(requestKey);

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return handleTokenRefresh(originalRequest);
    }

    const message = error.message || '未知错误';
    showPopup(`请求错误: ${message}`, 'error', 3000);
    return Promise.reject(error);
  }
);

// 处理 token 刷新
async function handleTokenRefresh(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
  if (!isRefreshing) {
    isRefreshing = true;
    try {
      let refreshTokens = userInfo.refreshToken || getItem('refreshToken');
      console.log('--------------------', refreshTokens);
      if(refreshTokens == '' || refreshTokens == null || refreshTokens == undefined){
        isRefreshing = false;
        refreshSubscribers = [];
        showPopup('刷新 token 失败，请重新登录', 'error', 3000);
        userStore.clearUserInfo(); // 假设有个清空用户信息的方法
        router.push('/');
        return Promise.reject('error');
      }
      const reqData = { refreshToken: refreshTokens };
      const response = await refreshTokenUrl(reqData);
      const { code, data, message } = response;

      if (code !== 200) {
        isRefreshing = false;
        refreshSubscribers = [];
        showPopup('刷新 token 失败，请重新登录', 'error', 3000);
        userStore.clearUserInfo(); // 假设有个清空用户信息的方法
        router.push('/');
        throw new Error(message || '刷新 token 失败');
      }

      const { accessToken, refreshToken } = data;
      userStore.userInfo.token = accessToken;
      userStore.userInfo.refreshToken = refreshToken;
      setItem('token', accessToken);
      setItem('refreshToken', refreshToken);

      // 通知所有等待的请求
      refreshSubscribers.forEach((cb) => cb(accessToken));
      refreshSubscribers = [];
      isRefreshing = false;

      // 重试原请求
      config.headers['Authorization'] = accessToken;
      return service.request(config);
    } catch (error) {
      isRefreshing = false;
      refreshSubscribers = [];
      showPopup('刷新 token 失败，请重新登录', 'error', 3000);
      userStore.clearUserInfo(); // 清空用户信息的方法
      router.push('/');
      return Promise.reject(error);
    }
  } else {
    // 如果已经在刷新 token，加入等待队列
    return new Promise((resolve) => {
      refreshSubscribers.push((token: string) => {
        config.headers['Authorization'] = token;
        resolve(service.request(config));
      });
    });
  }
}

// 构建 URL 参数
function buildURLWithParams(url: string, params: Record<string, any>): string {
  const urlObj = new URL(url, import.meta.env.VITE_API_URL);
  Object.keys(params).forEach((key) => urlObj.searchParams.append(key, params[key]));
  return urlObj.toString();
}

// 发起请求
export async function makeRequest<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
  if (config?.params) {
    url = buildURLWithParams(url, config.params);
    delete config.params;
  }
  return service.request<T>({ url, ...config });
}

export default service;