<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { getConsultOrderPre, createConsultOrder } from '@/services/consult';
import { getPatient } from '@/services/user';
import type { ConsultOrderPreData } from '@/types/consult';
import { useConsultStore } from '@/stores/consult';
import { Toast } from 'vant';
import type { Patient } from '@/types/user';

const consultStore = useConsultStore();

// 支付信息
const payInfo = ref<ConsultOrderPreData>();
// 获取订单准备数据方法
const loadPayInfo = async () => {
  // 类型收缩
  if (consultStore.consult.type === undefined || consultStore.consult.illnessType === undefined) {
    return Toast('缺少就诊类型信息');
  }
  // 发请求
  const res = await getConsultOrderPre(consultStore.consult.type, consultStore.consult.illnessType);
  console.log('订单准备res', res);
  // 赋值给页面
  payInfo.value = res;
  // 保存到store
  consultStore.setCoupon(payInfo.value.couponId);
};

//
const patient = ref<Patient>();
// 获取患者信息
const loadPatient = async () => {
  if (!consultStore.consult.patientId) return Toast('缺少患者id');
  const res = await getPatient(consultStore.consult.patientId);
  console.log('患者信息', res);
  // 设置页面数据
  patient.value = res;
};

const patientValue = computed(() => {
  return patient.value?.name + ' | ' + patient.value?.genderValue + ' | ' + patient.value?.age;
});

// 底部支付显示
const show = ref(false);
// 用户是否选择同意支付
const agree = ref(false);
// 支付类型
const paymentMethod = ref<0 | 1>();
// 订单id
const orderId = ref('');

// 1、防抖，防止重复点击生成多个订单
const loading = ref(false);

// 2、订单成功后清空store信息，设置订单id
// 3、异常处理

const submit = async () => {
  // 1、判断用户是否同意
  if (!agree.value) return Toast('请同意支付协议');
  // 生成订单的优化处理

  try {
    // 生成订单
    // 防抖状态设置（极限情况下还是可能生成多次点击）
    loading.value = true;
    const res = await createConsultOrder(consultStore.consult);
    console.log('生成订单结果', res);
    // 这里没有异常走的流程
    loading.value = false;
    // 设置订单数据
    orderId.value = res.id;
    // 清空store
    // consultStore.clear();
    // 控制支付选项的显示
    show.value = true;
  } catch (error) {
    // 如果发生了异常支付按钮要回到正常状态
    loading.value = false;
  }
};

onMounted(() => {
  // 预支付信息
  loadPayInfo();
  // 患者信息
  loadPatient();
});
</script>

<template>
  <div class="consult-pay" v-if="payInfo">
    <CpNavBar title="支付" />
    <!-- 支付信息 -->
    <div class="pay-info">
      <p class="tit">图文问诊 {{ payInfo.payment }} 元</p>
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p class="desc">
        <span>极速问诊</span>
        <span>自动分配医生</span>
      </p>
    </div>
    <!-- 优惠券信息 -->
    <van-cell-group>
      <van-cell title="优惠券" :value="`-¥${payInfo.couponDeduction}`" />
      <van-cell title="积分抵扣" :value="'-¥' + payInfo.pointDeduction" />
      <van-cell title="实付款" :value="`-¥${payInfo.actualPayment}`" class="pay-price" />
    </van-cell-group>
    <div class="pay-space"></div>

    <!-- 患者信息 -->
    <van-cell-group>
      <!-- <van-cell
        title="患者信息"
        :value="`${patient?.name} | ${patient?.genderValue} | ${patient?.age}岁`"
      ></van-cell> -->
      <!-- 用计算属性 -->
      <van-cell title="患者信息" :value="patientValue"></van-cell>
      <van-cell title="病情描述" :label="consultStore.consult.illnessDesc"></van-cell>
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox v-model="agree">我已同意 <span class="text">支付协议</span></van-checkbox>
    </div>

    <!-- 底部支付栏 -->
    <van-submit-bar
      button-type="primary"
      :price="payInfo.actualPayment * 100"
      :loading="loading"
      button-text="立即支付"
      text-align="left"
      @click="submit"
    />

    <!-- 支付选项 -->
    <van-action-sheet v-model:show="show" title="选择支付方式">
      <div class="pay-type">
        <p class="amount">¥ {{ payInfo.actualPayment.toFixed(2) }}</p>
        <van-cell-group>
          <van-cell title="微信支付" @click="paymentMethod = 0">
            <template #icon><cp-icon name="consult-wechat" /></template>
            <template #extra><van-checkbox :checked="paymentMethod === 0" /></template>
          </van-cell>
          <van-cell title="支付宝支付" @click="paymentMethod = 1">
            <template #icon><cp-icon name="consult-alipay" /></template>
            <template #extra><van-checkbox :checked="paymentMethod === 1" /></template>
          </van-cell>
        </van-cell-group>
        <div class="btn">
          <van-button type="primary" round block>立即支付</van-button>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<style lang="scss" scoped>
.consult-pay {
  padding-bottom: 50px;
  // 支付信息
  .pay-info {
    display: flex;
    padding: 15px;
    flex-wrap: wrap;
    align-items: center;
    .tit {
      width: 100%;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .img {
      margin-right: 10px;
      width: 38px;
      height: 38px;
      border-radius: 4px;
      overflow: hidden;
    }
    .desc {
      flex: 1;
      > span {
        display: block;
        color: var(--cp-tag);
        &:first-child {
          font-size: 16px;
          color: var(--cp-text2);
        }
      }
    }
  }
  // 优惠券信息
  .pay-price {
    ::v-deep() {
      .vam-cell__title {
        font-size: 16px;
      }
      .van-cell__value {
        font-size: 16px;
        color: var(--cp-price);
      }
    }
  }
  .pay-space {
    height: 12px;
    background-color: var(--cp-bg);
  }
  // 患者信息
  .pay-schema {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    .text {
      color: var(--cp-primary);
    }
  }
  // 底部支付栏
  ::v-deep() {
    .van-submit-bar__button {
      font-weight: normal;
      width: 160px;
    }
  }

  // 支付方式
  .pay-type {
    .amount {
      padding: 20px;
      text-align: center;
      font-size: 16px;
      font-weight: bold;
    }
    .btn {
      padding: 15px;
    }
    .van-cell {
      align-items: center;
      .cp-icon {
        margin-right: 10px;
        font-size: 18px;
      }
      .van-checkbox :deep(.van-checkbox__icon) {
        font-size: 16px;
      }
    }
  }
}
</style>
