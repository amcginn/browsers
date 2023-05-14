// ==UserScript==
// @name        insta - no sponsors
// @namespace   https://github.com/amcginn
// @match       https://www.instagram.com/
// @grant       none
// @version     1.0
// @author      amcginn
// @description remove sponsored post content from instagram.com
// ==/UserScript==

function removeSponsored() {
  let elements = document.getElementsByTagName('use');

  Array.from(elements).forEach( (element) => {
    let article = element.closest('article');
    if (article != null) {
      article.innerHTML = "<span>&nbsp;&nbsp;Removed sponsored post</span>";
      console.log('removed element')
    }
  })
}

window.addEventListener('load', function() {
  setInterval(removeSponsored, 5000);
});
