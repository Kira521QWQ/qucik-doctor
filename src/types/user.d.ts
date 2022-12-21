// 用户相关数据类型

// 服务器返回用户的类型
export type User = {
  // token令牌
  token: string;
  // 用户ID
  id: string;
  // 用户名称
  account: string;
  // 手机号
  mobile: string;
  // 头像
  avatar: string;
};
