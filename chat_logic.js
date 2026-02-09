console.log("✅ chat_logic.js loaded");

window.startChat = function (path) {
  const chatBox = document.getElementById("chatBox");
  chatBox.classList.remove("hidden");

  addBotMessage(
    `خوشحالم که اینجایی 🌿<br>
     بر اساس ارزیابی، تمرکز ما روی <b>${path}</b> هست.<br>
     دوست دارم بدونم الان بیشتر چه احساسی داری؟`
  );

  document.getElementById("sendBtn").onclick = sendMessage;
};

window.sendMessage = function () {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;

  addUserMessage(text);
  input.value = "";

  setTimeout(() => {
    addBotMessage(generateResponse(text));
  }, 600);
};

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

function generateResponse(text) {
  if (text.includes("استرس") || text.includes("خسته")) {
    return "کاملاً قابل درکه 🌿<br>می‌خوای با یک تمرین تنفس کوتاه شروع کنیم؟";
  }

  if (text.includes("نمی‌دونم") || text.includes("گیج")) {
    return "این حس طبیعی‌ه 🌱<br>بیشتر سردرگمی‌ات مربوط به کدوم بخش زندگیه؟";
  }

  return "ممنون که گفتی 🌸<br>دوست داری الان روی آرامش، وضوح مسیر یا اقدام عملی تمرکز کنیم؟";
}
