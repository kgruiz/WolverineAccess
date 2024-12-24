/**
 * FILE: preference.js
 * Manages user preferences throughout the application.
 *
 * This file handles storage and retrieval of user preferences, including:
 *  - The Preferences modal (open/close)
 *  - Toggles like 'Show Pinned Links'
 *  - Spinner-based controls for number of Favorites
 *  - Section reordering toggle and functionality
 */

// ==============================
// Preferences
// ==============================
/**
 * The preferences modal is displayed by clicking the relevant UI element.
 * This includes a fade-in/out and slide-in/out animation for user clarity.
 */

// Get modal elements
const preferencesMenu = document.getElementById('preferences-menu');
const preferencesMenuCloseButton =
    document.getElementById('preferences-menu-close-button');

/**
 * Open the preferences modal with a simple fade-in and slide-in effect.
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

    // Slide in animation
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
}

/**
 * Close the preferences modal with a fade-out animation.
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
 * Sets up the modal's event listeners for close behavior.
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

/**
 * Controls toggles in the Preferences modal, such as "Show Pinned Links."
 * These preferences are saved to localStorage for persistence.
 */
export function InitializePreferencesToggle() {
    // Handle the "Show Pinned Links" checkbox
    const toggleFavoritesCheckbox = document.getElementById('toggleFavoritesCheckbox');
    const heroPinnedBox = document.querySelector('.hero-pinned-box');

    // Retrieve stored user preference
    const savedPreference = localStorage.getItem('showFavorites');
    const showFavorites = savedPreference !== null ? JSON.parse(savedPreference) : true;
    toggleFavoritesCheckbox.checked = showFavorites;

    if (heroPinnedBox) {
        heroPinnedBox.style.display = showFavorites ? 'block' : 'none';
    }

    // Listen for changes
    toggleFavoritesCheckbox.addEventListener('change', () => {
        const show = toggleFavoritesCheckbox.checked;
        if (heroPinnedBox) {
            heroPinnedBox.style.display = show ? 'block' : 'none';
        }
        localStorage.setItem('showFavorites', JSON.stringify(show));
    });
}

/**
 * Allows users to adjust how many favorites are shown on the main page,
 * with a spinner control that cycles through a range of values and 'All'.
 * The selection is saved to localStorage.
 */
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

    // Handler for next/previous
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

    // Allow continuous pressing
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

    // Prevent accidental text selection when clicking buttons
    favoritesNumSpinnerBox.addEventListener('mousedown', function(e) {
        e.preventDefault();
    });
}

/**
 * Trigger UI updates after changing favorites display settings.
 * If these functions exist, they re-render the relevant sections.
 */
function updateFavoritesDisplay() {
    if (typeof populateFavoritesContainers === 'function') {
        populateFavoritesContainers();
    }
    if (typeof populateTopFavorites === 'function') {
        populateTopFavorites();
    }
}

// =======================================================================
// Section Reordering Feature
// =======================================================================
/**
 * This feature allows users to reorder main sections (e.g., Favorites, Most Popular)
 * by dragging and dropping when the preference toggle is enabled.
 */

// Track the section currently being dragged
let draggedSection = null;

/**
 * Handler for when a user starts dragging a section.
 * We only allow it if the section is marked draggable="true".
 */
function handleDragStart(e) {
    if (this.getAttribute('draggable') === 'true') {
        draggedSection = this;
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    }
}

/**
 * By default, dropping is disallowed. Prevent the default event
 * so this element becomes a valid drop target.
 */
function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

/**
 * When the user drops a section on another, place it before the
 * target in the DOM, then persist the new order.
 */
function handleDrop(e) {
    e.preventDefault();
    if (!draggedSection)
        return;
    if (this !== draggedSection) {
        const mainContainer = document.querySelector('main');
        // Insert the dragged section before the section on which user dropped
        mainContainer.insertBefore(draggedSection, this);
    }
    draggedSection.classList.remove('dragging');
    draggedSection = null;
    saveSectionOrder();
}

/**
 * Saves the current order of reorderable sections to localStorage.
 */
function saveSectionOrder() {
    const mainContainer = document.querySelector('main');
    const reorderableSections = mainContainer.querySelectorAll('.reorderable');
    const ids = Array.from(reorderableSections).map(sec => sec.id);
    localStorage.setItem('sectionOrder', JSON.stringify(ids));
}

/**
 * Restores the order of sections from localStorage, if any.
 */
function restoreSectionOrder() {
    const saved = localStorage.getItem('sectionOrder');
    if (!saved)
        return;
    const order = JSON.parse(saved);
    const mainContainer = document.querySelector('main');

    order.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            mainContainer.appendChild(section);
        }
    });
}

/**
 * Sets up the necessary drag-and-drop event handlers for all sections
 * that are marked with the class "reorderable."
 * Initially, they are set to draggable="false" and only become draggable
 * once the user enables the preference in the modal.
 */
function setupReorderableSections() {
    const reorderableSections = document.querySelectorAll('.reorderable');
    reorderableSections.forEach(section => {
        // Default to not draggable
        section.setAttribute('draggable', 'false');
        section.addEventListener('dragstart', handleDragStart);
        section.addEventListener('dragover', handleDragOver);
        section.addEventListener('drop', handleDrop);
    });
}

/**
 * Initializes the toggle that allows enabling/disabling section reordering.
 * The user’s choice persists in localStorage under 'enableSectionReorder'.
 */
export function initializeSectionReorderingToggle() {
    const toggleReorderCheckbox = document.getElementById('toggleSectionReorderCheckbox');
    if (!toggleReorderCheckbox)
        return;

    // Restore any existing section order from localStorage
    restoreSectionOrder();
    // Attach basic event listeners for all reorderable sections
    setupReorderableSections();

    // Check if the user had previously enabled reordering
    const savedPref = localStorage.getItem('enableSectionReorder');
    const wasEnabled = savedPref ? JSON.parse(savedPref) : false;
    toggleReorderCheckbox.checked = wasEnabled;

    // If previously enabled, mark sections as draggable
    if (wasEnabled) {
        document.querySelectorAll('.reorderable').forEach(sec => {
            sec.setAttribute('draggable', 'true');
        });
    }

    // Listen for changes on the new toggle
    toggleReorderCheckbox.addEventListener('change', () => {
        const reorderableSections = document.querySelectorAll('.reorderable');
        const isNowEnabled = toggleReorderCheckbox.checked;

        // Save the user’s preference
        localStorage.setItem('enableSectionReorder', JSON.stringify(isNowEnabled));

        // Update each section's draggable status
        reorderableSections.forEach(section => {
            section.setAttribute('draggable', isNowEnabled ? 'true' : 'false');
            // If turning off, remove visual cues
            if (!isNowEnabled) {
                section.classList.remove('dragging');
            }
        });
    });
}
