/**
 * FILE: preference.js
 * Manages user preferences throughout the application, including:
 *  - Show/Hide pinned links
 *  - Number of Favorites on main page
 *  - Reordering of main sections from within the Preferences modal
 */

// ==============================
// Modal Functionality
// ==============================
const preferencesMenu = document.getElementById('preferences-menu');
const preferencesMenuCloseButton =
    document.getElementById('preferences-menu-close-button');

/**
 * Opens the preferences modal with a fade-in/slide-in effect.
 */
export function openPreferencesMenu() {
    preferencesMenu.style.display = 'block';
    preferencesMenu.style.opacity = 0;
    let opacity = 0;
    const fadeIn = setInterval(() => {
        opacity += 0.05;
        preferencesMenu.style.opacity = opacity;
        if (opacity >= 1) {
            clearInterval(fadeIn);
        }
    }, 10);

    const content = preferencesMenu.querySelector('.preferences-menu-content');
    content.style.transform = 'translateY(-50px)';
    let translateY = -50;
    const slideIn = setInterval(() => {
        translateY += 2;
        content.style.transform = `translateY(${translateY}px)`;
        if (translateY >= 0) {
            content.style.transform = 'translateY(0)';
            clearInterval(slideIn);
        }
    }, 10);

    buildSectionReorderUI();
}

/**
 * Closes the preferences modal with a fade-out effect.
 */
export function closePreferencesMenu() {
    let opacity = 1;
    const fadeOut = setInterval(() => {
        opacity -= 0.05;
        preferencesMenu.style.opacity = opacity;
        if (opacity <= 0) {
            preferencesMenu.style.display = 'none';
            clearInterval(fadeOut);
        }
    }, 10);
}

/**
 * Initialize the Preferences modal's close/escape behavior.
 */
export function InitializePreferencesMenu() {
    preferencesMenuCloseButton.addEventListener('click', closePreferencesMenu);
    window.addEventListener('click', function(event) {
        if (event.target === preferencesMenu) {
            closePreferencesMenu();
        }
    });
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && preferencesMenu.style.display === 'block') {
            closePreferencesMenu();
        }
    });
}

// ==============================
// Show/Hide Pinned Links
// ==============================
export function InitializePreferencesToggle() {
    const toggleFavoritesCheckbox = document.getElementById('toggleFavoritesCheckbox');
    const heroPinnedBox = document.querySelector('.hero-pinned-box');

    // Retrieve saved preference or default true
    const savedPreference = localStorage.getItem('showFavorites');
    const showFavorites = savedPreference !== null ? JSON.parse(savedPreference) : true;
    toggleFavoritesCheckbox.checked = showFavorites;

    if (heroPinnedBox) {
        heroPinnedBox.style.display = showFavorites ? 'block' : 'none';
    }

    toggleFavoritesCheckbox.addEventListener('change', () => {
        const show = toggleFavoritesCheckbox.checked;
        if (heroPinnedBox) {
            heroPinnedBox.style.display = show ? 'block' : 'none';
        }
        localStorage.setItem('showFavorites', JSON.stringify(show));
    });
}

// ==============================
// Favorites Number Spinner
// ==============================
export function initializeFavoritesNumSpinner() {
    let favoritesNumSpinnerBox = document.getElementById('favorites-num-spinner-box');

    // First option = 'All'
    let allSpan = document.createElement('span');
    allSpan.textContent = 'All';
    favoritesNumSpinnerBox.appendChild(allSpan);

    // Next 1..99
    for (let i = 1; i < 100; i++) {
        let span = document.createElement('span');
        span.textContent = i;
        favoritesNumSpinnerBox.appendChild(span);
    }

    let favoritesNumbers = favoritesNumSpinnerBox.getElementsByTagName('span');
    let favoritesIndex = 0;

    // Restore from localStorage if available
    const savedFavoritesNum = localStorage.getItem('maxFavoritesDisplay');
    if (savedFavoritesNum !== null) {
        favoritesIndex = parseInt(savedFavoritesNum, 10);
    }

    for (let i = 0; i < favoritesNumbers.length; i++) {
        favoritesNumbers[i].style.display = 'none';
    }
    favoritesNumbers[favoritesIndex].style.display = 'initial';

    function nextFavoritesNum() {
        favoritesNumbers[favoritesIndex].style.display = 'none';
        favoritesIndex = (favoritesIndex + 1) % favoritesNumbers.length;
        favoritesNumbers[favoritesIndex].style.display = 'initial';
        saveMaxFavoritesDisplay();
        updateFavoritesDisplay();
    }

    function prevFavoritesNum() {
        favoritesNumbers[favoritesIndex].style.display = 'none';
        favoritesIndex =
            (favoritesIndex - 1 + favoritesNumbers.length) % favoritesNumbers.length;
        favoritesNumbers[favoritesIndex].style.display = 'initial';
        saveMaxFavoritesDisplay();
        updateFavoritesDisplay();
    }

    function saveMaxFavoritesDisplay() {
        localStorage.setItem('maxFavoritesDisplay', JSON.stringify(favoritesIndex));
    }

    const nextButton = document.querySelector('.favorites-spinner-next');
    const prevButton = document.querySelector('.favorites-spinner-prev');
    let nextTimeoutId = null;
    let prevTimeoutId = null;

    function handleNextStart() {
        nextFavoritesNum();
        nextTimeoutId = setTimeout(function continuousNext() {
            nextFavoritesNum();
            nextTimeoutId = setTimeout(continuousNext, 100);
        }, 300);
    }

    function handlePrevStart() {
        prevFavoritesNum();
        prevTimeoutId = setTimeout(function continuousPrev() {
            prevFavoritesNum();
            prevTimeoutId = setTimeout(continuousPrev, 100);
        }, 300);
    }

    function handleStop() {
        clearTimeout(nextTimeoutId);
        clearTimeout(prevTimeoutId);
    }

    nextButton.addEventListener('mousedown', handleNextStart);
    prevButton.addEventListener('mousedown', handlePrevStart);
    nextButton.addEventListener('mouseup', handleStop);
    prevButton.addEventListener('mouseup', handleStop);
    nextButton.addEventListener('mouseleave', handleStop);
    prevButton.addEventListener('mouseleave', handleStop);

    favoritesNumSpinnerBox.addEventListener('mousedown', function(e) {
        e.preventDefault();
    });
}

/**
 * Helper to re-render favorites if that feature is present.
 */
function updateFavoritesDisplay() {
    if (typeof populateFavoritesContainers === 'function') {
        populateFavoritesContainers();
    }
    if (typeof populateTopFavorites === 'function') {
        populateTopFavorites();
    }
}

// ==============================
// Section Reordering from Preferences
// ==============================

/**
 * Store an array of section IDs representing the user’s chosen order.
 */
function saveSectionOrder(sectionIds) {
    localStorage.setItem('sectionOrder', JSON.stringify(sectionIds));
}

/**
 * Retrieve the stored section order from localStorage, or null if not found.
 */
function getSavedSectionOrder() {
    const saved = localStorage.getItem('sectionOrder');
    return saved ? JSON.parse(saved) : null;
}

/**
 * Reorder the DOM's <section> elements in <main> according to the provided ID list.
 */
function applySectionOrder(sectionIds) {
    const mainContainer = document.querySelector('main');
    sectionIds.forEach((id) => {
        const sec = document.getElementById(id);
        if (sec) {
            mainContainer.appendChild(sec);
        }
    });
}

/**
 * Builds the UI in Preferences that lets users move sections up or down.
 * Reflects changes immediately in the DOM, and persists order in localStorage.
 */
function buildSectionReorderUI() {
    const defaultSectionIds = [
        'all-favorites-section', 'most-popular-section', 'all-links-section'
        // Add more sections if needed
    ];

    // Load existing or fallback to default
    let sectionOrder = getSavedSectionOrder() || defaultSectionIds.slice();

    // Remove IDs that are no longer in the DOM, add newly introduced IDs
    sectionOrder = sectionOrder.filter((id) => document.getElementById(id));
    defaultSectionIds.forEach((id) => {
        if (!sectionOrder.includes(id) && document.getElementById(id)) {
            sectionOrder.push(id);
        }
    });

    // Apply this order immediately
    applySectionOrder(sectionOrder);

    // Build the list
    const listContainer = document.getElementById('sectionsReorderList');
    if (!listContainer)
        return;
    listContainer.innerHTML = '';

    sectionOrder.forEach((sectionId, index) => {
        // Row container
        const row = document.createElement('div');
        row.classList.add('section-reorder-row');
        row.dataset.sectionId = sectionId;

        // Friendly label
        let friendlyName = sectionId;
        switch (sectionId) {
            case 'all-favorites-section':
                friendlyName = 'Favorites';
                break;
            case 'most-popular-section':
                friendlyName = 'Most Popular';
                break;
            case 'all-links-section':
                friendlyName = 'All Links';
                break;
            default:
                friendlyName = sectionId;
        }
        const label = document.createElement('span');
        label.textContent = friendlyName;

        // Up button
        const btnUp = document.createElement('button');
        btnUp.textContent = '↑';
        btnUp.addEventListener('click', () => {
            if (index > 0) {
                // Swap up
                const tmp = sectionOrder[index - 1];
                sectionOrder[index - 1] = sectionOrder[index];
                sectionOrder[index] = tmp;
                saveSectionOrder(sectionOrder);
                applySectionOrder(sectionOrder);
                buildSectionReorderUI();
            }
        });

        // Down button
        const btnDown = document.createElement('button');
        btnDown.textContent = '↓';
        btnDown.addEventListener('click', () => {
            if (index < sectionOrder.length - 1) {
                const tmp = sectionOrder[index + 1];
                sectionOrder[index + 1] = sectionOrder[index];
                sectionOrder[index] = tmp;
                saveSectionOrder(sectionOrder);
                applySectionOrder(sectionOrder);
                buildSectionReorderUI();
            }
        });

        row.appendChild(label);
        row.appendChild(btnUp);
        row.appendChild(btnDown);

        listContainer.appendChild(row);
    });
}

/**
 * Public function: call this after or when Preferences are opened, so the user sees
 * the current order. Also apply the saved order on initial load.
 */
export function initializeSectionReorderPreferences() {
    // In case the order was saved previously, apply it immediately on page load
    const stored = getSavedSectionOrder();
    if (stored) {
        applySectionOrder(stored);
    }

    // Rebuild the UI each time the modal finishes opening, so it’s always current
    preferencesMenu.addEventListener('transitionend', function handleOpen() {
        if (preferencesMenu.style.display === 'block') {
            buildSectionReorderUI();
        }
    });

    // If you’d rather build once on page load, uncomment:
    // buildSectionReorderUI();
}
