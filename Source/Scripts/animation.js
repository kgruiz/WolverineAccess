// script.js

export function InitializeAnimation(heroLogo) {
    const container = heroLogo

    // Define Path Data
    const pathData = 'M50,350 Q300,50 550,200';

    // Create Trajectory SVG
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'trajectory');
    svg.setAttribute('width', '600');
    svg.setAttribute('height', '400');

    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('stroke', '#888');  // Visible trajectory
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'none');

    svg.appendChild(path);
    container.appendChild(svg);

    // Create Ball
    const ball = document.createElement('div');
    ball.classList.add('ball');

    const ballSVG = document.createElementNS(svgNS, 'svg');
    ballSVG.setAttribute('width', '30');
    ballSVG.setAttribute('height', '30');

    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', '15');
    circle.setAttribute('cy', '15');
    circle.setAttribute('r', '15');
    circle.setAttribute('fill', '#ff5722');

    ballSVG.appendChild(circle);
    ball.appendChild(ballSVG);
    container.appendChild(ball);

    // Set opacity to 0 for all elements
    svg.style.opacity = '0';
    ball.style.opacity = '0';

    // Set the same path for CSS Motion Path
    ball.style.offsetPath = `path('${pathData}')`;

    // Animation Trigger
    heroLogo.addEventListener('click', () => {
        // Remove animate class if already present
        ball.classList.remove('animate');

        svg.style.opacity = '1';
        ball.style.opacity = '1';

        // Trigger reflow to restart animation
        void ball.offsetWidth;

        // Add animate class to start the animation
        ball.classList.add('animate');
    });

    // Remove animate class after animation ends to allow re-triggering
    ball.addEventListener('animationend', () => {
        ball.classList.remove('animate');
        svg.style.opacity = '0';
        ball.style.opacity = '0';
    });
}
