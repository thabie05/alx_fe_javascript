// script.js
let quotes = [
    { text: "Be the change...", category: "Inspirational", id: 1 },
    { text: "Great work...", category: "Motivational", id: 2 },
    { text: "Life goes on...", category: "Life", id: 3 }
];

let serverQuotes = [];
let conflicts = [];

const STORAGE_KEY = 'quotesData';

function saveQuotes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

function loadQuotes() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) quotes = JSON.parse(stored);
}

function generateCategoryButtons() {
    const categories = ['All', ...new Set(quotes.map(q => q.category))];
    const container = document.getElementById('categoryButtons');
    container.innerHTML = '';

    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category;
        button.addEventListener('click', () => {
            showRandomQuote(category === 'All' ? null : category);
        });
        container.appendChild(button);
    });
}

function showRandomQuote(category = null) {
    const filtered = category ? quotes.filter(q => q.category === category) : quotes;
    const display = document.getElementById('quoteDisplay');
    display.innerHTML = filtered.length ?
        `<p>"${filtered[Math.floor(Math.random() * filtered.length)].text}"</p>` :
        '<p>No quotes in this category</p>';
    sessionStorage.setItem('lastCategory', category || 'All');
}

function populateCategories() {
    const select = document.getElementById('categoryFilter');
    select.innerHTML = '<option value="all">All Categories</option>';
    const categories = [...new Set(quotes.map(q => q.category))];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });
}

function filterQuotes() {
    const category = document.getElementById('categoryFilter').value;
    localStorage.setItem('selectedCategory', category);
    showRandomQuote(category === 'all' ? null : category);
}


function exportQuotes() {
    const data = JSON.stringify(quotes);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
}

function importQuotes(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = e => {
        try {
            const newQuotes = JSON.parse(e.target.result);
            quotes.push(...newQuotes);
            saveQuotes();
            generateCategoryButtons();
            populateCategories();
            showRandomQuote(); // Refresh quote display
        } catch (e) {
            alert('Invalid JSON file');
        }
    };
    reader.readAsText(file);
}

async function syncWithServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts'); // Replace with your server endpoint
        serverQuotes = await response.json();

        // Simulate adding id to server quotes (adapt as needed for your real API)
        serverQuotes = serverQuotes.map((quote, index) => ({...quote, id: index + 1, category: "Server"}));


        conflicts = quotes.filter(q =>
            serverQuotes.some(sq => sq.id === q.id && sq.text !== q.text)
        );

        if (conflicts.length > 0) {
            showConflictNotification();
            // For simplicity, take server version.  Implement more sophisticated merge logic if needed.
            quotes = quotes.map(q =>
                serverQuotes.find(sq => sq.id === q.id) || q
            );
        } else {
            // Add only new quotes from the server (avoid duplicates)
            const newServerQuotes = serverQuotes.filter(sq => !quotes.some(q => q.id === sq.id));
            quotes = [...quotes, ...newServerQuotes];
        }

        saveQuotes();
        generateCategoryButtons();
        populateCategories();
        showRandomQuote(); // Refresh quote display
    } catch (error) {
        console.error('Sync failed:', error);
    }
}

function showConflictNotification() {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '20px';
    notification.style.background = '#ffcccc';
    notification.textContent = `${conflicts.length} conflicts resolved!`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}



window.onload = () => {
    loadQuotes();
    generateCategoryButtons();
    populateCategories();

    const savedCategory = localStorage.getItem('selectedCategory') || 'all';
    document.getElementById('categoryFilter').value = savedCategory;
    showRandomQuote(savedCategory === 'all' ? null : savedCategory);

    document.getElementById('newQuote').addEventListener('click', () => showRandomQuote());
    document.getElementById('exportQuotes').addEventListener('click', exportQuotes);
    document.getElementById('importQuotes').addEventListener('change', importQuotes);
    document.getElementById('categoryFilter').addEventListener('change', filterQuotes);


    syncWithServer(); // Initial sync
    setInterval(syncWithServer, 300000); // Periodic sync every 5 minutes
};