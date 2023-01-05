<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue';
import { loginByQQ, unbound, getSMSCode, bindMobile } from '@/services/user';
import type { FormInstance } from 'vant';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import type { User } from '@/types/user';
import { Toast } from 'vant';

const openId = ref('');
// 是否绑定过手机号
const isBind = ref(true);
onMounted(() => {
  // 用qq封装好的方法，我们在index页面中注入的 src="https://connect.qq.com/qc_jssdk.js"
  // qq 来检查我们刚才扫码登录是否成功
  if (window.QC.Login.check()) {
    // 获取openid
    window.QC.Login.getMe((id) => {
      console.log('openId', id);
      openId.value = id;
      //   unbound(id);
      loginByQQ(id)
        .then((succ) => {
          console.log('以前绑定过', succ);
          loginSuccess(succ);
        })
        .catch((err) => {
          console.log('未绑定过', err);
          isBind.value = false;
        });
    });
  }
});

// =================绑定手机号相关代码=====================
// 表单数据
const mobile = ref('');
const code = ref('');

// 表单校验
// 表单校验规则
const mobileRules = [
  { required: true, message: '请输入手机号' },
  { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
];
const codeRules = [
  { required: true, message: '请输入验证码' },
  { pattern: /^\d{6}$/, message: '验证码6个数字' },
];

const counter = ref(0);
const form = ref<FormInstance>();
let timerId: number; // 不需要响应所以没有ref
// 发送验证码事件处理函数
const sendCode = async () => {
  // 如果计时中，返回不响应
  if (counter.value > 0) return;
  console.log('发送验证码开始');
  // 验证手机号字段
  await form.value?.validate('mobile');
  console.log('手机号验证成功');
  // 开启倒计时
  console.log('开启倒计时');
  counter.value = 10;
  window.clearInterval(timerId);
  timerId = window.setInterval(() => {
    counter.value -= 1;
    if (counter.value <= 0) {
      window.clearInterval(timerId);
      console.log('清空了定时器', timerId);
    }
  }, 1000);
  // 通知服务器发送验证码
  const res = await getSMSCode(mobile.value, 'bindMobile');
  console.log('验证码获取结果', res);
};
// 生命周期函数
onUnmounted(() => {
  // 组件卸载时清理定时器
  window.clearInterval(timerId);
});

// 登录成功
const userStore = useUserStore();
const router = useRouter();
const loginSuccess = (data: User) => {
  userStore.setUser(data);
  router.replace('/user');
  Toast.success('登录成功');
};

// 绑定手机号
const bind = async () => {
  console.log('发起绑定请求');
  const res = await bindMobile({ mobile: mobile.value, code: code.value, openId: openId.value });
  console.log('绑定结果', res);
  // 用户信息保存/页面跳转/提示用户
  loginSuccess(res);
};
</script>

<template>
  <div class="login-bind" v-if="!isBind">
    <CpNavBar title="手机号绑定" />
    <div class="login-head">
      <span class="title">手机号绑定</span>
    </div>
    <div class="login-form">
      <van-form autocomplete="off" ref="form" @submit="bind">
        <van-field
          name="mobile"
          v-model="mobile"
          :rules="mobileRules"
          placeholder="请输入手机号"
        ></van-field>
        <van-field name="code" v-model="code" :rules="codeRules" placeholder="请输入验证码">
          <template #button>
            <span :class="['btn-send', counter > 0 ? 'disabled' : '']" @click="sendCode">
              {{ counter > 0 ? counter + 's后再次发送' : '发送验证码' }}
            </span>
          </template>
        </van-field>
        <div class="cp-cell">
          <van-button block round type="primary" native-type="submit"> 立即绑定 </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-bind {
  // 登录方式
  .login-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px;

    .title {
      font-weight: bold;
      font-size: 24px;
    }
  }
  // 登录表单
  .login-form {
    padding: 0 14px;

    .btn-send {
      color: var(--cp-primary);
      &.disabled {
        color: rgba(22, 194, 163, 0.5);
      }
    }
    .cp-cell {
      display: flex;
      height: 52px;
      padding: 14px 16px;
      box-sizing: border-box;
      align-items: center;
      margin-top: 16px;
    }
  }
}
</style>
