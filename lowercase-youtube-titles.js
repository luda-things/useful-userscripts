// ==UserScript==
// @name         lowercase youtube titles
// @namespace    https://violentmonkey.github.io
// @version      1.0.1
// @description  make all youtube video titles lowercase
// @author       lucidus.
// @match        *://www.youtube.com/*
// @match        *://youtube.com/*
// @match        *://m.youtube.com/*
// @match        *://youtu.be/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

// last updated: 2026-07-17

(() => {
  'use strict';
  const TARGETS = [
    { selector: '.ytLockupMetadataViewModelTitle span', text: true },
    { selector: '.ytLockupMetadataViewModelTitle', attrs: ['aria-label'] },
    { selector: '.ytLockupMetadataViewModelHeadingReset', attrs: ['aria-label', 'title'] },
    { selector: 'h1 yt-formatted-string', text: true },
    { selector: '#above-the-fold #title yt-formatted-string', text: true },
    { selector: 'ytd-watch-metadata h1 yt-formatted-string', text: true },
    { selector: '.ytp-title-link', text: true },
    { selector: '.ytp-modern-videowall-still-info-title', text: true }
  ];
  function lowerText(node) {
    const text = node.textContent;
    if (!text) return;
    const lowered = text.toLowerCase();
    if (text !== lowered) node.textContent = lowered;
  }
  function lowerAttrs(node, attrs) {
    for (const attr of attrs) {
      const val = node.getAttribute(attr);
      if (!val) continue;
      const lowered = val.toLowerCase();
      if (val !== lowered) node.setAttribute(attr, lowered);
    }
  }
  function apply() {
    for (const { selector, text, attrs } of TARGETS) {
      document.querySelectorAll(selector).forEach((node) => {
        if (text) lowerText(node);
        if (attrs) lowerAttrs(node, attrs);
      });
    }
  }
  let scheduled = false;
  function scheduleApply() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      apply();
    });
  }
  apply();
  const observer = new MutationObserver(scheduleApply);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });
  window.addEventListener('yt-navigate-finish', scheduleApply);
  window.addEventListener('popstate', scheduleApply);

  setInterval(apply, 500);
})();