#!/bin/sh

# 启动 Nginx
nginx

# 等待 Nginx 启动
sleep 2

# 启动后端服务
cd /app
npm start
