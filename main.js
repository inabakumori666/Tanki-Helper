// ==UserScript==
// @name         Tanki Helper
// @version      1
// @description  enjoy
// @author       you
// @match        https://tankionline.com/play*
// @match        https://*.tankionline.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tankionline.com
// @grant        none
// ==/UserScript==

(function () {
  'use strict';


  const translations = {
    en: {
      title: "Tanki Helper",
      tabMain: "Main",
      tabOther: "Other",
      autoConversion: "Auto Conversion",
      autoBuy: "AutoBuy 240 keys",
      openContainers: "Open Containers",
      fastUpgrade: "Fast Upgrade",
      language: "Language"
    },
    ru: {
      title: "Tanki Helper",
      tabMain: "Главная",
      tabOther: "Другое",
      autoConversion: "Авто конвертация",
      autoBuy: "Автопокупка 240 ключей",
      openContainers: "Открытие контейнеров",
      fastUpgrade: "Быстрое улучшение",
      language: "Язык"
    }
  };

  let currentLang = localStorage.getItem('tankiHelperLang') || 'en';


  const style = document.createElement("style");
  style.innerHTML = `
    #tankihelper-menu {
      position: fixed;
      width: 340px;
      background: #0c0c0c;
      color: #e0e0e0;
      font-family: 'Segoe UI', 'Roboto', sans-serif;
      border: 1px solid #2a2a2a;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.8);
      z-index: 9999;
      user-select: none;
      display: none;
      transform: translate(-50%, -50%) scale(0.8);
      opacity: 0;
      transition: transform 0.2s ease, opacity 0.2s ease;
      box-sizing: border-box;
      overflow: hidden;
      left: 50%;
      top: 50%;
      transform-origin: center center;
    }

    #tankihelper-menu.visible {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
      display: block !important;
    }

    /* Заголовок */
    #tankihelper-header {
      padding: 14px 16px;
      font-weight: 600;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: move;
      background: #0c0c0c;
      border-bottom: 1px solid #2a2a2a;
      color: #ffffff;
    }

    #tankihelper-header span:first-child {
      flex: 1;
      text-align: center;
      margin-right: 30px;
    }

    #tankihelper-close {
      cursor: pointer;
      font-size: 22px;
      line-height: 1;
      padding: 0 5px;
      user-select: none;
      transition: color 0.2s;
      width: 30px;
      text-align: right;
      color: #a0a0a0;
    }
    #tankihelper-close:hover {
      color: #ff5e5e;
    }

    /* Вкладки */
    #tankihelper-tabs {
      display: flex;
      justify-content: space-around;
      background: #0c0c0c;
      border-bottom: 1px solid #2a2a2a;
      padding: 0 8px;
    }

    .tankihelper-tab {
      flex: 1;
      padding: 10px 0;
      text-align: center;
      cursor: pointer;
      font-size: 15px;
      font-weight: 500;
      transition: all 0.2s;
      user-select: none;
      color: #a0a0a0;
      border-bottom: 2px solid transparent;
    }

    .tankihelper-tab:hover {
      color: #ffffff;
    }

    .tankihelper-tab.active {
      color: #ffffff;
      border-bottom: 2px solid #3a8cff;
    }

    /* Блоки элементов */
    #mainTab, #otherTab {
      padding: 12px;
    }

    .tankihelper-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #1a1a1a;
      border-radius: 12px;
      margin-bottom: 8px;
      border: 1px solid #2a2a2a;
      transition: background 0.2s;
    }

    .tankihelper-item:hover {
      background: #222222;
    }

    .tankihelper-label {
      font-size: 15px;
      font-weight: 500;
      color: #ffffff;
    }

    /* iOS-style toggle */
    .tankihelper-switch {
      position: relative;
      display: inline-block;
      width: 46px;
      height: 24px;
    }

    .tankihelper-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .tankihelper-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #3a3a3a;
      transition: .2s;
      border-radius: 24px;
    }

    .tankihelper-slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .2s;
      border-radius: 50%;
    }

    input:checked + .tankihelper-slider {
      background-color: #34c759; /* зелёный iOS */
    }

    input:checked + .tankihelper-slider:before {
      transform: translateX(22px);
    }

    /* Other tab */
    #otherTab {
      display: none;
    }

    #otherTab label {
      display: block;
      margin-bottom: 8px;
      font-size: 15px;
      color: #ccc;
    }

    .flag-selector {
      display: flex;
      gap: 20px;
      justify-content: center;
      font-size: 40px;
      cursor: pointer;
      margin-top: 10px;
    }

    .flag-selector span {
      transition: transform 0.2s;
      filter: brightness(0.9);
    }

    .flag-selector span:hover {
      transform: scale(1.2);
      filter: brightness(1.2);
    }
  `;
  document.head.appendChild(style);


  const menu = document.createElement("div");
  menu.id = "tankihelper-menu";
  menu.innerHTML = `
    <div id="tankihelper-header">
      <span id="menu-title">Tanki Helper</span>
      <span id="tankihelper-close">✖</span>
    </div>
    <div id="tankihelper-tabs">
      <div class="tankihelper-tab active" data-tab="main">Main</div>
      <div class="tankihelper-tab" data-tab="other">Other</div>
    </div>

    <div id="mainTab">
      <div class="tankihelper-item">
        <span class="tankihelper-label" data-i18n="autoConversion">Auto Conversion</span>
        <label class="tankihelper-switch">
          <input type="checkbox" class="tankihelper-toggle" data-name="autoConversion">
          <span class="tankihelper-slider"></span>
        </label>
      </div>
      <div class="tankihelper-item">
        <span class="tankihelper-label" data-i18n="autoBuy">AutoBuy 240 keys</span>
        <label class="tankihelper-switch">
          <input type="checkbox" class="tankihelper-toggle" data-name="autoBuy">
          <span class="tankihelper-slider"></span>
        </label>
      </div>
      <div class="tankihelper-item">
        <span class="tankihelper-label" data-i18n="openContainers">Open Containers</span>
        <label class="tankihelper-switch">
          <input type="checkbox" class="tankihelper-toggle" data-name="openContainers">
          <span class="tankihelper-slider"></span>
        </label>
      </div>
      <div class="tankihelper-item">
        <span class="tankihelper-label" data-i18n="fastUpgrade">Fast Upgrade</span>
        <label class="tankihelper-switch">
          <input type="checkbox" class="tankihelper-toggle" data-name="fastUpgrade">
          <span class="tankihelper-slider"></span>
        </label>
      </div>
    </div>

    <div id="otherTab" style="display: none;">
      <label data-i18n="language">Language</label>
      <div class="flag-selector">
        <span id="flag-en" title="English">🇺🇸</span>
        <span id="flag-ru" title="Русский">🇷🇺</span>
      </div>
    </div>
  `;
  document.body.appendChild(menu);


  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('tankiHelperLang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });
    document.getElementById('menu-title').textContent = translations[lang].title;
    const tabElements = document.querySelectorAll('.tankihelper-tab');
    if (tabElements[0]) tabElements[0].textContent = translations[lang].tabMain;
    if (tabElements[1]) tabElements[1].textContent = translations[lang].tabOther;
  }


  document.getElementById('flag-en').addEventListener('click', () => applyLanguage('en'));
  document.getElementById('flag-ru').addEventListener('click', () => applyLanguage('ru'));

  applyLanguage(currentLang);


  const tabs = menu.querySelectorAll(".tankihelper-tab");
  const mainTab = menu.querySelector("#mainTab");
  const otherTab = menu.querySelector("#otherTab");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const selected = tab.getAttribute("data-tab");

      mainTab.style.display = selected === "main" ? "block" : "none";
      otherTab.style.display = selected === "other" ? "block" : "none";
    });
  });


  let state = {
    autoConversion: false,
    autoBuy: false,
    openContainers: false,
    fastUpgrade: false
  };


  let autoConversionInterval = null;
  let autoBuyInterval = null;
  let fastUpgradeTimeout = null;
  let openContainersStopTimeout = null;
  let isSpammingOpenContainers = false;
  let speedHackEnabled = false;
  let originalPerfNow, originalDateNow, originalSetTimeout, originalSetInterval, originalRequestAnimationFrame;


  function simulateClick(el) {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    ['mousedown', 'mouseup', 'click'].forEach(type => {
      el.dispatchEvent(new MouseEvent(type, { bubbles: true, clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 }));
    });
  }

  function simulateKeyPress(key) {
    ['keydown', 'keyup'].forEach(type => {
      document.dispatchEvent(new KeyboardEvent(type, { key: key, code: key, keyCode: key.charCodeAt(0), bubbles: true }));
    });
  }

  function getElementByPartialClass(partial) {
    const els = document.querySelectorAll('*');
    for (let el of els) if (el.className.includes(partial)) return el;
    return null;
  }


  function startAutoConversion() {
    let idx = 0;
    autoConversionInterval = setInterval(() => {
      const actions = [
        () => simulateClick(getElementByPartialClass('UserScoreComponentStyle-addRubyCrystal')),
        () => {
          const maxBtn = Array.from(document.querySelectorAll('.ConverterDialogComponentStyle-sliderButton'))
            .find(b => b.querySelector('img[src*="max.2f636a21.svg"]'));
          if (maxBtn) {
            ['mousedown', 'mouseup', 'click'].forEach(type => maxBtn.dispatchEvent(new MouseEvent(type, { bubbles: true })));
          }
        },
        () => simulateKeyPress('Enter'),
        () => simulateKeyPress('Enter')
      ];
      if (actions[idx]) actions[idx]();
      idx = (idx + 1) % actions.length;
    }, 105);
  }

  function stopAutoConversion() {
    if (autoConversionInterval) {
      clearInterval(autoConversionInterval);
      autoConversionInterval = null;
    }
  }


  function startAutoBuy() {
    if (!autoBuyInterval) {
        enableSpeedHack(100);

          autoBuyInterval = setInterval(() => {
              const span = Array.from(document.querySelectorAll('span')).find(el => {
                  const t = el.textContent.toLowerCase();
                  return t.includes('240 ключей') || t.includes('240 keys');
              });
              if (span) {
                  const btn = span.closest('div[class*="shop-item-component"]');
                  if (btn) simulateClick(btn);
              }

              const h3n = Array.from(document.querySelectorAll('h3')).find(el => el.textContent.trim() === 'N');
              if (h3n) {
                  const div = h3n.closest('div');
                  if (div) simulateClick(div);
              }
          }, 85);
      }
  }

  function stopAutoBuy() {
      if (autoBuyInterval) {
          clearInterval(autoBuyInterval);
          autoBuyInterval = null;
          disableSpeedHack();
      }
  }


  function findButtonByTexts(tag, texts, partialClass) {
    const elements = document.querySelectorAll(tag);
    for (const el of elements) {
        const txt = el.textContent.trim();
        if (texts.includes(txt)) {
            const button = el.closest(`div[class*="${partialClass}"]`);
            if (button) return button;
        }
    }
    return null;
  }

  function clickIfFound(button) {
    if (button) {
        button.click();
        return true;
    }
    return false;
  }


  function enableSpeedHack(multiplier = 1.24) {
    if (speedHackEnabled) return;

    originalPerfNow = performance.now.bind(performance);
    originalDateNow = Date.now.bind(Date);
    originalSetTimeout = window.setTimeout.bind(window);
    originalSetInterval = window.setInterval.bind(window);
    originalRequestAnimationFrame = window.requestAnimationFrame.bind(window);

    const startPerf = originalPerfNow();
    const startDate = originalDateNow();

    performance.now = () => (originalPerfNow() - startPerf) * multiplier + startPerf;
    Date.now = () => (originalDateNow() - startDate) * multiplier + startDate;

    window.setTimeout = (func, delay, ...args) => originalSetTimeout(func, delay / multiplier, ...args);
    window.setInterval = (func, delay, ...args) => originalSetInterval(func, delay / multiplier, ...args);
    window.requestAnimationFrame = (callback) => originalRequestAnimationFrame((ts) => callback(ts * multiplier));

    speedHackEnabled = true;
  }

  function disableSpeedHack() {
    if (!speedHackEnabled) return;

    performance.now = originalPerfNow;
    Date.now = originalDateNow;
    window.setTimeout = originalSetTimeout;
    window.setInterval = originalSetInterval;
    window.requestAnimationFrame = originalRequestAnimationFrame;

    speedHackEnabled = false;
  }

  // Fast Upgrade
  function fastUpgradeLoop() {
    if (!state.fastUpgrade) return;

    const interval = 42;

    const enterBtn = findButtonByTexts('h3', ['Enter'], 'SquarePriceButtonComponentStyle-commonBlockButton');
    clickIfFound(enterBtn);

    setTimeout(() => {
        if (!state.fastUpgrade) return;
        const upgradeBtn = findButtonByTexts('span', ['Улучшить', 'Upgrade'], 'DialogContainerComponentStyle-getRubyButton');
        clickIfFound(upgradeBtn);
    }, interval);

    setTimeout(() => {
        if (!state.fastUpgrade) return;
        const buyBtn = findButtonByTexts('span', ['КУПИТЬ', 'BUY'], 'DialogContainerComponentStyle-getRubyButton');
        clickIfFound(buyBtn);
    }, interval * 2);

    fastUpgradeTimeout = setTimeout(fastUpgradeLoop, interval * 3);
  }

  function startFastUpgrade() {
      if (!fastUpgradeTimeout) {
          enableSpeedHack(1.24);
          fastUpgradeLoop();
      }
  }

  function stopFastUpgrade() {
      if (fastUpgradeTimeout) {
          clearTimeout(fastUpgradeTimeout);
          fastUpgradeTimeout = null;
          disableSpeedHack();
      }
  }

  // Open Containers
  const fetchSpamConfig = {
    enabled: false,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action: 'openMore' }),
    requestsPerFrame: 100
  };

  function findOpenMoreButton() {
    const targetTexts = ['Открыть ещё', 'OPEN MORE'];
    const spans = document.querySelectorAll('span');

    for (let span of spans) {
      const text = span.textContent.trim().toUpperCase();
      if (targetTexts.some(target => text === target.toUpperCase())) {
        let container = span.closest('div');
        while (container) {
          if (
            container.className.includes('ClosedContainerStyle') ||
            container.className.includes('ksc-')
          ) {
            return container;
          }
          container = container.parentElement;
        }
      }
    }
    return null;
  }

  function spamClick(target) {
    if (!isSpammingOpenContainers || !target) return;
    for (let i = 0; i < 10000; i++) {
      try {
        target.click();
      } catch {
        break;
      }
    }
  }

  function spamFetch() {
    if (!isSpammingOpenContainers || !fetchSpamConfig.enabled) return;
    for (let i = 0; i < fetchSpamConfig.requestsPerFrame; i++) {
      fetch(fetchSpamConfig.url, {
        method: fetchSpamConfig.method,
        headers: fetchSpamConfig.headers,
        body: fetchSpamConfig.body,
        credentials: 'include'
      }).catch(() => {});
    }
  }

  function openContainersLoop() {
    if (!isSpammingOpenContainers) return;
    const button = findOpenMoreButton();
    if (button) spamClick(button);
    spamFetch();
    requestAnimationFrame(openContainersLoop);
  }

  function startOpenContainers() {
    if (isSpammingOpenContainers) return;

    isSpammingOpenContainers = true;
    openContainersLoop();

    openContainersStopTimeout = setTimeout(() => {
    isSpammingOpenContainers = false;
  }, 30000);
  }

  function stopOpenContainers() {
    isSpammingOpenContainers = false;
    if (openContainersStopTimeout) {
      clearTimeout(openContainersStopTimeout);
      openContainersStopTimeout = null;
    }
  }


  function updateFeature(name, enabled) {
    state[name] = enabled;
    if (name === 'autoConversion') {
      if (enabled) startAutoConversion();
      else stopAutoConversion();
    }
    if (name === 'autoBuy') {
      if (enabled) startAutoBuy();
      else stopAutoBuy();
    }
    if (name === 'fastUpgrade') {
      if (enabled) startFastUpgrade();
      else stopFastUpgrade();
    }
    if (name === 'openContainers') {
      if (state[name]) startOpenContainers();
      else stopOpenContainers();
    }
  }


  menu.querySelectorAll('.tankihelper-toggle').forEach(toggle => {
    toggle.addEventListener('change', function(e) {
      const name = this.getAttribute('data-name');
      const enabled = this.checked;
      updateFeature(name, enabled);
    });
  });


  document.getElementById('tankihelper-close').addEventListener('click', function(e) {
    e.stopPropagation();
    hideMenu();
  });


  let visible = false;
  const menuEl = document.getElementById('tankihelper-menu');

  function showMenu() {
    menuEl.style.display = 'block';
    setTimeout(() => {
      menuEl.classList.add('visible');
    }, 10);
    visible = true;
  }

  function hideMenu() {
    menuEl.classList.remove('visible');
    setTimeout(() => {
      if (!visible) menuEl.style.display = 'none';
    }, 500);
    visible = false;
  }

  function toggleMenu() {
    if (visible) hideMenu();
    else showMenu();
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Insert') {
      e.preventDefault();
      toggleMenu();
    }
  });


  let drag = false, offsetX = 0, offsetY = 0;
  const header = document.getElementById('tankihelper-header');

  header.addEventListener('mousedown', e => {
    if (e.target.id === 'tankihelper-close') return;
    drag = true;
    offsetX = e.clientX - menuEl.offsetLeft;
    offsetY = e.clientY - menuEl.offsetTop;
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mouseup', () => {
    drag = false;
    document.body.style.userSelect = '';
  });

  document.addEventListener('mousemove', e => {
    if (!drag) return;
    let left = e.clientX - offsetX;
    let top = e.clientY - offsetY;

    if (left < 0) left = 0;
    if (top < 0) top = 0;
    if (left + menuEl.offsetWidth > window.innerWidth) left = window.innerWidth - menuEl.offsetWidth;
    if (top + menuEl.offsetHeight > window.innerHeight) top = window.innerHeight - menuEl.offsetHeight;

    menuEl.style.left = left + 'px';
    menuEl.style.top = top + 'px';
    menuEl.style.transform = 'scale(1)';
  });
})();
