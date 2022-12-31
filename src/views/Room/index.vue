<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
// 导入 socket.io
import { io, type Socket } from 'socket.io-client';
import { baseURL } from '@/utils/request';
import { useUserStore } from '@/stores/user';
import { useRoute } from 'vue-router';
import RoomStatus from './RoomStatus.vue';
import RoomAction from './RoomAction.vue';
import RoomMessage from './RoomMessage.vue';
import type { Data } from '@/types/user';
import type { TimeMessages, Message } from '@/types/room';
import { MsgType } from '@/enums';

// 创建 store 实例
const userStore = useUserStore();
// 创建route 实例
const route = useRoute();
// 创建 socket 对象变量
let socket: Socket;

// 消息列表数据变量
const list = ref<Message[]>([]);

// 在组件加载完毕后建立socket连接
onMounted(() => {
  socket = io(baseURL, {
    auth: {
      // 认证用户
      token: `Bearer ${userStore.user?.token}`,
    },
    query: {
      // 你和谁聊的天
      orderId: route.query.orderId,
    },
  });
  // 通用事件监听
  socket.on('connect', () => {
    console.log('socket 连接成功');
  });
  socket.on('error', (error) => {
    console.log('socket 发生错误', error);
  });
  socket.on('disconnect', () => {
    console.log('socket 断开连接');
  });

  // 具体业务事件的监听
  // socket.on('chatMsgList', (event: Data<TimeMessages[]>) => {
  // socket.on('chatMsgList', ({ data }: { data: TimeMessages[] }) => {
  socket.on(
    'chatMsgList',
    ({ data, code, message }: { data: TimeMessages[]; code: number; message: string }) => {
      console.log('问诊室接通', data, code, message);
      // 列表消息处理
      const arr: Message[] = [];
      data.forEach((item) => {
        // 创建一个时间消息
        const timeMsg = {
          id: item.createTime,
          createTime: item.createTime,
          msgType: MsgType.Notify,
          msg: {
            content: item.createTime,
          },
        };

        arr.push(timeMsg, ...item.items);
        // 消息列表，数据的追加，只能是往前。
        list.value.unshift(...arr);
        console.log('list.value', list.value);
      });
    }
  );
});

// 组件卸载断开连接
onUnmounted(() => {
  console.log('=========');
  socket.close();
});
</script>

<template>
  <div class="room">
    <CpNavBar title="问诊室" />
    <RoomStatus />
    <RoomMessage :list="list" />
    <RoomAction />
  </div>
</template>

<style lang="scss" scoped>
.room {
  padding-top: 50px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
