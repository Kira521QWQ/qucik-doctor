<script setup lang="ts">
import { ref, onUnmounted, onMounted } from 'vue';
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

let ws: WebSocket;
const msg = ref('');
const txt = ref('');
// 建立 webscoket 连接
onMounted(() => {
  ws = new WebSocket('ws://121.40.165.18:8800');

  ws.addEventListener('open', () => {
    console.log('连接建立');
    // 发送消息
    ws.send('Hello WebSockets!');
  });

  // 接受消息事件
  ws.onmessage = function (evt) {
    console.log('接收到的消息: ' + evt.data);
    msg.value = msg.value + evt.data;
    // 关闭连接
    // ws.close();
  };
  // 关闭连接事件
  ws.onclose = function (evt) {
    console.log('连接断开');
  };
});
</script>

<template>
  <div>测试用路由</div>
  <button @click="getUserInfo">发起一个token过期的请求</button>
  <h2>{{ counter }}</h2>
  <button @click="startCounter">开启倒计时</button>
  <hr />
  <!-- <div>{{ msg }}</div> -->
  <div v-html="msg" />
  <input v-model="txt" />
  <button @click="ws.send(txt)">发送消息</button>
</template>

<style lang="scss" scoped></style>
