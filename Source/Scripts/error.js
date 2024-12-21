// Import from constants.js
// Import from animation.js
import {animateEllipticalArc} from './animation.js';
// Import from auth.js
import {initializeSignInMenu, signIn, signOut} from './auth.js';
// Import from cards.js
import {CreateCard, CreateFavoriteCard} from './cards.js';
import {FAVORITES_KEY, filledStarSVG, footballSVG, optionsIconSVG, outlinedStarSVG, state} from './constants.js';
// Import from effects.js
import {initializeButtonEffects, initializeCardHoverEffects, initializeFavoritesIconHoverEffects, initializeHoverMenus, initializeNavIconsHoverEffects, initializeSwitchToggleEffects, setupHoverMenu, setupSignInHover} from './effects.js';
// Import from error.js
// Import from favorites.js
import {addFavorite, isLinkFavorited, loadFavorites, populateFavoritesContainers, removeFavorite, saveFavorites, updateStarAppearance} from './favorites.js';
// Import from globalListeners.js
import {InitializeGlobalListeners} from './globalListeners.js';
// Import from preference.js
import {InitializePreferencesMenu, InitializePreferencesToggle, openPreferencesMenu} from './preference.js';
// Import from search.js
import {SetupSearchSuggestions} from './search.js';

/**
 * Display an error message on the page.
 * @param {string} message - The error message to display.
 */
export function displayErrorMessage(message) {
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';

        const closeButton = document.createElement('span');
        closeButton.textContent = 'x';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '50%';
        closeButton.style.right = '10px';
        closeButton.style.transform = 'translateY(-50%)';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', () => {
            errorContainer.style.transform = 'translateY(100%)';
            setTimeout(() => {
                errorContainer.remove();
            }, 300);
        });

        errorContainer.appendChild(closeButton);
    } else {
        const newErrorContainer = document.createElement('div');
        newErrorContainer.id = 'error-container';
        newErrorContainer.style.position = 'fixed';
        newErrorContainer.style.bottom = '0';
        newErrorContainer.style.left = '0';
        newErrorContainer.style.width = '100%';
        newErrorContainer.style.backgroundColor = '#f44336';
        newErrorContainer.style.opacity = '0.9';
        newErrorContainer.style.color = '#fff';
        newErrorContainer.style.padding = '1rem';
        newErrorContainer.style.textAlign = 'center';
        newErrorContainer.style.zIndex = '10000';
        newErrorContainer.style.transform = 'translateY(100%)';
        newErrorContainer.style.transition = 'transform 0.3s ease';
        newErrorContainer.textContent = message;

        const closeButton = document.createElement('span');
        closeButton.textContent = 'x';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '50%';
        closeButton.style.right = '10px';
        closeButton.style.transform = 'translateY(-50%)';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', () => {
            newErrorContainer.style.transform = 'translateY(100%)';
            setTimeout(() => {
                newErrorContainer.remove();
            }, 300);
        });

        newErrorContainer.appendChild(closeButton);
        document.body.appendChild(newErrorContainer);

        setTimeout(() => {
            newErrorContainer.style.transform = 'translateY(0)';
        }, 10);

        // Remove the container after 5 seconds
        setTimeout(() => {
            newErrorContainer.style.transform = 'translateY(100%)';
            setTimeout(() => {
                newErrorContainer.remove();
            }, 300);
        }, 5000);
    }
}

/**
 * Display a log message on the page.
 * @param {string} message - The log message to display.
 */
export function displayLogMessage(message) {
    const logContainer = document.getElementById('log-container');
    if (logContainer) {
        logContainer.textContent = message;
        logContainer.style.display = 'block';

        const closeButton = document.createElement('span');
        closeButton.textContent = 'x';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '50%';
        closeButton.style.right = '10px';
        closeButton.style.transform = 'translateY(-50%)';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', () => {
            logContainer.style.transform = 'translateY(100%)';
            setTimeout(() => {
                logContainer.remove();
            }, 300);
        });

        logContainer.appendChild(closeButton);
    } else {
        const newLogContainer = document.createElement('div');
        newLogContainer.id = 'log-container';
        newLogContainer.style.position = 'fixed';
        newLogContainer.style.bottom = '0';
        newLogContainer.style.left = '0';
        newLogContainer.style.width = '100%';
        newLogContainer.style.backgroundColor = '#00274C';
        newLogContainer.style.opacity = '0.9';
        newLogContainer.style.color = '#fff';
        newLogContainer.style.padding = '1rem';
        newLogContainer.style.textAlign = 'center';
        newLogContainer.style.zIndex = '10000';
        newLogContainer.style.transform = 'translateY(100%)';
        newLogContainer.style.transition = 'transform 0.3s ease';
        newLogContainer.textContent = message;

        const closeButton = document.createElement('span');
        closeButton.textContent = 'x';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '50%';
        closeButton.style.right = '10px';
        closeButton.style.transform = 'translateY(-50%)';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', () => {
            newLogContainer.style.transform = 'translateY(100%)';
            setTimeout(() => {
                newLogContainer.remove();
            }, 300);
        });

        newLogContainer.appendChild(closeButton);
        document.body.appendChild(newLogContainer);

        setTimeout(() => {
            newLogContainer.style.transform = 'translateY(0)';
        }, 10);

        // Remove the container after 5 seconds
        setTimeout(() => {
            newLogContainer.style.transform = 'translateY(100%)';
            setTimeout(() => {
                newLogContainer.remove();
            }, 300);
        }, 5000);
    }
}

/**
 * Display a warning message on the page.
 * @param {string} message - The warning message to display.
 */
export function displayWarningMessage(message) {
    const warningContainer = document.getElementById('warning-container');
    if (warningContainer) {
        warningContainer.textContent = message;
        warningContainer.style.display = 'block';

        const closeButton = document.createElement('span');
        closeButton.textContent = 'x';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '50%';
        closeButton.style.right = '10px';
        closeButton.style.transform = 'translateY(-50%)';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', () => {
            warningContainer.style.transform = 'translateY(100%)';
            setTimeout(() => {
                warningContainer.remove();
            }, 300);
        });

        warningContainer.appendChild(closeButton);
    } else {
        const newWarningContainer = document.createElement('div');
        newWarningContainer.id = 'warning-container';
        newWarningContainer.style.position = 'fixed';
        newWarningContainer.style.bottom = '0';
        newWarningContainer.style.left = '0';
        newWarningContainer.style.width = '100%';
        newWarningContainer.style.backgroundColor = '#ff9800';
        newWarningContainer.style.opacity = '0.9';
        newWarningContainer.style.color = '#fff';
        newWarningContainer.style.padding = '1rem';
        newWarningContainer.style.textAlign = 'center';
        newWarningContainer.style.zIndex = '10000';
        newWarningContainer.style.transform = 'translateY(100%)';
        newWarningContainer.style.transition = 'transform 0.3s ease';
        newWarningContainer.textContent = message;

        const closeButton = document.createElement('span');
        closeButton.textContent = 'x';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '50%';
        closeButton.style.right = '10px';
        closeButton.style.transform = 'translateY(-50%)';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', () => {
            newWarningContainer.style.transform = 'translateY(100%)';
            setTimeout(() => {
                newWarningContainer.remove();
            }, 300);
        });

        newWarningContainer.appendChild(closeButton);
        document.body.appendChild(newWarningContainer);

        setTimeout(() => {
            newWarningContainer.style.transform = 'translateY(0)';
        }, 10);

        // Remove the container after 5 seconds
        setTimeout(() => {
            newWarningContainer.style.transform = 'translateY(100%)';
            setTimeout(() => {
                newWarningContainer.remove();
            }, 300);
        }, 5000);
    }
}

export function InitializeMessages() {

    // Override console.log to display log messages on the page
    const originalConsoleLog = console.log;
    console.log = function(...args) {
        originalConsoleLog.apply(console, args);
        displayLogMessage(args.join(' '));
    };

    // Override console.warn to display warning messages on the page
    const originalConsoleWarn = console.warn;
    console.warn = function(...args) {
        originalConsoleWarn.apply(console, args);
        displayWarningMessage(args.join(' '));
    };


    // Override console.error to display error messages on the page
    const originalConsoleError = console.error;
    console.error = function(...args) {
        originalConsoleError.apply(console, args);
        displayErrorMessage(args.join(' '));
    };

    // Override window.onerror to display uncaught errors on the page
    window.onerror = function(message, source, lineno, colno, error) {
        displayErrorMessage(`${message} at ${source}:${lineno}:${colno}`);
        return true;  // Prevent the default browser error handling
    };
}