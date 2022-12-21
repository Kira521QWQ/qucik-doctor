// 导入创建 store 的函数
import { defineStore } from 'pinia';
import { ref } from 'vue';

// 创建获取store的函数
export const useUserStore = defineStore('cp-user', () => {
  // 保存user对象的 state
  const user = ref(null);

  // 保存用户信息的函数
  const setUser = (u: any) => {
    user.value = u;
  };

  // 函数用户信息的函数
  const delUser = () => {
    user.value = null;
  };

  return { user, setUser, delUser };
});
