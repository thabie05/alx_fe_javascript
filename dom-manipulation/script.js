// script.js
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');

let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Hope" },
    // Add more initial quotes here
];

newQuoteButton.addEventListener('click', showRandomQuote);
showRandomQuote(); // Display initial quote on load

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteDisplay.textContent = quotes[randomIndex].text;
}

function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText.trim() === "" || newQuoteCategory.trim() === "") {
        alert("Please enter both a quote and a category.");
        return;
    }

    const newQuote = {
        text: newQuoteText,
        category: newQuoteCategory
    };

    quotes.push(newQuote);
    showRandomQuote(); // Optionally show the new quote immediately
    document.getElementById('newQuoteText').value = ""; // Clear input fields
    document.getElementById('newQuoteCategory').value = "";
}