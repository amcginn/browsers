// ==UserScript==
// @name        Toggle FB reactions
// @namespace   https://github.com/amcginn/
// @match       https://*.facebook.com/*
// @grant       none
// @version     1.0
// @author      amcginn
// @license     MIT
// @description Toggle the reaction and new comment containers.
// @downloadURL https://github.com/amcginn/browsers/blob/main/userscripts/facebook-toggle-reactions.user.js
// ==/UserScript==

// Configuration
const config = {
    top: '16px',
    left: '30%',
    width: '32px',
    height: '24px',
    bgColor: 'lightskyblue',
    borderColor: 'deepskyblue'
};

// Base selectors
const selectors = [
    'div[data-0] + div:not([data-0]) div:has(> div> form)',
    'div:has(> div > div > span[aria-label="See who reacted to this"]) + div',
    'div[data-0] + div:not([data-0]) div:has(>div > *[aria-label="Like"]):has(*[aria-label="Leave a comment"])',
    'div:has(> div > form div[contenteditable])'
];

// Add styles once
const style = document.createElement('style');
style.textContent = '.am-hidden { display: none !important; }';
document.head.appendChild(style);

// Track visibility state
let isHidden = true;

// Create and add toggle button
const toggleButton = document.createElement('button');
Object.assign(toggleButton.style, {
    position: 'fixed',
    top: config.top,
    left: config.left,
    width: config.width,
    height: config.height,
    backgroundColor: config.bgColor,
    border: `solid ${config.borderColor} 1px`,
    borderRadius: '4px',
    cursor: 'pointer',
    zIndex: '9999'
});

// Toggle functionality
toggleButton.addEventListener('click', () => {
    isHidden = !isHidden;
    document.querySelectorAll('.am-hide-toggle').forEach(el => {
        el.classList.toggle('am-hidden');
    });
});

document.body.appendChild(toggleButton);

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function addToggleClasses() {
    const selectorString = selectors.map(selector => `${selector}:not(.am-hide-toggle)`).join(',');
    const elements = document.querySelectorAll(selectorString);

    elements.forEach(el => {
        el.classList.add('am-hide-toggle');
        if (isHidden) {
            el.classList.add('am-hidden');
        }
    });
}

const debouncedAddToggleClasses = debounce(addToggleClasses, 100);

const observer = new MutationObserver(debouncedAddToggleClasses);
observer.observe(document.body, {
    childList: true,
    subtree: true
});

addToggleClasses();
