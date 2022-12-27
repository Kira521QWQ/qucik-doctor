import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Consult } from '@/types/consult';

// 导出极速问诊store
export const useConsultStore = defineStore(
  'cp-consult',
  () => {
    // 极速问诊对象
    const consult = ref<Consult>({});

    // 将来这里补充各种数据以及修改数据的方法
    // 设置问诊类型
    const setType = (type: 1 | 2 | 3) => {
      consult.value.type = type;
    };

    return { consult, setType };
  },
  { persist: true }
);
