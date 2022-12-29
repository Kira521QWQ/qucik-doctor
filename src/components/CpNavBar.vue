<script setup lang="ts">
// 导入 vue-router 的组合式 api: useRouter 函数
import { useRouter } from 'vue-router';
import { ref } from 'vue';

// 获取路由实例
const router = useRouter();

const img = ref(null);

// 封装数据
const props = defineProps<{
  title?: string;
  rightText?: string;
  // 还可以传递函数
  back?: (xxx: any) => void;
}>();

// 封装事件，把导航栏右侧按钮的点击事件暴露给父组件
const emits = defineEmits<{
  (e: 'click-right'): void;
}>();
// 右侧点击事件处理函数
const onClickRight = () => {
  console.log('子组件内部执行');
  // 调用父组件绑定的函数
  emits('click-right');
};

// 左侧箭头的事件处理函数
const onClickLeft = () => {
  console.log('左侧箭头点击');
  // 判断是否传递了函数
  if (props.back) {
    // 如果传了函数，则执行父组件传递的函数
    // props.back('导航组件内部处理了一些事情，给你传些数据');
    props.back(img.value);

    return;
  }
  // 返回上一层路由
  router.back();
};
</script>
<template>
  <!-- <input ref="img" /> -->
  <van-nav-bar
    left-arrow
    fixed
    placeholder
    :title="title"
    :right-text="rightText"
    @click-left="onClickLeft"
    @click-right="onClickRight"
  />
</template>
<style lang="scss" scoped>
:deep() {
  // .van-nav-bar {
  //   &__arrow {
  //     font-size: 18px;
  //     color: var(--cp-text1);
  //   }
  //   &__text {
  //     font-size: 15px;
  //   }
  // }
  // 上面最终等价生效的css写法如下
  .van-nav-bar__arrow {
    font-size: 18px;
    color: var(--cp-text1);
  }
  .van-nav-bar__text {
    font-size: 15px;
  }

  // 注意点
  // 如果是在 deep 里修改原来组件的样式，只能写一个类名，下面这中写法无效的
  //   .van-nav-bar .van-icon {
  //   color: red;
  // }
  // 这个写法是有效的
  // .van-icon {
  //   color: red;
  // }
}
</style>
