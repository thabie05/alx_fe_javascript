let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "Be the change...", category: "inspiration" },
    { text: "The only way...", category: "work" }
];

let currentQuotes = [];

function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    if (currentQuotes.length === 0) {  // Use currentQuotes for filtering
        quoteDisplay.textContent = "No quotes available.";
        return;
    }
    const randomIndex = Math.floor(Math.random() * currentQuotes.length); // Use currentQuotes
    const quote = currentQuotes[randomIndex]; // Use currentQuotes
    quoteDisplay.innerHTML = `<p>"${quote.text}"</p><em>${quote.category}</em>`;
}

function createAddQuoteForm() {
    const formDiv = document.createElement('div');
    formDiv.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote">
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category">
        <button onclick="addQuote()">Add Quote</button>
    `;
    document.body.appendChild(formDiv);
}

function addQuote() {
    const text = document.getElementById('newQuoteText').value.trim();
    const category = document.getElementById('newQuoteCategory').value.trim();
    if (text && category) {
        quotes.push({ text, category });
        saveQuotes();
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        populateCategories(); // Update categories after adding
        filterQuotes();       // Apply the filter after adding
        showRandomQuote();
    }
}

function createExportButton() {
    const btn = document.createElement('button');
    btn.textContent = 'Export Quotes';
    btn.onclick = () => {
        const data = JSON.stringify(quotes);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotes.json';
        a.click();
        URL.revokeObjectURL(url);
    };
    document.body.appendChild(btn);
}

function createImportInput() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            quotes = JSON.parse(e.target.result);
            saveQuotes();
            populateCategories(); // Update categories after import
            filterQuotes();      // Apply the filter after import
            showRandomQuote();
        };
        reader.readAsText(file);
    };
    document.body.appendChild(input);
}

function createCategoryFilter() {
    const filter = document.createElement('select');
    filter.id = 'categoryFilter';
    filter.innerHTML = '<option value="all">All Categories</option>';
    filter.onchange = filterQuotes;
    document.body.insertBefore(filter, document.getElementById('quoteDisplay'));
}

function populateCategories() {
    const categories = [...new Set(quotes.map(q => q.category))];
    const filter = document.getElementById('categoryFilter');
    filter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        filter.appendChild(option);
    });
    const saved = localStorage.getItem('selectedCategory');
    if (saved) filter.value = saved;
}

function filterQuotes() {
    const category = document.getElementById('categoryFilter').value;
    localStorage.setItem('selectedCategory', category);
    currentQuotes = category === 'all' ? quotes : quotes.filter(q => q.category === category);
    showRandomQuote();
}

async function syncWithServer() {
    try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts');
        const posts = await res.json();
        const serverQuotes = posts.map(post => ({
            text: post.title,
            category: 'server'
        }));

        serverQuotes.forEach(sq => {
            if (!quotes.some(q => q.text === sq.text)) {
                quotes.push(sq);
            }
        });

        saveQuotes();
        populateCategories();
        filterQuotes();
        showRandomQuote(); // Show a quote after sync
        alert('Synced with server! New quotes added.');
    } catch (error) {
        console.error('Sync failed:', error);
    }
}

function createSyncButton() {
    const btn = document.createElement('button');
    btn.textContent = 'Sync Now';
    btn.onclick = syncWithServer;
    document.body.appendChild(btn);
}


// Initialization and Event Listeners

document.getElementById('newQuote').addEventListener('click', showRandomQuote);

createAddQuoteForm();
createExportButton();
createImportInput();
createCategoryFilter();

populateCategories(); // Populate *after* creating the filter
filterQuotes();      // Apply the filter *after* populating categories
showRandomQuote();

createSyncButton();
setInterval(syncWithServer, 60000);