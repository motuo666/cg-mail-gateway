# CG Mail Gateway

小型 HTTP 邮件网关，用 Zoho SMTP 帮 CG Alert 发送 digest 邮件。

## 目录结构

- `index.mjs` — Express + Nodemailer 入口
- `package.json` — Node 项目配置

## 环境变量

必须配置这些环境变量：

- `ZOHO_SMTP_HOST` 例如 `smtp.zoho.com`
- `ZOHO_SMTP_PORT` 例如 `587`
- `ZOHO_SMTP_USER` 你的 Zoho 邮箱
- `ZOHO_SMTP_PASS` SMTP 密码或应用专用密码
- `MAIL_FROM` 发件人地址（可选，默认等于 `ZOHO_SMTP_USER`）
- `MAIL_GATEWAY_KEY` Worker 调用时使用的共享密钥

## 本地运行

```bash
npm install
npm start
```

健康检查：

```bash
curl http://localhost:3000/
```

发测试邮件：

```bash
curl -X POST http://localhost:3000/send-digest \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: 你的MAIL_GATEWAY_KEY" \
  -d '{
    "to": "you@example.com",
    "subject": "CG Alert test digest",
    "text": "Hello from mail gateway"
  }'
```