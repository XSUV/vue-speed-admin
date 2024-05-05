<script setup lang="ts">
import Error from './error.vue';

defineOptions({
  name: '500',
});
</script>

<template>
  <Error code="500" msg="抱歉，服务器出错了" />
</template>
