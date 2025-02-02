let quotes = [
    { text: "Be the change you wish to see in the world.", category: "Inspirational" },
    { text: "The only way to do great work is to love what you do.", category: "Motivational" },
    { text: "In three words I can sum up everything I've learned about life: it goes on.", category: "Life" }
];

let selectedCategory = null;

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
    textInput.value = '';
    categoryInput.value = '';

    // Check if category is new
    const categories = new Set(quotes.map(quote => quote.category));
    if (!categories.has(category)) {
        generateCategoryButtons();
    }

    showRandomQuote();
}

// Initialize the application
window.onload = function() {
    generateCategoryButtons();
    createAddQuoteForm();
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
    showRandomQuote();
};