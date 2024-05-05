<script setup lang="ts">
import Error from './error.vue';

defineOptions({
  name: '403',
});
</script>

<template>
  <Error code="403" msg="你没有权限访问该页面" />
</template>
