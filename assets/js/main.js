/* =========================================
   main.js — Tüm JavaScript
   - Dark mode toggle (localStorage'a kaydeder)
   - Aktif nav linki
   - Hamburger menü
   - Navbar scroll gölgesi
   - Scroll reveal
   - Proje slider
   - İletişim formu
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Dark Mode ──────────────────────────── */
  const htmlEl = document.documentElement;

  // Kayıtlı tercihi uygula
  if (localStorage.getItem('theme') === 'dark') {
    htmlEl.classList.add('dark');
  }

  // Toggle butonuna tıklama
  document.querySelectorAll('.dark-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      htmlEl.classList.toggle('dark');
      localStorage.setItem('theme', htmlEl.classList.contains('dark') ? 'dark' : 'light');
    });
  });

  /* ── Aktif nav linki ────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === currentPage) link.classList.add('active');
  });

  /* ── Hamburger menü ─────────────────────── */
  const toggle   = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
        toggle.classList.remove('open');
        navLinks.classList.remove('open');
      }
    });
  }

  /* ── Navbar scroll gölgesi ──────────────── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.boxShadow = window.scrollY > 10
        ? '0 4px 24px rgba(0,0,0,0.1)'
        : 'none';
    }, { passive: true });
  }

  /* ── Scroll reveal ──────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
  }

  /* ── Proje slider ───────────────────────── */
  document.querySelectorAll('.slider').forEach(slider => {
    const slides   = slider.querySelectorAll('.slide');
    const dotsWrap = slider.querySelector('.slider-dots');
    const btnPrev  = slider.querySelector('.slider-prev');
    const btnNext  = slider.querySelector('.slider-next');
    const interval = parseInt(slider.dataset.interval) || 5000;
    let current = 0;
    let timer;

    if (!slides.length || !dotsWrap) return;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slayt ${i + 1}`);
      dot.addEventListener('click', () => { stopTimer(); goTo(i); startTimer(); });
      dotsWrap.appendChild(dot);
    });

    function goTo(n) {
      slides[current].classList.remove('active');
      dotsWrap.children[current].classList.remove('active');
      current = (n + slides.length) % slides.length;
      slides[current].classList.add('active');
      dotsWrap.children[current].classList.add('active');
    }
    function startTimer() { timer = setInterval(() => goTo(current + 1), interval); }
    function stopTimer()  { clearInterval(timer); }

    if (btnPrev) btnPrev.addEventListener('click', () => { stopTimer(); goTo(current - 1); startTimer(); });
    if (btnNext) btnNext.addEventListener('click', () => { stopTimer(); goTo(current + 1); startTimer(); });

    slider.addEventListener('mouseenter', stopTimer);
    slider.addEventListener('mouseleave', startTimer);
    startTimer();
  });

  /* ── Proje modal ────────────────────────── */
  // Kart tıklaması → modal aç
  document.querySelectorAll('.project-card[data-modal]').forEach(card => {
    card.addEventListener('click', (e) => {
      // Slider ok butonlarına tıklanınca modal açılmasın
      if (e.target.closest('.slider-prev') || e.target.closest('.slider-next') || e.target.closest('.slider-dot')) return;
      const modalId = 'modal-' + card.dataset.modal;
      const overlay = document.getElementById(modalId);
      if (!overlay) return;
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      // Modal slider'ı başlat
      initModalSlider(overlay);
    });
  });

  // Modal kapat — overlay veya X butonu
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    // X butonu
    overlay.querySelector('.modal-close')?.addEventListener('click', () => closeModal(overlay));
    // Overlay dışına tıklama
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  // ESC tuşu ile kapat
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(closeModal);
    }
  });

  function closeModal(overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function initModalSlider(overlay) {
    const slider   = overlay.querySelector('.modal-slider');
    if (!slider || slider.dataset.initialized) return;
    slider.dataset.initialized = 'true';

    const slides   = slider.querySelectorAll('.modal-slide');
    const dotsWrap = slider.querySelector('.modal-slider-dots');
    const btnPrev  = slider.querySelector('.modal-prev');
    const btnNext  = slider.querySelector('.modal-next');
    let current = 0;
    let timer;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'modal-slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slayt ${i + 1}`);
      dot.addEventListener('click', () => { stopTimer(); goTo(i); startTimer(); });
      dotsWrap.appendChild(dot);
    });

    function goTo(n) {
      slides[current].classList.remove('active');
      dotsWrap.children[current].classList.remove('active');
      current = (n + slides.length) % slides.length;
      slides[current].classList.add('active');
      dotsWrap.children[current].classList.add('active');
    }
    function startTimer() { timer = setInterval(() => goTo(current + 1), 4000); }
    function stopTimer()  { clearInterval(timer); }

    btnPrev?.addEventListener('click', () => { stopTimer(); goTo(current - 1); startTimer(); });
    btnNext?.addEventListener('click', () => { stopTimer(); goTo(current + 1); startTimer(); });
    slider.addEventListener('mouseenter', stopTimer);
    slider.addEventListener('mouseleave', startTimer);
    startTimer();
  }

  /* ── İletişim formu ─────────────────────── */
  const sendBtn = document.getElementById('sendBtn');
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const msg = document.getElementById('successMsg');
      sendBtn.textContent = '✓ Gönderildi!';
      sendBtn.classList.add('sent');
      sendBtn.disabled = true;
      if (msg) { msg.classList.add('visible'); msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
      setTimeout(() => {
        sendBtn.textContent = 'Mesajı Gönder →';
        sendBtn.classList.remove('sent');
        sendBtn.disabled = false;
        if (msg) msg.classList.remove('visible');
      }, 5000);
    });
  }

});
