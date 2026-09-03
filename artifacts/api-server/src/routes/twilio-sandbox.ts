import { Router } from "express";
import axios from "axios";

const router = Router();

router.get("/twilio/sandbox-info", async (_req, res) => {
  const sid   = process.env["TWILIO_ACCOUNT_SID"]  || "";
  const token = process.env["TWILIO_AUTH_TOKEN"]    || "";

  if (!sid || !token) return res.status(500).json({ error: "Twilio credentials not set" });

  try {
    const resp = await axios.get(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages/Sandbox/WhatsApp.json`,
      { auth: { username: sid, password: token }, timeout: 10000 }
    );
    return res.json(resp.data);
  } catch {
    // Try sandbox endpoint
    try {
      const resp2 = await axios.get(
        `https://api.twilio.com/2010-04-01/Accounts/${sid}.json`,
        { auth: { username: sid, password: token }, timeout: 10000 }
      );
      return res.json({ accountInfo: resp2.data });
    } catch (err2: any) {
      return res.status(502).json({ error: err2?.response?.data || err2?.message });
    }
  }
});

router.get("/twilio/whatsapp-sandbox", async (_req, res) => {
  const sid   = process.env["TWILIO_ACCOUNT_SID"]  || "";
  const token = process.env["TWILIO_AUTH_TOKEN"]    || "";

  try {
    const resp = await axios.get(
      "https://api.twilio.com/2010-04-01/Accounts/${sid}/Sandbox/WhatsApp.json".replace("${sid}", sid),
      { auth: { username: sid, password: token }, timeout: 10000 }
    );
    return res.json(resp.data);
  } catch {
    // Try the messaging API for sandbox keyword
    try {
      const resp2 = await axios.get(
        `https://conversations.twilio.com/v1/Services`,
        { auth: { username: sid, password: token }, timeout: 10000 }
      );
      return res.json(resp2.data);
    } catch (err2: any) {
      return res.status(502).json({ error: err2?.response?.data || err2?.message });
    }
  }
});

export default router;
