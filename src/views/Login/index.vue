<script setup lang="ts">
import { ref, onUnmounted, onMounted } from 'vue';
// 导入路由管理和路由实例
import { useRouter, useRoute } from 'vue-router';
// 导入保存用户信息的store
import { useUserStore } from '@/stores/user';
// 业务网络请求
import { loginByPassword, loginByCode, getSMSCode } from '@/services/user';
import { Toast, type FormInstance } from 'vant';

// 创建userStore
const userStore = useUserStore();
// 创建路由对应的实例：相当于原来的 $router 和 $route
const router = useRouter();
const route = useRoute();

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
// 登录方式的条件
const isPwdLogin = ref(true);
// vant form 实例变量
const form = ref<FormInstance>();
// 验证码
const smsCode = ref('');
// 倒计时页面响应式数据
const counter = ref(0);
// 倒计时的timerId
let timerId: number;

// 配置表单校验，对象数组
const mobileRules = [
  { required: true, message: '请输入手机号' },
  { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
];
// 密码校验规则
const passwordRules = [
  { required: true, message: '请输入密码' },
  { pattern: /^\w{8,24}$/, message: '密码需8-24个字符' },
];
// 验证码规则
const codeRules = [
  { required: true, message: '请输入验证码' },
  { pattern: /^\d{6}$/, message: '验证码6位数字' },
];

// 登录事件处理
const login = async (formValues: { mobile: string; password: string }) => {
  if (!isAgree.value) return Toast('请勾选已同意');

  // 判断用户登录方式
  // 密码登录
  if (isPwdLogin.value) {
    // 发起登录网络请求
    const user = await loginByPassword(formValues.mobile, formValues.password);
    // 登录成功之后保存用户登录信息到store中
    userStore.setUser(user);
    // 获取路由的query传参信息
    console.log(route.query);
    console.log(route.query.returnURL);
    // 有回跳地址
    // router.push((route.query.returnURL as string) || '/user');
    // 上面的跳转代码和下面的等价
    if (route.query.returnURL) {
      router.push(route.query.returnURL as string);
    } else {
      // 去个人页面
      router.push('/user');
    }
    Toast.success('登录成功');
  } else {
    // 验证码登录
    const user = await loginByCode(formValues.mobile, smsCode.value);
    // 登录成功之后保存用户登录信息到store中
    userStore.setUser(user);
    if (route.query.returnURL) {
      router.push(route.query.returnURL as string);
    } else {
      // 去个人页面
      router.push('/user');
    }
    Toast.success('登录成功');
  }
};
// 发送验证码的事件处理函数
const sendSms = () => {
  console.log('对手机号合法性验证开始');
  // 1、promise 异常的 async 的try catch 处理方式
  // try {
  //   // 手动执行表单指定的验证
  //   await form.value?.validate('mobile');
  //   // 如果 promise 有异常，是不会走下一步的
  //   console.log('手机号没有问题');
  // } catch (error) {
  //   console.log('手机号有问题', error);
  // }

  // 2、.catch 处理方式
  // 手动执行表单指定的验证
  // form.value
  //   ?.validate('mobile')
  //   .then((succ) => {
  //     console.log('验证通过', succ);
  //   })
  //   .catch((error) => {
  //     console.log('手机号有问题', error);
  //   });
  // 3、.then 的第二个参数就是异常处理
  form.value?.validate('mobile').then(
    async (resolve) => {
      console.log('验证通过resolve', resolve);
      // 如果当前计时中，则返回
      if (counter.value > 0) return;

      // 显示倒计时,每隔1秒修改一下counter.value
      counter.value = 10;
      // 使用计时器的良好习惯，开启之前先clear。
      window.clearInterval(timerId);
      timerId = window.setInterval(() => {
        // counter.value -= 1
        // 和上面等价
        counter.value = counter.value - 1;
        if (counter.value <= 0) {
          // 清空计时器
          window.clearInterval(timerId);
        }
      }, 1000);

      // 告诉服务器，发送验证码
      const code = await getSMSCode(mobile.value, 'login');
      console.log(code);
    },
    (reject) => {
      console.log('手机号有问题reject', reject);
    }
  );
};
// 组件卸载时也清空 timerId
onUnmounted(() => {
  // 清空计时器
  window.clearInterval(timerId);
});

// 生成qq登录按钮
onMounted(() => {
  // QC.Login({
  //   btnId: 'qqLoginBtn',
  // });
});
</script>

<template>
  <div class="login">
    <!-- 自定义导航栏 -->
    <CpNavBar title="登录" rightText="注册" @click-right="onClickRight" />
    <!-- 登录方式 -->
    <div class="login-head">
      <span class="title">{{ isPwdLogin ? '密码登录' : '短信登录' }}</span>
      <a class="sms" href="javascript:;" @click="isPwdLogin = !isPwdLogin">
        <span>{{ isPwdLogin ? '短信验证码登录' : '密码登录' }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- 登录表单 -->
    <div class="login-form">
      <van-form autocomplete="off" @submit="login" ref="form">
        <van-field
          placeholder="请输入手机号"
          v-model="mobile"
          name="mobile"
          :rules="mobileRules"
          type="tel"
        ></van-field>
        <van-field
          placeholder="请输入密码"
          v-if="isPwdLogin"
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
        <!-- 短信登录 -->
        <van-field
          placeholder="请输入验证码"
          v-else
          :rules="codeRules"
          v-model="smsCode"
          name="smsCode"
        >
          <template #button>
            <span :class="['btn-send', counter > 0 ? 'disabled' : '']" @click="sendSms">{{
              counter > 0 ? counter + 's之后发送' : '发送验证码'
            }}</span>
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
        <a
          class="icon"
          href="https://graph.qq.com/oauth2.0/authorize?client_id=102015968&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fconsult-patients.itheima.net%2Flogin%2Fcallback"
        >
          <img src="@/assets/qq.svg" alt="qq-icon" />
        </a>
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
    .btn-send {
      color: var(--cp-primary);
      &.disabled {
        color: rgba(22, 194, 163, 0.5);
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
