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
            generate