<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { getConsultOrderPre } from '@/services/consult';
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
      <van-cell title="病情描述" label="头痛，头晕，恶心"></van-cell>
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox>我已同意 <span class="text">支付协议</span></van-checkbox>
    </div>

    <!-- 底部支付栏 -->
    <van-submit-bar
      button-type="primary"
      :price="payInfo.actualPayment * 100"
      button-text="立即支付"
      text-align="left"
    />
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
}
</style>