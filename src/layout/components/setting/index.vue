<script setup lang="ts">
import { ref, unref, reactive, nextTick, onBeforeMount } from 'vue';
import panel from '../panel/index.vue';
import { emitter } from '@/utils/mitt';

import { useMultiTagsStoreHook } from '@/store/modules/multiTags';
import { useDataThemeChange } from '@/layout/hooks/useDataThemeChange';
import { useGlobal } from '@/utils/tools';

const { $storage } = useGlobal<GlobalPropertiesApi>();

const { toggleClass } = useDataThemeChange();

const logoVal = ref($storage.configure?.showLogo ?? true);

const settings = reactive({
  greyVal: $storage.configure.grey,
  weakVal: $storage.configure.weak,
  tabsVal: $storage.configure.hideTabs,
  showLogo: $storage.configure.showLogo,
  showModel: $storage.configure.showModel,
  hideFooter: $storage.configure.hideFooter,
  multiTagsCache: $storage.configure.multiTagsCache,
  stretch: $storage.configure.stretch,
});

function storageConfigureChange<T>(key: string, val: T): void {
  const storageConfigure = $storage.configure;
  storageConfigure[key] = val;
  $storage.configure = storageConfigure;
}

/** 灰色模式设置 */
const greyChange = (value): void => {
  const htmlEl = document.querySelector('html');
  toggleClass(settings.greyVal, 'html-grey', htmlEl);
  storageConfigureChange('grey', value);
};

/** 色弱模式设置 */
const weekChange = (value): void => {
  const htmlEl = document.querySelector('html');
  toggleClass(settings.weakVal, 'html-weakness', htmlEl);
  storageConfigureChange('weak', value);
};

/** 隐藏标签页设置 */
const tagsChange = () => {
  const showVal = settings.tabsVal;
  storageConfigureChange('hideTabs', showVal);
  emitter.emit('tagViewsChange', showVal as unknown as string);
};

/** 隐藏页脚设置 */
const hideFooterChange = () => {
  const { hideFooter } = settings;
  storageConfigureChange('hideFooter', hideFooter);
};

/** 标签页持久化设置 */
const multiTagsCacheChange = () => {
  const { multiTagsCache } = settings;
  storageConfigureChange('multiTagsCache', multiTagsCache);
  useMultiTagsStoreHook().multiTagsCacheChange(multiTagsCache);
};

/** 侧边栏Logo */
function logoChange() {
  unref(logoVal)
    ? storageConfigureChange('showLogo', true)
    : storageConfigureChange('showLogo', false);
  emitter.emit('logoChange', unref(logoVal));
}

onBeforeMount(() => {
  /* 初始化系统配置 */
  nextTick(() => {
    settings.greyVal && document.querySelector('html')?.classList.add('html-grey');
    settings.weakVal && document.querySelector('html')?.classList.add('html-weakness');
    settings.tabsVal && tagsChange();
    settings.hideFooter && hideFooterChange();
  });
});
</script>

<template>
  <panel>
    <div class="p-5">
      <ul class="setting">
        <li>
          <span class="dark:text-white">灰色模式</span>
          <el-switch
            v-model="settings.greyVal"
            inline-prompt
            active-text="开"
            inactive-text="关"
            @change="greyChange"
          />
        </li>
        <li>
          <span class="dark:text-white">色弱模式</span>
          <el-switch
            v-model="settings.weakVal"
            inline-prompt
            active-text="开"
            inactive-text="关"
            @change="weekChange"
          />
        </li>
        <li>
          <span class="dark:text-white">隐藏标签页</span>
          <el-switch
            v-model="settings.tabsVal"
            inline-prompt
            active-text="开"
            inactive-text="关"
            @change="tagsChange"
          />
        </li>
        <li>
          <span class="dark:text-white">隐藏页脚</span>
          <el-switch
            v-model="settings.hideFooter"
            inline-prompt
            active-text="开"
            inactive-text="关"
            @change="hideFooterChange"
          />
        </li>
        <li>
          <span class="dark:text-white">Logo</span>
          <el-switch
            v-model="logoVal"
            inline-prompt
            :active-value="true"
            :inactive-value="false"
            active-text="开"
            inactive-text="关"
            @change="logoChange"
          />
        </li>
        <li>
          <span class="dark:text-white">页签持久化</span>
          <el-switch
            v-model="settings.multiTagsCache"
            inline-prompt
            active-text="开"
            inactive-text="关"
            @change="multiTagsCacheChange"
          />
        </li>
      </ul>
    </div>
  </panel>
</template>

<style lang="scss" scoped>
:deep(.el-divider__text) {
  font-size: 16px;
  font-weight: 700;
}

:deep(.el-switch__core) {
  --el-switch-off-color: var(--speed-switch-off-color);

  min-width: 36px;
  height: 18px;
}

:deep(.el-switch__core .el-switch__action) {
  height: 14px;
}

.theme-color {
  height: 20px;

  li {
    float: left;
    height: 20px;
    margin-right: 8px;
    cursor: pointer;
    border-radius: 4px;

    &:nth-child(1) {
      border: 1px solid #ddd;
    }
  }
}

.speed-theme {
  display: flex;
  gap: 12px;

  li {
    position: relative;
    width: 46px;
    height: 36px;
    overflow: hidden;
    cursor: pointer;
    background: #f0f2f5;
    border-radius: 4px;
    box-shadow: 0 1px 2.5px 0 rgb(0 0 0 / 18%);

    &:nth-child(1) {
      div {
        &:nth-child(1) {
          width: 30%;
          height: 100%;
          background: #1b2a47;
        }

        &:nth-child(2) {
          position: absolute;
          top: 0;
          right: 0;
          width: 70%;
          height: 30%;
          background: #fff;
          box-shadow: 0 0 1px #888;
        }
      }
    }

    &:nth-child(2) {
      div {
        &:nth-child(1) {
          width: 100%;
          height: 30%;
          background: #1b2a47;
          box-shadow: 0 0 1px #888;
        }
      }
    }

    &:nth-child(3) {
      div {
        &:nth-child(1) {
          width: 100%;
          height: 30%;
          background: #1b2a47;
          box-shadow: 0 0 1px #888;
        }

        &:nth-child(2) {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 30%;
          height: 70%;
          background: #fff;
          box-shadow: 0 0 1px #888;
        }
      }
    }
  }
}

.is-select {
  border: 2px solid var(--el-color-primary);
}

.setting {
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 3px 0;
    font-size: 14px;
  }
}
</style>
