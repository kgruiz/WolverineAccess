/**
 * FILE: globalListeners.js
 * Sets up global event listeners for the application.
 */

// ==============================
// Global Event Handlers
// ==============================

// ==============================
// Event Listeners
// ==============================

export function InitializeGlobalListeners() {

    window.addEventListener('scroll', () => {
        const backToTopButton = document.querySelector('.back-to-top');
        const homeButton = document.querySelector('.home-button');
        if (window.scrollY > 200) {
            backToTopButton.style.display = 'block';
            homeButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
            homeButton.style.display = 'none';
        }
    });
    document.querySelector('.back-to-top')?.addEventListener('click', () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    });
    document.querySelector('.home-button')?.addEventListener('click', () => {
        if (window.location.pathname.endsWith('index.html')) {
            window.scrollTo({top: 0, behavior: 'smooth'});
        } else {
            window.location.href = 'index.html';
        }
    });
}