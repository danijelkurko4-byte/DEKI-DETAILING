(function () {
  function cfg() {
    if (typeof getSiteConfig === 'function') {
      return getSiteConfig();
    }
    if (typeof SITE !== 'undefined') {
      return SITE;
    }
    return { reviews: [], whyUs: [], gallery: [], hours: [] };
  }

  function el(id) {
    return document.getElementById(id);
  }

  function whatsappUrl(text) {
    const c = cfg();
    const phone = String(c.whatsapp || '').replace(/\D/g, '');
    return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(text);
  }

  function injectSchema() {
    const c = cfg();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'AutoRepair',
      name: c.name,
      description: c.description,
      url: c.siteUrl,
      telephone: c.phone,
      image: c.siteUrl + (c.ogImage || 'logo.png'),
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Mirijevo',
        addressRegion: 'Beograd',
        addressCountry: 'RS',
        streetAddress: c.addressDetail || c.address,
      },
      openingHoursSpecification: (c.hours || []).map(function (h) {
        const parts = String(h.time).split(/[–-]/);
        return {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: h.days,
          opens: (parts[0] || h.time).trim(),
          closes: (parts[1] || h.time).trim(),
        };
      }),
      sameAs: [c.instagram],
    });
    document.head.appendChild(script);
  }

  function setHeroBackground() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const img = new Image();
    img.onload = function () {
      hero.style.backgroundImage =
        "linear-gradient(rgba(0,0,0,0.62), rgba(0,0,0,0.78)), url('" + cfg().heroImage + "')";
    };
    img.onerror = function () {
      hero.style.backgroundImage =
        "linear-gradient(rgba(0,0,0,0.62), rgba(0,0,0,0.78)), url('" + cfg().heroFallback + "')";
    };
    img.src = cfg().heroImage;
  }

  function setAboutImage() {
    const aboutImg = document.querySelector('[data-about-image]');
    if (!aboutImg) return;
    const c = cfg();
    const paths = [c.aboutImage, 'gallery/about.jpeg', 'gallery/about.png'].filter(Boolean);

    function applySrc(index) {
      if (index >= paths.length) {
        aboutImg.src = c.aboutFallback;
        return;
      }
      const test = new Image();
      test.onload = function () {
        aboutImg.src = paths[index];
      };
      test.onerror = function () {
        applySrc(index + 1);
      };
      test.src = paths[index];
    }

    applySrc(0);

    if (!aboutImg.dataset.lightboxLoadHook) {
      aboutImg.dataset.lightboxLoadHook = '1';
      aboutImg.addEventListener('load', function () {
        bindGalleryLightbox();
      });
    }
  }

  window.refreshAboutImage = setAboutImage;

  function renderWhyUs() {
    const grid = el('why-us-grid');
    if (!grid) return;
    grid.innerHTML = (cfg().whyUs || [])
      .map(function (item) {
        return (
          '<div class="card trust-card"><h3>' +
          item.title +
          '</h3><p>' +
          item.text +
          '</p></div>'
        );
      })
      .join('');
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function buildReviewsHtml() {
    let list = [];
    if (typeof getPublishedReviews === 'function') {
      list = getPublishedReviews();
    } else if (typeof SITE !== 'undefined' && SITE.reviews) {
      list = SITE.reviews;
    }

    if (!list.length) {
      return '<p class="form-note">Još nema odobrenih recenzija. Budite prvi — ostavite recenziju ispod.</p>';
    }

    return list
      .map(function (r) {
        const n = Math.min(5, Math.max(0, Number(r.stars) || 5));
        const stars = '★'.repeat(n) + '☆'.repeat(5 - n);
        const text =
          typeof formatReviewDisplayText === 'function'
            ? formatReviewDisplayText(r)
            : r.text;
        return (
          '<div class="card review-card"><div class="stars" aria-label="' +
          n +
          ' od 5">' +
          stars +
          '</div><p>“' +
          escapeHtml(text) +
          '”</p><strong>— ' +
          escapeHtml(r.name) +
          '</strong></div>'
        );
      })
      .join('');
  }

  window.submitReview = function (e) {
    e.preventDefault();
    const success = el('review-form-success');
    const err = el('review-form-error');

    if (typeof submitClientReview !== 'function') {
      if (err) {
        err.hidden = false;
        err.textContent = 'Sistem recenzija nije učitan. Proveri config.js.';
      }
      return;
    }

    const result = submitClientReview({
      name: el('rev-name').value,
      vozilo: el('rev-vozilo').value,
      usluga: el('rev-usluga').value,
      stars: el('rev-stars').value,
      text: el('rev-text').value,
    });

    if (!result.ok) {
      if (err) {
        err.hidden = false;
        err.textContent = result.error;
      }
      if (success) success.hidden = true;
      return;
    }

    if (err) err.hidden = true;
    if (success) {
      success.hidden = false;
      success.innerHTML =
        '<strong>Hvala!</strong> Recenzija je poslata i pojaviće se na sajtu nakon što je admin odobri.';
    }
    e.target.reset();
    const starHidden = el('rev-stars');
    if (starHidden) starHidden.value = '5';
    document.querySelectorAll('.star-btn.active').forEach(function (b) {
      b.classList.remove('active');
    });
    const fifth = document.querySelector('.star-btn[data-value="5"]');
    if (fifth) fifth.classList.add('active');
  };

  function renderReviews() {
    const html = buildReviewsHtml();
    ['reviews-grid', 'reviews-grid-page'].forEach(function (id) {
      const grid = el(id);
      if (grid) {
        grid.innerHTML = html;
      }
    });
  }

  var lightboxSlides = [];
  var lightboxIndex = 0;

  function openLightbox(index) {
    if (!lightboxSlides.length) return;
    lightboxIndex = index;
    updateLightbox();
    const lb = el('image-lightbox');
    if (!lb) return;
    lb.hidden = false;
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    const lb = el('image-lightbox');
    if (!lb) return;
    lb.hidden = true;
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const slide = lightboxSlides[lightboxIndex];
    if (!slide) return;
    const img = el('lightbox-img');
    const prev = el('lightbox-prev');
    const next = el('lightbox-next');
    if (img) {
      img.src = slide.src;
      img.alt = slide.alt || '';
    }
    if (prev) prev.style.display = lightboxSlides.length > 1 ? 'flex' : 'none';
    if (next) next.style.display = lightboxSlides.length > 1 ? 'flex' : 'none';
  }

  function shiftLightbox(delta) {
    if (lightboxSlides.length < 2) return;
    lightboxIndex = (lightboxIndex + delta + lightboxSlides.length) % lightboxSlides.length;
    updateLightbox();
  }

  function bindGalleryLightbox() {
    const grid = el('gallery-grid');
    if (!grid) return;

    lightboxSlides = [];
    grid.querySelectorAll('.gallery-item.loaded img').forEach(function (img, index) {
      lightboxSlides.push({
        src: img.currentSrc || img.src,
        alt: img.alt,
        caption: '',
      });

      img.style.cursor = 'zoom-in';
      if (!img.dataset.lightboxBound) {
        img.dataset.lightboxBound = '1';
        img.addEventListener('click', function () {
          openLightbox(index);
        });
      }
    });

    const aboutImg = document.querySelector('[data-about-image]');
    if (aboutImg && aboutImg.complete && aboutImg.naturalWidth > 0 && !aboutImg.dataset.lightboxBound) {
      aboutImg.dataset.lightboxBound = '1';
      aboutImg.addEventListener('click', function () {
        lightboxSlides = [
          {
            src: aboutImg.currentSrc || aboutImg.src,
            alt: aboutImg.alt,
            caption: 'BG Auto Spa — detailing studio',
          },
        ];
        openLightbox(0);
      });
    }
  }

  function initLightbox() {
    const closeBtn = el('lightbox-close');
    const prevBtn = el('lightbox-prev');
    const nextBtn = el('lightbox-next');
    const lb = el('image-lightbox');

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', function () {
      shiftLightbox(-1);
    });
    if (nextBtn) nextBtn.addEventListener('click', function () {
      shiftLightbox(1);
    });
    if (lb) {
      lb.addEventListener('click', function (e) {
        if (e.target === lb) closeLightbox();
      });
    }

    document.addEventListener('keydown', function (e) {
      const box = el('image-lightbox');
      if (!box || box.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') shiftLightbox(-1);
      if (e.key === 'ArrowRight') shiftLightbox(1);
    });
  }

  function renderGallery() {
    const grid = el('gallery-grid');
    if (!grid) return;
    grid.innerHTML = (cfg().gallery || [])
      .map(function (item, i) {
        return (
          '<figure class="gallery-item" data-index="' +
          i +
          '">' +
          '<img src="' +
          item.src +
          '" alt="' +
          escapeHtml(item.alt) +
          '" loading="lazy" />' +
          '<div class="gallery-placeholder">Slika uskoro</div></figure>'
        );
      })
      .join('');

    grid.querySelectorAll('.gallery-item img').forEach(function (img) {
      img.addEventListener('load', function () {
        img.closest('.gallery-item').classList.add('loaded');
        bindGalleryLightbox();
      });
      img.addEventListener('error', function () {
        img.closest('.gallery-item').classList.add('missing');
      });
      if (img.complete && img.naturalWidth > 0) {
        img.closest('.gallery-item').classList.add('loaded');
      } else if (img.complete) {
        img.closest('.gallery-item').classList.add('missing');
      }
    });

    bindGalleryLightbox();
  }

  function renderContactPage() {
    const c = cfg();
    const info = el('contact-info');
    if (info) {
      info.innerHTML =
        '<div class="contact-cards">' +
        '<a class="contact-card" href="tel:' +
        c.phone.replace(/\s/g, '') +
        '"><span>Telefon</span><strong>' +
        c.phone +
        '</strong></a>' +
        '<a class="contact-card" href="' +
        c.mapsLink +
        '" target="_blank" rel="noopener"><span>Adresa</span><strong>' +
        c.address +
        '</strong><small>' +
        (c.addressDetail || '') +
        '</small></a>' +
        '<a class="contact-card" href="' +
        c.instagram +
        '" target="_blank" rel="noopener"><span>Instagram</span><strong>' +
        c.instagramHandle +
        '</strong></a>' +
        '</div><div class="hours-block"><h3>Radno vreme</h3><ul>' +
        (c.hours || [])
          .map(function (h) {
            return '<li><span>' + h.days + '</span><strong>' + h.time + '</strong></li>';
          })
          .join('') +
        '</ul></div>';
    }

    const map = el('map-frame');
    if (map) {
      map.src = c.mapsEmbed;
      map.title = c.name + ' — mapa';
    }
  }

  function bindDynamicLinks() {
    document.querySelectorAll('[data-wa-booking]').forEach(function (a) {
      a.href = whatsappUrl('Zdravo ' + cfg().name + ', želim da zakažem detailing.');
    });
    const c = cfg();
    document.querySelectorAll('[data-phone]').forEach(function (a) {
      a.href = 'tel:' + c.phone.replace(/\s/g, '');
      if (!a.classList.contains('float-phone')) {
        a.textContent = c.phone;
      }
    });
    document.querySelectorAll('[data-instagram]').forEach(function (a) {
      a.href = c.instagram;
    });
  }

  function expandServiceSelect() {
    const select = el('usluga');
    if (!select || select.options.length > 6) return;
    const extras = [
      'BASIC PROGRAM (auto) — 160€',
      'STANDARD PROGRAM (auto) — 200€',
      'PREMIUM PROGRAM (auto) — 290€',
      'BASIC MOTO — 60€',
      'STANDARD MOTO — 100€',
      'PREMIUM MOTO — 150€',
      'Dubinsko pranje — od 80€',
      'Pranje podvozja — 35€',
    ];
    extras.forEach(function (label) {
      const opt = document.createElement('option');
      opt.textContent = label;
      select.appendChild(opt);
    });
  }

  window.sendRequest = function (e) {
    e.preventDefault();
    const c = cfg();
    const ime = el('ime').value.trim();
    const telefon = el('telefon').value.trim();
    const vozilo = el('vozilo').value.trim();
    const usluga = el('usluga').value;
    const poruka = el('poruka').value.trim();

    const tekst =
      'Zdravo ' +
      c.name +
      ', želim da zakažem detailing.\n\n' +
      'Ime: ' +
      ime +
      '\nTelefon: ' +
      telefon +
      '\nVozilo: ' +
      vozilo +
      '\nUsluga: ' +
      usluga +
      (poruka ? '\nPoruka: ' + poruka : '');

    const item = {
      id: Date.now(),
      date: new Date().toLocaleDateString('sr-RS'),
      ime: ime,
      telefon: telefon,
      vozilo: vozilo,
      usluga: usluga,
      status: 'Novo',
      cena: 0,
      napomena: poruka,
    };

    try {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      list.unshift(item);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
      console.warn('localStorage', err);
    }

    const success = el('form-success');
    if (success) {
      success.hidden = false;
      success.innerHTML =
        '<strong>Upit je sačuvan.</strong> Otvaramo WhatsApp — pošaljite poruku da potvrdite termin. ' +
        '<a href="' +
        whatsappUrl(tekst) +
        '" target="_blank" rel="noopener">Kliknite ovde ako se WhatsApp ne otvori</a>.';
    }

    window.open(whatsappUrl(tekst), '_blank', 'noopener');
    e.target.reset();
  };

  document.addEventListener('DOMContentLoaded', function () {
    try {
      injectSchema();
      setHeroBackground();
      setAboutImage();
      renderWhyUs();
      renderReviews();
      renderGallery();
      renderContactPage();
      bindDynamicLinks();
      expandServiceSelect();
      initStarPicker();
      initLightbox();
    } catch (err) {
      console.error('BG Auto Spa init:', err);
      renderReviews();
    }
  });

  function initStarPicker() {
    const hidden = el('rev-stars');
    if (!hidden) return;
    document.querySelectorAll('.star-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const val = btn.getAttribute('data-value');
        hidden.value = val;
        document.querySelectorAll('.star-btn').forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');
      });
    });
    const fifth = document.querySelector('.star-btn[data-value="5"]');
    if (fifth) fifth.classList.add('active');
  }
})();
