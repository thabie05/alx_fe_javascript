// script.js
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const categoryFilter = document.getElementById('categoryFilter');
const importFile = document.getElementById('importFile');

let quotes = JSON.parse(localStorage.getItem('quotes')) || [];
let lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';

// Function to display a random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.textContent = "No quotes available. Add some!";
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteDisplay.textContent = quotes[randomIndex].text;
}

// Function to add a new quote
function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (text === "" || category === "") {
        alert("Please enter both quote and category.");
        return;
    }

    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories(); // Update categories in the dropdown
    newQuoteText.value = "";
    newQuoteCategory.value = "";

    if (categoryFilter.value !== 'all' && categoryFilter.value !== category) {
        return; //Don't display the quote if it doesn't match the filter
    }
    showRandomQuote(); // Optionally show the new quote
}

function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
    syncToServer(); // Sync with the server after saving
}

function populateCategories() {
    const uniqueCategories = ['all']; // Start with "All Categories"
    quotes.forEach(quote => {
        if (!uniqueCategories.includes(quote.category)) {
            uniqueCategories.push(quote.category);
        }
    });

    categoryFilter.innerHTML = ""; // Clear existing options
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.text = category;
        categoryFilter.appendChild(option);
    });

    categoryFilter.value = lastSelectedCategory; // Restore last selected category
}

function filterQuotes() {
    lastSelectedCategory = categoryFilter.value;
    localStorage.setItem('lastSelectedCategory', lastSelectedCategory);

    if (lastSelectedCategory === 'all') {
        showRandomQuote(); // Show a random quote from all categories
        return;
    }

    const filteredQuotes = quotes.filter(quote => quote.category === lastSelectedCategory);

    if (filteredQuotes.length === 0) {
        quoteDisplay.textContent = "No quotes in this category.";
    } else {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        quoteDisplay.textContent = filteredQuotes[randomIndex].text;
    }
}


// JSON Import/Export
function exportToJson() {
    const jsonString = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);

            //Basic conflict resolution (server wins)
            quotes = importedQuotes;

            saveQuotes();
            populateCategories();
            filterQuotes(); // Refresh display after import

            alert('Quotes imported successfully!');
        } catch (error) {
            alert('Error importing quotes. Invalid JSON format.');
            console.error("JSON Parse Error:", error);
        }
    };
    fileReader.readAsText(event.target.files[0]);
}


// Server Simulation and Sync
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos'); // Replace with your server endpoint
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const serverQuotes = await response.json();

    //Basic conflict resolution (server wins)
    quotes = serverQuotes.map(item => ({ text: item.title, category: "Server Quote" })); // Adapt as needed

    saveQuotes();
    populateCategories();
    filterQuotes();
    console.log("Quotes synced from server.");
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
  }
}

async function syncToServer() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos', { // Replace with your server endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quotes)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      console.log("Quotes synced to server.");
    } catch (error) {
      console.error("Error syncing quotes to server:", error);
    }
  }
  

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    populateCategories();
    filterQuotes(); // Apply initial filter
    showRandomQuote();

    //Periodic Sync (e.g., every 5 minutes)
    setInterval(fetchQuotesFromServer, 300000); //300000 milliseconds = 5 minutes
});


newQuoteButton.addEventListener('click', showRandomQuote);

// Event listeners for import/export
const exportButton = document.createElement('button');
exportButton.textContent = 'Export to JSON';
exportButton.onclick = exportToJson;
document.body.appendChild(exportButton);

document.body.appendChild(importFile); // Add the import input to the body