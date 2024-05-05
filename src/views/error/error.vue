<script setup lang="ts">
import { useRouter } from 'vue-router';
import error from '@/assets/status/error.svg?component';

defineProps({
  code: {
    type: [Number, String],
    default: '404',
  },
  msg: {
    type: String,
    default: '抱歉，你无权访问该页面',
  },
});

const router = useRouter();
</script>

<template>
  <div class="flex justify-center items-center h-[640px]">
    <error />
    <div class="ml-12">
      <p
        v-motion
        class="font-medium text-4xl mb-4 dark:text-white"
        :initial="{
          opacity: 0,
          y: 100,
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 80,
          },
        }"
      >
        {{ code }}
      </p>
      <p
        v-motion
        class="mb-4 text-gray-500"
        :initial="{
          opacity: 0,
          y: 100,
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 120,
          },
        }"
      >
        {{ msg }}
      </p>
      <el-button
        v-motion
        type="primary"
        :initial="{
          opacity: 0,
          y: 100,
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 160,
          },
        }"
        @click="router.push('/')"
      >
        返回首页
      </el-button>
    </div>
  </div>
</template>
