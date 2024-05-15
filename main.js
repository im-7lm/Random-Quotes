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

// Get a random quote from the API
async function getQuote() {
  const response = await fetch("http://api.quotable.io/random");
  const data = await response.json();
  return data;
}

// Generate one quote function
async function generateQuote() {
  const quote = await getQuote();
  currentQuote = {
    text: quote.content,
    id: Math.floor(Math.random() * quote.length),
    author: quote.author,
  };
  quoteText.innerHTML = currentQuote.text;
  quoteId.innerHTML = currentQuote.id;
  quoteAuthor.innerHTML = currentQuote.author;
}

// Start auto generate function
function startAutoGenerate() {
  generateQuote();
  var timeSetValue = parseInt(timeSetInput.value);
  var timeSetMilliseconds = timeSetValue * 1000;

  intervalId = setInterval(generateQuote, timeSetMilliseconds);
  autoGenerateButton.classList.add("d-none");
  stopGenerateButton.style.display = "flex";
}

// Stop auto generate function
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

// Open menu button
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

// Dark mode logic
function toggleDarkMode() {
  const body = document.body;

  body.classList.toggle("dark-mode");
}

// Quote listening function
async function quoteListen() {
  const synth = window.speechSynthesis;

  // Check if a quote is available
  if (currentQuote) {
    let text = currentQuote.text;
    let author = currentQuote.author;
    const utterThis = new SpeechSynthesisUtterance(`${text} by ${author}`);

    // Configure speech synthesis options
    utterThis.volume = 1; // Adjust the volume (0 to 1)
    utterThis.rate = 1; // Adjust the speech rate (0.1 to 10)
    utterThis.pitch = 1; // Adjust the pitch (0 to 2)

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

function copyQuote() {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  const textToCopy = quoteText.innerText;

  // Create a temporary input element
  const tempInput = document.createElement("input");
  tempInput.value = textToCopy;
  document.body.appendChild(tempInput);

  // Select the text field
  tempInput.select();
  tempInput.setSelectionRange(0, 99999); // For mobile devices

  // Copy the text inside the input field
  document.execCommand("copy");

  // Remove the temporary input element
  document.body.removeChild(tempInput);

  // Alert the copied text
  Toast.fire({
    icon: "success",
    title: "تم النسخ بنجاح",
  });
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

// Loading Screen
$(window).on("load", function () {
  $("body").css("overflow", "auto");
  $(".loader-overlay").fadeOut(2000);
  $(".loader").fadeOut(2000);
});
