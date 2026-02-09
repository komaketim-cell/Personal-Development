console.log("✅ chat_logic.js loaded");

/* =========================
   GLOBAL STATE
========================= */
let chatState = {
  phase: "INIT", // INIT | EMOTION | CHOICE | ACTION
  lastEmotion: "",
  selectedAction: ""
};

/* =========================
   START CHAT
========================= */
window.startChat = function (path) {
  const chatBox = document.getElementById("chatBox");
  chatBox.classList.remove("hidden");

  chatState.phase = "EMOTION";

  addBotMessage(
    `خوشحالم که اینجایی 🌿<br>
     بر اساس ارزیابی، تمرکز ما روی <b>${path}</b> هست.<br>
     دوست دارم اول بدونم: الان چه احساسی داری؟`
  );

  document.getElementById("sendBtn").onclick = window.sendMessage;
};

/* =========================
   SEND MESSAGE
========================= */
window.sendMessage = function () {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;

  addUserMessage(text);
  input.value = "";

  handleUserMessage(text);
};

/* =========================
   CORE LOGIC
========================= */
function handleUserMessage(text) {
  switch (chatState.phase) {
    case "EMOTION":
      handleEmotion(text);
      break;

    case "CHOICE":
      handleChoice(text);
      break;

    case "ACTION":
      addBotMessage("اگر دوست داری ادامه بدیم، بگو 🌱");
      break;
  }
}

/* =========================
   STEP 1: EMOTION
========================= */
function handleEmotion(text) {
  chatState.lastEmotion = detectEmotion(text);
  chatState.phase = "CHOICE";

  addBotMessage(
    `${chatState.lastEmotion}<br><br>
     الان ترجیح می‌دی کدومو انجام بدیم؟<br>
     1️⃣ آروم شدن سریع<br>
     2️⃣ شفاف شدن موضوع<br>
     3️⃣ فقط حرف بزنیم`
  );
}

/* =========================
   STEP 2: CHOICE
========================= */
function handleChoice(text) {
  if (text.includes("1")) {
    chatState.selectedAction = "calm";
    chatState.phase = "ACTION";
    startBreathingExercise();
    return;
  }

  if (text.includes("2")) {
    chatState.selectedAction = "clarity";
    chatState.phase = "ACTION";
    askClarityQuestion();
    return;
  }

  if (text.includes("3")) {
    chatState.selectedAction = "talk";
    chatState.phase = "ACTION";
    openTalkSpace();
    return;
  }

  addBotMessage("برای انتخاب، فقط عدد 1، 2 یا 3 رو بفرست 🌿");
}

/* =========================
   ACTIONS
========================= */
function startBreathingExercise() {
  addBotMessage(
    `باشه 🌿<br>
     با هم ۳۰ ثانیه نفس می‌کشیم:<br>
     ⏺️ ۴ ثانیه دم<br>
     ⏸️ ۴ ثانیه نگه‌دار<br>
     🔽 ۶ ثانیه بازدم<br><br>
     وقتی تموم شد، فقط بنویس «تمام شد»`
  );
}

function askClarityQuestion() {
  addBotMessage(
    `باشه 🌱<br>
     اگر بخوای این حس رو در یک جمله خلاصه کنی، بیشتر مربوط به:<br>
     🔹 کار<br>
     🔹 رابطه<br>
     🔹 خودت<br>
     🔹 آینده<br><br>
     کدومش؟`
  );
}

function openTalkSpace() {
  addBotMessage(
    `من اینجام 🌸<br>
     هر چی دوست داری بنویس، بدون قضاوت می‌خونم.`
  );
}

/* =========================
   EMOTION DETECTION (SIMPLE)
========================= */
function detectEmotion(text) {
  if (text.includes("استرس") || text.includes("خسته")) {
    return "به نظر میاد الان فشار و خستگی روی ذهنت هست 🌿";
  }

  if (text.includes("گیج") || text.includes("نمی‌دونم")) {
    return "احساس سردرگمی داری، و این کاملاً قابل درکه 🌱";
  }

  if (text.includes("ناراحت") || text.includes("غمگین")) {
    return "به نظر میاد یه ناراحتی زیر این حرف‌ها هست 💙";
  }

  return "ممنون که احساست رو گفتی 🌸";
}

/* =========================
   UI HELPERS
========================= */
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
