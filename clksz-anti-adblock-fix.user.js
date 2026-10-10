 // ==UserScript==
 // @name         ClkSz - Hide Anti-Adblock Overlay
 // @namespace    local.clksz.overlay
 // @version      1.7
 // @description  Hide ClkSz overlays, including iframe-created closed Shadow DOMs.
 // @match        https://clksz.com/*
 // @match        https://www.clksz.com/*
 // @run-at       document-start
 // @inject-into  page
 // @grant        none
 // @noframes
 // ==/UserScript==

(() => {
  'use strict';

  const LOG = '[ClkSz fix]';
  const WARNING = 'Brave Shields is blocking ads';

  const roots = new Set();
  const observers = new WeakSet();
  const wrappers = new Map();

  let hiddenCount = 0;
  let patchedFrames = 0;

  function hide(element) {
    if (!element || !element.isConnected) return;

    if (
      element.style.getPropertyValue('display') !== 'none' ||
      element.style.getPropertyPriority('display') !== 'important'
    ) {
      element.style.setProperty(
        'display', 'none', 'important'
      );

      hiddenCount++;

      console.info(
        LOG, 'Overlay hidden, total:', hiddenCount
      );
    }
  }

  function restoreScroll() {
    for (const el of [
      document.documentElement,
      document.body
    ]) {
      if (!el) continue;

      if (getComputedStyle(el).overflow === 'hidden') {
        el.style.setProperty(
          'overflow', 'auto', 'important'
        );
      }
    }
  }

  function findWrapper(root) {
    for (const dialog of root.querySelectorAll(
      '[role="dialog"][aria-modal="true"]'
    )) {
      if (!dialog.textContent.includes(WARNING)) {
        continue;
      }

      let element = dialog.parentElement;

      while (element) {
        const css = getComputedStyle(element);

        if (
          css.position === 'fixed' &&
          css.zIndex === '2147483647'
        ) {
          return element;
        }

        element = element.parentElement;
      }
    }

    return null;
  }

  function scanRoot(root) {
    if (!root.host?.isConnected) return;

    let wrapper = wrappers.get(root);

    if (!wrapper || !wrapper.isConnected) {
      wrapper = findWrapper(root);

      if (wrapper) {
        wrappers.set(root, wrapper);
      }
    }

    if (!wrapper) return;

    // Hide the internal wrapper, never BODY or HTML.
    hide(wrapper);
    restoreScroll();
  }

  function captureRoot(root) {
    if (observers.has(root)) return;

    observers.add(root);
    roots.add(root);

    new MutationObserver(() => {
      scanRoot(root);
    }).observe(root, {
      childList: true,
      subtree: true,
      characterData: true
    });

    scanRoot(root);

    console.info(
      LOG,
      'ShadowRoot captured:',
      root.host?.tagName,
      root.mode
    );
  }

  function patchRealm(realm) {
    try {
      const proto = realm.Element.prototype;

      if (proto.attachShadow.__clkszPatched) {
        return;
      }

      const original = proto.attachShadow;

      function patchedAttachShadow(options) {
        const root = original.call(this, options);

        captureRoot(root);

        return root;
      }

      Object.defineProperty(
        patchedAttachShadow,
        '__clkszPatched',
        { value: true }
      );

      proto.attachShadow = patchedAttachShadow;

    } catch (error) {
      // Ignore inaccessible or sandboxed frames.
    }
  }

  function patchFrame(frame) {
    if (
      !frame ||
      frame.tagName !== 'IFRAME'
    ) return;

    try {
      const realm = frame.contentWindow;

      if (!realm?.Element) return;

      patchRealm(realm);
      patchedFrames++;

    } catch (error) {
      // Cross-origin frames cannot be patched.
    }
  }

  // Patch the main page.
  patchRealm(window);

  // The site obtains attachShadow from temporary
  // iframe realms. Patch those realms immediately
  // after their iframe is inserted.
  const originalAppend = Node.prototype.appendChild;

  Node.prototype.appendChild = function(node) {
    const result = originalAppend.call(this, node);

    if (node?.tagName === 'IFRAME') {
      patchFrame(node);
    }

    return result;
  };

  const originalInsertBefore =
    Node.prototype.insertBefore;

  Node.prototype.insertBefore = function(node, ref) {
    const result =
      originalInsertBefore.call(this, node, ref);

    if (node?.tagName === 'IFRAME') {
      patchFrame(node);
    }

    return result;
  };

  // Periodic fallback, without a style observer.
  setInterval(() => {
    for (const root of roots) {
      if (!root.host?.isConnected) {
        roots.delete(root);
        wrappers.delete(root);
        continue;
      }

      scanRoot(root);
    }
  }, 1000);

  console.info(LOG, 'v1.7 active');

})();
