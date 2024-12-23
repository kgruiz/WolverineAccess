/**
 * FILE: error.js
 * Comprehensive error, warning, and log handling.
 */

// ==============================
// Error Handling Functions
// ==============================

/**
 * Escapes HTML characters to prevent injection attacks.
 * @param {string} unsafe - The string to escape.
 * @returns {string} - The escaped string.
 */
function escapeHTML(unsafe) {
    return unsafe.replace(/[&<>"'`=\/]/g, function(s) {
        const entityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#39;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;',
        };
        return entityMap[s];
    });
}

/**
 * Displays an error message on the page.
 * @param {string} message - The error message to display.
 */
export function displayErrorMessage(message) {
    createMessageContainer('error', message, '#f44336');
}

/**
 * Displays a log message on the page.
 * @param {string} message - The log message to display.
 */
export function displayLogMessage(message) {
    createMessageContainer('log', message, '#00274C');
}

/**
 * Displays a warning message on the page.
 * @param {string} message - The warning message to display.
 */
export function displayWarningMessage(message) {
    createMessageContainer('warning', message, '#ff9800');
}

/**
 * Creates and displays a message container (error, log, warning).
 * @param {string} type - The type of message ('error', 'log', 'warning').
 * @param {string} message - The message to display.
 * @param {string} backgroundColor - The background color of the container.
 */
function createMessageContainer(type, message, backgroundColor) {
    const containerId = `${type}-container-${Date.now()}`;  // Ensure unique ID
    const container = document.createElement('div');
    container.id = containerId;
    container.style.position = 'fixed';
    container.style.bottom = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.backgroundColor = backgroundColor;
    container.style.opacity = '0.95';
    container.style.color = '#fff';
    container.style.padding = '1rem';
    container.style.textAlign = 'center';
    container.style.zIndex = '10000';
    container.style.whiteSpace = 'pre-wrap';
    container.style.transform = 'translateY(100%)';
    container.style.transition = 'transform 0.3s ease';

    const escapedMessage = escapeHTML(message);
    container.innerHTML = `<strong>${escapedMessage}</strong>`;

    document.body.appendChild(container);

    // Animate the container sliding up
    setTimeout(() => {
        container.style.transform = 'translateY(0)';
    }, 10);

    // Auto-remove the message box after 5 seconds
    setTimeout(() => {
        container.style.transform = 'translateY(100%)';
        setTimeout(() => container.remove(), 300);
    }, 5000);
}

/**
 * Initializes message handling by overriding console methods and global error handlers.
 */
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

    // Global handler for synchronous errors
    window.onerror = function(message, source, lineno, colno, error) {
        const stack = error?.stack || 'No stack trace available';
        const detailedMessage = `
            Error: ${message}
            Source: ${source}
            Line: ${lineno}, Column: ${colno}
            Stack Trace:
            ${stack}
        `;
        displayErrorMessage(detailedMessage);
        return true;  // Prevent default browser error handling
    };

    // Global handler for unhandled promise rejections
    window.onunhandledrejection = function(event) {
        const error = event.reason || {};
        const message = `
            Unhandled Promise Rejection:
            Message: ${error.message || event.reason || 'Unknown error'}
            Stack: ${error.stack || 'No stack trace available'}
        `;
        displayErrorMessage(message);
    };

    // Catch any uncaught async function exceptions
    Promise.allSettled = Promise.allSettled || function(promises) {
        return Promise.all(promises.map((p) => p.catch((reason) => ({
                                                           status: 'rejected',
                                                           reason,
                                                       }))));
    };
}