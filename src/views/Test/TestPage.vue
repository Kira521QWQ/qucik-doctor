<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { instance as request } from '@/utils/request';

const counter = ref(10);
// 变化的并且是非响应式的
let timerId: number;
const startCounter = () => {
  // 开启倒计时
  // 重置时间
  counter.value = 10;
  // 1 清
  window.clearInterval(timerId);
  timerId = window.setInterval(() => {
    counter.value -= 1;
    // 到点了再清
    if (counter.value <= 5) {
      // 2 清
      window.clearInterval(timerId);
    }
  }, 1000);
};
onUnmounted(() => {
  // 3 清
  window.clearInterval(timerId);
});

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
  <h2>{{ counter }}</h2>
  <button @click="startCounter">开启倒计时</button>
</template>

<style lang="scss" scoped></style>
