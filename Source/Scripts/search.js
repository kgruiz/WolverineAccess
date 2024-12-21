/**
 * FILE: search.js
 * Handles search suggestions and navigation to relevant pages
 */

// ==============================
// Search Suggestions Setup
// ==============================
/**
 * Setup search suggestions for an input element.
 * @param {HTMLElement} inputElement - The search input element.
 * @param {HTMLElement} suggestionsContainer - The container for suggestions.
 */
export function SetupSearchSuggestions(inputElement, suggestionsContainer) {
    let currentIndex = -1;
    let suggestionItems = [];
    inputElement.addEventListener('input', onInput);
    inputElement.addEventListener('keydown', onKeyDown);
    document.addEventListener('click', onDocumentClick);
    const formElement = inputElement.closest('form');
    const searchButton = formElement?.querySelector('button');
    searchButton?.addEventListener('click', onSearchButtonClick);

    function onInput() {
        const query = inputElement.value.trim().toLowerCase();
        if (!query) {
            hideSuggestions();
            return;
        }
        const filtered = state.linksData.filter(
            link => (link.title && link.title.toLowerCase().includes(query)) ||
                    (link.applicationName &&
                     link.applicationName.toLowerCase().includes(query)));
        buildSuggestions(query, filtered.slice(0, 5));
    }

    function buildSuggestions(query, results) {
        suggestionsContainer.innerHTML = '';
        currentIndex = -1;
        suggestionItems = [];
        const topItem = document.createElement('div');
        topItem.className = 'search-suggestion-item';
        topItem.textContent = `Search for "${inputElement.value.trim()}"`;
        topItem.addEventListener('click', () => {
            goToSearchPage(inputElement.value.trim());
        });
        suggestionsContainer.appendChild(topItem);
        suggestionItems.push({element: topItem, isSearchOption: true, link: null});
        results.forEach(link => {
            const item = document.createElement('div');
            item.className = 'search-suggestion-item';
            item.textContent = link.title;
            item.addEventListener('click', () => {
                window.location.href = link.href;
            });
            suggestionsContainer.appendChild(item);
            suggestionItems.push({element: item, isSearchOption: false, link: link.href});
        });
        suggestionsContainer.classList.add('active');
        if (suggestionItems.length > 0) {
            currentIndex = 0;
            highlightCurrentItem();
        }
    }

    function hideSuggestions() {
        suggestionsContainer.innerHTML = '';
        suggestionsContainer.classList.remove('active');
        currentIndex = -1;
        suggestionItems = [];
    }

    function onKeyDown(e) {
        if (!suggestionsContainer.classList.contains('active'))
            return;
        const maxIndex = suggestionItems.length - 1;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentIndex = (currentIndex + 1) > maxIndex ? 0 : currentIndex + 1;
            highlightCurrentItem();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentIndex = (currentIndex - 1) < 0 ? maxIndex : currentIndex - 1;
            highlightCurrentItem();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (currentIndex === -1 || suggestionItems[currentIndex].isSearchOption) {
                goToSearchPage(inputElement.value.trim());
            } else {
                window.location.href = suggestionItems[currentIndex].link;
            }
        } else if (e.key === 'Escape') {
            hideSuggestions();
        }
    }

    function highlightCurrentItem() {
        suggestionItems.forEach((item, index) => {
            if (index === currentIndex) {
                item.element.classList.add('highlighted');
            } else {
                item.element.classList.remove('highlighted');
            }
        });
    }

    function onDocumentClick(e) {
        if (!suggestionsContainer.contains(e.target) && e.target !== inputElement) {
            hideSuggestions();
        }
    }

    function goToSearchPage(query) {
        if (!query)
            return;
        window.location.href = `all-links-full.html?q=${encodeURIComponent(query)}`;
    }

    function onSearchButtonClick() {
        if (currentIndex === -1 ||
            suggestionItems[currentIndex]?.isSearchOption === true) {
            goToSearchPage(inputElement.value.trim());
        } else {
            window.location.href = suggestionItems[currentIndex].link;
        }
    }
}