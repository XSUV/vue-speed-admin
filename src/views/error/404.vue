<script setup lang="ts">
import Error from './error.vue';

defineOptions({
  name: '404',
});
</script>

<template>
  <Error code="404" msg="抱歉，你访问的页面不存在" />
</template>
