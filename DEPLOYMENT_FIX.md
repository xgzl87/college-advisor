# 静态资源加载错误修复指南

## 问题描述
出现 `GET http://47.116.113.187:3000/_next/static/... net::ERR_ABORTED 400 (Bad Request)` 错误，表示 Next.js 静态资源无法加载。

## 解决方案

### 1. 清理构建缓存并重新构建

在服务器上执行以下命令：

```bash
# 清理构建缓存
rm -rf .next
rm -rf node_modules/.cache

# 重新安装依赖（如果需要）
npm install

# 重新构建
npm run build

# 重启服务器
npm run start
```

### 2. 检查服务器配置

如果使用 Nginx 作为反向代理，确保配置正确：

```nginx
server {
    listen 80;
    server_name 47.116.113.187;

    location /_next/static/ {
        alias /path/to/your/app/.next/static/;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. 检查文件权限

确保 `.next` 目录和静态文件有正确的读取权限：

```bash
chmod -R 755 .next
```

### 4. 检查端口和进程

确保 Next.js 应用正在正确的端口上运行：

```bash
# 检查端口占用
netstat -tulpn | grep 3000

# 如果端口被占用，杀死进程
kill -9 <PID>

# 重新启动
npm run start
```

### 5. 检查环境变量

确保 `NODE_ENV=production` 已设置：

```bash
export NODE_ENV=production
npm run build
npm run start
```

### 6. 使用 PM2 管理进程（推荐）

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start npm --name "college-advisor" -- start

# 保存配置
pm2 save

# 设置开机自启
pm2 startup
```

## 常见问题

### 问题1: 构建文件不匹配
**原因**: 开发环境和生产环境的构建文件不一致
**解决**: 确保在生产环境重新构建

### 问题2: 缓存问题
**原因**: 浏览器或服务器缓存了旧的构建文件
**解决**: 清理浏览器缓存，或使用硬刷新 (Ctrl+Shift+R)

### 问题3: 服务器配置问题
**原因**: Nginx 或其他反向代理配置不正确
**解决**: 检查并更新服务器配置

### 问题4: 文件权限问题
**原因**: 服务器无法读取 `.next/static` 目录
**解决**: 检查并修复文件权限

## 验证修复

1. 访问 `http://47.116.113.187:3000`
2. 打开浏览器开发者工具 (F12)
3. 检查 Network 标签，确认所有 `_next/static/` 资源返回 200 状态码
4. 检查 Console 标签，确认没有加载错误

## 如果问题仍然存在

1. 检查服务器日志：`pm2 logs` 或查看应用日志
2. 检查 Next.js 构建日志：查看 `npm run build` 的输出
3. 检查服务器资源：确保有足够的磁盘空间和内存
4. 联系服务器管理员检查防火墙和网络配置

