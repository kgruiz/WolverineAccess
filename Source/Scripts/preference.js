/**
 * FILE: preference.js
 * Manages user preferences throughout the application, including:
 *  - Show/Hide pinned links
 *  - Number of Favorites on main page
 *  - Reordering of main sections from within the Preferences modal
 *  - Tabbed interface in a sidebar for the Preferences modal
 *  - Navigation Bar icon selection for pinned links
 *
 * This version ensures that each tab’s content is displayed separately:
 *  - Only the tab with .active is shown, per the CSS in index.html
 */

import {state} from './constants.js';
import {isLinkPinned} from './pinned.js';  // Production note: Using pinned.js for pinned checks

// ==============================
// Modal Functionality
// ==============================
const preferencesMenu = document.getElementById('preferences-menu');
const preferencesMenuCloseButton =
    document.getElementById('preferences-menu-close-button');

/**
 * Opens the preferences modal with a fade-in and slide-in effect.
 */
export function openPreferencesMenu() {
    preferencesMenu.style.display = 'block';
    preferencesMenu.style.opacity = '0';
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

    // Rebuild relevant UIs on modal open
    buildSectionReorderUI();
    buildNavBarLinksSelectionUI();
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
 * Initialize the Preferences modal's close/escape behavior,
 * along with tab switching in the sidebar.
 */
export function InitializePreferencesMenu() {
    preferencesMenuCloseButton.addEventListener('click', closePreferencesMenu);

    window.addEventListener('click', (event) => {
        if (event.target === preferencesMenu) {
            closePreferencesMenu();
        }
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && preferencesMenu.style.display === 'block') {
            closePreferencesMenu();
        }
    });

    // Production note: Initialize sidebar-based tab switching.
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.preferences-tab-content');

    tabButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            tabButtons.forEach((b) => b.classList.remove('active'));
            tabContents.forEach((c) => c.classList.remove('active'));

            btn.classList.add('active');
            const targetTab = btn.getAttribute('data-tab');
            const tabContent = document.getElementById(targetTab);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });
}

// ==============================
// Show/Hide Pinned Links
// ==============================
export function InitializePreferencesToggle() {
    const toggleFavoritesCheckbox = document.getElementById('toggleFavoritesCheckbox');
    const heroPinnedBox = document.querySelector('.hero-pinned-box');

    // Retrieve saved preference or default to true
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
    const favoritesNumSpinnerBox = document.getElementById('favorites-num-spinner-box');

    // First option = 'All'
    const allSpan = document.createElement('span');
    allSpan.textContent = 'All';
    favoritesNumSpinnerBox.appendChild(allSpan);

    // Next 1..99
    for (let i = 1; i < 100; i++) {
        const span = document.createElement('span');
        span.textContent = i;
        favoritesNumSpinnerBox.appendChild(span);
    }

    const favoritesNumbers = favoritesNumSpinnerBox.getElementsByTagName('span');
    let favoritesIndex = 0;

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
    nextButton.addEventListener('mouseup', handleStop);
    nextButton.addEventListener('mouseleave', handleStop);

    prevButton.addEventListener('mousedown', handlePrevStart);
    prevButton.addEventListener('mouseup', handleStop);
    prevButton.addEventListener('mouseleave', handleStop);

    favoritesNumSpinnerBox.addEventListener('mousedown', (e) => {
        e.preventDefault();
    });
}

function updateFavoritesDisplay() {
    // Production note: This calls other dynamic updates after
    // changing the number of favorites displayed.
    if (typeof populateFavoritesContainers === 'function') {
        populateFavoritesContainers();
    }
    if (typeof populateTopFavorites === 'function') {
        populateTopFavorites();
    }
}

// ==============================
// Section Reordering & Visibility
// ==============================
const defaultSectionIds = [
    'all-favorites-section', 'most-popular-section', 'all-links-section',
    'it-services-section'
];

/**
 * Store array of IDs representing the user’s chosen order.
 */
function saveSectionOrder(sectionIds) {
    localStorage.setItem('sectionOrder', JSON.stringify(sectionIds));
}

/**
 * Retrieve the stored section order from localStorage or null if not found.
 */
function getSavedSectionOrder() {
    const saved = localStorage.getItem('sectionOrder');
    return saved ? JSON.parse(saved) : null;
}

/**
 * Reorder the DOM's <section> elements in <main> according to the given ID list.
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
 * Retrieve a list of hidden sections from localStorage.
 */
function getHiddenSections() {
    const hidden = localStorage.getItem('hiddenSections');
    return hidden ? JSON.parse(hidden) : [];
}

/**
 * Save the updated list of hidden sections to localStorage.
 */
function saveHiddenSections(hiddenSections) {
    localStorage.setItem('hiddenSections', JSON.stringify(hiddenSections));
}

/**
 * Check if a given section is currently hidden.
 */
function isSectionHidden(sectionId) {
    return getHiddenSections().includes(sectionId);
}

/**
 * Hide or unhide a given section, updating localStorage accordingly.
 */
function toggleSectionVisibility(sectionId) {
    const sec = document.getElementById(sectionId);
    if (!sec)
        return;
    const hiddenSections = getHiddenSections();

    if (isSectionHidden(sectionId)) {
        sec.style.display = '';
        const idx = hiddenSections.indexOf(sectionId);
        if (idx !== -1) {
            hiddenSections.splice(idx, 1);
        }
    } else {
        sec.style.display = 'none';
        if (!hiddenSections.includes(sectionId)) {
            hiddenSections.push(sectionId);
        }
    }
    saveHiddenSections(hiddenSections);
}

/**
 * Apply hidden styles to any sections that are in localStorage as hidden.
 */
function applyHiddenSections() {
    const hiddenSections = getHiddenSections();
    hiddenSections.forEach((id) => {
        const sec = document.getElementById(id);
        if (sec) {
            sec.style.display = 'none';
        }
    });
}

/**
 * Builds the UI in Preferences to let users reorder and hide sections.
 */
function buildSectionReorderUI() {
    let sectionOrder = getSavedSectionOrder() || defaultSectionIds.slice();

    // Remove IDs not in DOM; add new ones if present
    sectionOrder = sectionOrder.filter((id) => document.getElementById(id));
    defaultSectionIds.forEach((id) => {
        if (!sectionOrder.includes(id) && document.getElementById(id)) {
            sectionOrder.push(id);
        }
    });

    // Apply the order and hidden states
    applySectionOrder(sectionOrder);
    applyHiddenSections();

    const listContainer = document.getElementById('sectionsReorderList');
    if (!listContainer)
        return;
    listContainer.innerHTML = '';

    sectionOrder.forEach((sectionId, index) => {
        const row = document.createElement('div');
        row.classList.add('section-reorder-row');
        row.dataset.sectionId = sectionId;
        row.draggable = true;

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
            case 'it-services-section':
                friendlyName = 'IT Services';
                break;
            default:
                friendlyName = sectionId;
        }

        const label = document.createElement('span');
        label.classList.add('section-reorder-label');
        label.textContent = friendlyName;

        const btnContainer = document.createElement('div');
        btnContainer.classList.add('section-reorder-buttons');

        // Up button
        const btnUp = document.createElement('button');
        btnUp.textContent = '↑';
        btnUp.addEventListener('click', () => {
            if (index > 0) {
                [sectionOrder[index - 1], sectionOrder[index]] =
                    [sectionOrder[index], sectionOrder[index - 1]];
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
                [sectionOrder[index + 1], sectionOrder[index]] =
                    [sectionOrder[index], sectionOrder[index + 1]];
                saveSectionOrder(sectionOrder);
                applySectionOrder(sectionOrder);
                buildSectionReorderUI();
            }
        });

        // Hide/Unhide button
        const btnHide = document.createElement('button');
        btnHide.textContent = isSectionHidden(sectionId) ? 'Unhide' : 'Hide';
        btnHide.addEventListener('click', () => {
            toggleSectionVisibility(sectionId);
            btnHide.textContent = isSectionHidden(sectionId) ? 'Unhide' : 'Hide';
        });

        btnContainer.appendChild(btnUp);
        btnContainer.appendChild(btnDown);
        btnContainer.appendChild(btnHide);

        row.appendChild(label);
        row.appendChild(btnContainer);
        listContainer.appendChild(row);
    });

    // DRAG & DROP
    listContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(listContainer, e.clientY);
        const draggingRow = document.querySelector('.dragging');
        if (!draggingRow)
            return;

        if (!afterElement) {
            listContainer.appendChild(draggingRow);
        } else {
            listContainer.insertBefore(draggingRow, afterElement);
        }
    });

    listContainer.querySelectorAll('.section-reorder-row').forEach((rowEl) => {
        rowEl.addEventListener('dragstart', () => {
            rowEl.classList.add('dragging');
        });
        rowEl.addEventListener('dragend', () => {
            rowEl.classList.remove('dragging');
            const newOrder =
                [...listContainer.querySelectorAll('.section-reorder-row')].map(
                    (el) => el.dataset.sectionId);
            saveSectionOrder(newOrder);
            applySectionOrder(newOrder);
            buildSectionReorderUI();
        });
    });
}

/**
 * Finds the element after the current mouse Y position (for drag-and-drop).
 */
function getDragAfterElement(container, y) {
    const rows = [...container.querySelectorAll('.section-reorder-row:not(.dragging)')];

    return rows
        .reduce(
            (closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return {offset, element: child};
                } else {
                    return closest;
                }
            },
            {offset: Number.NEGATIVE_INFINITY})
        .element;
}

/**
 * Public function: called to apply the saved order and hidden states
 * and to build the UI if needed.
 */
export function initializeSectionReorderPreferences() {
    const stored = getSavedSectionOrder();
    if (stored) {
        applySectionOrder(stored);
    }
    applyHiddenSections();
    buildSectionReorderUI();
    buildNavBarLinksSelectionUI();
}

// ==============================
// Navigation Bar Icon Selection
// ==============================
function buildNavBarLinksSelectionUI() {
    const navBarLinksSelection = document.getElementById('nav-bar-links-selection');
    if (!navBarLinksSelection)
        return;

    navBarLinksSelection.innerHTML = '';

    if (!state || !state.linksData) {
        const noStateMsg = document.createElement('p');
        noStateMsg.textContent = 'No pinned links available (no link data found).';
        navBarLinksSelection.appendChild(noStateMsg);
        return;
    }

    // Gather pinned links from state
    const pinnedLinks = state.linksData.filter((link) => isLinkPinned(link));

    // Retrieve existing nav bar picks from localStorage
    let navBarPicks = localStorage.getItem('navBarSelectedPinnedLinks');
    if (!navBarPicks) {
        navBarPicks = [];
    } else {
        try {
            navBarPicks = JSON.parse(navBarPicks);
        } catch (e) {
            navBarPicks = [];
        }
    }

    if (pinnedLinks.length === 0) {
        const noneMsg = document.createElement('p');
        noneMsg.textContent = 'No pinned links yet.';
        navBarLinksSelection.appendChild(noneMsg);
        return;
    }

    pinnedLinks.forEach((link) => {
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.marginBottom = '6px';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.marginRight = '8px';
        checkbox.checked = navBarPicks.includes(link.uniqueKey);

        const label = document.createElement('label');
        label.textContent = link.title || link.applicationName || 'Pinned Link';

        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                if (!navBarPicks.includes(link.uniqueKey)) {
                    navBarPicks.push(link.uniqueKey);
                }
            } else {
                const idx = navBarPicks.indexOf(link.uniqueKey);
                if (idx !== -1) {
                    navBarPicks.splice(idx, 1);
                }
            }
            localStorage.setItem('navBarSelectedPinnedLinks',
                                 JSON.stringify(navBarPicks));
            applyNavBarIcons();
        });

        navBarLinksSelection.appendChild(wrapper);
    });

    applyNavBarIcons();
}

/**
 * applyNavBarIcons reads the user-chosen pinned link IDs and renders them in the nav bar.
 */
function applyNavBarIcons() {
    const customNavIcons = document.getElementById('custom-nav-icons');
    if (!customNavIcons)
        return;

    customNavIcons.innerHTML = '';

    // Retrieve picks from localStorage
    const picksString = localStorage.getItem('navBarSelectedPinnedLinks');
    if (!picksString)
        return;

    let picks = [];
    try {
        picks = JSON.parse(picksString);
    } catch (e) {
        picks = [];
    }

    // Gather pinned links from state
    const pinnedLinks =
        state.linksData ? state.linksData.filter((link) => isLinkPinned(link)) : [];

    // Filter down to only links that user selected
    const selectedLinks = pinnedLinks.filter((link) => picks.includes(link.uniqueKey));

    // For each selection, place an icon or fallback text in the nav bar
    selectedLinks.forEach((link) => {
        const li = document.createElement('li');
        li.style.listStyle = 'none';

        const anchor = document.createElement('a');
        anchor.href = link.url || link.destination || '#';
        anchor.ariaLabel = link.title || link.applicationName || 'Pinned Link';
        anchor.style.display = 'inline-flex';
        anchor.style.alignItems = 'center';

        if (link.iconName) {
            const iconSpan = document.createElement('span');
            iconSpan.classList.add('material-icons');
            iconSpan.textContent = link.iconName;
            anchor.appendChild(iconSpan);
        } else {
            const textSpan = document.createElement('span');
            textSpan.textContent = link.title || link.applicationName || 'Link';
            anchor.appendChild(textSpan);
        }

        li.appendChild(anchor);
        customNavIcons.appendChild(li);
    });
}

export {buildSectionReorderUI};
