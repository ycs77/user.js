// ==UserScript==
// @name         Don't translate code block
// @namespace    ycs77
// @version      0.3.2
// @description  Don't translate code blocks from all website
// @author       Lucas Yang
// @match        http://*/*
// @match        https://*/*
// ==/UserScript==

(function () {
  'use strict';

  /**
   * Add translate class to element.
   *
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
    ...document.querySelectorAll('.code-block'),
    ...document.querySelectorAll('table.diff-table'),
  ]) {
    addTranslateClass(el)
  }

  window.addEventListener('load', () => {
    setTimeout(() => {
      for (const el of [
        // For svelte.dev editor section
        ...[document.querySelector('svelte-split-pane[data-pane="main"] > svelte-split-pane-section:nth-child(2)')].filter(Boolean),
      ]) {
        addTranslateClass(el)
      }
    }, 0)
  })

})();
