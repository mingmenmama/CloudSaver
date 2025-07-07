const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
const config = require('../config/default');
const router = express.Router();

// 初始化默认用户
const initDefaultUsers = async () => {
  try {
    // 检查管理员是否存在
    const adminExists = await db.get('SELECT * FROM users WHERE username = ?', [config.defaultAdmin.username]);
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(config.defaultAdmin.password, 10);
      await db.run(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [config.defaultAdmin.username, hashedPassword, config.defaultAdmin.role]
      );
    }

    // 检查普通用户是否存在
    const userExists = await db.get('SELECT * FROM users WHERE username = ?', [config.defaultUser.username]);
    if (!userExists) {
      const hashedPassword = await bcrypt.hash(config.defaultUser.password, 10);
      await db.run(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [config.defaultUser.username, hashedPassword, config.defaultUser.role]
      );
    }
  } catch (error) {
    console.error('初始化默认用户失败:', error);
  }
};

// 登录接口
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 查找用户
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    if (!user) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 验证密码
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 生成 JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 关闭注册接口
router.post('/register', (req, res) => {
  res.status(403).json({ message: '注册功能已关闭' });
});

// 获取用户信息
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await db.get('SELECT id, username, role FROM users WHERE id = ?', [req.user.id]);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// JWT 验证中间件
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: '访问令牌缺失' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: '令牌无效' });
    }
    req.user = user;
    next();
  });
}

// 初始化默认用户
initDefaultUsers();

module.exports = router;
