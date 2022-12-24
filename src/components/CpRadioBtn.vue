<script setup lang="ts">
// 组件动态显示的数据,外部传入的数据
defineProps<{
  options: {
    label: string;
    value: string | number;
  }[];
  modelValue?: string | number;
}>();

// 子组件向父组件传递数据，定义emits
const emits = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();
// 选项被点击的事件处理函数
const toggleItem = (value: string | number) => {
  emits('update:modelValue', value);
};
</script>

<template>
  <div class="cp-radio-btn">
    <a
      class="item"
      :class="{ active: item.value === modelValue }"
      href="javascript:;"
      v-for="item in options"
      :key="item.value"
      @click="toggleItem(item.value)"
      >{{ item.label }}</a
    >
  </div>
</template>

<style lang="scss" scoped>
.cp-radio-btn {
  display: flex;
  flex-wrap: wrap;
  .item {
    height: 32px;
    min-width: 60px;
    line-height: 30px;
    padding: 0 14px;
    text-align: center;
    border: 1px solid var(--cp-bg);
    background-color: var(--cp-bg);
    margin-right: 10px;
    box-sizing: border-box;
    color: var(--cp-text2);
    margin-bottom: 10px;
    border-radius: 4px;
    transition: all 0.3s;
    &.active {
      border-color: var(--cp-primary);
      background-color: var(--cp-plain);
    }
  }
}
</style>
