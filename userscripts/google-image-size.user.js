// ==UserScript==
// @name        Show Google Image Size
// @namespace   https://github.com/amcginn/
// @match       https://www.google.com/search*
// @grant       none
// @version     1.1.0
// @author      amcginn
// @license     MIT
// @description Add image sizes to Google Image search results.
// @changelog   1.1.0 - Use MutationObserver, debouncing, skip Google's own dimensions, improved positioning
// @changelog   1.0 - Initial release
// ==/UserScript==

function createSizeEl(width, height) {
  let container = document.createElement('div');
  container.innerText = width + 'x' + height;
  container.style.cssText = 'position:absolute;bottom:8px;right:10px;padding:2px 3px;border-radius:4px;pointer-events:none;font-size:14px;background:rgba(0,0,0,.6);color:white';
  return container;
}

function showImgSizes() {
  let searchImageResults = document.querySelectorAll('h3:has(> a[href] img):not(.image-size)');

  for (const result of searchImageResults) {
    try {
      let link = result.firstChild;
      if (!link?.href || link.querySelector('p')) continue;
      
      let linkParams = new URL(link.href, globalThis.location.origin).searchParams;
      let width = linkParams.get('w');
      let height = linkParams.get('h');

      if (!width || !height) continue;

      let imgContainer = result.parentElement;
      if (!imgContainer || imgContainer.querySelector(':scope > div[style*="position:absolute"]')) continue;

      imgContainer.style.position = 'relative';
      imgContainer.appendChild(createSizeEl(width, height));
      result.classList.add('image-size');
    } catch (error_) {
      console.debug('Failed to add image size:', error_)
    }
  }
}

let timeout;
function debouncedShowImgSizes() {
  clearTimeout(timeout);
  timeout = setTimeout(showImgSizes, 300);
}

window.addEventListener('load', () => {
  try {
    const observer = new MutationObserver(debouncedShowImgSizes);
    observer.observe(document.body, { childList: true, subtree: true });
    showImgSizes();
  } catch (error_) {
    console.error('Failed to initialize observer:', error_);
  }
});
