let quotes = JSON.parse(localStorage.getItem('quotes')) || [
        { text: "Be the change you wish to see in the world.", category: "Inspirational" },
        { text: "The only way to do great work is to love what you do.", category: "Motivational" },
        { text: "In three words I can sum up everything I've learned about life: it goes on.", category: "Life" }
    ];
    
    let selectedCategory = null;
    
    function saveQuotes() {
         localStorage.setItem('quotes', JSON.stringify(quotes));
    }
    
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
    
        // Store last viewed quote in session storage
        sessionStorage.setItem('lastQuote', JSON.stringify(quote));
    }
    
    function createAddQuoteForm() {
        const formContainer = document.createElement('div');
        formContainer.innerHTML = `
            <div style="margin-top: 20px;">
                <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
                <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
                <button onclick="addQuote()">Add Quote</button>
                <button onclick="exportQuotes()">Export JSON</button>
                <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />
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
        saveQuotes();
        textInput.value = '';
        categoryInput.value = '';
        generateCategoryButtons();
        showRandomQuote();
    }
    
    function exportQuotes() {
        const dataStr = JSON.stringify(quotes, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotes.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    
    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            try {
                const importedQuotes = JSON.parse(event.target.result);
                if (Array.isArray(importedQuotes)) {
                    quotes.push(...importedQuotes);
                    saveQuotes();
                    generateCategoryButtons();
                    showRandomQuote();
                    alert('Quotes imported successfully!');
                } else {
                    alert('Invalid JSON format.');
                }
            } catch (error) {
                alert('Error importing JSON file.');
            }
        };
        fileReader.readAsText(event.target.files[0]);
    }
    
    // Initialize the application
    window.onload = function() {
        generateCategoryButtons();
        createAddQuoteForm();
        document.getElementById('newQuote').addEventListener('click', showRandomQuote);
        showRandomQuote();
    
        // Restore last viewed quote from session storage
        const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
        if (lastQuote) {
            const quoteDisplay = document.getElementById('quoteDisplay');
            quoteDisplay.innerHTML = `<p>"${lastQuote.text}"</p><em>- ${lastQuote.category}</em>`;
        }
    };
    