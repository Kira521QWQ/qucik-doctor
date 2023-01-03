<script setup lang="ts">
import { ref } from 'vue';
import ConsultItem from './ConsultItem.vue';
import type { ConsultOrderListParams } from '@/types/consult';
import { getConsultOrderList } from '@/services/consult';

// 接收数据的定义
const props = defineProps<{ type: 1 | 2 | 3 }>();

// 列表查询参数
const params = ref<ConsultOrderListParams>({
  type: props.type,
  current: 1, // 第几页
  pageSize: 5, // 每页几条数据
});

// 订单列表
const list = ref();

// van-list 属性
const loading = ref(false);
const finished = ref(false);
const onLoad = async () => {
  console.log('请求数据');
  //   setTimeout(() => {
  //     list.value = [1, 2, 3, 4, 5];
  //     loading.value = false;
  //   }, 2000);
  const res = await getConsultOrderList(params.value);
  console.log('订单列表数据', res);
  list.value = res.rows;
  loading.value = false;
};
</script>

<template>
  <div class="consult-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <ConsultItem v-for="i in list" :key="i" />
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.consult-list {
  padding: 10px;
}
</style>
