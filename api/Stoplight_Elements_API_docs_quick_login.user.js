// ==UserScript==
// @name         Stoplight Elements API docs 快速登入 - 範例網站
// @namespace    ycs77
// @version      0.3.0
// @description  可以在使用 Stoplight Elements 的 API 文件時快速登入帳號
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
  const accounts = [
    {
      email: '',
      password: '',
    },
  ]
  const loginEndpoint = '/api/login'
  //
  //
  // =================================================

  if (accounts.length === 0 || !accounts[0].email || !accounts[0].password || !loginEndpoint) {
    alert('請在腳本中設定您的 E-mail 和密碼')
    throw new Error('請在腳本中設定您的 E-mail 和密碼')
  }

  const currentAccount = {
    email: accounts[0].email,
    password: accounts[0].password,
  }

  // 取得 Token
  async function getToken({ email, password }) {
    try {
      const response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.msg || data.message || JSON.stringify(data)
        throw new Error(`[HTTP ${response.status}] 登入失敗：${errorMessage}`)
      }

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

      throw new Error('無法取得 Token')
    } catch (error) {
      alert(error.message)
      throw error
    }
  }

  // 注入登入按鈕
  function injectQuickLoginUI() {
    const tokenInput = document.querySelector('[data-test="try-it-auth"] input[aria-label="Token"]')
    const actionsWrapper = document.querySelector('.SendButtonHolder .sl-stack')
    const sendRequestBtn = actionsWrapper?.querySelector('button')

    if (!tokenInput || !actionsWrapper || !sendRequestBtn) {
      console.warn('未找到 Token 輸入框元素，無法新增快速登入按鈕')
      return
    }

    // 新增快速登入按鈕
    const quickLoginBtn = document.createElement('button')
    quickLoginBtn.type = 'button'
    quickLoginBtn.className = sendRequestBtn.className
    quickLoginBtn.innerText = '快速登入'
    quickLoginBtn.onclick = async () => {
      quickLoginBtn.disabled = true
      quickLoginBtn.classList.add('sl-cursor-wait')
      quickLoginBtn.classList.remove('hover:sl-bg-primary-dark', 'active:sl-bg-primary-darker')

      try {
        // 取得新的 Token
        const token = await getToken(currentAccount)

        // 更新 Token 輸入框的值並觸發輸入事件
        tokenInput.value = token
        const event = new Event('input', { bubbles: true })
        tokenInput.dispatchEvent(event)
      } finally {
        quickLoginBtn.disabled = false
        quickLoginBtn.classList.remove('sl-cursor-wait')
        quickLoginBtn.classList.add('hover:sl-bg-primary-dark', 'active:sl-bg-primary-darker')
      }
    }
    actionsWrapper.appendChild(quickLoginBtn)

    if (accounts.length > 1) {
      // 新增帳號下拉選單
      const accountSelect = document.createElement('select')
      accountSelect.className = 'sl-button sl-form-group-border sl-h-sm sl-text-base sl-font-normal sl-px-1.5 sl-bg-transparent sl-rounded sl-border-transparent hover:sl-border-input focus:sl-border-primary active:sl-border-primary sl-border disabled:sl-opacity-60'
      accountSelect.style.maxWidth = '130px'
      accountSelect.style.lineHeight = '1.5'
      accountSelect.style.appearance = 'auto'
      accountSelect.style['-moz-appearance'] = 'auto'
      accountSelect.style['-webkit-appearance'] = 'auto'
      accounts.forEach(({ name, email }) => {
        const option = document.createElement('option')
        option.value = email
        option.text = name ? `(${name}) ${email}` : email
        if (email === currentAccount.email) {
          option.selected = true
        }
        option.style.backgroundColor = 'var(--color-canvas-100)'
        accountSelect.appendChild(option)
      })
      accountSelect.onchange = e => {
        const selectedEmail = e.target.value
        const selectedAccount = accounts.find(({ email }) => email === selectedEmail)
        if (selectedAccount) {
          currentAccount.email = selectedAccount.email
          currentAccount.password = selectedAccount.password
        }
      }
      actionsWrapper.appendChild(accountSelect)
    }
  }

  // 頁面加載完成後執行
  let pageLoaded = false
  function onPageLoaded() {
    if (pageLoaded) return
    if (!document.querySelector('.SendButtonHolder')) return
    pageLoaded = true
    injectQuickLoginUI()
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
    setTimeout(injectQuickLoginUI, 100)
  }

  // 監聽瀏覽器返回事件
  window.addEventListener('popstate', () => {
    setTimeout(injectQuickLoginUI, 100)
  })
})();
