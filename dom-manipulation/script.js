document.addEventListener("DOMContentLoaded", function () {
    const quotes = [
      { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
      { text: "Do what you can, with what you have, where you are.", category: "Inspiration" },
      { text: "The best way to predict the future is to create it.", category: "Success" },
    ];
  
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");
    const newQuoteText = document.getElementById("newQuoteText");
    const newQuoteCategory = document.getElementById("newQuoteCategory");
  
    function showRandomQuote() {
      if (quotes.length === 0) {
        quoteDisplay.innerHTML = "No quotes available.";
        return;
      }
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const quote = quotes[randomIndex];
      quoteDisplay.textContent = `${quote.text} - (${quote.category})`;
    }
  
    function addQuote() {
      const text = newQuoteText.value.trim();
      const category = newQuoteCategory.value.trim();
  
      if (text === "" || category === "") {
        alert("Both fields are required!");
        return;
      }
  
      quotes.push({ text, category });
      newQuoteText.value = "";
      newQuoteCategory.value = "";
      alert("Quote added successfully!");
    }
  
    newQuoteButton.addEventListener("click", showRandomQuote);
    window.addQuote = addQuote;
  
    // Display a quote on page load
    showRandomQuote();
  });
  