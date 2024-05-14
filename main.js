const quoteText = document.getElementById("quote-content");
const quoteId = document.getElementById("quoteId");
const quoteAuthor = document.getElementById("author");

const generateButton = document.getElementById("generate");
const autoGenerateButton = document.getElementById("auto");
const stopGenerateButton = document.getElementById("generate");

async function getQuotes() {
  const response = await fetch("quotes.json");
  const data = await response.json();
  return data;
}

async function generateQuote() {
  const quotes = await getQuotes();
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteText.innerHTML = quote.text;
  quoteId.innerHTML = quote.id;
  quoteAuthor.innerHTML = quote.author;
}

generateButton.addEventListener("click", generateQuote);
