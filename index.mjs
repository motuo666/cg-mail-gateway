import express from "express";
import nodemailer from "nodemailer";

const app = express();
app.use(express.json());

// 简单的共享密钥，防止别人乱调
const API_KEY = process.env.MAIL_GATEWAY_KEY || "";

// 配置 Zoho SMTP
const transporter = nodemailer.createTransport({
  host: process.env.ZOHO_SMTP_HOST,   // 例如 smtp.zoho.com
  port: Number(process.env.ZOHO_SMTP_PORT || 587),
  secure: false, // 587 通常为 false，465 才是 true
  auth: {
    user: process.env.ZOHO_SMTP_USER, // 你的 Zoho 邮箱
    pass: process.env.ZOHO_SMTP_PASS, // SMTP 密码 / 应用专用密码
  },
});

// 健康检查
app.get("/", (req, res) => {
  res.json({ ok: true });
});

// 真正发 digest 的入口
app.post("/send-digest", async (req, res) => {
  try {
    const key = req.headers["x-api-key"];
    if (!key || key !== API_KEY) {
      return res.status(401).json({ ok: false, error: "unauthorized" });
    }

    const { to, subject, html, text } = req.body || {};
    if (!to || !subject || (!html && !text)) {
      return res
        .status(400)
        .json({ ok: false, error: "missing to/subject/body" });
    }

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.ZOHO_SMTP_USER,
      to,
      subject,
      text,
      html,
    });

    console.log("Mail sent", to, info.messageId);
    res.json({ ok: true });
  } catch (e) {
    console.error("Mail send failed", e);
    res.status(500).json({ ok: false, error: String(e) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`mail-gateway listening on ${PORT}`);
});