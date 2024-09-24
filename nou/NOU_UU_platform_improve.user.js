// ==UserScript==
// @name         NOU 學習平台優化
// @namespace    https://uu.nou.edu.tw/
// @version      0.3
// @description  NOU 學習平台優化
// @author       Lucas Yang
// @match        https://uu.nou.edu.tw/learn/index.php
// @match        https://uu.nou.edu.tw/learn/exam/*
// @icon         https://uu.nou.edu.tw/base/10001/door/tpl/icon.ico
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  /* 清除 NOU 測驗亂點提醒 */
  if (typeof window.init_winlock === 'function') {
      window.init_winlock = function () {};
  }

  /**
   * @param referenceNode {HTMLElement}
   * @param newNode {HTMLElement}
   */
  function insertAfterEl(referenceNode, newNode) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  /**
   * @param referenceNode {HTMLElement}
   */
  function removeEl(referenceNode) {
      referenceNode.parentNode.removeChild(referenceNode);
  }

  /**
   * @param referenceNode {HTMLElement}
   * @param wrapNode {HTMLElement}
   * @returns {HTMLElement}
   */
  function wrapEl(referenceNode, wrapNode) {
      wrapNode = wrapNode || document.createElement('div')
      insertAfterEl(referenceNode, wrapNode)
      wrapNode.appendChild(referenceNode)
      return wrapNode
  }

  if (document.getElementById('s_main')) {
      document.getElementById('s_main').addEventListener('load', function () {
          /** @type {Document} */
          const d = this.contentWindow.document;
          if (!d.getElementById('audio-button-style') && d.querySelector('audio[controls]')) {
              const styleNode = d.createElement('style');
              styleNode.id = 'audio-button-style';
              styleNode.appendChild(d.createTextNode(`
                  .audio-wrapper {
                      display: flex;
                      align-items: center;
                  }
                  .audio-wrapper button {
                      color: #4C1D95 !important;
                      background-color: #EDE9FE !important;
                      padding: 6px 16px !important;
                      border-width: 0 !important;
                      border-radius: 4px !important;
                      margin-left: 10px !important;
                      cursor: pointer !important;
                      transition: background-color 0.2s !important;
                      user-select: none !important;
                  }
                  .audio-wrapper button:hover {
                      background-color: #DDD6FE !important;
                  }
                  .audio-wrapper button:active {
                      background-color: #C4B5FD !important;
                  }
              `));
              d.head.appendChild(styleNode);
          }
          d.querySelectorAll('audio[controls]').forEach(function (audioEl) {
              const button15El = document.createElement('button');
              button15El.appendChild(d.createTextNode('1.5倍'));
              button15El.addEventListener('click', async function () {
                  audioEl.playbackRate = 1.5;
                  await audioEl.play();
              });

              const button20El = document.createElement('button');
              button20El.appendChild(d.createTextNode('2倍'));
              button20El.addEventListener('click', async function () {
                  audioEl.playbackRate = 2;
                  await audioEl.play();
              });

              const wrapperEl = wrapEl(audioEl);
              wrapperEl.classList.add('audio-wrapper')
              wrapperEl.appendChild(button15El);
              wrapperEl.appendChild(button20El);
          });
      });
  }
})();
