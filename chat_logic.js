function startChat(path) {
  const chatBox = document.getElementById("chatBox");
  chatBox.classList.remove("hidden");

  addBotMessage(
    `خوشحالم که اینجایی 🌿  
    بر اساس ارزیابی، بهتره تمرکزمون رو روی «${path}» بذاریم.
    دوست دارم اول بدونم: الان بیشتر چه احساسی داری؟`
  );

  document.getElementById("sendBtn").onclick = sendMessage;
}

function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;

  addUserMessage(text);
  input.value = "";

  setTimeout(() => {
    addBotMessage(generateResponse(text));
  }, 600);
}

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

function generateResponse(userText) {
  if (userText.includes("استرس") || userText.includes("خسته")) {
    return "کاملاً قابل درکه 🌿  
    می‌خوای با یک تمرین تنفس ۶۰ ثانیه‌ای شروع کنیم؟";
  }

  if (userText.includes("نمی‌دونم") || userText.includes("گیج")) {
    return "اشکالی نداره، این خودش یک نقطه شروعه.  
    به نظرت بیشترین سردرگمی‌ات مربوط به کدوم بخش زندگیه؟";
  }

  return "ممنون که به اشتراک گذاشتی 🌱  
  من کنارتم، قدم‌به‌قدم جلو می‌ریم.  
  دوست داری الان روی آرامش، وضوح مسیر یا اقدام عملی تمرکز کنیم؟";
}
