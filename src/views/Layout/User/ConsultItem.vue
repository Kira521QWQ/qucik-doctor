<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ConsultOrderItem } from '@/types/consult';
import { OrderType } from '@/enums';
import { deleteOrder } from '@/services/consult';
import { Toast } from 'vant';

// 接收类型
const props = defineProps<{
  item: ConsultOrderItem;
}>();

// popover 显示
const show = ref(false);
const actions = computed(() => {
  return [
    { text: '查看处方', disabled: !props.item.prescriptionId },
    { text: '删除订单', disabled: false },
  ];
});
const onSelect = (action: { text: string; disabled?: boolean }, index: number) => {
  console.log('点了', action, index);
  // 更多，用户点击了删除
  if (index === 1) {
    deleteConsultOrder(props.item);
  }
};

// 删除状态
const deleteLoading = ref(false);
// 删除订单的事件处理函数
const deleteConsultOrder = async (item: ConsultOrderItem) => {
  console.log(item);
  if (item.id) {
    // 删除服务器端订单
    try {
      deleteLoading.value = true;
      const res = await deleteOrder(item.id);
      console.log('删除结果2', res);
      Toast('删除成功');
    } catch (error) {
      console.log(error);
      Toast('删除失败');
    } finally {
      deleteLoading.value = false;
    }
  }
};
</script>

<template>
  <div class="consult-item">
    <div class="head van-hairline--bottom">
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p>{{ item.docInfo?.name }}</p>
      <span
        :class="{
          orange: item.status === OrderType.ConsultPay,
          green: item.status === OrderType.ConsultChat,
        }"
        >{{ item.statusValue }}</span
      >
    </div>
    <div class="body">
      <div class="body-row">
        <div class="body-label">病情描述</div>
        <div class="body-value">{{ item.illnessDesc }}</div>
      </div>
      <div class="body-row">
        <div class="body-label">价格</div>
        <div class="body-value">¥ {{ item.payment.toFixed(2) }}</div>
      </div>
      <div class="body-row">
        <div class="body-label">创建时间</div>
        <div class="body-value tip">{{ item.createTime }}</div>
      </div>
    </div>
    <!-- 待支付 -->
    <div class="foot" v-if="item.status === OrderType.ConsultPay">
      <van-button class="gray" plain size="small" round>取消问诊</van-button>
      <van-button type="primary" plain size="small" round :to="`/user/consult/${item.id}`">
        去支付
      </van-button>
    </div>
    <!-- 待接诊 -->
    <div class="foot" v-if="item.status === OrderType.ConsultWait">
      <van-button class="gray" plain size="small" round>取消问诊</van-button>
      <van-button type="primary" plain size="small" round :to="`/room/?orderId=${item.id}`">
        继续沟通
      </van-button>
    </div>
    <!-- 咨询中 -->
    <div class="foot" v-if="item.status === OrderType.ConsultChat">
      <van-button class="gray" plain size="small" round v-if="item.prescriptionId">
        查看处方
      </van-button>
      <van-button type="primary" plain size="small" round :to="`/room/?orderId=${item.id}`">
        继续沟通
      </van-button>
    </div>
    <!-- 已完成 -->
    <div class="foot" v-if="item.status === OrderType.ConsultComplete">
      <div class="more">
        <van-popover
          placement="top-start"
          v-model:show="show"
          :actions="actions"
          @select="onSelect"
        >
          <template #reference>更多</template>
        </van-popover>
      </div>
      <van-button class="gray" plain size="small" round :to="`/room/?orderId=${item.id}`">
        问诊记录
      </van-button>
      <van-button type="primary" plain size="small" round v-if="item.evaluateId">
        写评价
      </van-button>
      <van-button type="primary" plain size="small" round> 查看评价 </van-button>
    </div>
    <!-- 已取消-为支付订单超时了 -->
    <div class="foot" v-if="item.status === OrderType.ConsultCancel">
      <van-button
        class="gray"
        @click="deleteConsultOrder(item)"
        :loading="deleteLoading"
        plain
        size="small"
        round
      >
        删除订单
      </van-button>
      <van-button type="primary" plain size="small" round> 咨询其他医生 </van-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.consult-item {
  border-radius: 4px;
  box-shadow: 0px 0px 22px 0px rgba(245, 245, 245, 0.1);
  background-color: #fff;
  margin-bottom: 10px;
  .head {
    display: flex;
    align-items: center;
    height: 50px;
    padding: 0 15px;
    .img {
      width: 20px;
      height: 20px;
    }
    > p {
      flex: 1;
      font-size: 15px;
      padding-left: 10px;
    }
    > span {
      color: var(--cp-tag);
      &.orange {
        color: #f2994a;
      }
      &.green {
        color: var(--cp-primary);
      }
    }
  }
  .body {
    padding: 15px 15px 8px 15px;
    .body-row {
      display: flex;
      margin-bottom: 7px;
    }
    .body-label {
      width: 62px;
      font-size: 13px;
      color: var(--cp-tip);
    }
    .body-value {
      width: 250px;
      &.tip {
        color: var(--cp-tip);
      }
    }
  }
  .foot {
    padding: 0 15px 15px 15px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .van-button {
      margin-left: 10px;
      padding: 0 16px;
      &.gray {
        color: var(--cp-text3);
        background-color: var(--cp-bg);
      }
    }
    .more {
      color: var(--cp-tag);
      flex: 1;
      font-size: 13px;
    }
  }
}
</style>
