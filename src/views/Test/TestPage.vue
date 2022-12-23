<script setup lang="ts">
import { instance as request } from '@/utils/request';

// 要想发起一个错误的请求，把token改一下
const getUserInfo = async () => {
  // get 方法就抛异常了
  const res = await request.get('https://consult-api.itheima.net/patient/myUser');
  // 发生了异常，这里没有执行，这是我们想要的效果
  console.log('请求后，并且没有异常走这里');
};
</script>

<template>
  <div>测试用路由</div>
  <button @click="getUserInfo">发起一个token过期的请求</button>
</template>

<style lang="scss" scoped></style>
