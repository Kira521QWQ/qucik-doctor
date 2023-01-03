<script setup lang="ts">
import ConsultList from './ConsultList.vue';
</script>

<template>
  <div class="consult">
    <CpNavBar title="问诊记录" />
    <van-tabs sticky>
      <van-tab title="极速问诊"><ConsultList type="2" /></van-tab>
      <van-tab title="找医生"><ConsultList type="1" /></van-tab>
      <van-tab title="开药问诊"><ConsultList type="3" /></van-tab>
    </van-tabs>
  </div>
</template>

<style lang="scss" scoped>
.consult {
  background-color: var(--cp-bg);
  //   min-height: calc(100vh - 46px);
  min-height: 100vh;
}
</style>
