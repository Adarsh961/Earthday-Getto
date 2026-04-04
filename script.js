/* ─────────────────────────────────────────
   GAME DATA — paste your image URLs below
───────────────────────────────────────── */
const rounds = [
  {
    prompt: "Which outfit is crafted from truly sustainable materials?",
    outfits: [
      {
        image: "https://raw.githubusercontent.com/Adarsh961/Earthday-Getto/main/james-balensiefen-XovTIAjyx2E-unsplash.jpg",   // ← Round 1, Option A
        name: "Raw Denim Jacket",
        desc: "Stone-washed denim with zero synthetic blends, natural indigo dye and upcycled metal rivets.",
        brand: "Undenim",
        sustainable: true,
      },
      {
        image: "https://raw.githubusercontent.com/Adarsh961/Earthday-Getto/main/image.jpg",   // ← Round 1, Option B
        name: "Faux Leather Blazer",
        desc: "Synthetic PVC-based faux leather with polyester lining. Mass-produced fast-fashion staple.",
        brand: "Fast Co.",
        sustainable: false,
      },
    ],
  },
  {
    prompt: "Both look beautiful, but which one loves the planet back?",
    outfits: [
      {
        image: "https://raw.githubusercontent.com/Adarsh961/Earthday-Getto/main/image(1).jpg",   // ← Round 2, Option A
        name: "Nylon Swimwear Set",
        desc: "100% virgin nylon and elastane. High water consumption. Microplastics shed every wash.",
        brand: "TrendWave",
        sustainable: false,
      },
      {
        image: "https://raw.githubusercontent.com/Adarsh961/Earthday-Getto/main/image(2).jpg",   // ← Round 2, Option B
        name: "Handloom Linen Kurta",
        desc: "Hand-woven on traditional looms with natural linen, vegetable dyes and zero synthetic finishing.",
        brand: "Islands of Loom",
        sustainable: true,
        objPos: "center 20%" 
      },
    ],
  },
  {
    prompt: "The final round, pick the true sustainability champion!",
    outfits: [
      {
        image: "https://raw.githubusercontent.com/Adarsh961/Earthday-Getto/main/image(4).jpg",   // ← Round 3, Option A
        name: "Plant-Based Sneaker",
        desc: "Upper from corn waste, natural rubber soles, recycled sugarcane foam insoles. Carbon neutral shipping.",
        brand: "Thaely",
        sustainable: true,
        objPos: "60% center",
      },
      {
        image: "https://raw.githubusercontent.com/Adarsh961/Earthday-Getto/main/women-heeled-shoes.jpg",   // ← Round 3, Option B
        name: "Glitter Platform Heel",
        desc: "Acrylic platform, PVC straps and synthetic glitter micro-particles. Non-recyclable composite materials.",
        brand: "SparkFast",
        sustainable: false,
      },
    ],
  },
];

const treeStages = [
  { emoji: "🌱", label: "Your Sustainability Seed" },
  { emoji: "🌿", label: "A Sprout is Growing!" },
  { emoji: "🌳", label: "A Thriving Tree!" },
  { emoji: "🌲", label: "A Champion Forest Tree!" },
];

const discounts   = [10, 20, 40];
const couponCodes = ["HERO10", "HERO20", "HERO30"];

/* ─────────────────────────────────────────
   STATE
───────────────────────────────────────── */
let currentRound  = 0;
let correctStreak = 0;
let treeLevel     = 0;
let gameOver      = false;

/* ─────────────────────────────────────────
   DOM REFS
───────────────────────────────────────── */
const treeArt        = document.getElementById("treeArt");
const treeLabelEl    = document.getElementById("treeLabel");
const roundLabel     = document.getElementById("roundLabel");
const questionPrompt = document.getElementById("questionPrompt");
const outfitsGrid    = document.getElementById("outfitsGrid");
const overlay        = document.getElementById("overlay");
const wrongPopup     = document.getElementById("wrongPopup");
const winPopup       = document.getElementById("winPopup");
const dots           = [
  document.getElementById("dot1"),
  document.getElementById("dot2"),
  document.getElementById("dot3"),
];

/* ─────────────────────────────────────────
   INIT
───────────────────────────────────────── */
renderRound();

/* ─────────────────────────────────────────
   RENDER ROUND
───────────────────────────────────────── */
function renderRound() {
  if (gameOver) return;

  const round = rounds[currentRound];
  roundLabel.textContent     = "Round " + (currentRound + 1) + " of 3";
  questionPrompt.textContent = round.prompt;

  const shuffled = round.outfits.slice().sort(() => Math.random() - 0.5);

  outfitsGrid.innerHTML = "";

  shuffled.forEach(function(outfit) {
    const card = document.createElement("div");
    card.className = "outfit-card";

    // Build card HTML — image tag, not emoji
    card.innerHTML =
      '<img class="outfit-img" src="' + outfit.image + '" alt="' + outfit.name + '" style="object-position:' + (outfit.objPos || 'center center') + '" />' +
      '<div class="outfit-name">' + outfit.name + '</div>' +
      
      '<span class="outfit-brand">' + outfit.brand + '</span>';

    card.addEventListener("click", function() {
      handlePick(outfit.sustainable, card);
    });

    outfitsGrid.appendChild(card);
  });

  updateTree();
}

/* ─────────────────────────────────────────
   HANDLE PICK
───────────────────────────────────────── */
function handlePick(isCorrect, card) {
  if (gameOver) return;

  document.querySelectorAll(".outfit-card").forEach(function(c) {
    c.style.pointerEvents = "none";
  });

  if (isCorrect) {
    card.classList.add("selected-correct");
    correctStreak++;
    treeLevel = Math.min(treeLevel + 1, 3);
    updateTree();
    markDot(currentRound, true);

    setTimeout(function() {
      currentRound++;
      if (currentRound >= rounds.length) {
        lockGameForever();
        showWin();
      } else {
        renderRound();
      }
    }, 900);

  } else {
    card.classList.add("selected-wrong");
    markDot(currentRound, false);

    var earnedCode = correctStreak > 0 ? couponCodes[correctStreak - 1] : "null";
    var earnedPct  = correctStreak > 0 ? discounts[correctStreak - 1]   : null;

    lockGameForever();
    setTimeout(function() { showWrongPopup(earnedPct, earnedCode); }, 600);
  }
}

/* ─────────────────────────────────────────
   LOCK GAME FOREVER
───────────────────────────────────────── */
function lockGameForever() {
  gameOver = true;
  document.querySelectorAll(".outfit-card").forEach(function(c) {
    c.style.pointerEvents = "none";
    c.style.cursor = "default";
  });
}

/* ─────────────────────────────────────────
   UPDATE TREE
───────────────────────────────────────── */
function updateTree() {
  var stage = treeStages[treeLevel];
  treeArt.textContent    = stage.emoji;
  treeLabelEl.textContent = stage.label;

  treeArt.style.animation = "none";
  void treeArt.offsetWidth;
  treeArt.style.animation = "";
}

/* ─────────────────────────────────────────
   SCORE DOTS
───────────────────────────────────────── */
function markDot(index, correct) {
  dots[index].classList.add(correct ? "correct" : "wrong");
}

/* ─────────────────────────────────────────
   WRONG POPUP
───────────────────────────────────────── */
function showWrongPopup(discountPct, code) {
  var titleEl = document.getElementById("wrongTitle");
  var bodyEl  = document.getElementById("wrongBody");
  var codeEl  = document.getElementById("wrongCouponCode");
  var couponBox = document.getElementById("wrongCoupon");

  if (discountPct) {
    titleEl.textContent = "You made the Earth smile! 🌍";
    bodyEl.textContent     = "You got " + correctStreak + " right — here's your " + discountPct + "% reward!";
    codeEl.textContent     = code;
    couponBox.style.display = "flex";
  } else {
    titleEl.textContent = "The Earth still loves you! 🌏";
    bodyEl.textContent     = "That wasn't the most sustainable pick — but your curiosity already helps the planet.";
    couponBox.style.display = "none";
  }
  
  openPopup(wrongPopup);
}

/* ─────────────────────────────────────────
   WIN POPUP
───────────────────────────────────────── */
function showWin() {
  launchConfetti();
  openPopup(winPopup);
}

/* ─────────────────────────────────────────
   POPUP UTILS
───────────────────────────────────────── */
function openPopup(popup) {
  overlay.classList.add("active");
  popup.style.display = "block";
  requestAnimationFrame(function() {
    popup.classList.add("active");
  });
}

/* ─────────────────────────────────────────
   COPY CODE
───────────────────────────────────────── */
function copyCode(elId) {
  var code = document.getElementById(elId).textContent;
  var btn  = document.querySelector("#" + elId + " ~ .copy-btn");

  navigator.clipboard.writeText(code).then(function() {
    if (btn) {
      var orig = btn.textContent;
      btn.textContent = "Copied ✓";
      setTimeout(function() { btn.textContent = orig; }, 1800);
    }
  }).catch(function() {
    var el = document.getElementById(elId);
    var range = document.createRange();
    range.selectNode(el);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
  });
}

/* ─────────────────────────────────────────
   CONFETTI
───────────────────────────────────────── */
function launchConfetti() {
  var wrap   = document.getElementById("confettiWrap");
  wrap.innerHTML = "";
  var colors = ["#25bcb4", "#ffffff", "#a8ede9", "#1a9990"];

  for (var i = 0; i < 55; i++) {
    var piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.cssText =
      "left:" + (Math.random() * 100) + "%;" +
      "background:" + colors[Math.floor(Math.random() * colors.length)] + ";" +
      "width:" + (4 + Math.random() * 8) + "px;" +
      "height:" + (4 + Math.random() * 8) + "px;" +
      "border-radius:" + (Math.random() > 0.5 ? "50%" : "2px") + ";" +
      "animation-duration:" + (1.5 + Math.random() * 2.5) + "s;" +
      "animation-delay:" + (Math.random() * 0.8) + "s;";
    wrap.appendChild(piece);
  }
}