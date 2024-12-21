/**
 * FILE: preference.js
 * Manages user preferences throughout the application.
 */

// ==============================
// Preferences
// ==============================

// ==============================
// Modal Functionality
// ==============================
// Get modal elements
const preferencesMenu = document.getElementById('preferences-menu');
const preferencesMenuCloseButton =
    document.getElementById('preferences-menu-close-button');

/**
 * Open the preferences modal.
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
 * Close the preferences modal.
 */
export function closePreferencesMenu() {
    // Fade out animation
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

export function InitializePreferencesMenu() {

    // Event listeners for modal functionality
    preferencesMenuCloseButton.addEventListener('click', closePreferencesMenu);
    window.addEventListener('click', function(event) {
        if (event.target == preferencesMenu) {
            closePreferencesMenu();
        }
    });
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && preferencesMenu.style.display === 'block') {
            closePreferencesMenu();
        }
    });
}

export function InitializePreferencesToggle() {

    // ==============================
    // Favorites Preference Toggle
    // ==============================
    // Get references to DOM elements for favorites toggle
    const toggleFavoritesCheckbox = document.getElementById('toggleFavoritesCheckbox');
    const heroPinnedBox = document.querySelector('.hero-pinned-box');
    // Load and apply saved favorites preference
    const savedPreference = localStorage.getItem('showFavorites');
    const showFavorites = savedPreference !== null ? JSON.parse(savedPreference) : true;
    toggleFavoritesCheckbox.checked = showFavorites;
    if (heroPinnedBox) {
        heroPinnedBox.style.display = showFavorites ? 'block' : 'none';
    }
    // Event listener for favorites preference change
    toggleFavoritesCheckbox.addEventListener('change', () => {
        const showFavorites = toggleFavoritesCheckbox.checked;
        if (heroPinnedBox) {
            heroPinnedBox.style.display = showFavorites ? 'block' : 'none';
        }
        // Save the updated preference to localStorage
        localStorage.setItem('showFavorites', JSON.stringify(showFavorites));
    });
}

export function initializeFavoritesNumSpinner() {
    // Initialize elements and variables
    var favoritesNumSpinnerBox = document.getElementById('favorites-num-spinner-box');
    // Add 'All' as the first option
    let allSpan = document.createElement('span');
    allSpan.textContent = 'All';
    favoritesNumSpinnerBox.appendChild(allSpan);
    for (let i = 1; i < 100; i++) {  // Start from 1 since 'All' is at index 0
        let span = document.createElement('span');
        span.textContent = i;
        favoritesNumSpinnerBox.appendChild(span);
    }

    var favoritesNumbers = favoritesNumSpinnerBox.getElementsByTagName('span');
    var favoritesIndex = 0;
    // Load saved value and set initial favorites index
    const savedFavoritesNum = localStorage.getItem('maxFavoritesDisplay');
    if (savedFavoritesNum !== null) {
        favoritesIndex = parseInt(savedFavoritesNum);
    }
    for (let i = 0; i < favoritesNumbers.length; i++) {
        favoritesNumbers[i].style.display = 'none';
    }
    favoritesNumbers[favoritesIndex].style.display = 'initial';

    // Function to show the next number
    function nextFavoritesNum() {
        favoritesNumbers[favoritesIndex].style.display = 'none';
        favoritesIndex = (favoritesIndex + 1) % favoritesNumbers.length;
        favoritesNumbers[favoritesIndex].style.display = 'initial';
        saveMaxFavoritesDisplay();
        updateFavoritesDisplay();
    }

    // Function to show the previous number
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

    let nextTimeoutId = null;
    let prevTimeoutId = null;

    const nextButton = document.querySelector('.favorites-spinner-next');
    const prevButton = document.querySelector('.favorites-spinner-prev');

    // Function to handle the continuous next button
    function handleNextStart() {
        nextFavoritesNum();
        nextTimeoutId = setTimeout(function continuousNext() {
            nextFavoritesNum();
            nextTimeoutId = setTimeout(continuousNext, 100);
        }, 300)
    }

    // Function to handle the continuous previous button
    function handlePrevStart() {
        prevFavoritesNum();
        prevTimeoutId = setTimeout(function continuousPrev() {
            prevFavoritesNum();
            prevTimeoutId = setTimeout(continuousPrev, 100)
        }, 300);
    }

    function handleStop() {
        clearTimeout(nextTimeoutId);
        clearTimeout(prevTimeoutId);
    }

    // Attach event listeners for the spinner buttons
    nextButton.addEventListener('mousedown', handleNextStart);
    prevButton.addEventListener('mousedown', handlePrevStart);
    nextButton.addEventListener('mouseup', handleStop);
    prevButton.addEventListener('mouseup', handleStop);
    nextButton.addEventListener('mouseleave', handleStop);
    prevButton.addEventListener('mouseleave', handleStop);


    // Prevent selection of number when clicking buttons
    favoritesNumSpinnerBox.addEventListener('mousedown', function(e) {
        e.preventDefault();
    });
}

// Add this function to trigger updates to the UI
function updateFavoritesDisplay() {
    if (typeof populateFavoritesContainers === 'function') {
        populateFavoritesContainers();
    }
    if (typeof populateTopFavorites === 'function') {
        populateTopFavorites();
    }
}