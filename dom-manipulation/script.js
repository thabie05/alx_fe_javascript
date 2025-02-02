// Storage keys
const LOCAL_STORAGE_KEY = 'quotesData';
const SESSION_STORAGE_KEY = 'lastQuote';

let quotes = [];
let selectedCategory = null;

// Initialize application
window.onload = function() {
    loadQuotesFromStorage();
    generateCategoryButtons();
    createAddQuoteForm();
    setupEventListeners();
    showRandomQuote();
};

// Web Storage functions
function loadQuotesFromStorage() {
    const storedQuotes = localStorage.getItem(LOCAL_STORAGE_KEY);
    quotes = storedQuotes ? JSON.parse(storedQuotes) : [
        { text: "Be the change you wish to see in the world.", category: "Inspirational" },
        { text: "The only way to do great work is to love what you do.", category: "Motivational" },
        { text: "In three words I can sum up everything I've learned about life: it goes on.", category: "Life" }
    ];
}

function saveQuotesToStorage() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(quotes[quotes.length - 1]));
}

// JSON Handling functions
function exportQuotes() {
    const dataStr = JSON.stringify(quotes);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quotes.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function importQuotes(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (!Array.isArray(importedQuotes)) throw new Error('Invalid format');
            
            quotes.push(...importedQuotes);
            saveQuotesToStorage();
            generateCategoryButtons();
            showRandomQuote();
            alert(`Successfully imported ${importedQuotes.length} quotes!`);
        } catch (error) {
            alert('Error importing quotes: Invalid JSON format');
        }
    };
    reader.readAsText(file);
}

// Modified existing functions
function addQuote() {
    const textInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');
    const text = textInput.value.trim();
    const category = categoryInput.value.trim();

    if (!text || !category) {
        alert('Please fill in both fields.');
        return;
    }

    quotes.push({ text, category });
    saveQuotesToStorage();
    textInput.value = '';
    categoryInput.value = '';

    const categories = new Set(quotes.map(quote => quote.category));
    if (!categories.has(category)) generateCategoryButtons();

    showRandomQuote();
}

function showRandomQuote() {
    const filteredQuotes = selectedCategory 
        ? quotes.filter(quote => quote.category === selectedCategory)
        : quotes;
    
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = '';

    if (filteredQuotes.length === 0) {
        quoteDisplay.textContent = 'No quotes available in this category.';
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    const quoteElement = document.createElement('div');
    quoteElement.innerHTML = `<p>"${quote.text}"</p><em>- ${quote.category}</em>`;
    quoteDisplay.appendChild(quoteElement);

    // Save to session storage
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(quote));
}

// Setup functions
function setupEventListeners() {
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
    document.getElementById('exportBtn').addEventListener('click', exportQuotes);
    document.getElementById('importFile').addEventListener('change', (e) => {
        if (e.target.files[0]) {
            importQuotes(e.target.files[0]);
            e.target.value = '';
        }
    });
}

// Existing UI functions
function generateCategoryButtons() {
    const categories = ['All', ...new Set(quotes.map(quote => quote.category))];
    const container = document.createElement('div');
    container.id = 'categoryButtons';
    
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category;
        button.addEventListener('click', () => {
            selectedCategory = category === 'All' ? null : category;
            showRandomQuote();
        });
        container.appendChild(button);
    });

    const existingContainer = document.getElementById('categoryButtons');
    if (existingContainer) {
        existingContainer.replaceWith(container);
    } else {
        document.body.insertBefore(container, document.getElementById('quoteDisplay'));
    }
}

function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
        <div style="margin-top: 20px;">
            <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
            <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
            <button onclick="addQuote()">Add Quote</button>
        </div>
    `;
    const newQuoteButton = document.getElementById('newQuote');
    newQuoteButton.parentNode.insertBefore(formContainer, newQuoteButton.nextSibling);
}