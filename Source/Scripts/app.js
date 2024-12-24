/**
 * FILE: app.js
 * Initializes and orchestrates application functionality.
 *
 * This file is the main entry point for the app. It fetches data, populates
 * UI components, sets up event listeners, and calls functions from other modules.
 */

import {InitializeAnimation} from './animation.js';
import {initializeSignInMenu} from './auth.js';
import {CreateCard, CreateFavoriteCard} from './cards.js';
import {state} from './constants.js';
import {initializeButtonEffects, initializeCardHoverEffects, initializeFavoritesIconHoverEffects, initializeHoverMenus, initializeNavIconsHoverEffects, initializeSwitchToggleEffects} from './effects.js';
import {InitializeMessages} from './error.js';
import {isLinkFavorited, loadFavorites, populateFavoritesContainers} from './favorites.js';
import {InitializeGlobalListeners} from './globalListeners.js';
import {addCardToPinnedsContainers, addPinned, isLinkPinned, loadPinneds, populatePinnedsContainers, removeCardFromPinnedsContainers, removePinned, savePinneds} from './pinned.js';
import {initializeFavoritesNumSpinner, InitializePreferencesMenu, InitializePreferencesToggle, initializeSectionReorderPreferences} from './preference.js';
import {initializeTimeSpinners} from './Schedule/calendarOptions.js';
import {Class, Section} from './Schedule/class.js';
import {InitializePrinterFriendlyButton, RenderClassSchedule} from './Schedule/schedule.js';
import {SetupSearchSuggestions} from './search.js';

document.addEventListener('DOMContentLoaded', () => {
    // ==============================
    // Data Fetching and Initialization
    // ==============================
    Promise
        .all([
            fetch('../../Assets/JSON Files/tasks.json').then((response) => {
                if (!response.ok) {
                    return response.text().then((text) => {
                        let errorDetails = text;
                        try {
                            const json = JSON.parse(text);
                            errorDetails = JSON.stringify(json, null, 2);
                        } catch (e) {
                            // If not JSON, keep plain text
                        }

                        const detailedErrorMessage =
                            `Failed to load tasks.json.\n` +
                            `Status: ${response.status} ${response.statusText}\n` +
                            `Details:\n${errorDetails}`;

                        console.error(detailedErrorMessage);
                        displayErrorMessage(detailedErrorMessage);

                        return Promise.reject(new Error('Failed to load tasks.json'));
                    });
                }
                return response.json();
            }),
            fetch('../../../Assets/JSON Files/classSchedules.json').then((response) => {
                if (!response.ok) {
                    return response.text().then((text) => {
                        const detailedErrorMessage =
                            `Failed to load classSchedules.json\n` +
                            `Status: ${response.status} ${response.statusText}\n` +
                            `Details:\n${text}`;

                        console.error(detailedErrorMessage);
                        displayErrorMessage(detailedErrorMessage);

                        return Promise.reject(
                            new Error('Failed to load classSchedules.json'));
                    });
                }
                return response.json();
            })
        ])
        .then(([tasksData, schedulesData]) => {
            // Successfully fetched both JSON files
            // Parse tasksData into state
            state.linksData = tasksData;

            // Initialize the state for class schedules
            state.classSchedules = {};
            for (const uniqName in schedulesData) {
                if (schedulesData.hasOwnProperty(uniqName)) {
                    const scheduleData = schedulesData[uniqName];
                    const courses = scheduleData.courses.map((courseData) => {
                        const sections = courseData.sections.map((sectionData) => {
                            return new Section(
                                sectionData.class_nbr, sectionData.instruction_mode,
                                sectionData.section, sectionData.component,
                                sectionData.days_and_times, sectionData.room,
                                sectionData.instructor, sectionData.start_end_date);
                        });
                        return new Class(courseData.course, courseData.status,
                                         courseData.units, courseData.grading, sections);
                    });
                    state.classSchedules[uniqName] = {courses};
                }
            }

            // Proceed once data is in place
            initializePage();
        })
        .catch((error) => {
            const detailedErrorMessage =
                `Error during data fetching.\n` +
                `Message: ${error.message}\n` +
                `Stack:\n${error.stack || 'No stack trace available.'}`;

            console.error(detailedErrorMessage);
            displayErrorMessage(detailedErrorMessage);

            // Initialize the page even if fetching fails
            initializePage();
        });

    /**
     * Main initialization after data fetch completes or fails.
     * Sets up user state, favorites, pinned, and UI interactions.
     */
    function initializePage() {
        // For demonstration: set state to "signed in"
        state.signedIn = true;
        state.userName = 'Kaden';
        state.userEmail = 'kgruiz@umich.edu';

        // Load favorites and pinned
        loadFavorites();
        loadPinneds();

        // Populate 'Most Popular'
        const mostPopularContainer = document.getElementById('most-popular-container');
        if (mostPopularContainer && state.linksData.length > 0) {
            const sortedByRank =
                [...state.linksData].sort((a, b) => b.currentRating - a.currentRating);
            const top4 = sortedByRank.slice(0, 4);
            top4.forEach((link) => {
                const card = CreateCard(link);
                mostPopularContainer.append(card);
            });
        }

        // Populate top Favorites
        const topFavoritesContainer = document.getElementById('favorites-container');
        if (topFavoritesContainer && state.linksData.length > 0) {
            function populateTopFavorites() {
                topFavoritesContainer.innerHTML = '';
                const favoritedLinks =
                    state.linksData.filter((link) => isLinkFavorited(link));
                const sortedByRank =
                    [...favoritedLinks].sort((a, b) => b.currentRating - a.currentRating);
                const maxFavoritesDisplay = localStorage.getItem('maxFavoritesDisplay');
                let numToDisplay =
                    maxFavoritesDisplay ? parseInt(maxFavoritesDisplay, 10) : 4;
                if (maxFavoritesDisplay == 0) {
                    numToDisplay = Infinity;
                }
                const topFavorites = sortedByRank.slice(0, numToDisplay);

                topFavorites.forEach((link) => {
                    const card = CreateCard(link);
                    topFavoritesContainer.append(card);
                });
            }
            window.populateTopFavorites = populateTopFavorites;
            populateTopFavorites();
        }

        // Populate All Links on Index
        const allLinksContainer = document.getElementById('all-links-container');
        if (allLinksContainer && state.linksData.length > 0) {
            const sortedByRank =
                [...state.linksData].sort((a, b) => b.currentRating - a.currentRating);
            const top10 = sortedByRank.slice(0, 10);
            const next30 = sortedByRank.slice(10, 40);

            top10.forEach((link) => {
                const card = CreateCard(link);
                card.classList.add('initial-cards');
                allLinksContainer.append(card);
            });
            next30.forEach((link) => {
                const card = CreateCard(link);
                card.classList.add('additional-cards', 'hidden');
                allLinksContainer.append(card);
            });
        }

        // Initialize Favorites in hero/nav
        populateFavoritesContainers();
        // Initialize pinned links
        populatePinnedsContainers();

        // For the All Links Full page
        const allLinksFullContainer = document.getElementById('all-links-full-container');
        if (allLinksFullContainer) {
            let sortType = 'rank';
            let searchTerm = '';
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('q')) {
                searchTerm = urlParams.get('q').toLowerCase();
            }

            function RenderAllLinksFull() {
                allLinksFullContainer.innerHTML = '';
                let linksToShow = [...state.linksData];

                if (sortType === 'rank') {
                    linksToShow.sort((a, b) => b.currentRating - a.currentRating);
                } else if (sortType === 'alphabetical') {
                    linksToShow.sort((a, b) => a.title.localeCompare(b.title));
                }

                if (searchTerm.trim() !== '') {
                    linksToShow = linksToShow.filter(
                        (link) =>
                            (link.title &&
                             link.title.toLowerCase().includes(searchTerm)) ||
                            (link.applicationName &&
                             link.applicationName.toLowerCase().includes(searchTerm)));
                }

                if (linksToShow.length === 0) {
                    const noResults = document.createElement('p');
                    noResults.textContent = 'No results found.';
                    allLinksFullContainer.appendChild(noResults);
                } else {
                    linksToShow.forEach((link) => {
                        const card = CreateCard(link);
                        allLinksFullContainer.append(card);
                    });
                }
                // Re-init card hover
                initializeCardHoverEffects();
            }

            const fullSearchInput = document.getElementById('fullSearchInput');
            if (fullSearchInput) {
                fullSearchInput.value = searchTerm;
                fullSearchInput.addEventListener('input', () => {
                    searchTerm = fullSearchInput.value.toLowerCase();
                    RenderAllLinksFull();
                });
            }

            const sortTypeToggle = document.getElementById('sort-type-toggle');
            if (sortTypeToggle) {
                sortTypeToggle.addEventListener('change', () => {
                    sortType = sortTypeToggle.checked ? 'alphabetical' : 'rank';
                    RenderAllLinksFull();
                });
            }
            RenderAllLinksFull();

            const showMoreButton = document.getElementById('show-more');
            const showLessButton = document.getElementById('show-less');
            const showAllButton = document.getElementById('show-all');

            showMoreButton?.addEventListener('click', () => {
                const additionalCards = document.querySelectorAll('.additional-cards');
                additionalCards.forEach((card) => {
                    card.classList.remove('hidden');
                });
                showMoreButton.classList.add('hidden');
                showLessButton.classList.remove('hidden');
                showAllButton.classList.remove('hidden');
            });

            showLessButton?.addEventListener('click', () => {
                const additionalCards = document.querySelectorAll('.additional-cards');
                additionalCards.forEach((card) => {
                    card.classList.add('hidden');
                });
                showMoreButton.classList.remove('hidden');
                showLessButton.classList.add('hidden');
                showAllButton.classList.add('hidden');
            });

            initializeSignInMenu();
            initializeHoverMenus();
            initializeButtonEffects();
            initializeCardHoverEffects();
            initializeNavIconsHoverEffects();
            initializeFavoritesIconHoverEffects();
        }

        // Favorites Manager Page
        const favoritesManagerContainer =
            document.getElementById('all-favorites-container');
        if (favoritesManagerContainer) {
            let sortType = 'rank';
            let searchTerm = '';

            const fullSearchInputFavorites =
                document.getElementById('fullSearchInputFavorites');
            if (fullSearchInputFavorites) {
                fullSearchInputFavorites.addEventListener('input', () => {
                    searchTerm = fullSearchInputFavorites.value.toLowerCase();
                    RenderFavorites();
                });
            }

            const toggleFavorites =
                document.querySelector('.sort-type-selector-favorites');
            if (toggleFavorites) {
                toggleFavorites.addEventListener('change', () => {
                    sortType = toggleFavorites.checked ? 'alphabetical' : 'rank';
                    RenderFavorites();
                });
            }

            function RenderFavorites() {
                favoritesManagerContainer.innerHTML = '';
                let favoritedLinks =
                    state.linksData.filter((link) => isLinkFavorited(link));

                if (sortType === 'rank') {
                    favoritedLinks.sort((a, b) => b.currentRating - a.currentRating);
                } else if (sortType === 'alphabetical') {
                    favoritedLinks.sort((a, b) => a.title.localeCompare(b.title));
                }

                if (searchTerm.trim() !== '') {
                    favoritedLinks = favoritedLinks.filter(
                        (link) =>
                            (link.title &&
                             link.title.toLowerCase().includes(searchTerm)) ||
                            (link.applicationName &&
                             link.applicationName.toLowerCase().includes(searchTerm)));
                }

                if (favoritedLinks.length === 0) {
                    const noFavorites = document.createElement('p');
                    noFavorites.textContent = 'No pinned links yet.';
                    favoritesManagerContainer.appendChild(noFavorites);
                } else {
                    favoritedLinks.forEach((link) => {
                        const card = CreateFavoriteCard(link);
                        favoritesManagerContainer.appendChild(card);
                    });
                }
            }

            RenderFavorites();
            initializeSignInMenu();
            initializeHoverMenus();
            initializeButtonEffects();
            initializeCardHoverEffects();
            initializeNavIconsHoverEffects();
            initializeFavoritesIconHoverEffects();
        }

        // Setup Search Suggestions
        const headerInput = document.getElementById('headerSearchInput');
        const headerSuggestions = document.getElementById('headerSearchSuggestions');
        const heroInput = document.getElementById('heroSearchInput');
        const heroSuggestions = document.getElementById('heroSearchSuggestions');
        if (headerInput && headerSuggestions) {
            SetupSearchSuggestions(headerInput, headerSuggestions);
        }
        if (heroInput && heroSuggestions) {
            SetupSearchSuggestions(heroInput, heroSuggestions);
        }

        // Show More / Show Less on index
        const showMoreButton = document.getElementById('show-more');
        const showLessButton = document.getElementById('show-less');
        const showAllButton = document.getElementById('show-all');

        showMoreButton?.addEventListener('click', () => {
            const additionalCards = document.querySelectorAll('.additional-cards');
            additionalCards.forEach((card) => {
                card.classList.remove('hidden');
            });
            showMoreButton.classList.add('hidden');
            showLessButton.classList.remove('hidden');
            showAllButton.classList.remove('hidden');
        });

        showLessButton?.addEventListener('click', () => {
            const additionalCards = document.querySelectorAll('.additional-cards');
            additionalCards.forEach((card) => {
                card.classList.add('hidden');
            });
            showMoreButton.classList.remove('hidden');
            showLessButton.classList.add('hidden');
            showAllButton.classList.add('hidden');
        });

        const heroLogo = document.getElementById('hero-logo');

        initializeSignInMenu();
        initializeHoverMenus();
        initializeButtonEffects();
        initializeCardHoverEffects();
        initializeNavIconsHoverEffects();
        initializeFavoritesIconHoverEffects();
        initializeSwitchToggleEffects();
        InitializeMessages();
        InitializeGlobalListeners();

        // Initialize preferences
        InitializePreferencesMenu();
        InitializePreferencesToggle();
        initializeFavoritesNumSpinner();

        // Initialize the new approach for reordering sections in Preferences
        initializeSectionReorderPreferences();

        if (window.location.pathname.includes('index.html')) {
            InitializeAnimation(heroLogo);
        }

        // Class Schedule page logic
        if (window.location.pathname.includes('class-schedule.html')) {
            const calendarViewOptions = document.querySelector('.calendar-view-options');
            calendarViewOptions.style.display = 'none';

            let timeSpinners;
            InitializePrinterFriendlyButton();

            function updateClassSchedule() {
                const selectedRadio =
                    document.querySelector('input[name="schedule-view"]:checked');
                const viewType = selectedRadio ? selectedRadio.value : 'list';

                if (viewType === 'calendar') {
                    calendarViewOptions.style.display = 'flex';
                } else {
                    calendarViewOptions.style.display = 'none';
                }

                const selectedCheckboxes =
                    document.querySelectorAll('input[name="schedule-day"]:checked');
                let selectedDays = Array.from(selectedCheckboxes).map((c) => c.value);

                // Default to Monday if no days are selected
                if (selectedDays.length === 0) {
                    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
                    selectedDays = days.map((day) => {
                        const checkbox = document.getElementById(`day-${day}`);
                        if (checkbox) {
                            checkbox.checked = true;
                        }
                        return day.charAt(0).toUpperCase() + day.slice(1);
                    });
                }

                const toggleTimePostfix = document.getElementById('toggleTimePostfix');
                const toggleClassTitle = document.getElementById('toggleClassTitle');
                const toggleInstructor = document.getElementById('toggleInstructor');
                const toggleLocation = document.getElementById('toggleLocation');
                const toggleShowTime = document.getElementById('toggleShowTime');
                const toggleShowEnrolled = document.getElementById('toggleShowEnrolled');
                const toggleShowWaitlisted =
                    document.getElementById('toggleShowWaitlisted');

                const showTimePostfix = toggleTimePostfix.checked;
                const showClassTitle = toggleClassTitle.checked;
                const showInstructor = toggleInstructor.checked;
                const showLocation = toggleLocation.checked;
                const showTime = toggleShowTime.checked;
                const showEnrolled = toggleShowEnrolled.checked;
                const showWaitlisted = toggleShowWaitlisted.checked;

                timeSpinners =
                    initializeTimeSpinners(RenderClassSchedule, showTimePostfix);

                RenderClassSchedule('kgruiz', viewType, selectedDays, showTimePostfix,
                                    showClassTitle, showInstructor, showLocation,
                                    showTime, showEnrolled, showWaitlisted,
                                    state.classSchedules);
            }

            updateClassSchedule();

            // Event listeners for schedule view radio
            const scheduleViewRadios =
                document.querySelectorAll('input[name="schedule-view"]');
            scheduleViewRadios.forEach((radio) => {
                radio.addEventListener('change', updateClassSchedule);
            });

            // Event listeners for day checkboxes
            const dayCheckboxes = document.querySelectorAll('input[name="schedule-day"]');
            dayCheckboxes.forEach((checkbox) => {
                checkbox.addEventListener('change', updateClassSchedule);
            });

            const toggleTimePostfix = document.getElementById('toggleTimePostfix');
            const toggleClassTitle = document.getElementById('toggleClassTitle');
            const toggleInstructor = document.getElementById('toggleInstructor');
            const toggleLocation = document.getElementById('toggleLocation');
            const toggleShowTime = document.getElementById('toggleShowTime');
            const toggleShowEnrolled = document.getElementById('toggleShowEnrolled');
            const toggleShowWaitlisted = document.getElementById('toggleShowWaitlisted');

            [toggleTimePostfix, toggleClassTitle, toggleInstructor, toggleLocation,
             toggleShowTime, toggleShowEnrolled, toggleShowWaitlisted]
                .forEach((toggle) => {
                    toggle.addEventListener('change', updateClassSchedule);
                });
        }
    }
});

/**
 * Displays an error message in the #error-message-container if present.
 */
function displayErrorMessage(message) {
    const errorContainer = document.getElementById('error-message-container');
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    } else {
        console.error('Error container not found:', message);
    }
}
