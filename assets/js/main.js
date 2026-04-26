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

  /* ── İletişim formu — validasyon + Formspree ── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {

    // ── Yardımcı fonksiyonlar ──────────────────
    function showError(inputEl, errorId, msg) {
      inputEl.classList.add('error');
      inputEl.classList.remove('valid');
      const errEl = document.getElementById(errorId);
      if (errEl) { errEl.textContent = msg; errEl.classList.add('visible'); }
    }

    function showValid(inputEl, errorId) {
      inputEl.classList.remove('error');
      inputEl.classList.add('valid');
      const errEl = document.getElementById(errorId);
      if (errEl) errEl.classList.remove('visible');
    }

    function clearState(inputEl, errorId) {
      inputEl.classList.remove('error', 'valid');
      const errEl = document.getElementById(errorId);
      if (errEl) errEl.classList.remove('visible');
    }

    function isValidEmail(val) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
    }

    // ── Alanları doğrula ───────────────────────
    function validateField(input) {
      const id   = input.id;
      const val  = input.value.trim();
      const errId = 'err-' + id;

      if (id === 'fname') {
        if (!val) { showError(input, errId, 'Ad alanı boş bırakılamaz.'); return false; }
        if (val.length < 2) { showError(input, errId, 'Ad en az 2 karakter olmalıdır.'); return false; }
      }
      if (id === 'lname') {
        if (!val) { showError(input, errId, 'Soyad alanı boş bırakılamaz.'); return false; }
        if (val.length < 2) { showError(input, errId, 'Soyad en az 2 karakter olmalıdır.'); return false; }
      }
      if (id === 'email') {
        if (!val) { showError(input, errId, 'E-posta alanı boş bırakılamaz.'); return false; }
        if (!isValidEmail(val)) { showError(input, errId, 'Geçerli bir e-posta adresi girin. (örn: ad@mail.com)'); return false; }
      }
      if (id === 'subject') {
        if (!val) { showError(input, errId, 'Lütfen bir konu seçin.'); return false; }
      }
      if (id === 'message') {
        if (!val) { showError(input, errId, 'Mesaj alanı boş bırakılamaz.'); return false; }
        if (val.length < 10) { showError(input, errId, 'Mesaj en az 10 karakter olmalıdır.'); return false; }
      }

      showValid(input, errId);
      return true;
    }

    // ── Anlık doğrulama (blur olunca) ─────────
    ['fname','lname','email','subject','message'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('blur', () => validateField(el));
      el.addEventListener('input', () => {
        // Hata varken düzeltince anında temizle
        if (el.classList.contains('error')) validateField(el);
      });
    });

    // ── Form submit ────────────────────────────
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fields = ['fname','lname','email','subject','message'];
      let allValid = true;

      fields.forEach(id => {
        const el = document.getElementById(id);
        if (el && !validateField(el)) allValid = false;
      });

      if (!allValid) {
        // İlk hatalı alana odaklan
        const firstError = contactForm.querySelector('.error');
        if (firstError) firstError.focus();
        return;
      }

      // ── EmailJS ile gönder ──────────────────
      const sendBtn    = document.getElementById('sendBtn');
      const successMsg = document.getElementById('successMsg');

      sendBtn.textContent = 'Gönderiliyor...';
      sendBtn.classList.add('loading');
      sendBtn.disabled = true;

      const templateParams = {
        ad:     document.getElementById('fname').value.trim(),
        soyad:  document.getElementById('lname').value.trim(),
        email:  document.getElementById('email').value.trim(),
        konu:   document.getElementById('subject').value,
        mesaj:  document.getElementById('message').value.trim(),
        name:   document.getElementById('fname').value.trim() + ' ' + document.getElementById('lname').value.trim()
      };

      emailjs.send('service_jtzou9i', 'template_iu4mmul', templateParams)
        .then(() => {
          sendBtn.textContent = '✓ Gönderildi!';
          sendBtn.classList.remove('loading');
          sendBtn.classList.add('sent');
          if (successMsg) {
            successMsg.classList.add('visible');
            successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          contactForm.reset();
          fields.forEach(id => {
            const el = document.getElementById(id);
            if (el) clearState(el, 'err-' + id);
          });
          setTimeout(() => {
            sendBtn.textContent = 'Mesajı Gönder →';
            sendBtn.classList.remove('sent');
            sendBtn.disabled = false;
            if (successMsg) successMsg.classList.remove('visible');
          }, 6000);
        })
        .catch(() => {
          sendBtn.textContent = '✗ Hata oluştu, tekrar dene';
          sendBtn.classList.remove('loading');
          sendBtn.classList.add('error-state');
          sendBtn.disabled = false;
          setTimeout(() => {
            sendBtn.textContent = 'Mesajı Gönder →';
            sendBtn.classList.remove('error-state');
          }, 4000);
        });
    });
  }

});
