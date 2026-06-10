/* ==============================
   KnosAI · 企业知识绿洲
   认证交互脚本（登录/注册/控制台）
   ============================== */

(function () {
  'use strict';

  /* ---- 注册页 ---- */
  var registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('email');
      var password = document.getElementById('password');
      var confirm = document.getElementById('confirm-password');
      var industry = document.getElementById('industry');
      var company = document.getElementById('company');
      var globalAlert = document.getElementById('global-alert');
      var emailError = document.getElementById('email-error');
      var passwordError = document.getElementById('password-error');
      var confirmError = document.getElementById('confirm-error');

      globalAlert.classList.remove('show');
      emailError.textContent = '';
      passwordError.textContent = '';
      confirmError.textContent = '';
      [email, password, confirm].forEach(function (el) { el.classList.remove('error'); });

      var valid = true;

      /* 邮箱验证 */
      if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        emailError.textContent = '请输入有效的邮箱地址';
        email.classList.add('error');
        valid = false;
      }

      /* 公司名验证 */
      if (!company.value.trim()) {
        document.getElementById('company-error').textContent = '请输入公司名称';
        company.classList.add('error');
        valid = false;
      }

      /* 行业验证 */
      if (!industry.value) {
        document.getElementById('industry-error').textContent = '请选择所属行业';
        valid = false;
      }

      /* 密码强度 */
      if (!password.value || password.value.length < 6) {
        passwordError.textContent = '密码至少6个字符';
        password.classList.add('error');
        valid = false;
      }

      /* 确认密码 */
      if (password.value !== confirm.value) {
        confirmError.textContent = '两次密码不一致';
        confirm.classList.add('error');
        valid = false;
      }

      if (!valid) {
        globalAlert.textContent = '请检查表单填写';
        globalAlert.classList.add('show');
        return;
      }

      /* mock 注册：保存到 localStorage */
      var users = JSON.parse(localStorage.getItem('knosai_users') || '[]');
      if (users.some(function (u) { return u.email === email.value; })) {
        globalAlert.textContent = '该邮箱已注册，请直接登录';
        globalAlert.classList.add('show');
        return;
      }

      users.push({
        email: email.value,
        password: password.value,
        company: company.value.trim(),
        industry: industry.value,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('knosai_users', JSON.stringify(users));

      /* 自动登录并跳转 */
      localStorage.setItem('knosai_current_user', JSON.stringify({
        email: email.value,
        company: company.value.trim(),
        industry: industry.value
      }));

      alert('注册成功！即将进入控制台');
      location.href = 'dashboard.html';
    });
  }

  /* ---- 登录页 ---- */
  var loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('email');
      var password = document.getElementById('password');
      var globalAlert = document.getElementById('global-alert');
      var emailError = document.getElementById('email-error');
      var passwordError = document.getElementById('password-error');

      globalAlert.classList.remove('show');
      emailError.textContent = '';
      passwordError.textContent = '';
      [email, password].forEach(function (el) { el.classList.remove('error'); });

      var users = JSON.parse(localStorage.getItem('knosai_users') || '[]');
      var user = users.find(function (u) { return u.email === email.value && u.password === password.value; });

      if (!user) {
        globalAlert.textContent = '邮箱或密码错误';
        globalAlert.classList.add('show');
        return;
      }

      localStorage.setItem('knosai_current_user', JSON.stringify({
        email: user.email,
        company: user.company,
        industry: user.industry
      }));

      location.href = 'dashboard.html';
    });
  }

  /* ---- 控制台 ---- */
  var dashboardPage = document.getElementById('dashboard-page');
  if (dashboardPage) {
    var currentUser = JSON.parse(localStorage.getItem('knosai_current_user') || 'null');
    if (!currentUser) {
      location.href = 'login.html';
      return;
    }

    /* 填充用户名 */
    var usernameEl = document.getElementById('dashboard-username');
    if (usernameEl) {
      usernameEl.textContent = currentUser.company || currentUser.email;
    }

    /* 填充公司信息 */
    var infoEl = document.getElementById('dashboard-info');
    if (infoEl && (currentUser.company || currentUser.industry)) {
      infoEl.style.display = 'block';
      infoEl.textContent = '公司：' + (currentUser.company || '-') + ' | 行业：' + (currentUser.industry || '-');
    }

    /* 退出按钮 */
    var logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        localStorage.removeItem('knosai_current_user');
        location.href = 'login.html';
      });
    }
  }

  /* ---- 全局：检测登录态（保护页面） ---- */
  var protectedPages = ['dashboard.html'];
  if (protectedPages.indexOf(location.pathname.split('/').pop()) !== -1) {
    var user = JSON.parse(localStorage.getItem('knosai_current_user') || 'null');
    if (!user) {
      location.href = 'login.html';
    }
  }

})();