/* =========================================
   main.js — Tüm JavaScript kodları
   - Aktif nav linki
   - Navbar scroll gölgesi
   - Scroll reveal animasyonu
   - Hamburger menü
   - Proje slider
   - İletişim formu
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Aktif nav linki ────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });

  /* ── Hamburger menü ─────────────────────── */
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    // Linke tıklayınca menüyü kapat
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
    // Dışarı tıklayınca kapat
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
        ? '0 4px 24px rgba(44,40,32,0.08)'
        : 'none';
    });
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

    if (slides.length === 0) return;

    // Nokta göstergelerini oluştur
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

    function startTimer() {
      timer = setInterval(() => goTo(current + 1), interval);
    }
    function stopTimer() {
      clearInterval(timer);
    }

    if (btnPrev) btnPrev.addEventListener('click', () => { stopTimer(); goTo(current - 1); startTimer(); });
    if (btnNext) btnNext.addEventListener('click', () => { stopTimer(); goTo(current + 1); startTimer(); });

    slider.addEventListener('mouseenter', stopTimer);
    slider.addEventListener('mouseleave', startTimer);

    startTimer();
  });

  /* ── İletişim formu ─────────────────────── */
  const sendBtn = document.getElementById('sendBtn');
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const msg = document.getElementById('successMsg');
      sendBtn.textContent = '✓ Gönderildi!';
      sendBtn.classList.add('sent');
      sendBtn.disabled = true;
      if (msg) {
        msg.classList.add('visible');
        msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      setTimeout(() => {
        sendBtn.textContent = 'Mesajı Gönder →';
        sendBtn.classList.remove('sent');
        sendBtn.disabled = false;
        if (msg) msg.classList.remove('visible');
      }, 5000);
    });
  }

});
