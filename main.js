const quoteText = document.getElementById("quote-content");
const quoteId = document.getElementById("quoteId");
const quoteAuthor = document.getElementById("author");

const generateButton = document.getElementById("generate");
const autoGenerateButton = document.getElementById("auto");
const stopGenerateButton = document.getElementById("stop");

const menuButton = document.getElementById("menu-button");
const closeMenuButton = document.getElementById("close-menu");
const menu = document.getElementById("menu");

const listenButton = document.getElementById("listen");
const copyButton = document.getElementById("copy");
const shareButton = document.getElementById("shareButton");

const timeSetInput = document.getElementById("timeSet");
const checkbox = document.getElementById("setMode");

let intervalId;
let currentQuote = null;

generateButton.addEventListener("click", generateQuote);
autoGenerateButton.addEventListener("click", startAutoGenerate);
stopGenerateButton.addEventListener("click", stopAutoGenerate);
document.addEventListener("DOMContentLoaded", generateQuote);

menuButton.addEventListener("click", openMenu);
closeMenuButton.addEventListener("click", closeMenu);
checkbox.addEventListener("change", toggleDarkMode);

listenButton.addEventListener("click", quoteListen);
copyButton.addEventListener("click", copyQuote);
shareButton.addEventListener("click", shareToX);

// Get quotes function
async function getQuotes() {
  const response = await fetch("quotes.json");
  const data = await response.json();
  return data;
}

// generate one quote function
async function generateQuote() {
  const quotes = await getQuotes();
  currentQuote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteText.innerHTML = currentQuote.text;
  quoteId.innerHTML = currentQuote.id;
  quoteAuthor.innerHTML = currentQuote.author;
}

// start auto generate function
function startAutoGenerate() {
  generateQuote();
  var timeSetValue = parseInt(timeSetInput.value);
  var timeSetMilliseconds = timeSetValue * 1000;

  intervalId = setInterval(generateQuote, timeSetMilliseconds);
  autoGenerateButton.classList.add("d-none");
  stopGenerateButton.style.display = "flex";
}

// stop auto generate function
function stopAutoGenerate() {
  clearInterval(intervalId);
  autoGenerateButton.classList.remove("d-none");
  stopGenerateButton.style.display = "none";
}

// Add an event listener to the input field
timeSetInput.addEventListener("input", function () {
  var updatedValue = parseInt(timeSetInput.value);

  localStorage.setItem("timeSetValue", updatedValue);
});
var savedValue = localStorage.getItem("timeSetValue");

timeSetInput.value = savedValue || "3";

var timeSetMilliseconds = (savedValue || 3) * 1000;

// open menu button
function openMenu() {
  menu.classList.remove("d-none");
  menu.classList.add("fadeIn");
}

function closeMenu() {
  menu.classList.remove("fadeIn");
  menu.classList.add("fadeOut");
  menu.addEventListener(
    "animationend",
    () => {
      menu.classList.add("d-none");
      menu.classList.remove("fadeOut");
    },
    { once: true }
  );
}

// dark mode logic
function toggleDarkMode() {
  const body = document.body;

  body.classList.toggle("dark-mode");
}

// quote listeing function
async function quoteListen() {
  const synth = window.speechSynthesis;

  // Check if a quote is available
  if (currentQuote) {
    let text = currentQuote.text;
    const utterThis = new SpeechSynthesisUtterance(text);

    // Pause auto-generation
    stopAutoGenerate();

    // Listen to the quote
    synth.speak(utterThis);

    utterThis.onend = function () {
      // Resume auto-generation after the voice finishes speaking
      if (autoGenerateButton.classList.contains("d-none")) {
        startAutoGenerate();
      }
    };
  }
}

async function copyQuote() {
  const textToCopy = quoteText.innerText;

  try {
    await navigator.clipboard.writeText(textToCopy);
    Toast.fire({
      icon: "success",
      title: "تم النسخ بنجاح",
    });
  } catch (error) {
    Toast.fire({
      icon: "error",
      title: "حدث خطأ في نسخ النص",
    });
  }
}

function shareToX() {
  if (currentQuote) {
    const quoteText = currentQuote.text;
    const quoteAuthor = currentQuote.author;

    const shareText = `${quoteText} - ${quoteAuthor}`;

    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}`;

    window.open(tweetUrl);
  }
}
