<script setup lang="ts">
import { onMounted, ref } from 'vue';

const openid = ref('');
onMounted(() => {
  // 用qq封装好的方法，我们在index页面中注入的 src="https://connect.qq.com/qc_jssdk.js"
  // qq 来检查我们刚才扫码登录是否成功
  if (window.QC.Login.check()) {
    // 获取openid
    window.QC.Login.getMe((id) => {
      console.log('openid', id);
      openid.value = id;
    });
  }
});
</script>

<template>
  <div>我是本地的登录回调页面!!! {{ openid }}</div>
</template>

<style lang="scss" scoped></style>
