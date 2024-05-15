const quoteText = document.getElementById("quote-content");
const quoteId = document.getElementById("quoteId");
const quoteAuthor = document.getElementById("author");

const generateButton = document.getElementById("generate");
const autoGenerateButton = document.getElementById("auto");
const stopGenerateButton = document.getElementById("stop");

const menuButton = document.getElementById("menu-button");
const closeMenuButton = document.getElementById("close-menu");
const menu = document.getElementById("menu");

const timeSetInput = document.getElementById("timeSet");
const checkbox = document.getElementById("setMode");

let intervalId;

generateButton.addEventListener("click", generateQuote);
autoGenerateButton.addEventListener("click", startAutoGenerate);
stopGenerateButton.addEventListener("click", stopAutoGenerate);
checkbox.addEventListener("change", toggleDarkMode);

// Get quotes function
async function getQuotes() {
  const response = await fetch("quotes.json");
  const data = await response.json();
  return data;
}

// generate one quote function
async function generateQuote() {
  const quotes = await getQuotes();
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteText.innerHTML = quote.text;
  quoteId.innerHTML = quote.id;
  quoteAuthor.innerHTML = quote.author;
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

// menu
menuButton.addEventListener("click", () => {
  menu.classList.remove("d-none");
  menu.classList.add("fadeIn");
});

closeMenuButton.addEventListener("click", () => {
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
});

// dark mode logic
function toggleDarkMode() {
  const body = document.body;

  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    image.src = darkSrc;
  } else {
    image.src = lightSrc;
  }
}
