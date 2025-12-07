// ==UserScript==
// @name        Show Google Image Size
// @namespace   https://github.com/amcginn/
// @match       https://www.google.com/search*
// @grant       none
// @version     1.2.0
// @author      amcginn
// @license     MIT
// @description Add image sizes to Google Image search results.
// @changelog   1.2.0 - Refactor from Google changes: pull from window js objects
// @changelog   1.1.0 - Use MutationObserver, debouncing, skip Google's own dimensions, improved positioning
// @changelog   1.0 - Initial release
// @downloadURL https://update.greasyfork.org/scripts/497480/Show%20Google%20Image%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/497480/Show%20Google%20Image%20Size.meta.js
// ==/UserScript==

function createSizeEl(width, height) {
  let container = document.createElement('div');
  container.innerText = width + 'x' + height;
  container.style.cssText = 'position:absolute;bottom:8px;right:10px;padding:2px 3px;border-radius:4px;pointer-events:none;font-size:14px;background:rgba(0,0,0,.6);color:white';
  return container;
}

function showImgSizes() {
  let searchImageResults = document.querySelectorAll('h3:has(> a img):not(.image-size)');

  for (const result of searchImageResults) {
    try {
      let container = result.closest('[data-ved]')
      let imgId = container.getAttribute('jsdata').split(';').pop()
      let arr = window.W_jd[imgId];
      let syms = Object.getOwnPropertySymbols(arr);
      let realArr = arr[syms[0]].Ar

      let fullImg = realArr[1].Ar[3]
      let height = fullImg[1]
      let width = fullImg[2]

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
  if (!window.W_jd) return;

  try {
    const observer = new MutationObserver(debouncedShowImgSizes);
    observer.observe(document.body, { childList: true, subtree: true });
    showImgSizes();
  } catch (error_) {
    console.error('Failed to initialize observer:', error_);
  }
});