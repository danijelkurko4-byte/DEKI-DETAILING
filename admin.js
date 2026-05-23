const STORAGE_KEY = 'bg_auto_spa_upiti';
const SETTINGS_KEY = 'bg_auto_spa_settings';

let inquiries = [];
let pendingReviews = [];
let approvedReviews = [];
let useSupabase = false;

function sb() {
  return typeof BgSupabase !== 'undefined' ? BgSupabase : null;
}

function setDbStatus(text, kind) {
  const el = document.getElementById('db-status');
  if (!el) return;
  el.textContent = text;
  el.className = 'db-status' + (kind ? ' ' + kind : '');
}

function showLogin(show) {
  const screen = document.getElementById('login-screen');
  if (screen) screen.classList.toggle('hidden', !show);
}

async function adminLogin(e) {
  e.preventDefault();
  const errEl = document.getElementById('login-error');
  errEl.style.display = 'none';

  if (!isSupabaseConfigured()) {
    errEl.textContent = 'Popuni url i anonKey u supabase-config.js';
    errEl.style.display = 'block';
    return;
  }

  const email = document.getElementById('admin-email').value.trim();
  const password = document.getElementById('admin-pass').value;
  const result = await sb().signInAdmin(email, password);
  if (!result.ok) {
    errEl.textContent = result.error;
    errEl.style.display = 'block';
    return;
  }
  showLogin(false);
  await loadAllData();
}

async function adminLogout() {
  if (useSupabase && sb()) await sb().signOutAdmin();
  showLogin(true);
}

async function initAdmin() {
  useSupabase = isSupabaseConfigured();

  if (!useSupabase) {
    setDbStatus('Supabase nije podešen — radi samo localStorage na ovom računaru.', 'warn');
    document.getElementById('login-hint').textContent =
      'Bez Supabase-a admin radi lokalno. Za online upite popuni supabase-config.js.';
    showLogin(false);
    inquiries = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    loadSettingsForm();
    renderAll();
    return;
  }

  setDbStatus('Supabase uključen — uloguj se admin nalogom.', '');
  const session = await sb().getAdminSession();
  if (session) {
    showLogin(false);
    setDbStatus('Povezano: ' + (session.user.email || 'admin'), '');
    await loadAllData();
  } else {
    showLogin(true);
  }
}

async function loadAllData() {
  if (useSupabase) {
    try {
      inquiries = (await sb().fetchInquiries()) || [];
      pendingReviews = (await sb().fetchReviewsByStatus('pending')) || [];
      approvedReviews = (await sb().fetchReviewsByStatus('approved')) || [];
      if (typeof SITE !== 'undefined' && SITE.reviews) {
        await sb().seedReviewsIfEmpty(SITE.reviews);
        approvedReviews = (await sb().fetchReviewsByStatus('approved')) || [];
      }
      const remote = await sb().fetchSiteSettings();
      if (remote && Object.keys(remote).length) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(remote));
      }
    } catch (err) {
      console.error(err);
      alert('Greška pri učitavanju iz Supabase: ' + (err.message || err));
      inquiries = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    }
  } else {
    inquiries = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }
  loadSettingsForm();
  renderAll();
}

function loadSettingsForm() {
  const c = getSiteConfig();
  document.getElementById('set-name').value = c.name || '';
  document.getElementById('set-address').value = c.address || '';
  document.getElementById('set-address-detail').value = c.addressDetail || '';
  document.getElementById('set-phone').value = c.phone || '';
  document.getElementById('set-whatsapp').value = c.whatsapp || '';
  document.getElementById('set-instagram').value = c.instagram || '';
  document.getElementById('set-site-url').value = c.siteUrl || '';
}

async function saveSettings() {
  const data = {
    name: document.getElementById('set-name').value.trim(),
    address: document.getElementById('set-address').value.trim(),
    addressDetail: document.getElementById('set-address-detail').value.trim(),
    phone: document.getElementById('set-phone').value.trim(),
    whatsapp: document.getElementById('set-whatsapp').value.trim().replace(/\D/g, ''),
    instagram: document.getElementById('set-instagram').value.trim(),
    siteUrl: document.getElementById('set-site-url').value.trim(),
  };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
  if (useSupabase && sb()) {
    const res = await sb().saveSiteSettings(data);
    if (!res.ok) {
      alert('Local sačuvano, ali Supabase greška: ' + res.error);
      return;
    }
  }
  const m = document.getElementById('settings-msg');
  m.style.display = 'block';
  setTimeout(function () {
    m.style.display = 'none';
  }, 2500);
}

function starsHtml(n) {
  n = Math.min(5, Math.max(0, Number(n) || 0));
  return '<span class="stars-inline">' + '★'.repeat(n) + '☆'.repeat(5 - n) + '</span>';
}

function reviewMeta(r) {
  const p = [];
  if (r.usluga) p.push(r.usluga);
  if (r.vozilo) p.push(r.vozilo);
  return p.join(' · ') || '—';
}

function reviewText(r) {
  return typeof formatReviewDisplayText === 'function' ? formatReviewDisplayText(r) : r.text;
}

function renderPendingReviews() {
  const list = useSupabase ? pendingReviews : getPendingReviews();
  pendingReviewsTable.innerHTML = list.length
    ? list
        .map(function (r) {
          return (
            '<tr><td>' +
            r.date +
            '</td><td>' +
            r.name +
            '</td><td>' +
            starsHtml(r.stars) +
            '</td><td>' +
            reviewMeta(r) +
            '</td><td>' +
            r.text +
            '</td><td><div class="table-actions"><button class="small-btn approve" onclick="approveReview(' +
            r.id +
            ')">Odobri</button><button class="small-btn reject" onclick="rejectReview(' +
            r.id +
            ')">Odbij</button></div></td></tr>'
          );
        })
        .join('')
    : '<tr><td colspan="6">Nema recenzija na čekanju.</td></tr>';
}

function renderApprovedReviews() {
  const list = useSupabase ? approvedReviews : getApprovedReviews();
  approvedReviewsTable.innerHTML = list.length
    ? list
        .map(function (r) {
          return (
            '<tr><td>' +
            r.date +
            '</td><td>' +
            r.name +
            '</td><td>' +
            starsHtml(r.stars) +
            '</td><td>' +
            reviewText(r) +
            '</td><td><div class="table-actions"><button class="small-btn reject" onclick="removeReview(' +
            r.id +
            ')">Ukloni sa sajta</button></div></td></tr>'
          );
        })
        .join('')
    : '<tr><td colspan="5">Nema objavljenih recenzija.</td></tr>';
}

async function approveReview(id) {
  if (useSupabase && sb()) {
    const res = await sb().setReviewStatus(id, 'approved');
    if (!res.ok) {
      alert(res.error);
      return;
    }
    await loadAllData();
    alert('Recenzija je odobrena i vidljiva na sajtu.');
    return;
  }
  if (approveClientReview(id)) {
    renderReviewPanels();
    alert('Recenzija je odobrena i vidljiva na sajtu.');
  }
}

async function rejectReview(id) {
  if (!confirm('Odbijati ovu recenziju?')) return;
  if (useSupabase && sb()) {
    await sb().deleteReviewById(id);
    await loadAllData();
    return;
  }
  rejectClientReview(id);
  renderReviewPanels();
}

async function removeReview(id) {
  if (!confirm('Ukloniti recenziju sa sajta?')) return;
  if (useSupabase && sb()) {
    await sb().deleteReviewById(id);
    await loadAllData();
    return;
  }
  deletePublishedReview(id);
  renderReviewPanels();
}

function renderReviewPanels() {
  renderPendingReviews();
  renderApprovedReviews();
  const n = useSupabase ? pendingReviews.length : getPendingReviews().length;
  statRecPending.textContent = n;
  const b = document.getElementById('pendingBadge');
  if (n > 0) {
    b.style.display = 'inline';
    b.textContent = n;
  } else {
    b.style.display = 'none';
  }
}

async function saveData() {
  if (!useSupabase) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inquiries));
  }
  renderAll();
}

function openPanel(panel, button) {
  document.querySelectorAll('.panel').forEach(function (i) {
    i.classList.remove('active');
  });
  document.getElementById('panel-' + panel).classList.add('active');
  document.querySelectorAll('.menu button').forEach(function (b) {
    b.classList.remove('active');
  });
  if (button) button.classList.add('active');
  document.getElementById('panelTitle').textContent =
    {
      dashboard: 'Dashboard',
      upiti: 'Upiti klijenata',
      recenzije: 'Recenzije',
      termini: 'Termini',
      cenovnik: 'Cenovnik',
      podesavanja: 'Podešavanja',
    }[panel] || 'Admin Panel';
}

function priceFromService(s) {
  const m = s.match(/(\d+)€/);
  return m ? Number(m[1]) : 0;
}

async function addInquiry(e) {
  e.preventDefault();
  const service = usluga.value;
  const item = {
    id: Date.now(),
    date: new Date().toLocaleDateString('sr-RS'),
    ime: ime.value,
    telefon: telefon.value,
    vozilo: vozilo.value,
    usluga: service,
    status: status.value,
    cena: Number(cena.value || 0) || priceFromService(service),
    napomena: napomena.value,
  };
  if (useSupabase && sb()) {
    const res = await sb().insertInquiry(item);
    if (!res.ok) {
      alert('Greška: ' + res.error);
      return;
    }
    await loadAllData();
  } else {
    inquiries.unshift(item);
    saveData();
  }
  e.target.reset();
}

function statusClass(s) {
  return s.toLowerCase().replace('š', 's').replace('ž', 'z');
}

async function changeStatus(id, newStatus) {
  const item = inquiries.find(function (i) {
    return i.id === id;
  });
  if (!item) return;
  item.status = newStatus;
  if (useSupabase && sb()) {
    const res = await sb().updateInquiry(item);
    if (!res.ok) {
      alert(res.error);
      return;
    }
    await loadAllData();
  } else {
    saveData();
  }
}

async function deleteInquiry(id) {
  if (!confirm('Da li sigurno brišeš ovaj upit?')) return;
  if (useSupabase && sb()) {
    const res = await sb().deleteInquiryById(id);
    if (!res.ok) {
      alert(res.error);
      return;
    }
    await loadAllData();
    return;
  }
  inquiries = inquiries.filter(function (i) {
    return i.id !== id;
  });
  saveData();
}

function renderTable() {
  inquiryTable.innerHTML = inquiries
    .map(function (i) {
      return (
        '<tr><td>' +
        i.date +
        '</td><td>' +
        i.ime +
        '</td><td>' +
        i.telefon +
        '</td><td>' +
        i.vozilo +
        '</td><td>' +
        i.usluga +
        '</td><td>' +
        (i.cena ? i.cena + '€' : '-') +
        '</td><td><span class="status ' +
        statusClass(i.status) +
        '">' +
        i.status +
        '</span></td><td><div class="table-actions"><button class="small-btn" onclick="changeStatus(' +
        i.id +
        ',\'Kontaktiran\')">Kontaktiran</button><button class="small-btn" onclick="changeStatus(' +
        i.id +
        ',\'Zakazano\')">Zakazano</button><button class="small-btn" onclick="changeStatus(' +
        i.id +
        ',\'Završeno\')">Završeno</button><button class="small-btn" onclick="deleteInquiry(' +
        i.id +
        ')">Obriši</button></div></td></tr>'
      );
    })
    .join('');
}

function renderLatest() {
  latestTable.innerHTML = inquiries
    .slice(0, 5)
    .map(function (i) {
      return (
        '<tr><td>' +
        i.ime +
        '</td><td>' +
        i.telefon +
        '</td><td>' +
        i.vozilo +
        '</td><td>' +
        i.usluga +
        '</td><td><span class="status ' +
        statusClass(i.status) +
        '">' +
        i.status +
        '</span></td></tr>'
      );
    })
    .join('');
}

function renderAppointments() {
  appointmentsTable.innerHTML = inquiries
    .filter(function (i) {
      return i.status === 'Zakazano';
    })
    .map(function (i) {
      return (
        '<tr><td>' +
        i.ime +
        '</td><td>' +
        i.telefon +
        '</td><td>' +
        i.vozilo +
        '</td><td>' +
        i.usluga +
        '</td><td>' +
        (i.napomena || '-') +
        '</td><td><span class="status zakazano">Zakazano</span></td></tr>'
      );
    })
    .join('');
}

function renderStats() {
  const z = inquiries.filter(function (i) {
    return i.status === 'Zakazano';
  }).length;
  const zv = inquiries.filter(function (i) {
    return i.status === 'Završeno';
  }).length;
  const zar = inquiries
    .filter(function (i) {
      return i.status === 'Završeno';
    })
    .reduce(function (s, i) {
      return s + Number(i.cena || 0);
    }, 0);
  statUpiti.textContent = inquiries.length;
  statZakazano.textContent = z;
  statZavrseno.textContent = zv;
  statZarada.textContent = zar + '€';
}

function exportData() {
  const blob = new Blob([JSON.stringify(inquiries, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'bg-auto-spa-upiti.json';
  a.click();
  URL.revokeObjectURL(url);
}

function renderAll() {
  renderTable();
  renderLatest();
  renderAppointments();
  renderStats();
  renderReviewPanels();
}

document.addEventListener('DOMContentLoaded', initAdmin);
