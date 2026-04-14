// 🔹 ANIME CATEGORIES
const animeCategories = {

  Action: [
    "Naruto", "Attack on Titan", "Jujutsu Kaisen",
    "Demon Slayer", "Chainsaw Man", "Fire Force",
    "Tokyo Revengers", "Black Clover", "Bleach"
  ],

  Romance: [
    "Tonikaku Kawaii", "My Dress-Up Darling",
    "The Angel Next Door Spoils Me Rotten",
    "My Tiny Senpai", "Darling in the Franxx",
    "Horimiya", "Kimi ni Todoke"
  ],

  Comedy: [
    "KonoSuba", "Gintama",
    "The Disastrous Life of Saiki K",
    "Grand Blue", "Nichijou",
    "Asobi Asobase"
  ],

  Thriller: [
    "Death Note", "Erased",
    "Tokyo Ghoul", "Parasyte",
    "Another", "Monster"
  ],

  Fantasy: [
    "Solo Leveling", "Re:Zero",
    "Sword Art Online", "No Game No Life",
    "Overlord", "Magi"
  ],

  SliceOfLife: [
    "Spy x Family", "Barakamon",
    "Clannad", "Usagi Drop",
    "March Comes in Like a Lion"
  ],

  Psychological: [
    "Death Note",
    "Monster",
    "Paranoia Agent",
    "Serial Experiments Lain",
    "Perfect Blue",
    "Psycho-Pass",
    "Ergo Proxy",
    "Welcome to the NHK",
    "Future Diary",
    "Kaiji"
  ]
};

// 🔹 STATE
let allAnime = [];
let activeAnime = [];
let watchedAnime = [];

let isInitialized = false;
let currentRotation = 0;
let lastIndex = -1;

// 🎯 RANDOM ANIME (only from current category)
function getRandomAnime() {
  const available = allAnime.filter(a => !watchedAnime.includes(a));
  return available[Math.floor(Math.random() * available.length)];
}

// 🎡 FILL ACTIVE (8 items)
function fillActive() {
  activeAnime = [];

  let attempts = 0;

  while (activeAnime.length < 8 && attempts < 50) {
    let rand = getRandomAnime();

    if (rand && !activeAnime.includes(rand)) {
      activeAnime.push(rand);
    }

    attempts++;
  }
}

// 🔁 REFILL WHEEL (IMPORTANT)
function refillWheel() {
  let remainingAnime = allAnime.filter(a =>
    !watchedAnime.includes(a) && !activeAnime.includes(a)
  );

  while (activeAnime.length < 8 && remainingAnime.length > 0) {
    let randomIndex = Math.floor(Math.random() * remainingAnime.length);
    activeAnime.push(remainingAnime[randomIndex]);
    remainingAnime.splice(randomIndex, 1);
  }
}

// ⚙️ RENDER ACTIVE LIST
function renderActive() {
  const container = document.getElementById("activeList");
  container.innerHTML = "";

  activeAnime.forEach((anime, index) => {
    const div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
      ${anime}
      <button onclick="removeAnime(${index})">❌</button>
    `;

    container.appendChild(div);
  });
}

// ❌ REMOVE FROM WHEEL
function removeAnime(index) {
  activeAnime.splice(index, 1);
  refillWheel();

  renderActive();
  drawWheel();
}

// ✅ CHECKLIST
function renderChecklist() {
  const container = document.getElementById("checklist");
  container.innerHTML = "";

  allAnime.forEach((anime) => {
    const checked = watchedAnime.includes(anime);

    const div = document.createElement("div");

    div.innerHTML = `
      <label>
        <input type="checkbox" ${checked ? "checked" : ""}
        onchange="toggleAnime('${anime}')">
        ${anime}
      </label>
    `;

    container.appendChild(div);
  });
}

// 🔄 TOGGLE ANIME (MAIN LOGIC)
function toggleAnime(anime) {

  if (watchedAnime.includes(anime)) {
    // ❌ untick
    watchedAnime = watchedAnime.filter(a => a !== anime);
  } else {
    // ✅ tick
    watchedAnime.push(anime);

    // remove from wheel
    activeAnime = activeAnime.filter(a => a !== anime);

    // refill
    refillWheel();
  }

  // 🔥 RESET WHEN ALL DONE
  if (watchedAnime.length === allAnime.length) {
    alert("All anime in this category completed! Resetting...");

    watchedAnime = [];
    fillActive();
  }

  renderActive();
  renderChecklist();
  drawWheel();
}

// 🎡 DRAW WHEEL
function drawWheel() {
  const canvas = document.getElementById("wheelCanvas");
  const ctx = canvas.getContext("2d");

  const radius = canvas.width / 2;
  const angle = (2 * Math.PI) / activeAnime.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  activeAnime.forEach((anime, i) => {
    const start = i * angle;
    const end = start + angle;

    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, start, end);
    ctx.fillStyle = i % 2 === 0 ? "#00ffff55" : "#00ffffaa";
    ctx.fill();

    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(start + angle / 2);
    ctx.fillStyle = "white";
    ctx.font = "13px Arial";
    ctx.fillText(anime, radius / 2, 0);
    ctx.restore();
  });
}

// 🎡 SPIN WHEEL
function spinWheel() {
  let index;

  do {
    index = Math.floor(Math.random() * activeAnime.length);
  } while (index === lastIndex);

  lastIndex = index;

  const angle = 360 / activeAnime.length;
  const stopAngle = 360 - index * angle - angle / 2;

  const spins = 360 * (4 + Math.random() * 2);

  currentRotation += spins + stopAngle;

  const canvas = document.getElementById("wheelCanvas");
  canvas.style.transform = `rotate(${currentRotation}deg)`;

  setTimeout(() => {
    const selected = activeAnime[index];
    document.getElementById("result").innerText =
      "🎯 You should watch: " + selected;
  }, 3000);
}

// 🟢 NAVIGATION
function goToCategory() {
  document.getElementById("landingPage").style.display = "none";
  document.getElementById("categoryPage").style.display = "block";
}

// 🚀 START APP WITH CATEGORY
function startApp(category) {
  document.getElementById("categoryPage").style.display = "none";
  document.getElementById("mainApp").style.display = "block";

  // 🔥 SET CATEGORY
  allAnime = [...animeCategories[category]];
  watchedAnime = [];

  fillActive();
  renderActive();
  renderChecklist();
  drawWheel();

  document.getElementById("spinBtn").addEventListener("click", spinWheel);
}
