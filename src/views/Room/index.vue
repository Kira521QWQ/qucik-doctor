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
import type { ConsultOrderItem } from '@/types/consult';
import { MsgType, OrderType } from '@/enums';
import { getConsultOrderDetail } from '@/services/consult';

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

  // 订单状态变化事件
  socket.on('statusChange', async (event) => {
    console.log('statusChange', event);
    // 重新获取订单详情
    const res = await getConsultOrderDetail(route.query.orderId as string);
    console.log('订单状态发生变化，订单详情', res);
    consult.value = res;
  });

  // 监听消息事件
  socket.on('receiveChatMsg', (event: Message) => {
    console.log('客户端接收到的消息', event);
    // 设置到页面中
    list.value.push(event);
  });
});

// 组件卸载断开连接
onUnmounted(() => {
  console.log('=========');
  socket.close();
});

// 获取订单详情
const consult = ref<ConsultOrderItem>();
onMounted(async () => {
  // 发请求
  const res = await getConsultOrderDetail(route.query.orderId as string);
  console.log('页面订单详情', res);
  consult.value = res;
});

// 发送聊天消息到服务器
const sendText = (text: string) => {
  console.log('要发送给服务器的聊天内容', text);
  // 使用websocket发送消息
  socket.emit('sendChatMsg', {
    from: userStore.user?.id, // 谁发的
    to: consult.value?.docInfo?.id, // 发给接诊的医生
    msgType: MsgType.MsgText, // 消息类型
    msg: {
      content: text,
    },
  });
};
</script>

<template>
  <div class="room">
    <CpNavBar title="问诊室" />
    <RoomStatus :status="consult?.status" :countdown="consult?.countdown" />
    <RoomMessage :list="list" />
    <RoomAction :disabled="consult?.status !== OrderType.ConsultChat" @send-text="sendText" />
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
