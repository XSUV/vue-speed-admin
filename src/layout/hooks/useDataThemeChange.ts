import { ref } from 'vue';
import { getConfig } from '@/config';
import { useLayout } from './useLayout';
import { removeToken } from '@/utils/auth';
import { routerArrays } from '@/layout/types';
import { router, resetRouter } from '@/router';
import type { themeColorsType } from '../types';
import { useAppStoreHook } from '@/store/modules/app';
import { useGlobal, storageLocal } from '@/utils/tools';
import { useMultiTagsStoreHook } from '@/store/modules/multiTags';

export function useDataThemeChange() {
  const { layoutTheme } = useLayout();
  const themeColors = ref<themeColorsType[]>([
    /* 亮白色 */
    { color: '#ffffff', themeColor: 'light' },
    /* 道奇蓝 */
    { color: '#1b2a47', themeColor: 'default' },
    /* 深紫罗兰色 */
    { color: '#722ed1', themeColor: 'saucePurple' },
    /* 深粉色 */
    { color: '#eb2f96', themeColor: 'pink' },
    /* 猩红色 */
    { color: '#f5222d', themeColor: 'dusk' },
    /* 橙红色 */
    { color: '#fa541c', themeColor: 'volcano' },
    /* 绿宝石 */
    { color: '#13c2c2', themeColor: 'mingQing' },
    /* 酸橙绿 */
    { color: '#52c41a', themeColor: 'auroraGreen' },
  ]);

  const { $storage } = useGlobal<GlobalPropertiesApi>();
  const dataTheme = ref<boolean>($storage?.layout?.darkMode);
  const overallStyle = ref<string>($storage?.layout?.overallStyle);
  const body = document.documentElement as HTMLElement;

  function toggleClass(flag: boolean, clsName: string, target?: HTMLElement) {
    const targetEl = target || document.body;
    let { className } = targetEl;
    className = className.replace(clsName, '').trim();
    targetEl.className = flag ? `${className} ${clsName}` : className;
  }

  /** 清空缓存并返回登录页 */
  function onReset() {
    removeToken();
    storageLocal().clear();
    const { Grey, Weak, MultiTagsCache, Layout } = getConfig();
    useAppStoreHook().setLayout(Layout);

    useMultiTagsStoreHook().multiTagsCacheChange(MultiTagsCache);
    toggleClass(Grey, 'html-grey', document.querySelector('html'));
    toggleClass(Weak, 'html-weakness', document.querySelector('html'));
    router.push('/login');
    useMultiTagsStoreHook().handleTags('equal', [...routerArrays]);
    resetRouter();
  }

  return {
    body,
    dataTheme,
    overallStyle,
    layoutTheme,
    themeColors,
    onReset,
    toggleClass,
  };
}
