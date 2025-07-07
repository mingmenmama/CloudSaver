module.exports = {
  // 默认管理员账户
  defaultAdmin: {
    username: 'admin',
    password: 'mingmenmama',
    role: 'admin'
  },
  
  // 默认普通用户账户
  defaultUser: {
    username: '10000',
    password: '10000',
    role: 'user'
  },
  
  // 关闭注册功能
  registrationEnabled: false,
  
  // 普通用户权限设置
  userPermissions: {
    canModifySettings: false
  }
};
