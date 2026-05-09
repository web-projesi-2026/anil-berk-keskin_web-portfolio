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

  /* ── Projeler: JSON'dan dinamik kart üret ── */
  const projectsGrid = document.getElementById('projectsGrid');
  if (projectsGrid) {
    fetch('../assets/data/projects.json')
      .then(r => r.json())
      .then(projects => {
        // Kartları oluştur
        projects.forEach(p => {
          const card = document.createElement('div');
          card.className = 'project-card reveal';
          card.dataset.modal = p.id;

          // Slider HTML
          const slidesHTML = p.gorseller.map((g, i) => `
            <div class="slide ${i === 0 ? 'active' : ''}">
              <img src="${g}" alt="${p.baslik} ekran ${i+1}"
                   onerror="this.src='${p.placeholder}'"/>
            </div>`).join('');

          // Teknoloji etiketleri
          const tagsHTML = p.teknolojiler.map(t =>
            `<span class="card-tag">${t}</span>`).join('');

          card.innerHTML = `
            <div class="card-thumb ${p.thumb_class}">
              <span class="card-num">${p.num}</span>
              <div class="slider" data-interval="5000">
                ${slidesHTML}
                <div class="slider-dots"></div>
                <button class="slider-prev" aria-label="Önceki">&#8249;</button>
                <button class="slider-next" aria-label="Sonraki">&#8250;</button>
              </div>
            </div>
            <div class="card-body">
              <h3>${p.baslik}</h3>
              <p>${p.kisa_aciklama}</p>
              <div class="card-footer">
                <div class="card-tags">${tagsHTML}</div>
                <span class="card-link">Detaylar →</span>
              </div>
              <button class="btn-inceleme" data-id="${p.id}" data-baslik="${p.baslik}" data-teknoloji="${p.teknolojiler.slice(0,2).join(', ')}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                İnceleme Listesine Al
              </button>
            </div>`;

          projectsGrid.appendChild(card);
        });

        // Modal HTML'lerini de oluştur
        projects.forEach(p => {
          const slidesHTML = p.gorseller.map((g, i) => `
            <div class="modal-slide ${i === 0 ? 'active' : ''}">
              <img src="${g}" alt="${p.baslik} ekran ${i+1}"
                   onerror="this.src='${p.placeholder}'"/>
            </div>`).join('');

          const featuresHTML = p.ozellikler.map(f =>
            `<div class="modal-feature">${f}</div>`).join('');

          const tagsHTML = p.teknolojiler.map(t =>
            `<span class="modal-tag">${t}</span>`).join('');

          const overlay = document.createElement('div');
          overlay.className = 'modal-overlay';
          overlay.id = `modal-${p.id}`;
          overlay.innerHTML = `
            <div class="modal">
              <button class="modal-close" aria-label="Kapat">✕</button>
              <div class="modal-slider-wrap">
                <div class="modal-slider">
                  ${slidesHTML}
                  <div class="modal-slider-dots"></div>
                  <button class="modal-prev">&#8249;</button>
                  <button class="modal-next">&#8250;</button>
                </div>
              </div>
              <div class="modal-content">
                <div class="modal-num">Proje ${p.num}</div>
                <h2 class="modal-title">${p.baslik}</h2>
                <p class="modal-desc">${p.uzun_aciklama}</p>
                <div class="modal-features">${featuresHTML}</div>
                <div class="modal-tags">${tagsHTML}</div>
                <div class="modal-actions">
                  <a href="${p.github}" target="_blank" class="modal-btn-primary">GitHub'da Gör →</a>
                  <a href="#" class="modal-btn-secondary">Canlı Demo</a>
                </div>
              </div>
            </div>`;
          document.body.appendChild(overlay);
        });

        // Kartlar hazır, diğer işlemleri başlat
        initReveal();
        initSliders();
        initModals();
        initInceleme();
      })
      .catch(() => {
        projectsGrid.innerHTML = '<p style="padding:40px;color:var(--text-muted)">Projeler yüklenemedi.</p>';
      });
  }

  // Projeler sayfası değilse direkt başlat
  if (!projectsGrid) {
    initReveal();
    initSliders();
    initModals();
  }

  /* ── İnceleme Listesi (localStorage) ───── */
  function initInceleme() {
    const toggleBtn   = document.getElementById('incelemeToggle');
    const panel       = document.getElementById('incelemePanel');
    const countEl     = document.getElementById('incelemeCount');
    const body        = document.getElementById('incelemePanelBody');
    const clearBtn    = document.getElementById('incelemeClear');
    if (!toggleBtn) return;

    // localStorage'dan oku
    let liste = JSON.parse(localStorage.getItem('incelemeListe') || '[]');

    function kaydet() {
      localStorage.setItem('incelemeListe', JSON.stringify(liste));
    }

    function sayfayiGuncelle() {
      // Sayaç
      countEl.textContent = liste.length;
      if (liste.length > 0) {
        countEl.classList.add('visible');
      } else {
        countEl.classList.remove('visible');
      }

      // Panel içeriği
      if (liste.length === 0) {
        body.innerHTML = '<div class="inceleme-empty">Henüz proje eklemediniz.<br>Kartlardaki butona tıklayın.</div>';
      } else {
        body.innerHTML = liste.map(item => `
          <div class="inceleme-item" data-id="${item.id}">
            <div class="inceleme-item-info">
              <strong>${item.baslik}</strong>
              <span>${item.teknoloji}</span>
            </div>
            <button class="inceleme-item-remove" data-id="${item.id}" aria-label="Kaldır">✕</button>
          </div>`).join('');

        // Kaldır butonları
        body.querySelectorAll('.inceleme-item-remove').forEach(btn => {
          btn.addEventListener('click', () => {
            liste = liste.filter(i => i.id !== btn.dataset.id);
            kaydet();
            sayfayiGuncelle();
            guncelleKartButonlari();
          });
        });
      }

      // Kart butonlarını güncelle
      guncelleKartButonlari();
    }

    function guncelleKartButonlari() {
      document.querySelectorAll('.btn-inceleme').forEach(btn => {
        const eklendi = liste.some(i => i.id === btn.dataset.id);
        if (eklendi) {
          btn.classList.add('eklendi');
          btn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Listede`;
        } else {
          btn.classList.remove('eklendi');
          btn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            İnceleme Listesine Al`;
        }
      });
    }

    // Kart butonlarına tıklama
    document.addEventListener('click', e => {
      const btn = e.target.closest('.btn-inceleme');
      if (!btn) return;
      e.stopPropagation();
      const id       = btn.dataset.id;
      const baslik   = btn.dataset.baslik;
      const teknoloji = btn.dataset.teknoloji;
      const zatenVar = liste.some(i => i.id === id);

      if (zatenVar) {
        liste = liste.filter(i => i.id !== id);
      } else {
        liste.push({ id, baslik, teknoloji });
      }
      kaydet();
      sayfayiGuncelle();
    });

    // Panel aç/kapat
    toggleBtn.addEventListener('click', e => {
      e.stopPropagation();
      panel.classList.toggle('open');
    });
    document.addEventListener('click', e => {
      if (!panel.contains(e.target) && e.target !== toggleBtn) {
        panel.classList.remove('open');
      }
    });

    // Listeyi temizle
    clearBtn.addEventListener('click', () => {
      liste = [];
      kaydet();
      sayfayiGuncelle();
    });

    // Başlangıçta güncelle
    sayfayiGuncelle();
  }

  /* ── Scroll reveal ──────────────────────── */
  function initReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;
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
  function initSliders() {
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

      btnPrev?.addEventListener('click', () => { stopTimer(); goTo(current - 1); startTimer(); });
      btnNext?.addEventListener('click', () => { stopTimer(); goTo(current + 1); startTimer(); });
      slider.addEventListener('mouseenter', stopTimer);
      slider.addEventListener('mouseleave', startTimer);
      startTimer();
    });
  }

  /* ── Modal ──────────────────────────────── */
  function initModals() {
    document.querySelectorAll('.project-card[data-modal]').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.slider-prev') || e.target.closest('.slider-next') ||
            e.target.closest('.slider-dot') || e.target.closest('.btn-inceleme')) return;
        const overlay = document.getElementById('modal-' + card.dataset.modal);
        if (!overlay) return;
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        initModalSlider(overlay);
      });
    });

    document.addEventListener('click', e => {
      const overlay = e.target.closest('.modal-overlay');
      if (overlay && (e.target === overlay || e.target.closest('.modal-close'))) {
        closeModal(overlay);
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(closeModal);
      }
    });
  }

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
