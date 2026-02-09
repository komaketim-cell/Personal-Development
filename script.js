let finalResult = {};

fetch("questions.json")
  .then(res => res.json())
  .then(data => initQuiz(data));

function initQuiz(data) {
  const quiz = document.getElementById("quiz");

  data.questions.forEach(q => {
    quiz.innerHTML += `
      <div class="question">
        <label>${q.id}. ${q.text}</label><br>
        <input type="range" min="1" max="5" value="3" id="q${q.id}">
      </div>
    `;
  });

  document.getElementById("submitBtn").onclick = () => calculate(data);
}

function calculate(data) {
  const reversed = data.reversed_questions;
  const scores = { calmness: [], clarity: [], energy: [], readiness: [] };

  data.questions.forEach(q => {
    let v = Number(document.getElementById(`q${q.id}`).value);
    if (reversed.includes(q.id)) v = 6 - v;
    scores[q.category].push(v);
  });

  const avg = arr => arr.reduce((a,b)=>a+b,0)/arr.length;

  finalResult = {
    calmness: avg(scores.calmness),
    clarity: avg(scores.clarity),
    energy: avg(scores.energy),
    readiness: avg(scores.readiness)
  };

  if (finalResult.calmness < 3) finalResult.path = "آرامش ذهن";
  else if (finalResult.clarity < 3) finalResult.path = "خودشناسی";
  else if (finalResult.energy >= 3.5) finalResult.path = "موفقیت شغلی";
  else finalResult.path = "آرامش + خودشناسی";

  showResult();
}

function showResult() {
  document.getElementById("resultBox").classList.remove("hidden");
  document.getElementById("resultText").innerHTML = `
    🧘 آرامش: ${finalResult.calmness.toFixed(1)}<br>
    🔍 وضوح: ${finalResult.clarity.toFixed(1)}<br>
    🔋 انرژی: ${finalResult.energy.toFixed(1)}<br>
    🌱 آمادگی: ${finalResult.readiness.toFixed(1)}<br><br>
    <b>مسیر پیشنهادی:</b> ${finalResult.path}
  `;

  startChat(finalResult.path);
}
