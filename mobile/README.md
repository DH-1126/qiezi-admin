# 茄子交易移动端 H5

移动端与现有 Web 端使用独立入口和端口，方便分别预览、调试与后续开发。

## 本地地址

- 移动端首页：<http://localhost:5174/mobile/>
- Web 端首页：<http://localhost:5173/qiezi-admin/>
- Mock API：<http://localhost:3002/>

## 线上地址

- 移动端首页：<https://dh-1126.github.io/qiezi-admin/mobile/>
- Web 端首页：<https://dh-1126.github.io/qiezi-admin/>
- 后台：<https://dh-1126.github.io/qiezi-admin/admin>

## 启动

在本目录运行移动端：

```bash
npm run dev
```

移动端复用上一级 Web 工程中已经安装的 Vite 工具，不需要重复安装依赖。

在上一级 Web 工程运行 `npm run build:all` 会把 Web、后台和移动端一起构建到 `dist`；运行 `npm run deploy` 会统一发布到 GitHub Pages。

## 页面入口

- `/mobile/`：首页
- `/mobile/my.html`：我的
- `/mobile/purchase-orders.html`：购买订单
- `/mobile/sale-orders.html`：发布订单
- `/mobile/wallet.html`：我的钱包与提现
- `/mobile/sell.html`：出哈夫币发布管理、状态筛选与商品下架
- `/mobile/publish.html`：四步渐进式商品发布、图片上传与提交校验
- `/mobile/verification.html`：实名认证
- `/mobile/password.html`：修改登录密码
- `/mobile/binding.html`：第三方授权绑定
- `/mobile/about.html`：关于我们
- `/mobile/privacy.html`：隐私协议
- `/mobile/agreement.html`：用户协议

工程内页面跳转统一使用上述英文地址；原始中文 HTML 原型继续保留在项目的 `素材` 目录中。
