// Import from constants.js
// Import from animation.js
import {animateEllipticalArc} from './animation.js';
// Import from auth.js
import {initializeSignInMenu, signIn, signOut} from './auth.js';
// Import from cards.js
import {FAVORITES_KEY, filledStarSVG, footballSVG, optionsIconSVG, outlinedStarSVG, state} from './constants.js';
// Import from effects.js
import {initializeButtonEffects, initializeCardHoverEffects, initializeFavoritesIconHoverEffects, initializeHoverMenus, initializeNavIconsHoverEffects, initializeSwitchToggleEffects, setupHoverMenu, setupSignInHover} from './effects.js';
// Import from error.js
import {displayErrorMessage, displayLogMessage, displayWarningMessage, InitializeMessages} from './error.js';
// Import from favorites.js
import {addFavorite, isLinkFavorited, loadFavorites, populateFavoritesContainers, removeFavorite, saveFavorites, updateStarAppearance} from './favorites.js';
// Import from globalListeners.js
import {InitializeGlobalListeners} from './globalListeners.js';
// Import from preference.js
import {InitializePreferencesMenu, InitializePreferencesToggle, openPreferencesMenu} from './preference.js';
// Import from search.js
import {SetupSearchSuggestions} from './search.js';

// ==============================
// UI Rendering Functions
// ==============================
/**
 * Create a card element for a given link.
 * @param {Object} link - The link object.
 * @returns {HTMLElement} - The card element.
 */
export function CreateCard(link) {
    const card = document.createElement('a');
    card.className = 'card';
    card.href = link.href;
    card.dataset.uniqueKey = link.uniqueKey;
    if (link.openInNewWindow) {
        card.target = '_blank';
        card.rel = 'noopener';
    }
    const header = document.createElement('h3');
    header.textContent = link.title;
    card.appendChild(header);
    const subHeader = document.createElement('p');
    subHeader.className = 'sub-header';
    subHeader.textContent = link.applicationName;
    card.appendChild(subHeader);
    const img = document.createElement('img');
    img.src = link.image;
    img.alt = link.alt;
    card.appendChild(img);
    const star = document.createElement('span');
    star.className = 'favorite-star';
    if (isLinkFavorited(link)) {
        // Set filled star icon
        star.innerHTML = filledStarSVG;
        star.classList.add('favorited');
        card.classList.add('favorited-card');
    } else {
        // Set the outlined star icon
        star.innerHTML = outlinedStarSVG;
    }
    card.appendChild(star);
    // Add hover effect for the star
    star.addEventListener('mouseover', () => {
        star.style.transform = 'scale(1.2)';
        star.style.color = '#FFCB05';  // Optional: Apply a color highlight
    });
    star.addEventListener('mouseout', () => {
        if (!isLinkFavorited(link)) {
            star.style.color = '';  // Reset to default color
        }
        star.style.transform = 'scale(1)';
    });
    // Click event for favoriting
    star.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();  // Prevent card click
        if (isLinkFavorited(link)) {
            // Remove from favorites
            removeFavorite(link);
            star.classList.remove('favorited');
            card.classList.remove('favorited-card');
            // Set to outlined star
            star.innerHTML = outlinedStarSVG;
            // Trigger unfill animation
            star.classList.add('animate-unfill');
            // Remove the animation class after animation completes
            star.addEventListener('animationend', () => {
                star.classList.remove('animate-unfill');
            }, {once: true});
            // Remove card from favorites containers
            removeCardFromFavoritesContainers(card);
        } else {
            // Add to favorites
            addFavorite(link);
            star.classList.add('favorited');
            card.classList.add('favorited-card');
            // Set to filled star
            star.innerHTML = filledStarSVG;
            // Trigger fill animation
            star.classList.add('animate-fill');
            // Remove the animation class after animation completes
            star.addEventListener('animationend', () => {
                star.classList.remove('animate-fill');
            }, {once: true});
            // Add card to favorites containers
            addCardToFavoritesContainers(card);
        }
        // Update the star icon appearance
        updateStarAppearance(star, link);
        // Re-render favorites if necessary
        if (typeof RenderFavorites === 'function') {
            RenderFavorites();
        }
    });
    // Add hover effects to the card
    card.addEventListener('mouseover', () => {
        card.style.transform = 'translateY(-5px)';
        const favoriteStar = card.querySelector('.favorite-star');
        if (favoriteStar) {
            favoriteStar.style.display = 'block';
        }
    });
    card.addEventListener('mouseout', () => {
        card.style.transform = 'translateY(0px)';
        const favoriteStar = card.querySelector('.favorite-star');
        if (favoriteStar && !isLinkFavorited(link)) {
            favoriteStar.style.display = 'none';
        }
    });
    return card;
}

/**
 * Create a favorite card element for a given link.
 * @param {Object} link - The link object.
 * @returns {HTMLElement} - The favorite card element.
 */
export function CreateFavoriteCard(link) {
    const card = document.createElement('a');
    card.className = 'favorite-card';
    card.href = link.href;
    card.dataset.uniqueKey = link.uniqueKey;
    if (link.openInNewWindow) {
        card.target = '_blank';
        card.rel = 'noopener';
    }

    const header = document.createElement('h3');
    header.textContent = link.title;
    card.appendChild(header);
    const subHeader = document.createElement('p');
    subHeader.className = 'sub-header';
    subHeader.textContent = link.applicationName;
    card.appendChild(subHeader);
    const img = document.createElement('img');
    img.src = link.image;
    img.alt = link.alt;
    card.appendChild(img);

    card.style.transition = 'transform 0.3s ease';

    // Add the options icon (three dots)
    const optionsIcon = document.createElement('span');
    optionsIcon.className = 'options-icon';
    optionsIcon.innerHTML = optionsIconSVG;
    card.appendChild(optionsIcon);
    optionsIcon.style.display = 'none';

    // Create the options menu
    const optionsMenu = document.createElement('div');
    optionsMenu.className = 'options-menu';
    const removeFavoriteOption = document.createElement('div');
    removeFavoriteOption.className = 'options-menu-item';
    removeFavoriteOption.textContent = 'Remove Favorite';
    optionsMenu.appendChild(removeFavoriteOption);

    // Add the options menu to the card
    card.appendChild(optionsMenu);

    // Event listener for optionsIcon click to toggle the menu
    optionsIcon.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();  // Prevent card click
        optionsMenu.classList.toggle('active');
    });

    // Event listener for removeFavoriteOption click
    removeFavoriteOption.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();  // Prevent card click

        // Remove from favorites
        removeFavorite(link);

        // Update the card UI
        card.remove();

        // Remove card from other favorites containers
        removeCardFromFavoritesContainers(card);

        // Re-render the favorites if necessary
        RenderFavorites();
    });

    // Close options menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!optionsMenu.contains(event.target) && event.target !== optionsIcon) {
            optionsMenu.classList.remove('active');
        }
    });

    // Prevent menu from closing when clicking inside
    optionsMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Add hover effects to the card
    card.addEventListener('mouseover', () => {
        optionsIcon.style.display = 'block';
        card.style.transform = 'translateY(-5px)';
    });
    card.addEventListener('mouseout', () => {
        optionsIcon.style.display = 'none';
        card.style.transform = 'translateY(0px)';
    });

    card.addEventListener('mouseleave', () => {
        optionsIcon.style.display = 'none';
        optionsMenu.classList.remove('active');
        card.style.transform = 'translateY(0px)';
    });


    return card;
}