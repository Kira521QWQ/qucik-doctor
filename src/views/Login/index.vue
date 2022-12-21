<script setup lang="ts">
// 父组件绑定子组件暴露的事件处理函数
const onClickRight = () => {
  console.log('右侧点击，父组件执行的事件处理函数');
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
      <van-form autocomplete="off">
        <van-field placeholder="请输入手机号" type="tel"></van-field>
        <van-field placeholder="请输入密码" type="password"></van-field>
        <div class="cp-cell">
          <van-checkbox>
            <span>我已同意</span>
            <a href="javascript:;">用户协议</a>
            <span>及</span>
            <a href="javascript:;">隐私条款</a>
          </van-checkbox>
        </div>
        <div class="cp-cell">
          <van-button block round type="primary">登 录</van-button>
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
    <svg>
      <use href="#icon-login-eye-off" />
    </svg>
    <svg>
      <use href="#icon-home-docs" />
    </svg>
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
