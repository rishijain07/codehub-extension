(function () {
  'use strict';

  var DEFAULT_PROMPT = 'What is CodeHub and how does it automatically sync accepted DSA solutions to GitHub?';
  var CODEHUB_URL = 'https://rishijain07.github.io/codehub-extension/';
  var CODEHUB_DOCS_URL = 'https://rishijain07.github.io/codehub-extension/llms.txt';
  var activePlatform = 'leetcode';
  var motionApi = null;

  var platformData = {
    leetcode: {
      name: 'LeetCode',
      path: 'leetcode/0001-two-sum',
      mode: 'instant hook',
      detail: 'accepted on submit',
      accent: '#f29e39'
    },
    geeksforgeeks: {
      name: 'GeeksforGeeks',
      path: 'geeksforgeeks/bfs-traversal-of-graph',
      mode: 'instant hook',
      detail: 'accepted on submit',
      accent: '#2f9d50'
    },
    codeforces: {
      name: 'Codeforces',
      path: 'codeforces/4A-watermelon',
      mode: 'background sync',
      detail: 'via public API',
      accent: '#278acb'
    },
    codechef: {
      name: 'CodeChef',
      path: 'codechef/START01',
      mode: 'instant hook',
      detail: 'accepted on submit',
      accent: '#9a6b45'
    },
    neetcode: {
      name: 'NeetCode',
      path: 'neetcode/neetcode-150',
      mode: 'instant hook',
      detail: 'accepted on submit',
      accent: '#16b6b1'
    },
    hackerrank: {
      name: 'HackerRank',
      path: 'hackerrank/cpp-hello-world',
      mode: 'public challenge hook',
      detail: 'accepted on submit',
      accent: '#00c46a'
    }
  };

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setText(selector, value) {
    var element = qs(selector);
    if (element) element.textContent = value;
  }

  function setPlatform(key, options) {
    var data = platformData[key];
    if (!data) return;

    activePlatform = key;
    document.documentElement.style.setProperty('--platform-accent', data.accent);

    qsa('[data-platform]').forEach(function (button) {
      var isActive = button.getAttribute('data-platform') === key;
      button.setAttribute('aria-pressed', String(isActive));
    });

    setText('[data-source-name]', data.name);
    setText('[data-source-mode]', data.mode);
    setText('[data-source-detail]', data.detail);
    setText('[data-source-path]', data.path);
    setText('[data-commit-path]', data.path + '/solution.cpp');
    setText('[data-commit-hash]', key === 'codeforces' ? 'sync  ·  fetched from Codeforces API' : 'commit  ·  accepted solution captured');

    var consoleElement = qs('[data-commit-console]');
    if (consoleElement) consoleElement.setAttribute('data-active-platform', key);

    var status = qs('[data-commit-status]');
    if (status) status.textContent = data.name + ' selected. Ready to replay the sync trail.';

    if (motionApi && options && options.animate !== false) {
      motionApi.replay();
    } else {
      revealCommitFinalState();
    }
  }

  function revealCommitFinalState() {
    qsa('[data-commit-node]').forEach(function (node) {
      node.classList.add('is-live');
    });
    qsa('[data-flow-fill]').forEach(function (fill) {
      fill.style.transform = 'scale(1)';
    });
    qsa('[data-flow-traveler]').forEach(function (traveler) {
      traveler.style.transform = '';
    });
    var row = qs('[data-commit-row]');
    if (row) {
      row.style.opacity = '1';
      row.style.visibility = 'visible';
      row.style.transform = 'none';
    }
  }

  function initPlatformSwitcher() {
    qsa('[data-platform]').forEach(function (button) {
      button.addEventListener('click', function () {
        setPlatform(button.getAttribute('data-platform'), { animate: true });
      });
    });

    setPlatform(activePlatform, { animate: false });
  }

  function initMotion() {
    if (!window.gsap) return null;

    var gsap = window.gsap;
    var root = document.documentElement;
    var mm = gsap.matchMedia();
    var currentReplay = null;
    var motionController = null;

    root.classList.add('motion-ready');

    mm.add({
      reduced: '(prefers-reduced-motion: reduce)',
      desktop: '(min-width: 681px)',
      mobile: '(max-width: 680px)'
    }, function (context) {
      var conditions = context.conditions;
      var reduced = conditions.reduced;
      var desktop = conditions.desktop;
      var header = qs('.site-header');
      var heroCopy = qs('[data-motion="hero-copy"]');
      var consoleElement = qs('[data-motion="hero-console"]');
      var nodes = qsa('[data-commit-node]');
      var fills = qsa('[data-flow-fill]');
      var travelers = qsa('[data-flow-traveler]');
      var commitRow = qs('[data-commit-row]');

      if (currentReplay) currentReplay.kill();

      if (reduced) {
        root.classList.add('reduced-motion');
        gsap.set([header, heroCopy, consoleElement, commitRow].filter(Boolean), { autoAlpha: 1, clearProps: 'transform' });
        gsap.set(nodes, { scale: 1, clearProps: 'transform' });
        gsap.set(fills, { scaleX: 1, scaleY: 1, clearProps: 'transform' });
        gsap.set(travelers, { clearProps: 'all' });
        revealCommitFinalState();
        return function () {
          if (currentReplay) currentReplay.kill();
        };
      }

      root.classList.remove('reduced-motion');

      gsap.set([header, heroCopy, consoleElement].filter(Boolean), { autoAlpha: 0, y: 16 });
      gsap.set(commitRow, { autoAlpha: 0, y: 8 });
      gsap.set(nodes, { scale: 0.98 });
      gsap.set(fills, desktop ? { scaleX: 0, scaleY: 1, transformOrigin: 'left center' } : { scaleX: 1, scaleY: 0, transformOrigin: 'center top' });
      gsap.set(travelers, desktop ? { x: 0 } : { y: 0 });

      function distanceFor(element) {
        return desktop ? Math.max(0, element.parentNode.offsetWidth - element.offsetWidth) : Math.max(0, element.parentNode.offsetHeight - element.offsetHeight);
      }

      function replay() {
        if (currentReplay) currentReplay.kill();
        gsap.set(commitRow, { autoAlpha: 0, y: 8 });
        gsap.set(nodes, { scale: 0.98 });
        gsap.set(fills, desktop ? { scaleX: 0, scaleY: 1 } : { scaleX: 1, scaleY: 0 });
        gsap.set(travelers, desktop ? { x: 0 } : { y: 0 });
        nodes.forEach(function (node) { node.classList.remove('is-live'); });

        var trail = gsap.timeline({
          defaults: { ease: 'power3.out' },
          onComplete: function () {
            nodes.forEach(function (node) { node.classList.add('is-live'); });
            var status = qs('[data-commit-status]');
            if (status) status.textContent = platformData[activePlatform].name + ' is committed to GitHub.';
          }
        });

        trail.addLabel('accepted');
        trail.to(nodes[0], { scale: 1.05, duration: 0.24, ease: 'back.out(1.6)' }, 'accepted');
        trail.to(fills[0], desktop ? { scaleX: 1, duration: 0.5 } : { scaleY: 1, duration: 0.5 }, 'accepted+=0.08');
        trail.to(travelers[0], desktop ? { x: distanceFor(travelers[0]), duration: 0.5 } : { y: distanceFor(travelers[0]), duration: 0.5 }, 'accepted+=0.08');
        trail.to(nodes[1], { scale: 1.05, duration: 0.24, ease: 'back.out(1.6)' }, 'accepted+=0.52');
        trail.to(fills[1], desktop ? { scaleX: 1, duration: 0.5 } : { scaleY: 1, duration: 0.5 }, 'accepted+=0.66');
        trail.to(travelers[1], desktop ? { x: distanceFor(travelers[1]), duration: 0.5 } : { y: distanceFor(travelers[1]), duration: 0.5 }, 'accepted+=0.66');
        trail.to(nodes[2], { scale: 1.05, duration: 0.24, ease: 'back.out(1.6)' }, 'accepted+=1.1');
        trail.to(commitRow, { autoAlpha: 1, y: 0, duration: 0.3 }, 'accepted+=1.18');

        currentReplay = trail;
        trail.play(0);
      }

      var intro = gsap.timeline({ defaults: { duration: 0.62, ease: 'power3.out' }, onComplete: replay });
      intro.to(header, { autoAlpha: 1, y: 0, duration: 0.48 });
      intro.to(heroCopy, { autoAlpha: 1, y: 0 }, '-=0.18');
      intro.to(consoleElement, { autoAlpha: 1, y: 0 }, '-=0.3');
      intro.play(0);

      motionController = {
        replay: replay,
        kill: function () {
          intro.kill();
          if (currentReplay) currentReplay.kill();
        }
      };

      return function () {
        intro.kill();
        if (currentReplay) currentReplay.kill();
      };
    });

    return {
      replay: function () {
        if (motionController && motionController.replay) motionController.replay();
      },
      revert: function () {
        if (motionController && motionController.kill) motionController.kill();
        mm.revert();
      }
    };
  }

  function initSectionReveals() {
    if (!window.gsap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var gsap = window.gsap;
    var targets = qsa('[data-reveal]');
    if (!targets.length || !window.IntersectionObserver) return;

    gsap.set(targets, { autoAlpha: 0, y: 20 });
    var observer = new IntersectionObserver(function (entries) {
      var visible = entries.filter(function (entry) { return entry.isIntersecting; }).map(function (entry) { return entry.target; });
      if (!visible.length) return;
      gsap.to(visible, { autoAlpha: 1, y: 0, duration: 0.56, ease: 'power3.out', stagger: 0.07, overwrite: 'auto' });
      visible.forEach(function (element) { observer.unobserve(element); });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

    targets.forEach(function (target) { observer.observe(target); });
  }

  function initAiDialog() {
    var dialog = qs('#aiDialog');
    var trigger = qs('[data-ai-trigger]');
    var closeButton = qs('[data-dialog-close]');
    var card = qs('.dialog-card', dialog || document);
    var textarea = qs('#aiPromptInput');
    var copyButton = qs('#copyPromptButton');
    var status = qs('#dialogStatus');
    var chatgpt = qs('#launchChatGptBtn');
    var claude = qs('#launchClaudeBtn');
    var returnFocus = null;

    if (!dialog || !trigger || !textarea) return;

    function buildAiPrompt(question) {
      return [
        'You are answering a question about CodeHub, a privacy-first Chrome extension for competitive programmers.',
        'Use these official sources for context:',
        'Product page: ' + CODEHUB_URL,
        'Agent documentation: ' + CODEHUB_DOCS_URL,
        '',
        'User question:',
        question.trim() || DEFAULT_PROMPT
      ].join('\n');
    }

    function updateLinks() {
      var value = textarea.value.trim();
      var encoded = encodeURIComponent(buildAiPrompt(value));
      if (chatgpt) chatgpt.href = 'https://chatgpt.com/?q=' + encoded;
      if (claude) claude.href = 'https://claude.ai/new?q=' + encoded;
      var disabled = value.length === 0;
      [chatgpt, claude].forEach(function (link) {
        if (!link) return;
        link.setAttribute('aria-disabled', String(disabled));
      });
    }

    function openDialog() {
      returnFocus = document.activeElement;
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
      updateLinks();
      if (window.gsap && card && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.gsap.fromTo(card, { autoAlpha: 0, y: 12, scale: 0.985 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, ease: 'power3.out' });
      }
      window.setTimeout(function () { textarea.focus(); }, 0);
    }

    function closeDialog() {
      if (dialog.open) dialog.close();
      else dialog.removeAttribute('open');
    }

    function copyPrompt() {
      var value = buildAiPrompt(textarea.value);
      var done = function (message) {
        if (status) status.textContent = message;
        window.setTimeout(function () {
          if (status) status.textContent = '';
        }, 2200);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(function () { done('Prompt copied.'); }).catch(function () { done('Copy unavailable — select the prompt manually.'); });
        return;
      }

      textarea.focus();
      textarea.select();
      try {
        var copied = document.execCommand('copy');
        done(copied ? 'Prompt copied.' : 'Copy unavailable — select the prompt manually.');
      } catch (error) {
        done('Copy unavailable — select the prompt manually.');
      }
    }

    trigger.addEventListener('click', openDialog);
    if (closeButton) closeButton.addEventListener('click', closeDialog);
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) closeDialog();
    });
    dialog.addEventListener('close', function () {
      if (returnFocus && typeof returnFocus.focus === 'function') returnFocus.focus();
    });
    textarea.addEventListener('input', updateLinks);
    if (copyButton) copyButton.addEventListener('click', copyPrompt);

    qsa('[data-prompt]', dialog).forEach(function (button) {
      button.addEventListener('click', function () {
        textarea.value = button.getAttribute('data-prompt') || DEFAULT_PROMPT;
        updateLinks();
        textarea.focus();
        if (status) status.textContent = 'Prompt selected.';
      });
    });

    [chatgpt, claude].forEach(function (link) {
      if (!link) return;
      link.addEventListener('click', function (event) {
        if (!textarea.value.trim()) {
          event.preventDefault();
          if (status) status.textContent = 'Add a question before opening an AI service.';
        }
      });
    });
  }

  function init() {
    initPlatformSwitcher();
    motionApi = initMotion();
    initSectionReveals();
    initAiDialog();

    var replayButton = qs('[data-replay]');
    if (replayButton) {
      replayButton.addEventListener('click', function () {
        if (motionApi && motionApi.replay) motionApi.replay();
        else revealCommitFinalState();
      });
    }

    window.addEventListener('pagehide', function () {
      if (motionApi && motionApi.revert) motionApi.revert();
    }, { once: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
