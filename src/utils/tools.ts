import { getCurrentInstance } from 'vue';

// 获取全局属性
export const useGlobal = <T>() => {
  const instance = getCurrentInstance();
  if (!instance) {
    throw new Error('useGlobal must be called within a setup function');
  }
  const globalProperties = instance.appContext.config.globalProperties as T;

  return globalProperties;
};
// 数组求和
export const sum = (array: number[]): number => {
  return array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
};
// 格式化字节
export const formatBytes = (bytes: number, digits = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(digits))} ${sizes[i]}`;
};
// 判断是否手机端
export const deviceDetection = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();

  const isMidp = /midp/i.test(userAgent);
  const isUcweb = /ucweb/i.test(userAgent);
  const isAndroid = /android/i.test(userAgent);
  const isIphoneOs = /iphone os/i.test(userAgent);
  const isWindowsCe = /windows ce/i.test(userAgent);
  const isRv = /rv:1.2.3.4/i.test(userAgent);
  const isWindowsMobile = /windows mobile/i.test(userAgent);

  return isMidp || isUcweb || isAndroid || isIphoneOs || isWindowsCe || isRv || isWindowsMobile;
};
export const delay = (ms = 20): Promise<void> => {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
};
// 是否为空，针对 数组、对象、字符串、new Map()、new Set()、null、undefined 进行判断，null、undefined 直接返回 true，也就是直接等于空
export const isAllEmpty = (val: unknown): boolean => {
  // 检查null和undefined
  if (val == null) {
    return true;
  }

  // 检查字符串、数组
  if (typeof val === 'string' || Array.isArray(val)) {
    return val.length === 0;
  }

  // 检查Map和Set
  if (val instanceof Map || val instanceof Set) {
    return val.size === 0;
  }

  // 检查对象（排除null，因为typeof null === 'object'）
  if (typeof val === 'object' && val !== null) {
    return Object.keys(val).length === 0;
  }

  // 如果不是上述类型，则不认为是“空”
  return false;
};

// 处理localStorage
export function storageLocal() {
  const setItem = (key: string, value: any): void => {
    localStorage.setItem(key, JSON.stringify(value));
  };
  const getItem = <T>(key: string): T | null => {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  };
  const removeItem = (key: string): void => {
    localStorage.removeItem(key);
  };
  const clear = (): void => {
    localStorage.clear();
  };
  return {
    setItem,
    getItem,
    removeItem,
    clear,
  };
}

export function isUrl(value: string): boolean {
  const urlPattern = new RegExp(
    "^((https|http|ftp|rtsp|mms)?://)(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].[a-z]{2,6})(:[0-9]{1,5})?((/?)|(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$",
    'i',
  );
  return !!value && urlPattern.test(value);
}

type Target = '_self' | '_blank' | '_parent' | '_top' | string;

export function openLink(href: string, target: Target = '_blank'): void {
  // 使用window.open来打开链接
  window.open(href, target);
}
// 向当前元素添加/删除指定类名
export function toggleClass(bool: boolean, name: string, element?: HTMLElement | Element): void {
  // 如果 element 未提供，则默认为 document.body
  const targetElement = element || document.body;

  // 获取元素当前的 className
  const currentClassNames = targetElement.className;

  // 创建一个 Set 来确保类名的唯一性，并移除额外的空格
  const classSet = new Set(currentClassNames.trim().split(/\s+/));

  // 根据 bool 参数决定是添加还是移除类名
  if (bool) {
    classSet.add(name);
  } else {
    classSet.delete(name);
  }

  // 使用空格将处理后的类名数组重新组合成字符串，设置回元素的 className
  targetElement.className = Array.from(classSet).join(' ');
}
// 判断元素是否存在指定类名
export function hasClass(element: HTMLElement | Element, name: string): boolean {
  // 检查 element 是否为 null 或 undefined
  if (!element) return false;

  // 创建正则表达式来检测类名是否存在
  const reg = new RegExp(`(^|\\s)${name}(\\s|$)`);

  // 使用正则表达式的 test 方法检查 className 中是否含有指定的 name
  return reg.test(element.className);
}
// 获取由基本数据类型组成的数组交集
export function intersection(...args: any[]) {
  return args.reduce((prev, curr) => prev.filter((item: any) => curr.includes(item)));
}
// 判断一个数组中是否包含了另一个由基本数据类型组成的数组中的全部元素
export function isIncludeAllChildren(parent: any[], child: any[]): boolean {
  return child.every((element) => parent.includes(element));
}
// 从数组中获取指定 key 组成的新数组，会去重也会去除不存在的值
export function getKeyList(arr: any, key: string, duplicates = true): any[] {
  let result: any[] = [];

  for (const item of arr) {
    // 检查对象中是否存在 key，并且值不为 undefined 或 null
    if (key in item && item[key] !== undefined && item[key] !== null) {
      result.push(item[key]);
    }
  }

  // 如果 duplicates 为 true，则去重
  if (duplicates) {
    result = Array.from(new Set(result));
  }

  return result;
}
