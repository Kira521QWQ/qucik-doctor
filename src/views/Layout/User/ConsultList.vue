<script setup lang="ts">
import { ref } from 'vue';
import ConsultItem from './ConsultItem.vue';
import type { ConsultOrderListParams, ConsultOrderItem } from '@/types/consult';
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
const list = ref<ConsultOrderItem[]>([]);

// van-list 属性
const loading = ref(false);
const finished = ref(false);
const onLoad = async () => {
  console.log('请求数据');
  const res = await getConsultOrderList(params.value);
  console.log('订单列表数据', res);
  list.value.push(...res.rows);
  //   console.log(typeof list.value[0], list.value[0]);
  //   console.log(typeof res.rows[0], res.rows[0]);
  //   console.log(list.value[0] === res.rows[0]);
  // 效果和上面一样
  //   list.value = [...list.value, ...res.rows];
  //   console.log('list.value', list.value);
  //   console.log(list.value[0]);
  //   console.log(typeof list.value[0]);

  // 判断列表是否还有更多数据
  if (params.value.current < res.pageTotal) {
    // 数据还没有请求完毕，页码增1
    params.value.current += 1;
  } else {
    finished.value = true;
  }
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
      <ConsultItem v-for="item in list" :key="item.id" :item="item" />
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.consult-list {
  padding: 10px;
}
</style>
