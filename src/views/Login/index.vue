<script setup lang="ts">
import { ref } from 'vue';
// 导入保存用户信息的store
import { useUserStore } from '@/stores/user';
// 业务网络请求
import { loginByPassword } from '@/services/user';
import { Toast } from 'vant';

// 创建userStore
const userStore = useUserStore();

// 父组件绑定子组件暴露的事件处理函数
const onClickRight = () => {
  console.log('右侧点击，父组件执行的事件处理函数');
  userStore.delUser();
};

// 搜集页面数据（定义数据容器）：手机号和密码
const mobile = ref('');
const password = ref('');
// 页面状态数据
const isAgree = ref(false);
const isShowPwd = ref(false);
const isPwdLogin = ref(true);

// 配置表单校验，对象数组
const mobileRules = [
  { required: true, message: '请输入手机号' },
  { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
];

const passwordRules = [
  { required: true, message: '请输入密码' },
  { pattern: /^\w{8,24}$/, message: '密码需8-24个字符' },
];

// 登录事件处理
const login = async (formValues: { mobile: string; password: string }) => {
  if (!isAgree.value) return Toast('请勾选已同意');
  // 发起登录网络请求
  const user = await loginByPassword(formValues.mobile, formValues.password);
  // 登录成功之后保存用户登录信息到store中
  userStore.setUser(user);
};
</script>

<template>
  <div class="login">
    <!-- 自定义导航栏 -->
    <CpNavBar title="登录" rightText="注册" @click-right="onClickRight" />
    <!-- 登录方式 -->
    <div class="login-head">
      <span class="title">密码登录</span>
      <a class="sms" href="javascript:;">
        <span>短信验证码登录</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- 登录表单 -->
    <div class="login-form">
      <van-form autocomplete="off" @submit="login">
        <van-field
          placeholder="请输入手机号"
          v-model="mobile"
          name="mobile"
          :rules="mobileRules"
          type="tel"
        ></van-field>
        <van-field
          placeholder="请输入密码"
          v-model="password"
          name="password"
          :rules="passwordRules"
          :type="isShowPwd ? 'text' : 'password'"
        >
          <template #button>
            <CpIcon
              :name="isShowPwd ? 'login-eye-on' : 'login-eye-off'"
              @click="isShowPwd = !isShowPwd"
            />
          </template>
        </van-field>
        <div class="cp-cell">
          <van-checkbox v-model="isAgree">
            <span>我已同意</span>
            <a href="javascript:;">用户协议</a>
            <span>及</span>
            <a href="javascript:;">隐私条款</a>
          </van-checkbox>
        </div>
        <div class="cp-cell">
          <van-button block round type="primary" native-type="submit">登 录</van-button>
        </div>
        <div class="cp-cell">
          <a href="javascript:;">忘记密码？</a>
        </div>
      </van-form>
    </div>

    <!-- 第三方登录 -->
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <div class="icon">
        <img src="@/assets/qq.svg" alt="qq-icon" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  .login-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px;

    .title {
      font-weight: bold;
      font-size: 24px;
    }
    .sms {
      span {
        font-size: 16px;
      }
    }
  }

  // 登录表单
  .login-form {
    padding: 0 14px;
    .cp-cell {
      display: flex;
      height: 52px;
      padding: 14px 16px;
      box-sizing: border-box;
      align-items: center;
      .van-checkbox {
        a {
          color: var(--cp-primary);
          margin: 0 6px;
        }
      }
    }
  }

  // 第三方登录
  .login-other {
    margin-top: 60px;
    padding: 0 30px;
    .icon {
      display: flex;
      justify-content: center;
      img {
        width: 36px;
        height: 36px;
        padding: 4px;
      }
    }
  }
}
</style>
