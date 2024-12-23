/**
 * FILE: error.js
 * Manages application errors, warnings, and logs.
 */

// ==============================
// Error Handling
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
            '=': '&#x3D;'
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
    const containerId = `${type}-container`;
    let existingContainer = document.getElementById(containerId);
    let container;
    const isLog = type === 'log';
    const defaultTimeout = isLog ? 10000 : 5000;

    // Split the message into lines
    const escapedMessage = escapeHTML(message);
    const lines = escapedMessage.split('\n');
    const header = lines[0];
    const body = lines.slice(1).join('<br>');
    const isSingleLine = lines.length === 1;

    if (existingContainer) {
        container = existingContainer;
        // Update header and body
        const messageHeader = container.querySelector('.message-header');
        const messageBody = container.querySelector('.message-body');
        messageHeader.innerHTML = header;
        messageBody.innerHTML = body;

        // Collapse the message body if it was expanded
        collapseMessage(container, false);

        // Clear existing timeout if any
        if (container.removeTimeout) {
            clearTimeout(container.removeTimeout);
        }

        // Set the auto-remove timeout
        container.removeTimeout = setTimeout(() => {
            hideContainer(container);
        }, defaultTimeout);
    } else {
        container = document.createElement('div');
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
        container.style.whiteSpace =
            'pre-wrap';  // Preserves white spaces and line breaks
        container.style.transform = 'translateY(100%)';
        container.style.transition = 'transform 0.3s ease';
        container.setAttribute('expanded', 'false');

        // Create message header
        const messageHeader = document.createElement('div');
        messageHeader.classList.add('message-header');
        messageHeader.style.cursor = 'pointer';  // Indicates clickable for expansion
        messageHeader.style.fontWeight = 'bold';
        messageHeader.innerHTML = header;
        container.appendChild(messageHeader);

        // Create message body
        const messageBody = document.createElement('div');
        messageBody.classList.add('message-body');
        messageBody.innerHTML = body;
        messageBody.style.maxHeight = '0';
        messageBody.style.overflow = 'hidden';
        messageBody.style.transition = 'max-height 0.3s ease';
        container.appendChild(messageBody);

        // Create and append close button
        const closeButton = document.createElement('span');
        closeButton.innerHTML = '<span class="material-icons">close</span>';
        closeButton.classList.add('close-button');
        closeButton.style.position = 'absolute';
        closeButton.style.top = '50%';
        closeButton.style.right = '1rem';
        closeButton.style.transform = 'translateY(-50%)';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '1.2rem';
        closeButton.style.lineHeight = '1';
        closeButton.addEventListener('click', () => {
            hideContainer(container);
        });
        container.appendChild(closeButton);

        if (!isSingleLine) {
            // Create and append expand button
            const expandButton = document.createElement('span');
            expandButton.innerHTML = '<span class="material-icons">expand_less</span>';
            expandButton.classList.add('expand-button');
            expandButton.style.position = 'absolute';
            expandButton.style.top = '50%';
            expandButton.style.right = '3rem';
            expandButton.style.transform = 'translateY(-50%)';
            expandButton.style.cursor = 'pointer';
            expandButton.style.fontSize = '1.2rem';
            expandButton.style.lineHeight = '1';
            container.appendChild(expandButton);

            // Add event listener for expand/collapse via expand button
            expandButton.addEventListener('click', () => {
                toggleExpand(container, expandButton, isLog);
            });

            // Add event listener for expand/collapse via message header
            messageHeader.addEventListener('click', () => {
                toggleExpand(container, expandButton, isLog);
            });
        }

        // Append container to the body
        document.body.appendChild(container);

        // Animate the container sliding up
        setTimeout(() => {
            container.style.transform = 'translateY(0)';
        }, 10);

        // Set the auto-remove timeout
        container.removeTimeout = setTimeout(() => {
            hideContainer(container);
        }, defaultTimeout);
    }
}  // End of createMessageContainer function

/**
 * Toggles the expanded/collapsed state of the container.
 * @param {HTMLElement} container - The message container element.
 * @param {HTMLElement} expandButton - The expand button element.
 * @param {boolean} isLog - Indicates if the message type is 'log'.
 */
function toggleExpand(container, expandButton, isLog) {
    const isExpanded = container.getAttribute('expanded') === 'true';
    const messageBody = container.querySelector('.message-body');
    const closeButton = container.querySelector('.close-button');

    if (!isExpanded) {
        // Expand the container
        const scrollHeight = messageBody.scrollHeight;
        messageBody.style.maxHeight = `${scrollHeight}px`;
        container.setAttribute('expanded', 'true');
        expandButton.innerHTML = '<span class="material-icons">expand_more</span>';
        closeButton.style.top = '2rem';
        expandButton.style.top = '2rem';

        // Clear the existing timeout to prevent auto-remove while expanded
        if (container.removeTimeout) {
            clearTimeout(container.removeTimeout);
            container.removeTimeout = null;
        }
    } else {
        // Collapse the container
        messageBody.style.maxHeight = '0';
        container.setAttribute('expanded', 'false');
        expandButton.innerHTML = '<span class="material-icons">expand_less</span>';
        closeButton.style.top = '50%';
        expandButton.style.top = '50%';

        // Reset the auto-remove timeout
        const defaultTimeout = isLog ? 10000 : 5000;
        container.removeTimeout = setTimeout(() => {
            hideContainer(container);
        }, defaultTimeout);
    }
}

/**
 * Hides and removes the container with a slide-down animation.
 * @param {HTMLElement} container - The message container element.
 */
function hideContainer(container) {
    container.style.transform = 'translateY(100%)';
    setTimeout(() => {
        container.remove();
    }, 300);
}

/**
 * Collapses the message body without animation.
 * @param {HTMLElement} container - The message container element.
 * @param {boolean} animate - Whether to animate the collapse.
 */
function collapseMessage(container, animate = true) {
    const messageBody = container.querySelector('.message-body');
    const expandButton = container.querySelector('.expand-button');
    const closeButton = container.querySelector('.close-button');
    if (!expandButton) {
        return;
    }
    if (animate) {
        // Animate collapse
        messageBody.style.maxHeight = '0';
    } else {
        // Instant collapse without animation
        messageBody.style.transition = 'none';
        messageBody.style.maxHeight = '0';
        // Force reflow to apply styles
        void messageBody.offsetWidth;
        // Re-enable transition
        messageBody.style.transition = 'max-height 0.3s ease';
    }

    container.setAttribute('expanded', 'false');
    expandButton.innerHTML = '<span class="material-icons">expand_less</span>';
    closeButton.style.top = '50%';
    expandButton.style.top = '50%';
}

/**
 * Initializes message handling by overriding console methods and window.onerror.
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

    // Override window.onerror to display uncaught errors on the page
    window.onerror = function(message, source, lineno, colno, error) {
        displayErrorMessage(`${message} at ${source}:${lineno}:${colno}`);
        return true;  // Prevent the default browser error handling
    };
}
