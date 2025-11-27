// ==UserScript==
// @name         NOU 學習平台優化
// @namespace    https://uu.nou.edu.tw/
// @version      1.0
// @description  NOU 學習平台優化
// @author       Lucas Yang
// @match        https://uu.nou.edu.tw/learn/index.php
// @match        https://uu.nou.edu.tw/learn/exam/*
// @match        https://uu.nou.edu.tw/base/10001/*
// @icon         https://uu.nou.edu.tw/base/10001/door/tpl/icon.ico
// @require      https://cdn.jsdelivr.net/npm/js-base64@3.7.7/base64.min.js
// @grant        none
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

    let url;
    if (document.getElementById('video') && flowplayer.version.startsWith('7.')) {
      url = flowplayer('#video').video.src;
    } else if (document.getElementById('player') && flowplayer.version.startsWith('3.')) {
      url = flowplayer('#player').original_src;
    } else {
      throw new Error('不支援的 flowplayer 版本或未找到影片元素。');
    }

    const title = document.title;
    const mpvCommand = `mpv ${url}` + (title ? ` --title="${title}"` : '');
    const mpvUrl = `mpv://play/${encodeMpvURI(url)}/` + (title ? `?v_title=${encodeMpvURI(title)}` : '');
    console.log(mpvCommand);
    console.log(mpvUrl);

    const mpvOpenBtn = document.createElement('a');
    mpvOpenBtn.href = mpvUrl;
    mpvOpenBtn.target = '_blank';
    mpvOpenBtn.innerHTML = 'mpv 播放';
    mpvOpenBtn.title = '使用 mpv 播放影片';

    const mpvCopyCmdBtn = document.createElement('button');
    mpvCopyCmdBtn.innerHTML = 'mpv 指令';
    mpvCopyCmdBtn.title = '複製 mpv 指令';
    mpvCopyCmdBtn.addEventListener('click', async function () {
      await navigator.clipboard.writeText(mpvCommand);
      mpvCopyCmdBtn.innerHTML = '已複製！';
      mpvCopyCmdBtn.disabled = true;
      setTimeout(() => {
        mpvCopyCmdBtn.innerHTML = 'mpv 指令';
        mpvCopyCmdBtn.disabled = false;
      }, 3000);
    });

    const mpvCopyCmdSpeed1_46Btn = document.createElement('button');
    mpvCopyCmdSpeed1_46Btn.innerHTML = 'mpv 指令 (1.46倍速)';
    mpvCopyCmdSpeed1_46Btn.title = '複製 mpv 指令 (1.46倍速)';
    mpvCopyCmdSpeed1_46Btn.addEventListener('click', async function () {
      await navigator.clipboard.writeText(mpvCommand + ' --speed=1.4641');
      mpvCopyCmdSpeed1_46Btn.innerHTML = '已複製！';
      mpvCopyCmdSpeed1_46Btn.disabled = true;
      setTimeout(() => {
        mpvCopyCmdSpeed1_46Btn.innerHTML = 'mpv 指令 (1.46倍速)';
        mpvCopyCmdSpeed1_46Btn.disabled = false;
      }, 3000);
    });

    const mpvCopyCmdSpeed2Btn = document.createElement('button');
    mpvCopyCmdSpeed2Btn.innerHTML = 'mpv 指令 (2倍速)';
    mpvCopyCmdSpeed2Btn.title = '複製 mpv 指令 (2倍速)';
    mpvCopyCmdSpeed2Btn.addEventListener('click', async function () {
      await navigator.clipboard.writeText(mpvCommand + ' --speed=2');
      mpvCopyCmdSpeed2Btn.innerHTML = '已複製！';
      mpvCopyCmdSpeed2Btn.disabled = true;
      setTimeout(() => {
        mpvCopyCmdSpeed2Btn.innerHTML = 'mpv 指令 (2倍速)';
        mpvCopyCmdSpeed2Btn.disabled = false;
      }, 3000);
    });

    const mpvWrapper = document.createElement('div');
    mpvWrapper.classList.add('mpv-wrapper');
    mpvWrapper.appendChild(mpvOpenBtn);
    mpvWrapper.appendChild(mpvCopyCmdBtn);
    mpvWrapper.appendChild(mpvCopyCmdSpeed1_46Btn);
    mpvWrapper.appendChild(mpvCopyCmdSpeed2Btn);
    document.body.appendChild(mpvWrapper);

    function encodeMpvURI(data) {
      return Base64.encode(data).replace(/\//g, '_').replace(/\+/g, '-').replace(/\=/g, '');
    }
  }
})();
