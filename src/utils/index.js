import { ref } from 'vue';
import CryptoJS from 'crypto-js';
import { useTransition } from '@vueuse/core'; // 确保导入了正确的 useTransition 方法

// 实现数值的变化动效
export function useDynamicValueTransition(duration = 3000) {
  const value = ref(0); // 初始值可以设置为 0 或其他初始值
  const outputValue = useTransition(value, {
    duration,
  });

  const setTargetValue = (targetValue) => {
    value.value = targetValue;
  };

  return {
    outputValue,
    setTargetValue,
  };
}

// 创建一个MD5加密函数
export function encryptWithMD5(value) {
  return CryptoJS.MD5(value).toString();
}

// 创建一个SHA256加密函数
export function  computeHmac(content, key) {
  // 将字符串转换为 WordArray
  // const contentWordArray = Utf8.parse(content);
  // const keyWordArray = Utf8.parse(key);
  // const hash = HmacSHA256(contentWordArray, keyWordArray);
  // return Base64.getEncoder().stringify(hash);
  const hash = CryptoJS.HmacSHA256(content, key);
  return CryptoJS.enc.Base64.stringify(hash);
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url;
  const search = url.substring(url.lastIndexOf('?') + 1);
  let obj= {}; // 使用Record类型定义一个可以以字符串为键的对象
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs
  });
  return obj
}

export function extractIdFromUrl(url) {
  try {
    const urlObj = new URL(url);
    const pathArray = urlObj.pathname.split('/').filter(Boolean); // 分割路径并过滤空字符串
    const id = pathArray[pathArray.length - 1]; // 获取最后一个非空字符串作为 id
    return id;
  } catch (error) {
    console.error('Error parsing URL:', error);
    return null;
  }
}

/** sessionStorage 工具方法 */
/** 设置值 */
export function setItem(key, val) {
  if (!!key && !!val) {
    sessionStorage.setItem(key, JSON.stringify(val));
  }
}

/** 取值 */
export function getItem(key) {
  if (!!key && key.length > 0) {
    const item = sessionStorage.getItem(key);
    if (item === null) {
      // 可以选择返回默认值或者直接返回null
      return null; // 或者 return defaultValue;
    }
    return JSON.parse(item);
    // return JSON.parse(sessionStorage.getItem(key));
  }
}

/** 删除值 */
export function removeItem(key) {
  if (!!key && key.length > 0) {
    try {
      if (key.toString().indexOf("MNG_") != -1) {
        sessionStorage.removeItem(key);
      } else {
        sessionStorage.removeItem('MNG_'+key);
      }

      return true;
    } catch (e) {

    }
    return false;
  }
}

/** 转换双精度浮点数 ***/
export function findBigIntFigure(num) {
  let bigIntNumber = BigInt(num);
  return bigIntNumber.toString();
}

/**
 * 设置图片的错误处理，自动显示默认图片
 */
export function handleImageError(event, defaultImageUrl) {
  event.target.src = defaultImageUrl;
}

// 校验身份证号
export function findCodeFun(val) {
  const pattern = /^[1-9]\d{5}(18|19|20|21|22)?\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}(\d|[Xx])$/;
  return pattern.test(val);
}

// 校验手机号
export function validatePhone(phone) {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
}

// 校验密码
export function isPasswordValid(password) {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
  return regex.test(password);
}

// 校验邮箱
export function isValidEmail(email) {
  // 正则表达式用于匹配常见的邮箱格式
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// 只能输入数字
export function isNumeric(value) {
  return value.replace(/[^\d]/g, '');
}


// 只能输入数字
export function filterInput(value) {
  // 使用正则表达式移除非数字字符
  console.log('value', value)
   // 确保value是字符串类型
  value = value.toString();
   // 移除非数字字符
  value = value.replace(/\D/g, '');
  // 更新输入框的值
  console.log('value1', value)
  return parseInt(value, 10);
}

// 输入框只能输入数字及小数点后最多只能3位
export function formatNumber(value) {
  // 移除所有非数字和小数点的字符
  value = Number(value);
  let str = value.replace(/[^0-9.]/g, '');
  // 确保只有一个小数点
  if (str.indexOf('.') !== -1 && str.indexOf('.', str.indexOf('.') + 1) !== -1) {
    str = str.slice(0, str.indexOf('.') + 1) + str.slice(str.indexOf('.', str.indexOf('.') + 1) + 1);
  }
  // 限制小数点后最多三位
  if (str.includes('.')) {
    str = str.slice(0, str.indexOf('.') + 4);
  }
  // 总长度限制为7位，包括小数点
  // str = str.slice(0, 7);
  return parseFloat(str);
}

// 点击复制内容
export const copyToClipboard = async (text) => {
  try {
    // 首先尝试使用现代 API
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      console.log('Text copied to clipboard');
    } else {
      // 如果不支持 clipboard API，使用 execCommand 方法
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      console.log('Text copied to clipboard using execCommand');
    }
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};

// 解析时间
export function formatTime(timeStr) {
  // 将传入的时间字符串解析为 Date 对象
  const targetTime = new Date(timeStr);
  const now = new Date();

  // 获取当前时间的年、月、日
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();

  // 获取目标时间的年、月、日
  const targetYear = targetTime.getFullYear();
  const targetMonth = targetTime.getMonth();
  const targetDay = targetTime.getDate();

  // 判断是否是当天
  if (targetYear === currentYear && targetMonth === currentMonth && targetDay === currentDay) {
    // 返回时分格式
    return targetTime.toTimeString().slice(0, 5); // HH:mm
  } else if (targetYear === currentYear) {
    // 返回月日格式
    return `${String(targetMonth + 1).padStart(2, '0')}-${String(targetDay).padStart(2, '0')}`; // MM-DD
  } else {
    // 计算年份差
    const yearsAgo = currentYear - targetYear;
    return `前${yearsAgo}年`;
  }
}

/**
 * 根据文件的 MIME 类型进行分类
 * @param {string} mimeType - 文件的 MIME 类型
 * @returns {string} - 文件分类（如 'image', 'video', 'audio', 'document', 'archive' 等）
 */
export function classifyFileByMimeType(mimeType) {
  if (!mimeType) return 'unknown';

  // 将 MIME 类型转换为小写，便于统一处理
  const type = mimeType.toLowerCase();

  // 判断文件类型
  if (type.startsWith('image/')) {
    return 'image';
  } else if (type.startsWith('video/')) {
    return 'video';
  } else if (type.startsWith('audio/')) {
    return 'audio';
  } else if (type.startsWith('application/') || type.startsWith('text/')) {
    // 判断是否为压缩文件
    if (type === 'application/zip' || 
        type === 'application/x-rar-compressed' || 
        type === 'application/x-7z-compressed' || 
        type === 'application/x-tar' || 
        type === 'application/x-gzip') {
      return 'archive';
    }
    return 'document';
  } else {
    // 处理文件后缀的情况
    const fileExtensions = {
      'jpg': 'image',
      'jpeg': 'image',
      'png': 'image',
      'gif': 'image',
      'mp4': 'video',
      'mov': 'video',
      'avi': 'video',
      'mp3': 'audio',
      'wav': 'audio',
      'pdf': 'document',
      'doc': 'document',
      'docx': 'document',
      'xls': 'document',
      'xlsx': 'document',
      'ppt': 'document',
      'pptx': 'document',
      'zip': 'archive',
      'rar': 'archive',
      '7z': 'archive',
      'tar': 'archive',
      'gz': 'archive',
    };

    const extension = type.split('.').pop();
    return fileExtensions[extension] || 'unknown';
  }
}

/**
 * 获取当前时间并格式化为 YYYY-MM-DD HH:mm 的字符串
 * @returns {string} 格式化后的时间字符串，例如 "2025-03-18 13:41"
 */
export function getCurrentTimeFormatted() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/** 
 * 时间转换，将传入2025-03-18 13:44，转换为2025.03.18 13:44
 *  **/
export function formatDateTime(inputDateTime) {
  // 将输入的时间字符串按照空格分割为日期和时间两部分
  const [datePart, timePart] = inputDateTime.split(' ');

  // 将日期部分按照 '-' 分割，并重新组合为 '.' 分隔的格式
  const formattedDate = datePart.split('-').join('.');

  // 返回组合后的日期时间字符串
  return `${formattedDate} ${timePart}`;
}

/**
 * 通过URL获取文件大小
 * @param url 文件的URL
 * @returns 文件大小（字节数），如果获取失败则返回null
 */
export async function getFileSize(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (!response.ok) {
      throw new Error(`Failed to fetch file metadata: ${response.statusText}`);
    }

    const contentLength = response.headers.get('Content-Length');
    if (contentLength === null) {
      throw new Error('Content-Length header not found');
    }

    return parseInt(contentLength, 10);
  } catch (error) {
    console.error('Error fetching file size:', error);
    return null;
  }
}

/**
 * 通过传入URL返回文件大小、文件名称、文件后缀
 * @param {string} url - 文件的URL
 * @returns {Promise<{size: number | null, name: string | null, extension: string | null}>} - 返回文件大小、文件名和文件后缀
 */
export async function getFileInfoFromUrl(url) {
  try {
    // 获取文件元信息
    // 如果你只需要获取文件的大小，而不需要读取文件内容，可以将请求模式设置为 no-cors。但请注意，这种模式下无法读取响应头或响应体，只能获取一个不透明的响应：
    // const response = await fetch(url, { method: 'HEAD' });
    const response = await fetch(url, { method: 'HEAD' });
    if (!response.ok) {
      throw new Error(`Failed to fetch file metadata: ${response.statusText}`);
    }

    // 获取文件大小
    const contentLength = response.headers.get('Content-Length');
    const size = contentLength ? parseInt(contentLength, 10) : null;

    // 从URL中提取文件名和文件后缀
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const fileNameWithExtension = pathname.split('/').pop(); // 获取文件名（含后缀）
    const [name, extension] = fileNameWithExtension ? fileNameWithExtension.split('.').reduce((acc, part, index, arr) => {
      if (index === arr.length - 1) {
        acc[1] = part; // 最后一个部分是文件后缀
      } else {
        acc[0] = acc[0] ? `${acc[0]}.${part}` : part; // 文件名部分
      }
      return acc;
    }, ['', '']) : [null, null];

    return {
      size,
      name,
      extension,
    };
  } catch (error) {
    console.error('Error fetching file info:', error);
    return {
      size: null,
      name: null,
      extension: null,
    };
  }
}

/**
 * 解析不同类型的值
 * @param {number} type - 类型：1银行卡，2手机号或邮箱，3姓名
 * @param {string} value - 需要解析的值
 * @returns {string} 解析后的值
 */
export function parseValue(type, value) {
  if (!value) return '';

  switch (type) {
    case 1: // 银行卡
      return value.slice(-4);

    case 2: // 手机号或邮箱
      if (/^\d+$/.test(value)) { // 手机号
        return `${value.slice(0, 3)}******${value.slice(-2)}`;
      } else if (value.includes('@')) { // 邮箱
        const [prefix, suffix] = value.split('@');
        return `${prefix.slice(0, 3)}****@${suffix}`;
      }
      return value;

    case 3: // 姓名
      return `**${value.slice(-1)}`;

    default:
      return value;
  }
}

// 校验输入金额，最多3位小数点
export const filterInputNumber = (value) => {
  // 如果为空，允许输入（中间状态）
  if (!value) return true;

  // 正则表达式：
  // ^0$|^0\.$|^0\.0$|^0\.00$ 匹配纯0情况（不允许）
  // ^0\.[0-9]{0,3}$ 匹配0开头带小数的情况（允许中间状态）
  // ^[1-9][0-9]*\.?[0-9]{0,3}$ 匹配非0开头的数字，可带最多3位小数
  const regex = /^(?!0$|0\.$|0\.0$|0\.00$)(0\.[0-9]{0,3}|[1-9][0-9]*\.?[0-9]{0,3})$/;

  // 测试输入是否符合正则表达式
  return regex.test(value);
};
