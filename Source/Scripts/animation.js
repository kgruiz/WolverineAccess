/**
 * FILE: animation.js
 * Controls animations and visual transitions.
 */

import {footballSVG} from './constants.js';

// ==============================
// Animation Logic
// ==============================

export function animateEllipticalArc(svgString, startX, startY, endX, endY) {
    console.log('Function called with parameters:',
                {svgString, startX, startY, endX, endY});

    // Create a temporary span to hold the SVG
    const tempSpan = document.createElement('span');
    console.log('Created temporary span to hold SVG.');

    tempSpan.innerHTML = svgString;
    console.log('Inserted SVG string into temporary span.');

    // Append the tempSpan to the body first to ensure the SVG is part of the DOM
    document.body.appendChild(tempSpan);
    console.log('Temporary span appended to the document body.');

    const svg = tempSpan.querySelector('svg');

    if (!svg) {
        console.error('Invalid SVG string provided. No <svg> element found.');
        tempSpan.remove();
        console.log('Temporary span removed due to invalid SVG.');
        return;
    }

    console.log('SVG element successfully retrieved:', svg);

    // Style the temporary span for positioning and visibility
    tempSpan.style.position = 'fixed';    // Position absolutely for precise control
    tempSpan.style.left = `${startX}px`;  // Set initial X position
    tempSpan.style.top = `${startY}px`;   // Set initial Y position
    tempSpan.style.display = 'inline-block';
    tempSpan.style.transition = 'transform 3s linear, opacity 1s';  // Smooth animation
    tempSpan.style.opacity = 0;             // Start hidden for fade-in
    tempSpan.style.pointerEvents = 'none';  // Allow clicks through the SVG

    console.log('Styled temporary span for absolute positioning and initial opacity.');

    // Optional: Add a border to the SVG for debugging (remove in production)
    // tempSpan.style.border = "2px solid black";
    // tempSpan.style.padding = "5px";

    // Parameters for the elliptical arc
    const centerX = (startX + endX) / 2;
    const centerY = Math.min(startY, endY) - 100;  // Adjust as needed
    const radiusX = Math.abs(endX - startX) / 2;
    const radiusY = 100;    // Adjust as needed for the desired ellipse
    const duration = 3000;  // Duration in milliseconds

    console.log('Calculated animation parameters:',
                {centerX, centerY, radiusX, radiusY, duration});

    let startTime;

    // Function to fade the SVG in
    function fadeIn() {
        console.log('Fade-in initiated.');
        tempSpan.style.opacity = 1;
        console.log('SVG fade-in complete.');
    }

    // Function to fade the SVG out
    function fadeOut() {
        console.log('Fade-out initiated.');
        tempSpan.style.opacity = 0;
        console.log('SVG fade-out complete.');
    }

    // Function to animate the arc
    function animate(timestamp) {
        if (!startTime) {
            startTime = timestamp;
            console.log('Animation start time set to:', startTime);
        }

        const elapsed = timestamp - startTime;
        console.log('Elapsed time:', elapsed);

        const progress = Math.min(elapsed / duration, 1);  // Ensure it stops at 100%
        console.log('Animation progress:', progress);

        // Calculate the angle in radians (0 to π for a half-circle)
        const angle = Math.PI * progress;
        console.log('Calculated angle (radians):', angle);

        // Update the SVG's position based on the elliptical arc formula
        const x = centerX + radiusX * Math.cos(angle) - startX;  // Relative movement
        const y = centerY + radiusY * Math.sin(angle) - startY;  // Relative movement
        console.log('Calculated relative position on arc:', {x, y});

        tempSpan.style.transform = `translate(${x}px, ${y}px)`;
        console.log('Updated temporary span transform to:', tempSpan.style.transform);

        if (progress < 1) {
            console.log('Animation progress < 1, requesting next frame.');
            requestAnimationFrame(animate);
        } else {
            console.log('Animation complete.');
            setTimeout(() => {
                console.log('Starting fade-out after animation completion.');
                fadeOut();
                setTimeout(() => {
                    console.log('Removing temporary span after fade-out.');
                    tempSpan.remove();
                }, 1000);  // Wait for fade-out transition to complete
            }, 500);       // Optional delay before fading out
        }
    }

    // Start the animation sequence: Fade in, then animate arc
    console.log('Initiating fade-in.');
    fadeIn();

    setTimeout(() => {
        console.log('Starting animation after fade-in.');
        requestAnimationFrame(animate);
    }, 1000);  // Wait for fade-in to complete before starting animation
}

export function InitializeAnimation(heroLogo) {



    if (heroLogo) {

        heroLogo.addEventListener('click', () => {
            let startX = heroLogo.getBoundingClientRect().right + 20;
            let startY = heroLogo.getBoundingClientRect().bottom - 20;
            let endX = heroLogo.getBoundingClientRect().left - 20;
            let endY = heroLogo.getBoundingClientRect().top + 20;


            // Create a large rectangle at the start point
            const startRect = document.createElement('div');
            startRect.style.position = 'absolute';
            startRect.style.left = `${startX - 50}px`;
            startRect.style.top = `${startY - 50}px`;
            startRect.style.width = '100px';
            startRect.style.height = '100px';
            startRect.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
            startRect.style.zIndex = '1000';
            document.body.appendChild(startRect);

            // Create a large rectangle at the end point
            const endRect = document.createElement('div');
            endRect.style.position = 'absolute';
            endRect.style.left = `${endX - 50}px`;
            endRect.style.top = `${endY - 50}px`;
            endRect.style.width = '100px';
            endRect.style.height = '100px';
            endRect.style.backgroundColor = 'rgba(0, 0, 255, 0.5)';
            endRect.style.zIndex = '1000';
            document.body.appendChild(endRect);

            // Remove the rectangles after 10 seconds
            setTimeout(() => {
                startRect.remove();
                endRect.remove();
            }, 10000);

            animateEllipticalArc(footballSVG, startX, startY, endX, endY);
        });
    }
}