/* ============================================================
   CECOTINS CORE — assets/cecotins-core.js
   Gerencia: tema persistente (localStorage), toggle, animações
   ============================================================ */
(function () {
  var KEY = 'cecotins-theme';

  /* --- Lê preferência salva --- */
  function getTheme() {
    try { return localStorage.getItem(KEY); } catch(e) { return null; }
  }

  /* --- Salva preferência --- */
  function setTheme(val) {
    try { localStorage.setItem(KEY, val); } catch(e) {}
  }

  /* --- Aplica classe no body e atributo no documentElement --- */
  function applyTheme(isLight) {
    if (isLight) {
      document.body.classList.add('light-mode');
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      document.documentElement.removeAttribute('data-theme');
    }
  }

  /* --- Sincroniza o toggle visual com o estado atual --- */
  function syncToggle() {
    var toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    var isLight = document.body.classList.contains('light-mode');
    toggle.checked = isLight;

    toggle.addEventListener('change', function () {
      var nowLight = this.checked;
      applyTheme(nowLight);
      setTheme(nowLight ? 'light' : 'dark');
      /* Evento para componentes que precisam saber da mudança */
      document.dispatchEvent(new CustomEvent('themeChange', { detail: { light: nowLight } }));
    });
  }

  /* --- Aplica tema salvo antes do render --- */
  var saved = getTheme();
  /* Padrão: escuro */
  if (saved === 'light') {
    document.body.classList.add('light-mode');
  } else {
    document.body.classList.remove('light-mode');
  }

  /* --- Init quando DOM estiver pronto --- */
  document.addEventListener('DOMContentLoaded', function () {
    syncToggle();
    initGSAP();
    initAccordions();
    initCounters();
  });

  /* --- GSAP padrão compartilhado --- */
  function initGSAP() {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.fade-up').forEach(function(el) {
      gsap.fromTo(el,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        }
      );
    });

    gsap.utils.toArray('.fade-in').forEach(function(el) {
      gsap.fromTo(el,
        { opacity: 0 },
        {
          opacity: 1, duration: 0.8, ease: 'power1.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        }
      );
    });

    gsap.utils.toArray('.stagger-group').forEach(function(group) {
      var children = group.querySelectorAll('.stagger-item');
      gsap.fromTo(children,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: group, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });
  }

  /* --- Acordeão genérico --- */
  function initAccordions() {
    document.querySelectorAll('.accordion-item').forEach(function(item) {
      var btn = item.querySelector('.accordion-header');
      if (!btn) return;
      btn.addEventListener('click', function() {
        var isOpen = item.classList.contains('open');
        document.querySelectorAll('.accordion-item.open').forEach(function(o) {
          o.classList.remove('open');
        });
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  /* --- Contadores animados --- */
  function initCounters() {
    if (typeof gsap === 'undefined') return;
    document.querySelectorAll('[data-count]').forEach(function(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var obj = { val: 0 };
      gsap.to(obj, {
        val: target, duration: 2, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        onUpdate: function() {
          el.textContent = (Number.isInteger(target)
            ? Math.round(obj.val).toLocaleString('pt-BR')
            : obj.val.toFixed(1)) + suffix;
        }
      });
    });
  }

})();
