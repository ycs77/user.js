# Stoplight Elements API docs 自動刷新 Token

[安裝](https://github.com/ycs77/user.js/raw/refs/heads/main/api/Stoplight_Elements_API_docs_auto_refresh.user.js)

然後設定登入資訊：

```diff
 // ==UserScript==
-// @name         Stoplight Elements API docs 自動刷新 Token - 範例網站
+// @name         Stoplight Elements API docs 自動刷新 Token - 我的網站
 // ...
-// @match        https://example.com/docs
+// @match        https://your-site.com/docs
 // ...
 // ==/UserScript==

 (function() {
   'use strict';

   // =================================================
   //
   //              請在此處修改你的登入資訊
   //
   //
-  const email = ''
+  const email = 'your@example.com'
-  const password = ''
+  const password = 'yuor_password'
-  const loginEndpoint = ''
+  const loginEndpoint = '/api/v1/login'
   //
   //
   // =================================================
```
