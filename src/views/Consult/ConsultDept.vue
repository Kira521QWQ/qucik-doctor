<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { FirstDept } from '@/types/consult';
import { getAllDept } from '@/services/consult';

// 左侧一级导航栏选中索引
const active = ref(0);

// 定义数据响应式容器
const list = ref<FirstDept[]>([]);

// 发起请求
onMounted(async () => {
  const res = await getAllDept();
  list.value = res;
  console.log('科室数据', list.value);
});
</script>

<template>
  <div class="consult-dept">
    <CpNavBar title="选择科室" />
    <div class="wrapper">
      <van-sidebar v-model="active">
        <van-sidebar-item v-for="item in list" :title="item.name" :key="item.id" />
      </van-sidebar>
      <div class="sub-dept">
        <router-link to="/consult/illness">科室一</router-link>
        <router-link to="/consult/illness">科室二</router-link>
        <router-link to="/consult/illness">科室三</router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.consult-dept {
  padding-top: 0px;

  .wrapper {
    height: calc(100vh - 46px);
    // overflow: hidden;
    display: flex;

    .van-sidebar {
      width: 114px;
      &-item {
        padding: 14px;
        color: var(--cp-tag);
        &--select {
          color: var(--cp-main);
          font-weight: normal;
          &::before {
            display: none;
          }
        }
      }
    }

    .sub-dept {
      // flex: 1;
      // height: 100%;
      width: 100%;
      overflow-y: auto;
      > a {
        display: block;
        padding: 14px 30px;
        color: var(--cp-dark);
      }
    }
  }
}
</style>
