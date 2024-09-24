// ==UserScript==
// @name         NOU TronClass 取消影片自動暫停
// @namespace    https://nou.tronclass.com.tw/
// @version      0.1
// @description  NOU TronClass 取消影片自動暫停
// @author       Lucas Yang
// @match        https://nou.tronclass.com.tw/*
// @icon         https://nou.tronclass.com.tw/static/assets/images/favicon-b420ac72.ico
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  const d = document;

  let windowBlurEvent;

  function findVideo() {
    let i = 0;
    let loaded = false;
    const timer = setInterval(() => {
      i++;
      if (i > 5) {
        clearInterval(timer);
        return;
      } else if (!loaded && d.querySelector('video')) {
        let paused = d.querySelector('video').paused;

        if (windowBlurEvent) {
          window.removeEventListener('blur', windowBlurEvent);
        }
        windowBlurEvent = () => {
          if (d.querySelector('video') && !paused) {
            d.querySelector('video').play();
          }
        };
        window.addEventListener('blur', windowBlurEvent);

        d.querySelector('video').addEventListener('play', () => {
          paused = false;
        });
        d.querySelector('video').addEventListener('pause', () => {
          paused = true;
        });

        loaded = true;
      }
    }, 1000);
  }

  const fullScreenRegex = /^\/course\/\d+\/learning-activity\/full-screen/;

  if (fullScreenRegex.test(location.pathname)) {
    findVideo();
  }

  window.addEventListener('hashchange', function() {
    if (fullScreenRegex.test(location.pathname)) {
      findVideo();
    }
  });
})();
