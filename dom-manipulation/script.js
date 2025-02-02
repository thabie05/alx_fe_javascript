// Load quotes from localStorage or use defaults
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "Be the change you wish to see in the world.", category: "inspiration" },
    { text: "The only way to do great work is to love what you do.", category: "work" }
  ];
  let currentQuotes = [];
  
  // Save quotes to localStorage
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  // Display a random quote; use currentQuotes if filtering is active, otherwise use quotes
  function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const quotesToUse = currentQuotes.length > 0 ? currentQuotes : quotes;
    if (quotesToUse.length === 0) {
      quoteDisplay.textContent = "No quotes available.";
      return;
    }
    const randomIndex = Math.floor(Math.random() * quotesToUse.length);
    const quote = quotesToUse[randomIndex];
    quoteDisplay.innerHTML = `<p>"${quote.text}"</p><em>${quote.category}</em>`;
  }
  
  // Create the form for adding a new quote
  function createAddQuoteForm() {
    const formDiv = document.createElement('div');
    formDiv.innerHTML = `
      <input id="newQuoteText" type="text" placeholder="Enter a new quote">
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category">
      <button id="addQuoteButton">Add Quote</button>
    `;
    document.body.appendChild(formDiv);
    document.getElementById('addQuoteButton').addEventListener('click', addQuote);
  }
  
  // Unified addQuote function: adds, saves, updates filtering and displays the quote
  function addQuote() {
    const text = document.getElementById('newQuoteText').value.trim();
    const category = document.getElementById('newQuoteCategory').value.trim();
    if (text && category) {
      quotes.push({ text, category });
      saveQuotes();
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
      populateCategories();
      filterQuotes();
      showRandomQuote();
    }
  }
  
  // Create export button to download the quotes as a JSON file
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
  
  // Create import input to load quotes from a JSON file
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
        populateCategories();
        filterQuotes();
        showRandomQuote();
      };
      reader.readAsText(file);
    };
    document.body.appendChild(input);
  }
  
  // Create a select element for filtering quotes by category
  function createCategoryFilter() {
    const filter = document.createElement('select');
    filter.id = 'categoryFilter';
    filter.innerHTML = '<option value="all">All Categories</option>';
    filter.onchange = filterQuotes;
    // Insert filter before the quote display element if it exists
    const quoteDisplay = document.getElementById('quoteDisplay');
    if (quoteDisplay) {
      document.body.insertBefore(filter, quoteDisplay);
    } else {
      document.body.appendChild(filter);
    }
  }
  
  // Populate the category filter with unique categories from quotes
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
  
  // Filter quotes based on the selected category and update the display
  function filterQuotes() {
    const category = document.getElementById('categoryFilter').value;
    localStorage.setItem('selectedCategory', category);
    currentQuotes = category === 'all' ? quotes : quotes.filter(q => q.category === category);
    showRandomQuote();
  }
  
  // Sync quotes with the server, adding any new ones from a sample API endpoint
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
      alert('Synced with server! New quotes added.');
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
  
  // Create a manual sync button to trigger server synchronization
  function createSyncButton() {
    const btn = document.createElement('button');
    btn.textContent = 'Sync Now';
    btn.onclick = syncWithServer;
    document.body.appendChild(btn);
  }
  
  // Initialize the app when the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', () => {
    // Ensure there is an element to display quotes
    if (!document.getElementById('quoteDisplay')) {
      const quoteDisplay = document.createElement('div');
      quoteDisplay.id = 'quoteDisplay';
      document.body.appendChild(quoteDisplay);
    }
    createCategoryFilter();
    createAddQuoteForm();
    createExportButton();
    createImportInput();
    createSyncButton();
    populateCategories();
    filterQuotes();
    showRandomQuote();
    // Automatically sync with the server every 60 seconds
    setInterval(syncWithServer, 60000);
  });
  