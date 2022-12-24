import 'vue-router';

declare module 'vue-router' {
  // 扩展 元信息类型
  // 接口可以重复定义效果是合并（拓展）
  interface RouteMeta {
    // 标题
    title?: string;
  }
}
