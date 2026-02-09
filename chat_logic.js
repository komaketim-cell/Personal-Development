console.log("✅ chat_logic.js (State Machine + AI Adapter) loaded");

/* =====================================================
   CONFIG
===================================================== */

// 🔴 وقتی AI واقعی وصل شد → true
const AI_ENABLED = false;

// endpoint نمونه (بعداً به backend خودت وصل می‌کنی)
const AI_ENDPOINT = "/api/ai";

/* =====================================================
   STATE MACHINE & CONTEXT
===================================================== */

const ChatPhases = {
  INIT: "INIT",
  EMOTION: "EMOTION",
  CHOICE: "CHOICE",
  ACTION: "ACTION"
};

let chatContext = {
  phase: ChatPhases.INIT,
  emotion: null,
  emotionLabel: "",
  goal: null,
  depth: 1
};

/* =====================================================
   PUBLIC API (GLOBAL)
===================================================== */

window.startChat = function (path) {
  const chatBox = document.getElementById("chatBox");
  chatBox.classList.remove("hidden");

  chatContext.phase = ChatPhases.EMOTION;
  chatContext.goal = path;

  addBotMessage(
    `خوشحالم که اینجایی 🌿<br>
     تمرکز فعلی ما روی <b>${path}</b> هست.<br>
     قبل از هر چیز، دوست دارم بدونم الان چه احساسی داری؟`
  );

  document.getElementById("sendBtn").onclick = window.sendMessage;
};

window.sendMessage = function () {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;

  addUserMessage(text);
  input.value = "";

  routeMessage(text);
};

/* =====================================================
   ROUTER
===================================================== */

function routeMessage(text) {
  if (AI_ENABLED) {
    routeWithAI(text);
  } else {
    routeRuleBased(text);
  }
}

/* =====================================================
   RULE-BASED FLOW (Fallback / MVP)
===================================================== */

function routeRuleBased(text) {
  switch (chatContext.phase) {
    case ChatPhases.EMOTION:
      onEmotion(text);
      break;
    case ChatPhases.CHOICE:
      onChoice(text);
      break;
    case ChatPhases.ACTION:
      onAction(text);
      break;
    default:
      addBotMessage("یه لحظه صبر کن 🌱");
  }
}

/* =====================================================
   AI FLOW (Adapter)
===================================================== */

async function routeWithAI(text) {
  try {
    const payload = {
      message: text,
      context: chatContext
    };

    const response = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    /*
      data = {
        reply: "متن پاسخ AI",
        newContext: { ... }
      }
    */

    if (data.newContext) {
      chatContext = { ...chatContext, ...data.newContext };
    }

    addBotMessage(data.reply);

  } catch (e) {
    console.error("AI error → fallback", e);
    routeRuleBased(text);
  }
}

/* =====================================================
   PHASE 1: EMOTION
===================================================== */

function onEmotion(text) {
  const emotionData = detectEmotion(text);

  chatContext.emotion = emotionData.key;
  chatContext.emotionLabel = emotionData.label;
  chatContext.phase = ChatPhases.CHOICE;

  addBotMessage(
    `${emotionData.label}<br><br>
     دوست داری الان کدوم مسیر رو بریم؟<br>
     1️⃣ آروم شدن سریع<br>
     2️⃣ شفاف شدن موضوع<br>
     3️⃣ فقط حرف بزنیم`
  );
}

/* =====================================================
   PHASE 2: CHOICE
===================================================== */

function onChoice(text) {
  if (text.includes("1")) {
    chatContext.goal = "calm";
    chatContext.phase = ChatPhases.ACTION;
    startCalmAction();
    return;
  }

  if (text.includes("2")) {
    chatContext.goal = "clarity";
    chatContext.phase = ChatPhases.ACTION;
    startClarityAction();
    return;
  }

  if (text.includes("3")) {
    chatContext.goal = "talk";
    chatContext.phase = ChatPhases.ACTION;
    startTalkAction();
    return;
  }

  addBotMessage("فقط عدد 1، 2 یا 3 رو بفرست 🌿");
}

/* =====================================================
   PHASE 3: ACTION
===================================================== */

function onAction(text) {
  addBotMessage(
    "من باهات هستم 🌱<br>اگر دوست داری عمیق‌تر ادامه بدیم، بنویس «ادامه»."
  );
}

/* =====================================================
   ACTION IMPLEMENTATIONS
===================================================== */

function startCalmAction() {
  addBotMessage(
    `باشه 🌿<br>
     🔹 ۴ ثانیه دم<br>
     🔹 ۴ ثانیه نگه‌دار<br>
     🔹 ۶ ثانیه بازدم<br><br>
     وقتی تموم شد، بنویس «تمام شد».`
  );
}

function startClarityAction() {
  addBotMessage(
    `باشه 🌱<br>
     این حس بیشتر به کدوم بخش زندگیت مربوطه؟<br>
     🔹 کار<br>
     🔹 رابطه<br>
     🔹 خودت<br>
     🔹 آینده`
  );
}

function startTalkAction() {
  addBotMessage(
    `من گوش می‌دم 🌸<br>
     هر چی دوست داری بنویس.`
  );
}

/* =====================================================
   EMOTION DETECTION (MVP)
===================================================== */

function detectEmotion(text) {
  if (text.includes("استرس") || text.includes("فشار") || text.includes("خسته")) {
    return {
      key: "stress",
      label: "به نظر میاد ذهنت تحت فشاره و خسته‌ای 🌿"
    };
  }

  if (text.includes("گیج") || text.includes("نمی‌دونم")) {
    return {
      key: "confusion",
      label: "یه حس سردرگمی توی حرف‌هات هست 🌱"
    };
  }

  if (text.includes("غم") || text.includes("ناراحت")) {
    return {
      key: "sadness",
      label: "انگار یه ناراحتی آروم زیر این حس‌ها هست 💙"
    };
  }

  return {
    key: "neutral",
    label: "ممنون که احساست رو گفتی 🌸"
  };
}

/* =====================================================
   UI HELPERS
===================================================== */

function addBotMessage(text) {
  const box = document.getElementById("chatMessages");
  box.innerHTML += `<div class="message bot">${text}</div>`;
  box.scrollTop = box.scrollHeight;
}

function addUserMessage(text) {
  const box = document.getElementById("chatMessages");
  box.innerHTML += `<div class="message user">${text}</div>`;
  box.scrollTop = box.scrollHeight;
}
