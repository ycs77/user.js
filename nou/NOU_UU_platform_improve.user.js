// ==UserScript==
// @name         NOU 學習平台優化
// @namespace    https://uu.nou.edu.tw/
// @version      0.5
// @description  NOU 學習平台優化
// @author       Lucas Yang
// @match        https://uu.nou.edu.tw/learn/index.php
// @match        https://uu.nou.edu.tw/learn/exam/*
// @match        https://uu.nou.edu.tw/base/10001/content/*
// @icon         https://uu.nou.edu.tw/base/10001/door/tpl/icon.ico
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/js-base64@3.7.7/base64.min.js
// ==/UserScript==

(function() {
  'use strict';

  // 清除 NOU 測驗亂點提醒
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

  // 增加音檔變速按鈕
  if (document.getElementById('s_main')) {
    document.getElementById('s_main').addEventListener('load', function () {
      /** @type {Document} */
      const d = this.contentWindow.document;

      if (!d.getElementById('audio-button-style') && d.querySelector('audio[controls]')) {
        const style = d.createElement('style');
        style.id = 'audio-button-style';
        style.innerHTML = `
          .audio-wrapper {
            display: flex;
            align-items: center;
          }
          .audio-wrapper button {
            color: #4C1D95 !important;
            background-color: #EDE9FE !important;
            padding: 6px 16px !important;
            font-size: 14px !important;
            border-width: 0 !important;
            border-radius: 4px !important;
            margin-left: 10px !important;
            text-decoration: none !important;
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
        `;
        d.head.appendChild(style);
      }

      d.querySelectorAll('audio[controls]').forEach(function (audioEl) {
        const button15 = document.createElement('button');
        button15.innerHTML = '1.5倍';
        button15.addEventListener('click', async function () {
          audioEl.playbackRate = 1.5;
          await audioEl.play();
        });

        const button20 = document.createElement('button');
        button20.innerHTML = '2倍';
        button20.addEventListener('click', async function () {
          audioEl.playbackRate = 2;
          await audioEl.play();
        });

        const wrapper = wrapEl(audioEl);
        wrapper.classList.add('audio-wrapper')
        wrapper.appendChild(button15);
        wrapper.appendChild(button20);
      });
    });
  }

  // 增加複製影片 mpv 指令按鈕
  //
  // 需要先安裝：
  // 1. mpv: https://mpv.io/installation/
  // 2. mpv handler: https://github.com/akiirui/mpv-handler/releases/latest
  if (document.querySelector('.flowplayer') && typeof flowplayer === 'function') {
    if (!document.getElementById('mpv-button-style')) {
      const style = document.createElement('style');
      style.id = 'mpv-button-style';
      style.innerHTML = `
        .mpv-wrapper {
          display: flex;
          align-items: center;
          margin-top: 10px;
        }
        .mpv-wrapper a,
        .mpv-wrapper button {
          color: #4C1D95 !important;
          background-color: #EDE9FE !important;
          padding: 6px 16px !important;
          font-size: 14px !important;
          border-width: 0 !important;
          border-radius: 4px !important;
          margin-right: 10px !important;
          text-decoration: none !important;
          cursor: pointer !important;
          transition: background-color 0.2s !important;
          user-select: none !important;
        }
        .mpv-wrapper a:hover,
        .mpv-wrapper button:enabled:hover {
          background-color: #DDD6FE !important;
        }
        .mpv-wrapper a:active,
        .mpv-wrapper button:enabled:active {
          background-color: #C4B5FD !important;
        }
        .mpv-wrapper button:disabled {
          color: #C4B5FD !important;
          cursor: default !important;
        }
      `;
      document.head.appendChild(style);
    }

    const url = flowplayer(0).video.src;
    const title = document.title;
    const mpvCommand = `mpv ${url} --title="${title}"`;
    const mpvUrl = `mpv://play/${encodeMpvURI(url)}/?v_title=${encodeMpvURI(title)}`;
    console.log(mpvCommand);
    console.log(mpvUrl);

    const mpvOpenBtn = document.createElement('a');
    mpvOpenBtn.href = mpvUrl;
    mpvOpenBtn.target = '_blank';
    mpvOpenBtn.innerHTML = 'mpv 播放';

    const mpvCopyBtn = document.createElement('button');
    mpvCopyBtn.innerHTML = '複製 mpv 指令';
    mpvCopyBtn.addEventListener('click', async function () {
      await navigator.clipboard.writeText(mpvCommand);
      mpvCopyBtn.innerHTML = '已複製！';
      mpvCopyBtn.disabled = true;
      setTimeout(() => {
        mpvCopyBtn.innerHTML = '複製 mpv 指令';
        mpvCopyBtn.disabled = false;
      }, 3000);
    });

    const mpvWrapper = document.createElement('div');
    mpvWrapper.classList.add('mpv-wrapper');
    mpvWrapper.appendChild(mpvOpenBtn);
    mpvWrapper.appendChild(mpvCopyBtn);
    document.body.appendChild(mpvWrapper);

    function encodeMpvURI(data) {
      return Base64.encode(data).replace(/\//g, '_').replace(/\+/g, '-').replace(/\=/g, '');
    }
  }
})();
