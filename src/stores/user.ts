// 导入创建 store 的函数
import { defineStore } from 'pinia';
import type { User } from '@/types/user';
import { ref } from 'vue';

// 创建获取store的函数
export const useUserStore = defineStore(
  'cp-user',
  () => {
    // 保存user对象的 state
    // const user = ref<User | null>(null);
    // 上面和下面根据你们团队的要求来
    const user = ref<User>();
    // 保存用户信息的函数
    const setUser = (u: User) => {
      user.value = u;
    };

    // 函数用户信息的函数
    const delUser = () => {
      user.value = undefined;
    };

    return { user, setUser, delUser };
  },
  { persist: true }
);
