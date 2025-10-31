// ==UserScript==
// @name         Stoplight Elements API docs 自動刷新 Token - 範例網站
// @namespace    ycs77
// @version      0.1.0
// @description  在使用 Stoplight Elements 的 API 文件自動刷新 Token
// @author       Lucas Yang
// @match        https://example.com/docs
// @icon         https://cdn.prod.website-files.com/6320e912264435aca2ab0351/64888134079693cfbffed91c_stoplight-favicon-small.png
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  // =================================================
  //
  //              請在此處修改你的登入資訊
  //
  //
  const email = ''
  const password = ''
  const loginEndpoint = ''
  //
  //
  // =================================================

  if (!email || !password) {
    alert('請在腳本中設定您的電子郵件和密碼。')
    console.error('請在腳本中設定您的電子郵件和密碼。')
    return
  }

  // 取得 Token
  async function getToken() {
    try {
      const response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error(`登入失敗，狀態碼：${response.status}`)
      }

      const data = await response.json()

      if (typeof data.token === 'string') return data.token
      if (typeof data.access_token === 'string') return data.access_token
      if (typeof data.data === 'object') {
        if (typeof data.data.token === 'string') return data.data.token
        if (typeof data.data.access_token === 'string') return data.data.access_token
        if (typeof data.data.user_token === 'object') {
          if (typeof data.data.user_token.token === 'string') return data.data.user_token.token
          if (typeof data.data.user_token.access_token === 'string') return data.data.user_token.access_token
        }
      }

      alert('無法取得 Token')
    } catch (error) {
      alert('取得 Token 時發生錯誤')
      throw error
    }
  }

  // 注入刷新 Token 按鈕
  function injectRefreshTokenButton() {
    const tokenInput = document.querySelector('[data-test="try-it-auth"] input[aria-label="Token"]')
    const SendButtonHolder = document.querySelector('.SendButtonHolder')
    const buttonsWrapper = SendButtonHolder?.querySelector('.sl-stack')
    const sendRequestBtn = buttonsWrapper?.querySelector('button')

    if (!tokenInput || !buttonsWrapper || !sendRequestBtn) {
      console.warn('未找到 Token 輸入框元素，無法添加刷新按鈕。')
      return
    }

    // 新增刷新按鈕
    const refreshTokenBtn = document.createElement('button')
    refreshTokenBtn.type = 'button'
    refreshTokenBtn.className = sendRequestBtn.className
    refreshTokenBtn.innerText = '刷新 Token'
    refreshTokenBtn.onclick = async () => {
      refreshTokenBtn.disabled = true
      refreshTokenBtn.classList.add('sl-cursor-wait')
      refreshTokenBtn.classList.remove('hover:sl-bg-primary-dark', 'active:sl-bg-primary-darker')

      try {
        // 取得新的 Token
        const token = await getToken()

        // 更新 Token 輸入框的值並觸發輸入事件
        tokenInput.value = token
        const event = new Event('input', { bubbles: true })
        tokenInput.dispatchEvent(event)
      } finally {
        refreshTokenBtn.disabled = false
        refreshTokenBtn.classList.remove('sl-cursor-wait')
        refreshTokenBtn.classList.add('hover:sl-bg-primary-dark', 'active:sl-bg-primary-darker')
      }
    }

    buttonsWrapper.appendChild(refreshTokenBtn)
  }

  // 頁面加載完成後執行
  let pageLoaded = false
  function onPageLoaded() {
    if (pageLoaded) return
    if (!document.querySelector('.SendButtonHolder')) return
    pageLoaded = true
    injectRefreshTokenButton()
  }

  // 監聽頁面加載完成事件
  onPageLoaded()
  window.addEventListener('load', onPageLoaded)

  // 監聽 Elements API 元素初始化完成
  const elementsApi = document.querySelector('elements-api')
  if (elementsApi) {
    const observer = new MutationObserver((mutations, obs) => {
      if (elementsApi.children.length > 0) {
        obs.disconnect()
        onPageLoaded()
      }
    })

    observer.observe(elementsApi, {
      childList: true,
      subtree: true,
    })
  }

  // 監聽 URL 變化
  const originalPushState = history.pushState
  history.pushState = function () {
    originalPushState.apply(history, arguments)
    setTimeout(injectRefreshTokenButton, 100)
  }

  // 監聽瀏覽器返回事件
  window.addEventListener('popstate', () => {
    setTimeout(injectRefreshTokenButton, 100)
  })
})();
