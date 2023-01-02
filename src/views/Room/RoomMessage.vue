<script setup lang="ts">
import { MsgType } from '@/enums';
import { ImagePreview } from 'vant';
import type { Message } from '@/types/room';
import { useUserStore } from '@/stores/user';

// userStore 实例
const userStore = useUserStore();

defineProps<{
  list: Message[];
}>();

const timeMap = {
  1: '一周内',
  2: '一月内',
  3: '半年内',
  4: '大于半年',
};
// 病情历史
const flagMap = {
  0: '就诊过',
  1: '没就诊过',
};

// 图片预览函数
const previewImage = (pics?: { id: string; url: string }[]) => {
  if (!pics || pics.length === 0) return;
  console.log(pics);
  ImagePreview(pics.map((item) => item.url));
};

const flagFn = (flag: any) => {
  if (flag === 0) {
    return '就诊过';
  } else {
    return '没就诊过';
  }
};

const formatTime = (time: string) => {
  // 格式化处理日期
  return time;
};
</script>

<template>
  <template v-for="{ id, msgType, msg, from, createTime, fromAvatar } in list" :key="id">
    <!-- 通知 -->
    <div class="msg msg-tip" v-if="msgType === MsgType.Notify">
      <div class="content">
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <!-- 病情描述 -->
    <div class="msg msg-illness" v-if="msgType === MsgType.CardPat">
      <div class="patient van-hairline--bottom">
        <p>
          {{ msg.consultRecord?.patientInfo.name }}
          {{ msg.consultRecord?.patientInfo.genderValue }}
          {{ msg.consultRecord?.patientInfo.age }}岁
        </p>
        <p>
          {{ msg.consultRecord?.illnessTime && timeMap[msg.consultRecord?.illnessTime] }} |
          <!-- {{ msg.consultRecord?.consultFlag && flagMap[msg.consultRecord?.consultFlag] }} -->
          {{ flagFn(msg.consultRecord?.consultFlag) }}
        </p>
      </div>
      <van-row>
        <van-col span="6">病情描述</van-col>
        <van-col span="18">{{ msg.consultRecord?.illnessDesc }}</van-col>
        <van-col span="6">图片</van-col>
        <van-col span="18" @click="previewImage(msg.consultRecord?.pictures)">点击查看</van-col>
      </van-row>
    </div>

    <!-- 温馨提示-通知 -->
    <div class="msg msg-tip" v-if="msgType === MsgType.NotifyTip">
      <div class="content">
        <span class="green">温馨提示：</span>
        <span>{{ msg.content }}</span>
      </div>
    </div>

    <!-- 发送文字-我自己的消息 -->
    <div class="msg msg-to" v-if="msgType === MsgType.MsgText && userStore.user?.id === from">
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <div class="pao">{{ msg.content }}</div>
      </div>
      <!-- 用自己的头像 -->
      <van-image :src="userStore.user?.avatar" />
    </div>

    <!-- 发送文字-接收到消息 -->
    <div class="msg msg-from" v-if="msgType === MsgType.MsgText && userStore.user?.id !== from">
      <!-- 服务器端目前返回数据有问题 -->
      <!-- <van-image :src="fromAvatar" /> -->
      <!-- 先用本地图片代替 -->
      <img style="width: 38px; height: 38px" src="@/assets/avatar-doctor.svg" />
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <div class="pao">{{ msg.content }}</div>
      </div>
    </div>

    <!-- 发送图片-自己发送的 -->
    <div class="msg msg-to" v-if="msgType === MsgType.MsgImage && userStore.user?.id === from">
      <div class="content">
        <div class="time">{{ createTime }}</div>
        <van-image fit="contain" :src="msg.picture?.url" />
      </div>
      <van-image :src="fromAvatar" />
    </div>
    <!-- 发送图片-对方发送的 -->
    <div class="msg msg-from" v-if="msgType === MsgType.MsgImage && userStore.user?.id !== from">
      <!-- <van-image :src="fromAvatar" /> -->
      <img style="width: 38px; height: 38px" src="@/assets/avatar-doctor.svg" />
      <div class="content">
        <div class="time">{{ createTime }}</div>
        <van-image fit="contain" :src="msg.picture?.url" />
      </div>
    </div>

    <!-- 处方消息 -->
    <div class="msg msg-recipe" v-if="msgType === MsgType.CardPre">
      <div class="content">
        <div class="head van-hairline--bottom">
          <div class="head-tit">
            <h3>电子处方</h3>
            <p>原始处方 <van-icon name="arrow"></van-icon></p>
          </div>
          <p>
            {{ msg.prescription?.name }} {{ msg.prescription?.genderValue }}
            {{ msg.prescription?.age }}岁 {{ msg.prescription?.diagnosis }}
          </p>
          <p>开方时间：{{ msg.prescription?.createTime }}</p>
        </div>
        <div class="body">
          <div class="body-item" v-for="item in msg.prescription?.medicines" :key="item.id">
            <div class="durg">
              <p>{{ item.name }} {{ item.specs }}</p>
              <p>{{ item.usageDosag }}</p>
            </div>
            <div class="num">x{{ item.quantity }}</div>
          </div>
        </div>
        <div class="foot"><span>购买药品</span></div>
      </div>
    </div>
  </template>

  <!-- 通知 -->
  <!-- <div class="msg msg-tip">
    <div class="content">
      <span>医护人员正在赶来，请耐心等候</span>
    </div>
  </div> -->

  <!-- 订单取消 -->
  <!-- <div class="msg msg-tip msg-tip-cancel">
    <div class="content">
      <span>订单取消</span>
    </div>
  </div> -->
</template>

<style lang="scss" scoped>
.msg {
  display: flex;
  padding: 15px;
  // 医生消息+图片
  &-from {
    .content {
      max-width: 240px;
      min-width: 52px;
      .time {
        color: var(--cp-tip);
        margin-bottom: 5px;
      }
      .pao {
        padding: 15px;
        background-color: #fff;
        color: var(--cp-text3);
        font-size: 15px;
        border-radius: 8px;
        position: relative;
        &::before {
          content: '';
          position: absolute;
          left: -13px;
          top: 10px;
          width: 13px;
          height: 16px;
          background: #fff;
          border-top-left-radius: 13px 3px;
        }
        &::after {
          content: '';
          position: absolute;
          left: -13px;
          top: 13px;
          width: 13px;
          height: 13px;
          background: var(--cp-bg);
          border-top-right-radius: 13px 13px;
        }
      }
      .van-image {
        max-height: 160px;
        max-width: 160px;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid var(--cp-line);
      }
    }
    > .van-image {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 13px;
    }
  }
  // 患者消息+图片
  &-to {
    justify-content: flex-end;
    .content {
      max-width: 240px;
      min-width: 52px;
      .time {
        color: var(--cp-tip);
        margin-bottom: 5px;
        text-align: right;
      }
      .pao {
        padding: 15px;
        background-color: var(--cp-primary);
        color: #fff;
        font-size: 15px;
        border-radius: 8px;
        position: relative;
        &::before {
          content: '';
          position: absolute;
          right: -13px;
          top: 10px;
          width: 13px;
          height: 16px;
          background: var(--cp-primary);
          border-top-right-radius: 13px 3px;
        }
        &::after {
          content: '';
          position: absolute;
          right: -13px;
          top: 13px;
          width: 13px;
          height: 13px;
          background: var(--cp-bg);
          border-top-left-radius: 13px 13px;
        }
      }
      .van-image {
        max-height: 160px;
        max-width: 160px;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid var(--cp-line);
      }
    }
    > .van-image {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      overflow: hidden;
      margin-left: 13px;
    }
  }
  &-tip {
    justify-content: center;
    font-size: 12px;
    .content {
      height: 34px;
      line-height: 34px;
      background-color: #fff;
      color: var(--cp-tip);
      font-size: 12px;
      border-radius: 17px;
      padding: 0 16px;
      max-width: 100%;
      .green {
        color: var(--cp-primary);
      }
    }
    &-cancel {
      .content {
        background-color: #ededed;
      }
    }
  }
  &-illness {
    display: block;
    background-color: #fff;
    margin: 15px;
    border-radius: 8px;
    font-size: 12px;
    .patient {
      padding-bottom: 15px;
      margin-bottom: 15px;
      > p {
        &:first-child {
          font-size: 16px;
        }
        &:last-child {
          margin-top: 5px;
          color: var(--cp-tip);
        }
      }
    }
    .van-col {
      &:nth-child(-n + 2) {
        margin-bottom: 5px;
      }
      &:nth-child(2n) {
        color: var(--cp-tip);
      }
    }
  }
  &-recipe {
    padding: 15px;
    .content {
      background-color: #fff;
      border-radius: 8px;
      color: var(--cp-tip);
      font-size: 12px;
      flex: 1;
      .head {
        padding: 15px;
        .head-tit {
          display: flex;
          justify-content: space-between;
          > h3 {
            font-weight: normal;
            font-size: 16px;
            color: var(--cp-text1);
          }
        }
        p {
          margin-top: 5px;
        }
      }
      .body {
        padding: 15px 15px 0 15px;
        &-item {
          display: flex;
          margin-bottom: 15px;
          .durg {
            flex: 1;
            > p {
              &:first-child {
                font-size: 14px;
                color: var(--cp-text1);
                margin-bottom: 5px;
              }
            }
          }
          .num {
            color: var(--cp-text1);
          }
        }
      }
      .foot {
        background-color: var(--cp-plain);
        color: var(--cp-primary);
        font-size: 16px;
        text-align: center;
        height: 42px;
        line-height: 42px;
      }
    }
  }
}
</style>
