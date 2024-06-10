// ==UserScript==
// @name        Show Google Image Size
// @namespace   https://github.com/amcginn/
// @match       https://www.google.com/search*
// @grant       none
// @version     1.0
// @author      amcginn
// @license     MIT
// @description Add image sizes to Google Image search results.
// ==/UserScript==

function createSizeEl(width, height) {
  let container = document.createElement('div');
  container.innerText = width + 'x' + height;

  container.style.position = 'absolute';
  container.style.bottom = '8px';
  container.style.right = '10px';
  container.style.padding = '2px 3px';
  container.style.borderRadius = '4px';
  container.style.pointerEvents = 'none';
  container.style.cursor = 'inherit';
  container.style.fontSize = '14px';
  container.style.backgroundColor = 'rgba(0, 0, 0, .6)';
  container.style.color = 'white';

  return container;
}

function showImgSizes() {
  let searchImageResults = document.querySelectorAll('h3:has(a[href] g-img):not(.image-size)');

  searchImageResults.forEach((result) => {
    try {
      let link = result.firstChild;
      if (link) {
        let linkParams = new URL(link.href, window.location.origin).searchParams;
        let width = linkParams.get('w');
        let height = linkParams.get('h');

        if (width && height) {
          let imgSizeEl = createSizeEl(width, height);
          result.insertAdjacentElement("afterend", imgSizeEl);
          result.classList.add('image-size');
        }
      }
    } catch (er) {
      console.log(er);
    }
  });
}

window.addEventListener('load', () => {
  setInterval(showImgSizes, 1000);
});
