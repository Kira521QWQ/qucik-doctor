// 导入我们自定义的组件
import CpNavBar from '@/components/CpNavBar.vue';
import CpIcon from '@/components/CpIcon.vue';

// 注册到全局组件
declare module 'vue' {
  // TS 接口可以重复定义，效果是同名的接口内部的类型合并
  interface GlobalComponents {
    CpNavBar: typeof CpNavBar;
    CpIcon: typeof CpIcon;
  }
}
