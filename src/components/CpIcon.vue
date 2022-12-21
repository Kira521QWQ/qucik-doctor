<script setup lang="ts">
// 封装svg icon 路径名
defineProps<{
  name: string;
}>();
</script>
<template>
  <svg aria-hidden="true" class="cp-icon">
    <use :href="`#icon-${name}`" />
  </svg>
</template>
<style lang="scss" scoped>
.cp-icon {
  // 更好的封装方式，把icon大小也对外暴露出去，通过 props
  // 和字体一样大
  width: 1em;
  height: 1em;
}
</style>
