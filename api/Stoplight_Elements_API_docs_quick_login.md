# Stoplight Elements API docs 自動刷新 Token

[安裝](https://github.com/ycs77/user.js/raw/refs/heads/main/api/Stoplight_Elements_API_docs_quick_login.user.js)

然後設定登入資訊：

```diff
 // ==UserScript==
-// @name         Stoplight Elements API docs 快速登入 - 範例網站
+// @name         Stoplight Elements API docs 快速登入 - 我的網站
 // ...
-// @match        https://example.com/docs*
+// @match        https://your-site.com/docs*
 // ...
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
-      email: '',
+      email: 'your@example.com',
-      password: '',
+      password: 'yuor_password',
     },
   ]
   const loginEndpoint = '/api/login'
   //
   //
   // =================================================
```

也可以設定多個帳號以快速切換：

```js
const accounts = [
  {
    name: '主要帳號',
    email: 'your@example.com',
    password: 'yuor_password',
  },
  {
    name: '次要帳號',
    email: 'your@example2.com',
    password: 'yuor_password',
  },
]
```
