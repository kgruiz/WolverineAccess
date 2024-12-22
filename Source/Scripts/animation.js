/**
 * FILE: animation.js
 * Controls animations and visual transitions.
 */

import {footballSVG} from './constants.js';

// script.js

export function InitializeAnimation(heroLogo) {
    const container = heroLogo

    // Get the dimensions of the hero logo
    const heroRect = container.getBoundingClientRect();
    const startX = 20;                  // Start a bit inside from the left
    const startY = 20;                  // Start a bit inside from the top
    const endX = heroRect.width - 20;   // End a bit inside from the right
    const endY = heroRect.height - 20;  // End a bit inside from the bottom

    // Create Trajectory SVG
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'trajectory');
    svg.setAttribute('width', heroRect.width);    // Match container width
    svg.setAttribute('height', heroRect.height);  // Match container height

    container.appendChild(svg);

    // Create Ball with SVG String
    const ball = document.createElement('div');
    ball.classList.add('ball');
    ball.innerHTML = footballSVG;
    container.appendChild(ball);

    // Position the ball initially at the start of the path
    ball.style.top = `${startY}px`;
    ball.style.left = `${startX}px`;

    // Set initial opacity of elements to 0
    ball.style.opacity = '0';

    // Animation Trigger
    heroLogo.addEventListener('click', () => {
        // Remove animate class if already present
        ball.classList.remove('animate');

        ball.style.opacity = '1';

        // Trigger reflow to restart animation
        void ball.offsetWidth;

        // Add animate class to start the animation
        ball.classList.add('animate');
    });

    // Remove animate class after animation ends to allow re-triggering
    ball.addEventListener('animationend', () => {
        ball.classList.remove('animate');

        ball.style.opacity = '0';
    });
}