// ==UserScript==
// @name         Don't translate code
// @namespace    ycs77
// @version      0.2.1
// @description  Don't translate code from all website
// @author       Lucas Yang
// @match        http://*/*
// @match        https://*/*
// ==/UserScript==

(function () {
  'use strict';

  /**
   * Add translate class to element.
   * @param {HTMLElement} el
   */
  function addTranslateClass(el) {
    if (!el.classList.contains('notranslate')) {
      el.classList.add('notranslate')
    }
  }

  for (const el of [
    ...document.querySelectorAll('pre'),
    ...document.querySelectorAll('code'),
    ...document.querySelectorAll('table.diff-table'),
  ]) {
    addTranslateClass(el)
  }

})();
