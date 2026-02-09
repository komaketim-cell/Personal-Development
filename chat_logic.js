/*************************************************
 * Chat Logic – Stage 4.7
 * UX Buttons + Safety Layer + Session Memory
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
   Session Memory
========================= */
const MEMORY_KEY = "calm_chat_context";

function saveMemory() {
  sessionStorage.setItem(MEMORY_KEY, JSON.stringify(chatContext));
}

function loadMemory() {
  const data = sessionStorage.getItem(MEMORY_KEY);
  if (!data) return false;

  try {
    const parsed = JSON.parse(data);
    Object.assign(chatContext, parsed);
    return true;
  } catch {
    return false;
  }
}

function clearMemory() {
  sessionStorage.removeItem(MEMORY_KEY);
}

/* =========================
   Safety Layer – Red Flags
========================= */
function detectRedFlag(text) {
  if (!text) return false;

  const redFlags = [
    "خسته شدم از همه چی",
    "دیگه نمی‌کشم",
    "بریدم",
    "همه چی تمومه",
    "پوچ",
    "بی‌فایده"
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

function addChoiceButtons() {
  const chatBox = document.getElementById("chat-box");

  const wrapper = document.createElement("div");
  wrapper.className = "choice-buttons";

  const choices = [
    { id: "calm", label: "🧘 آروم شدن ذهن" },
    { id: "clarity", label: "🔍 شفاف شدن فکرها" },
    { id: "action", label: "👣 یه قدم کوچیک" }
  ];

  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.innerText = choice.label;
    btn.onclick = () => {
      wrapper.remove();
      addUserMessage(choice.label);

      chatContext.selectedChoice = choice.id;
      chatContext.state = STATES.ACTION;
      saveMemory();

      handleAction();
    };
    wrapper.appendChild(btn);
  });

  chatBox.appendChild(wrapper);
  chatBox.scrollTop = chatBox.scrollHeight;
}

/* =========================
   State Handlers
========================= */
function handleInit() {
  addBotMessage("سلام 🌱 دوست دارم بدونم الان حالت چطوره؟");
  chatContext.state = STATES.EMOTION;
  saveMemory();
}

function handleEmotion(userMessage) {
  chatContext.detectedEmotion = userMessage;

  addBotMessage(
    "ممنون که گفتی. حس می‌کنم الان مهم‌ترین چیز اینه که به خودت فضا بدی."
  );

  addBotMessage("دوست داری الان روی کدوم تمرکز کنیم؟");
  addChoiceButtons();

  chatContext.state = STATES.CHOICE;
  saveMemory();
}

function handleAction() {
  addBotMessage(
    "باشه. الان فقط برای ۳۰ ثانیه:\n" +
    "• نفس عمیق بکش\n" +
    "• شونه‌هات رو شُل کن\n" +
    "• هیچ کاری لازم نیست درست بشه\n\n" +
    "من اینجام 🌱"
  );

  saveMemory();
}

/* =========================
   SAFE State
========================= */
function handleSafeState() {
  addBotMessage(
    "از حرف‌هات حس می‌کنم الان فشار زیادی روی توئه.\n\n" +
    "لازم نیست قوی باشی یا تصمیم بگیری.\n" +
    "همین که گفتی، کافیه 🌱"
  );

  saveMemory();
}

/* =========================
   Router
========================= */
function routeMessage(userMessage) {
  chatContext.lastUserMessage = userMessage;

  if (detectRedFlag(userMessage)) {
    chatContext.state = STATES.SAFE;
    saveMemory();
    handleSafeState();
    return;
  }

  switch (chatContext.state) {
    case STATES.EMOTION:
      handleEmotion(userMessage);
      break;

    case STATES.ACTION:
      addBotMessage("هر وقت دوست داشتی می‌تونیم ادامه بدیم 🌱");
      break;

    case STATES.SAFE:
      handleSafeState();
      break;

    default:
      handleInit();
  }
}

/* =========================
   Restore Session (on load)
========================= */
function restoreSession() {
  if (!loadMemory()) {
    handleInit();
    return;
  }

  if (chatContext.detectedEmotion) {
    addBotMessage("خوش اومدی 🌱 همون‌جایی هستیم که بودیم.");
  }

  switch (chatContext.state) {
    case STATES.CHOICE:
      addBotMessage("دوست داری روی کدوم تمرکز کنیم؟");
      addChoiceButtons();
      break;

    case STATES.ACTION:
      handleAction();
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
  restoreSession();
};

window.sendMessage = function () {
  const input = document.getElementById("user-input");
  const text = input.value.trim();
  if (!text) return;

  addUserMessage(text);
  input.value = "";

  routeMessage(text);
};
