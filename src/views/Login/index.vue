<script setup lang="ts">
// 父组件绑定子组件暴露的事件处理函数
const onClickRight = () => {
  console.log('右侧点击，父组件执行的事件处理函数');
};
</script>

<template>
  <div>
    <CpNavBar title="登录" rightText="注册" @click-right="onClickRight" />
  </div>
</template>

<style scoped></style>
