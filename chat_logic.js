/*************************************************
 * Chat Logic – Stage 4
 * State Machine + Safety Layer (Frontend Only)
 *************************************************/

const AI_ENABLED = false;

/* =========================
   States
========================= */
const STATES = {
  INIT: "INIT",
  EMOTION: "EMOTION",
  CHOICE: "CHOICE",
  ACTION: "ACTION",
  SAFE: "SAFE"
};

/* =========================
   Context
========================= */
const chatContext = {
  state: STATES.INIT,
  lastUserMessage: "",
  detectedEmotion: null,
  selectedChoice: null
};

/* =========================
   Safety Layer – Red Flags
========================= */
function detectRedFlag(text) {
  if (!text) return false;

  const redFlags = [
    "خسته شدم از همه چی",
    "دیگه نمی‌کشم",
    "بی‌فایده",
    "هیچی مهم نیست",
    "پوچ",
    "بریدم",
    "دیگه توان ندارم",
    "همه چی تمومه"
  ];

  return redFlags.some(flag => text.includes(flag));
}

/* =========================
   UI Helpers
========================= */
function addBotMessage(text) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("div");
  msg.className = "bot-message";
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function addUserMessage(text) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("div");
  msg.className = "user-message";
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

/* =========================
   State Handlers
========================= */
function handleInit() {
  addBotMessage("سلام 🌱 دوست دارم بدونم الان حالت چطوره؟");
  chatContext.state = STATES.EMOTION;
}

function handleEmotion(userMessage) {
  chatContext.detectedEmotion = userMessage;

  addBotMessage(
    "ممنون که گفتی. از حرف‌هات حس می‌کنم یه چیزی توی ذهنت شلوغه."
  );

  addBotMessage(
    "دوست داری الان روی کدوم تمرکز کنیم؟\n\n" +
    "1️⃣ آروم شدن ذهن\n" +
    "2️⃣ شفاف شدن فکرها\n" +
    "3️⃣ یه قدم خیلی کوچیک عملی"
  );

  chatContext.state = STATES.CHOICE;
}

function handleChoice(userMessage) {
  chatContext.selectedChoice = userMessage;

  addBotMessage("باشه. فقط یه تمرین خیلی ساده با هم انجام بدیم.");

  chatContext.state = STATES.ACTION;
  handleAction();
}

function handleAction() {
  addBotMessage(
    "الان برای ۳۰ ثانیه:\n" +
    "• نفس عمیق بکش\n" +
    "• شونه‌هات رو شُل کن\n" +
    "• لازم نیست چیزی رو درست کنی\n\n" +
    "اگه خواستی بعدش می‌تونیم ادامه بدیم."
  );
}

/* =========================
   SAFE State
========================= */
function handleSafeState() {
  addBotMessage(
    "حسی که گفتی نشون می‌ده الان فشار زیادی روی توئه.\n\n" +
    "لازم نیست همین الان کاری انجام بدی یا قوی باشی.\n" +
    "فقط بدون من اینجام و شنونده‌ام 🌱"
  );

  addBotMessage(
    "اگه دوست داری، می‌تونی:\n" +
    "• فقط نفس بکشی\n" +
    "• یا گفتگو رو همین‌جا متوقف کنیم\n" +
    "• یا بعداً برگردی"
  );
}

/* =========================
   Router
========================= */
function routeMessage(userMessage) {
  chatContext.lastUserMessage = userMessage;

  // ✅ Safety check (global)
  if (detectRedFlag(userMessage)) {
    chatContext.state = STATES.SAFE;
    handleSafeState();
    return;
  }

  switch (chatContext.state) {
    case STATES.EMOTION:
      handleEmotion(userMessage);
      break;

    case STATES.CHOICE:
      handleChoice(userMessage);
      break;

    case STATES.ACTION:
      addBotMessage("هر وقت آماده بودی، می‌تونی دوباره صحبت کنی 🌱");
      break;

    case STATES.SAFE:
      handleSafeState();
      break;

    default:
      handleInit();
  }
}

/* =========================
   Public API (Global)
========================= */
window.startChat = function () {
  chatContext.state = STATES.INIT;
  handleInit();
};

window.sendMessage = function () {
  const input = document.getElementById("user-input");
  const text = input.value.trim();
  if (!text) return;

  addUserMessage(text);
  input.value = "";

  routeMessage(text);
};
