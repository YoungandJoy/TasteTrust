// =====================================================================
//  TasteTrust Slack bot — Vercel serverless function.
//  Endpoint: https://taste-trust.vercel.app/api/slack
//
//  Required env vars (set in Vercel → Project → Settings → Environment Variables):
//    ANTHROPIC_API_KEY     — your Anthropic API key (sk-ant-...)
//    SLACK_BOT_TOKEN       — bot token (xoxb-...) from Slack app OAuth & Permissions
//    SLACK_SIGNING_SECRET  — from Slack app Basic Information page
//
//  Slack app configuration (api.slack.com → your app):
//    1. OAuth & Permissions → Scopes → Bot Token Scopes:
//       app_mentions:read, chat:write
//    2. Event Subscriptions → Enable + Request URL:
//       https://taste-trust.vercel.app/api/slack
//       Subscribe to bot events: app_mention
//    3. Reinstall to workspace (after adding scopes)
// =====================================================================

import crypto from "node:crypto";

export const config = { api: { bodyParser: false } };

// --- Compact PLACES summary for the model context ---
// (Mirrors the data in src/TasteTrust.jsx but flattened for prompt use.)
const PLACES_SUMMARY = [
  // ---------- 한식 (Korean) ----------
  { n: "Sae Ma Eul BBQ Pelangi", h: "Pelangi, Johor Bahru", c: "Korean BBQ", r: 4.8, p: "$$" },
  { n: "KyoChon Chicken @ JB City Square", h: "Johor Bahru", c: "Korean Fried Chicken", r: 4.7, p: "" },
  { n: "GO K BBQ 고케이 비비큐", h: "76 Amoy St, Singapore", c: "Korean BBQ", r: 4.4, p: "$$" },
  { n: "Hongdae Ip Gu", h: "Johor Bahru", c: "Korean", r: 4.1, p: "$$" },
  { n: "Dal In Restaurant", h: "JB/SG", c: "Korean", r: 4.1, p: "$$" },
  { n: "하남돼지집 HANAM BBQ", h: "R&F Mall, Johor Bahru", c: "Korean BBQ", r: 4.8, p: "" },
  { n: "Jang San Korean 장산왕족발", h: "JB/SG", c: "Korean", r: 4.6, p: "" },
  { n: "Jeong's Jjajang", h: "JB/SG", c: "Korean (Jjajang)", r: 4.8, p: "$$" },
  { n: "Oven & Fried Chicken", h: "JB/SG", c: "Korean Fried Chicken", r: 4.2, p: "$$" },
  { n: "Hoodadak 후다닥", h: "JB/SG", c: "Korean", r: 4.1, p: "$$" },
  { n: "The Gogijip / Halmae Gukbab / Hanyang Bulgogi", h: "Hansik Dining Collective", c: "Korean", r: 4.3, p: "" },
  { n: "SODENG — The Vintage BBQ", h: "Telok Ayer, Singapore", c: "Korean BBQ", r: 4.9, p: "" },
  { n: "Pohang Seafood & Butchery 회랑고기랑", h: "JB/SG", c: "Korean", r: 4.6, p: "" },
  { n: "Noodle Star K", h: "Tanjong Pagar, Singapore", c: "Korean", r: 4.6, p: "$$" },
  { n: "Myeong In Jip", h: "JB/SG", c: "Korean", r: 4.4, p: "" },
  { n: "DRIM — Korean Steak House", h: "Mandarin Gallery, Singapore", c: "Korean Steakhouse", r: 4.9, p: "$$$$" },
  { n: "Kong Madam 콩마담", h: "JB/SG", c: "Korean (Tofu)", r: 4.6, p: "" },
  // ---------- Restaurant ----------
  { n: "Dusk by Mok Mok", h: "Johor Bahru", c: "Cafe", r: 4.6, p: "$$" },
  { n: "The Wagyu Tavern (JB)", h: "Johor Bahru", c: "Yakiniku", r: 5.0, p: "$$$$" },
  { n: "Commune by the Creators", h: "JB/SG", c: "Restaurant", r: 4.7, p: "" },
  { n: "Bottega JB", h: "Johor Bahru", c: "Italian", r: 4.5, p: "" },
  { n: "Pizzeria Vincenzo Capuano", h: "JB/SG", c: "Italian", r: 4.7, p: "" },
  { n: "Latteria Mozzarella Bar", h: "JB/SG", c: "Italian", r: 4.5, p: "$$" },
  { n: "L'Arte Pizza & Focaccia", h: "JB/SG", c: "Pizza", r: 4.6, p: "$" },
  { n: "Takeout IL CLAY @ Clarke Quay", h: "Clarke Quay, Singapore", c: "Italian", r: 4.4, p: "" },
  { n: "Scarpetta", h: "JB/SG", c: "Italian", r: 4.4, p: "" },
  { n: "Yakiniku Tenshin", h: "Gurney Paragon, Penang", c: "Yakiniku", r: 4.9, p: "$$$$" },
  { n: "My Awesome Cafe", h: "JB/SG", c: "Restaurant", r: 4.7, p: "$$" },
  { n: "Casa Vostra", h: "Raffles City, Singapore", c: "Italian", r: 4.3, p: "" },
  { n: "LeVeL33", h: "Singapore", c: "Modern European", r: 4.4, p: "$$$$" },
  { n: "Whiskey Library & Jazz Club", h: "JB/SG", c: "Bar", r: 4.3, p: "" },
  { n: "Southbridge", h: "JB/SG", c: "Bar", r: 4.5, p: "$$" },
  { n: "VUE", h: "JB/SG", c: "Fine Dining", r: 4.7, p: "$$$$" },
  { n: "PREGO", h: "JB/SG", c: "Italian", r: 4.1, p: "$$$" },
  { n: "Apollonia's Pizzeria", h: "JB/SG", c: "Pizza", r: 4.3, p: "$" },
  { n: "Southside Interim Market", h: "Sentosa", c: "Food court", r: 3.8, p: "$$" },
  { n: "Blue Palms Brewhouse", h: "JB/SG", c: "Gastropub", r: 4.5, p: "$$" },
  // ---------- Cafe ----------
  { n: "Alley & Daisy Cafe", h: "Jalan Trus, Johor Bahru", c: "Cafe", r: 4.7, p: "$" },
  { n: "Antipodean Coffee Johor Bahru", h: "Johor Bahru", c: "Cafe", r: 4.6, p: "$" },
  { n: "Doña Bakehouse", h: "JB/SG", c: "Bakery", r: 4.5, p: "$" },
  { n: "off day cafe", h: "JB/SG", c: "Cafe", r: 4.3, p: "$" },
  { n: "La Levain", h: "JB/SG", c: "Cafe", r: 4.4, p: "$" },
  { n: "Baker's Bench Bakery", h: "JB/SG", c: "Bakery", r: 4.5, p: "$" },
  { n: "CAFE KREAMS", h: "JB/SG", c: "Cafe", r: 4.4, p: "" },
  { n: "Lean & Rich Bakery", h: "JB/SG", c: "Bakery", r: 4.4, p: "$" },
  { n: "ME Cafe & Games", h: "Orchard, Singapore", c: "Board game cafe", r: 4.4, p: "" },
  { n: "Birds of Paradise Gelato — Craig", h: "Tanjong Pagar, Singapore", c: "Ice Cream", r: 4.5, p: "" },
  { n: "Equate Coffee", h: "JB/SG", c: "Coffee", r: 4.6, p: "$" },
  { n: "YY Kafei Dian", h: "JB/SG", c: "Coffee shop", r: 4.1, p: "$" },
  { n: "queic by Olivia", h: "JB/SG", c: "Dessert (Cheesecake)", r: 4.1, p: "" },
  { n: "Mei Heong Yuen Dessert", h: "JB/SG", c: "Dessert (Mango)", r: 4.1, p: "$" },
  { n: "Champion Bolo Bun", h: "JB/SG", c: "Cafe", r: 4.4, p: "$" },
  { n: "Baristart Coffee Singapore", h: "Tras Street, Singapore", c: "Cafe", r: 4.1, p: "$$" },
  { n: "Atico Lounge", h: "JB/SG", c: "Lounge bar", r: 4.1, p: "" },
  { n: "DAMSO", h: "JB/SG", c: "Coffee (Korean rice cakes)", r: 4.9, p: "$" },
  { n: "Burnt Ends Bakery", h: "Audi House of Progress", c: "Bakery", r: 4.5, p: "$" },
  { n: "Radio Bakery", h: "Los Angeles", c: "Bakery", r: 4.5, p: "$$" },
  // ---------- Singapore ----------
  { n: "IT Roo Café", h: "JB/SG", c: "Cafe", r: 4.1, p: "$" },
  { n: "Hock Kee Kopitiam", h: "City Square, Johor Bahru", c: "Kopitiam", r: 4.4, p: "$" },
  { n: "NangLen Thai Restaurant Bar", h: "Tanjong Pagar, Singapore", c: "Thai", r: 4.6, p: "" },
  { n: "National Kitchen by Violet Oon", h: "Singapore", c: "Nyonya", r: 4.4, p: "$$$" },
  { n: "The Coconut Club", h: "Beach Road, Singapore", c: "Singaporean", r: 4.2, p: "$$" },
  { n: "KOK Sen Restaurant", h: "Singapore", c: "Singaporean", r: 4.1, p: "$$" },
  { n: "The Teochew Kitchenette — Bak Kut Teh", h: "Keong Saik, Singapore", c: "Teochew", r: 4.6, p: "$$" },
  { n: "Honey Pork Rib / Kra Pow Thai", h: "Chinatown Point, Singapore", c: "Thai", r: 4.6, p: "$" },
  { n: "99 Old Trees Durian", h: "Singapore", c: "Durian", r: 4.4, p: "$$" },
  { n: "Outram Park Ya Hua Rou Gu Cha", h: "Outram Park, Singapore", c: "Bak Kut Teh", r: 4.2, p: "$" },
  { n: "Keng Eng Kee Seafood", h: "Alexandra Village, Singapore", c: "Seafood", r: 4.3, p: "$$" },
  { n: "Papa Ayam", h: "313@Somerset, Singapore", c: "Restaurant", r: 4.5, p: "$" },
  { n: "Hawkers' Street @ Tang Plaza", h: "Tang Plaza, Singapore", c: "Food court", r: 4.5, p: "$" },
  { n: "Market Street Hawker Centre", h: "Market Street, Singapore", c: "Hawker centre", r: 4.3, p: "$" },
  { n: "328 Katong Laksa", h: "Katong, Singapore", c: "Laksa", r: 3.9, p: "$" },
  { n: "Tiong Shian Porridge", h: "Singapore", c: "Porridge", r: 3.8, p: "$" },
  { n: "Long Beach @ Robertson Quay", h: "Robertson Quay, Singapore", c: "Seafood", r: 4.4, p: "$$$$" },
  // ---------- 일식 (Japanese) ----------
  { n: "Awagyu Yakiniku Taman Daya", h: "Taman Daya, Johor Bahru", c: "Yakiniku", r: 4.9, p: "$$$$" },
  { n: "Keijometo", h: "Johor Bahru", c: "Japanese", r: 4.2, p: "$$" },
  { n: "Sushi Shin JB", h: "Johor Bahru", c: "Sushi", r: 4.6, p: "$$$$" },
  { n: "Marado Japanese Cuisine", h: "Puteri Harbour", c: "Sushi", r: 4.9, p: "" },
  { n: "Monster Curry — ION Orchard", h: "ION Orchard, Singapore", c: "Japanese Curry", r: 4.7, p: "$" },
  { n: "Sushidan Singapore", h: "Singapore", c: "Sushi", r: 4.6, p: "$$" },
  { n: "Enishi @ International Plaza", h: "International Plaza, Singapore", c: "Ramen", r: 4.6, p: "$$" },
  { n: "Omoté", h: "JB/SG", c: "Japanese", r: 4.3, p: "$$" },
  { n: "KOMA Singapore", h: "Singapore", c: "Japanese", r: 4.3, p: "$$$$" },
  { n: "Keria 酒菜けりあ", h: "JB/SG", c: "Japanese", r: 4.4, p: "" },
  { n: "SANPOUTEI RAMEN", h: "JB/SG", c: "Ramen", r: 3.1, p: "$$" },
  { n: "Tonshou", h: "JB/SG", c: "Tonkatsu", r: 4.5, p: "$$" },
  { n: "MENSHO TOKYO", h: "Los Angeles, CA", c: "Ramen", r: 4.8, p: "$$" },
  { n: "Jeju (LA)", h: "Los Angeles, CA", c: "Korean", r: 4.3, p: "$$$" },
  { n: "Oh! BANZAI", h: "JB/SG", c: "Japanese", r: 4.5, p: "" },
  { n: "Newport Seafood Restaurant", h: "Los Angeles", c: "Chinese (Lobster)", r: 4.4, p: "$$" },
  { n: "Toku Unagi & Sushi", h: "Los Angeles, CA", c: "Sushi", r: 4.4, p: "$$$" },
  { n: "Uchi West Hollywood", h: "West Hollywood, CA", c: "Sushi", r: 4.5, p: "$$$$" },
  { n: "TONCHIN LA", h: "Los Angeles, CA", c: "Ramen", r: 4.6, p: "$$$" },
  // ---------- Chinese ----------
  { n: "Haidilao @ Zenith Mall", h: "Zenith Mall, Johor Bahru", c: "Hot Pot", r: 4.7, p: "$$$" },
  { n: "Xiang Xiang Hunan Cuisine 湘香湖南菜", h: "Chinatown, Singapore", c: "Hunan", r: 4.8, p: "$$" },
  { n: "Jia He Grand Chinese Restaurant", h: "Singapore", c: "Chinese", r: 4.3, p: "$$$$" },
  { n: "Fragrance Bak Kwa @ Chinatown", h: "Chinatown, Singapore", c: "Bak Kwa", r: 4.8, p: "" },
  { n: "Jing Hua Xiao Chi (Dim Sum)", h: "Singapore", c: "Dim Sum", r: 4.0, p: "$$" },
  { n: "东北小厨 Dong Bei Xiao Chu", h: "JB/SG", c: "Chinese (Northeastern)", r: 4.3, p: "$$" },
  { n: "XiaoYanZi Tomato Hot Pot", h: "JB/SG", c: "Hot Pot", r: 4.8, p: "$$" },
  { n: "Cassia", h: "JB/SG", c: "Cantonese", r: 4.7, p: "$$$$" },
  { n: "Boiling Point", h: "Los Angeles", c: "Hot Pot", r: 4.2, p: "$$" },
  { n: "Howlin' Ray's Hot Chicken", h: "Chinatown, Los Angeles", c: "Hot Chicken", r: 4.7, p: "$" },
  { n: "Feng Mao BBQ Lamb Kebab", h: "Olympic Blvd, Los Angeles", c: "Chinese BBQ", r: 4.4, p: "$$$" },
  { n: "Bao Chick", h: "Los Angeles", c: "Fried Chicken Bao", r: 4.3, p: "$" },
  { n: "Sam Woo Village BBQ", h: "Los Angeles", c: "Chinese BBQ", r: 4.3, p: "$$" },
];

function placesAsText() {
  return PLACES_SUMMARY.map(
    (p) => `- ${p.n} | ${p.h || "—"} | ${p.c} | ★${p.r}${p.p ? " · " + p.p : ""}`
  ).join("\n");
}

const SYSTEM_PROMPT = `You are TasteTrust, a friendly Slack assistant for Gayoen's verified restaurant curation across Singapore, Johor Bahru, and Los Angeles.

Style:
- Default to Korean when the user writes in Korean. English is also fine.
- Keep replies concise (3–6 lines, or a short bulleted list when listing places).
- When recommending, always include: name, neighborhood, cuisine, ★rating, price level.
- Be warm and direct, like a friend giving recs. No corporate fluff.
- If you can't answer from the data, say so honestly (don't make up restaurants).
- For each place you mention, encourage opening it in Google Maps via the live site: https://taste-trust.vercel.app/?q=<name>

Verified restaurant data (${PLACES_SUMMARY.length} places, all personally visited by Gayoen):
${placesAsText()}
`;

// --- helpers ---

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function verifySlackSignature(req, rawBody, secret) {
  const ts = req.headers["x-slack-request-timestamp"];
  const sig = req.headers["x-slack-signature"];
  if (!ts || !sig) return false;
  if (Math.abs(Date.now() / 1000 - parseInt(ts, 10)) > 60 * 5) return false;
  const baseString = `v0:${ts}:${rawBody}`;
  const computed =
    "v0=" +
    crypto.createHmac("sha256", secret).update(baseString).digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(computed, "utf8"),
      Buffer.from(sig, "utf8")
    );
  } catch {
    return false;
  }
}

async function callClaude(userMessage) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("Server missing ANTHROPIC_API_KEY env var.");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    }),
  });
  if (!response.ok) {
    const t = await response.text();
    throw new Error(`Anthropic API ${response.status}: ${t.slice(0, 200)}`);
  }
  const j = await response.json();
  return (j.content?.[0]?.text || "").trim() || "🤔 (빈 응답)";
}

async function postSlack(channel, text, thread_ts) {
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) throw new Error("Server missing SLACK_BOT_TOKEN env var.");

  const r = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ channel, text, thread_ts }),
  });
  const j = await r.json().catch(() => ({}));
  if (!j.ok) {
    console.error("Slack post failed:", j);
  }
  return j;
}

// --- handler ---

export default async function handler(req, res) {
  if (req.method === "GET") {
    res
      .status(200)
      .send(
        "TasteTrust Slack endpoint. POST events here from your Slack app's Event Subscriptions."
      );
    return;
  }
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }

  let rawBody;
  try {
    rawBody = await readRawBody(req);
  } catch (e) {
    res.status(400).send("Bad body");
    return;
  }

  const signingSecret = process.env.SLACK_SIGNING_SECRET;
  if (!signingSecret) {
    res.status(500).send("Server missing SLACK_SIGNING_SECRET");
    return;
  }
  if (!verifySlackSignature(req, rawBody, signingSecret)) {
    res.status(401).send("Bad signature");
    return;
  }

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    res.status(400).send("Bad JSON");
    return;
  }

  // 1. URL verification handshake
  if (body.type === "url_verification") {
    res.status(200).json({ challenge: body.challenge });
    return;
  }

  // 2. Event callback
  if (body.type === "event_callback") {
    const event = body.event || {};

    // Skip Slack retries to avoid duplicate replies
    if (req.headers["x-slack-retry-num"]) {
      res.status(200).end();
      return;
    }

    // Skip our own bot's messages (no infinite loop)
    if (event.bot_id || event.subtype === "bot_message") {
      res.status(200).end();
      return;
    }

    if (event.type !== "app_mention") {
      res.status(200).end();
      return;
    }

    const text = (event.text || "").replace(/<@\w+>/g, "").trim();
    if (!text) {
      res.status(200).end();
      await postSlack(
        event.channel,
        "안녕! 식당 추천이 필요하면 `@TasteTrust 매운 한식 어디가 좋아` 처럼 말 걸어줘. (English도 OK)",
        event.ts
      );
      return;
    }

    // Acknowledge, then run the model and post.
    // Vercel will keep the function alive until we return — we want the
    // postSlack to complete before the function shuts down. So we await
    // before sending the 200. Slack tolerates ~3s; Haiku 4.5 typically
    // returns in <2s, so this is fine.
    try {
      const reply = await callClaude(text);
      await postSlack(event.channel, reply, event.thread_ts || event.ts);
      res.status(200).end();
    } catch (err) {
      console.error("Bot error:", err);
      try {
        await postSlack(
          event.channel,
          `⚠️ 응답 생성 실패: ${String(err.message || err).slice(0, 200)}`,
          event.thread_ts || event.ts
        );
      } catch {}
      res.status(200).end();
    }
    return;
  }

  res.status(200).end();
}
