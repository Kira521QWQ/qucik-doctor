<script lang="ts" setup>
import { ref } from 'vue';
import type { Doctor } from '@/types/consult';
import { followDoctor } from '@/services/consult';

defineProps<{
  doctor: Doctor;
}>();

// 定义关注请求状态
const loading = ref(false);

// 关注的事件处理函数
const follow = async (doctor: Doctor) => {
  // 开始前，设置按钮的loading状态
  loading.value = true;
  // 发起关注请求
  await followDoctor(doctor.id);
  // 关注成功
  loading.value = false;
  // 修改关注状态，原来是+关注=》已关注，原来状态的取反
  doctor.likeFlag = doctor.likeFlag === 1 ? 0 : 1;
};
</script>
<template>
  <div class="doctor-item">
    <van-image round :src="doctor.avatar" />
    <p class="name">{{ doctor.name }}</p>
    <p class="van-ellipsis">{{ doctor.hospitalName }} {{ doctor.depName }}</p>
    <p>{{ doctor.positionalTitles }}</p>
    <van-button :loading="loading" round size="small" type="primary" @click="follow(doctor)">
      {{ doctor.likeFlag === 1 ? '已关注' : '+ 关注' }}
    </van-button>
  </div>
</template>
<style scoped lang="scss">
.doctor-item {
  width: 135px;
  height: 190px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0px 0px 11px 0px rgba(229, 229, 229, 0.2);
  text-align: center;
  padding: 15px;
  margin-left: 15px;
  display: inline-block;
  box-sizing: border-box;
  > .van-image {
    width: 58px;
    height: 58px;
    vertical-align: top;
    border-radius: 50%;
    margin: 0 auto 8px;
  }
  > p {
    margin-bottom: 0;
    font-size: 11px;
    color: var(--cp-tip);
    &.name {
      font-size: 13px;
      color: var(--cp-text1);
      margin-bottom: 5px;
    }
  }
  > .van-button {
    padding: 0 12px;
    height: 28px;
    margin-top: 8px;
    width: 72px;
  }
}
</style>
