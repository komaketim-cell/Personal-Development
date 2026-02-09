// --- بارگذاری JSON و نمایش سؤال‌ها ---
fetch("questions.json")
  .then((res) => res.json())
  .then((data) => initQuiz(data));

function initQuiz(data) {
  const quizBox = document.getElementById("quiz");
  data.questions.forEach((q) => {
    const div = document.createElement("div");
    div.classList.add("question");

    div.innerHTML = `
      <label>${q.id}. ${q.text}</label>
      <br>
      <input type="range" min="1" max="5" value="3" step="1" id="q${q.id}"/>
      <span id="val${q.id}">3</span>
    `;

    quizBox.appendChild(div);

    // نمایش مقدار عددی اسلایدر
    const slider = div.querySelector(`#q${q.id}`);
    const valDisplay = div.querySelector(`#val${q.id}`);
    slider.addEventListener("input", () => {
      valDisplay.textContent = slider.value;
    });
  });

  document.getElementById("submitBtn").addEventListener("click", () => {
    calculateResult(data);
  });
}

// --- تابع محاسبه امتیازات ---
function calculateResult(data) {
  const reversed = data.reversed_questions;
  const scores = { calmness: [], clarity: [], energy: [], readiness: [] };

  data.questions.forEach((q) => {
    let val = Number(document.getElementById(`q${q.id}`).value);
    if (reversed.includes(q.id)) val = 6 - val;
    scores[q.category].push(val);
  });

  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const calmness = avg(scores.calmness);
  const clarity = avg(scores.clarity);
  const energy = avg(scores.energy);
  const readiness = avg(scores.readiness);

  // --- منطق انتخاب مسیر ---
  let primary_path = "";
  if (calmness < 3) primary_path = "آرامش ذهن";
  else if (clarity < 3) primary_path = "خودشناسی";
  else if (energy >= 3.5 && clarity >= 3.5) primary_path = "موفقیت شغلی";
  else primary_path = "آرامش + خودشناسی";

  showResult({ calmness, clarity, energy, readiness, primary_path });
}

// --- نمایش نتیجه برای کاربر ---
function showResult(result) {
  const box = document.getElementById("resultBox");
  const text = document.getElementById("resultText");

  const summary = `
    🧘 آرامش ذهن: ${result.calmness.toFixed(1)}<br>
    🔍 وضوح مسیر: ${result.clarity.toFixed(1)}<br>
    🔋 انرژی و انگیزه: ${result.energy.toFixed(1)}<br>
    🌱 آمادگی برای کار درونی: ${result.readiness.toFixed(1)}<br><br>
    <b>مسیر پیشنهادی برای شروع:</b> ${result.primary_path}<br><br>
    📣 بر اساس پاسخ‌هات، از تمرین‌های <b>${result.primary_path}</b> شروع می‌کنیم تا 
    ذهن و مسیر رشدت با هم هماهنگ‌تر بشن 🌿
  `;

  text.innerHTML = summary;
  box.classList.remove("hidden");
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}
