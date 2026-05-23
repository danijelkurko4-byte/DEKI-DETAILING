/**
 * BG Auto Spa — podesi podatke ovde (telefon, adresa, WhatsApp).
 * Posle deploy-a na Render, uploaduj ceo folder.
 */
const SITE = {
  name: 'BG Auto Spa',
  tagline: 'Detailing studio',
  description:
    'Detailing i poliranje vozila u Mirijevu, Beograd. Dubinsko pranje, keramička zaštita, poliranje laka i lakiranje kočnica.',
  siteUrl: 'https://bg-auto-spa.onrender.com/',
  phone: '+381 692293200',
  whatsapp: '381692293200',
  address: 'Mirijevo, Beograd',
  addressDetail: 'Mirijevo, Beograd',
  mapsLink: 'https://www.google.com/maps/search/?api=1&query=Mirijevo+Beograd+detailing',
  mapsEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2830.2!2d20.52!3d44.82!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475a7%3A0x0!2zTWlyaWpldm8!5e0!3m2!1ssr!2srs!4v1',
  instagram: 'https://www.instagram.com/bg.auto.spa/',
  instagramHandle: '@bg.auto.spa',
  hours: [
    { days: 'Pon – Pet', time: '09:00 – 19:00' },
    { days: 'Subota', time: '09:00 – 16:00' },
    { days: 'Nedelja', time: 'Po dogovoru' },
  ],
  heroImage: 'gallery/hero.jpg',
  heroFallback:
    'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1600&q=80',
  aboutImage: 'gallery/about.jpg',
  aboutFallback:
    'https://images.unsplash.com/photo-1605515298946-d062f2e9da53?auto=format&fit=crop&w=1200&q=80',
  ogImage: 'logo.png',
  gallery: [
    { src: 'gallery/1.jpg', alt: 'Poliranje automobila — pre/posle', label: 'Poliranje' },
    { src: 'gallery/2.jpg', alt: 'Dubinsko pranje enterijera', label: 'Enterijer' },
    { src: 'gallery/3.jpg', alt: 'Keramička zaštita laka', label: 'Keramika' },
    { src: 'gallery/4.jpg', alt: 'Detailing sportskog automobila', label: 'Sportski auto' },
    { src: 'gallery/5.jpg', alt: 'Moto detailing', label: 'Moto' },
    { src: 'gallery/6.jpg', alt: 'Showroom finish', label: 'Finish' },
  ],
  whyUs: [
    {
      title: 'Pažljiv rad',
      text: 'Svako vozilo tretiramo individualno — bez žurbe i prečica.',
    },
    {
      title: 'Premium proizvodi',
      text: 'Profesionalna hemija i zaštite za dugotrajan sjaj i zaštitu laka.',
    },
    {
      title: 'Auto i moto',
      text: 'Kompletni paketi za automobile i motocikle — jasan cenovnik.',
    },
    {
      title: 'Lokalno u Mirijevu',
      text: 'Brza komunikacija, dogovor termina i ličan pristup klijentu.',
    },
  ],
  reviews: [
    {
      name: 'Marko P.',
      text: 'Radio sam premium paket na Audi A4 — auto izgleda kao iz salona. Poliranje, keramika, felne i pragovi besprekorno sjaje. Vredi svaki dinar.',
      stars: 5,
    },
    {
      name: 'Jelena S.',
      text: 'Dubinsko pranje enterijera na Škodi Octaviji posle dece i psa. Nisam verovala da može ovako da izgleda — sve miriše sveže, a sedišta su kao nova.',
      stars: 5,
    },
    {
      name: 'Stefan M.',
      text: 'Keramička zaštita na BMW-u 320d. Prošla su tri meseca, a auto i dalje izgleda kao da je tek izašao iz studija. Dogovor i komunikacija bez zamerke.',
      stars: 5,
    },
    {
      name: 'Nikola K.',
      text: 'Poliranje laka na VW Golfu 7. Uklonjene su ogrebotine koje sam godinama video na suncu — svi me pitaju gde sam radio auto.',
      stars: 5,
    },
    {
      name: 'Ana R.',
      text: 'Standard program na Mercedesu C-klase. Auto je sjajan i uredan, rad malo duži nego što smo dogovorili, ali kvalitet u potpunosti opravdava čekanje.',
      stars: 4,
    },
    {
      name: 'Dejan V.',
      text: 'Dubinsko pranje Ford Mondea karavana — enterijer čist, tepisi kao novi. Cena je fer za ono što dobiješ.',
      stars: 4,
    },
    {
      name: 'Miloš T.',
      text: 'Lakiranje kočnica i spoljašnje pranje na Opelu Astru. Vozilo izgleda urednije, felne mnogo lepše — vraćam se na pun detailing.',
      stars: 4,
    },
    {
      name: 'Ivana Đ.',
      text: 'Moto detailing na Yamahi MT-07. Rezervoar i felne sjaje, lanac temeljno očišćen. Odličan odnos cene i kvaliteta; termin je mogao biti nešto raniji.',
      stars: 4,
    },
    {
      name: 'Petar L.',
      text: 'Basic program na Peugeotu 308 — solidan posao za ovu cenu, lak znatno lepše izgleda. Jedino bih voleo još malo detaljnije čišćenje stakala iznutra.',
      stars: 4,
    },
    {
      name: 'Tamara N.',
      text: 'Dubinsko pranje i impregnacija na Toyota Corolli. Enterijer odličan, plastike lepo matirane. Jedino mi je prvi put bilo malo teže da nađem parking.',
      stars: 4,
    },
    {
      name: 'Goran Š.',
      text: 'Pranje podvozja i spoljašnji detailing na Renaultu Megane. Sve uredno, više nema onog prljavog izgleda odozdo — potpuno zadovoljan.',
      stars: 4,
    },
    {
      name: 'Luka B.',
      text: 'Poliranje i keramika na Kia Sportage-u. Sjaj i dalje drži, auto lepše izgleda nego kad sam ga kupio. Termin je jednom pomeren, ali su me na vreme obavestili.',
      stars: 4,
    },
    {
      name: 'Maja K.',
      text: 'Dubinsko pranje Honda Civica — sedišta, tepisi i plafon odlično urađeni. Za prvu posetu baš dobar utisak; sledeći put idem na premium paket.',
      stars: 4,
    },
    {
      name: 'Nemanja D.',
      text: 'Lakiranje kočnica na Audi A3 Sportback. Klešta crna, sportski izgled — brzo urađeno i poštena cena. Preporučujem uz detaljno pranje felni.',
      stars: 4,
    },
  ],
};

const STORAGE_KEY = 'bg_auto_spa_upiti';
const SETTINGS_KEY = 'bg_auto_spa_settings';
const REVIEWS_PENDING_KEY = 'bg_auto_spa_reviews_pending';
const REVIEWS_APPROVED_KEY = 'bg_auto_spa_reviews_approved';
const REVIEWS_SEEDED_KEY = 'bg_auto_spa_reviews_seeded';
const REVIEWS_TEXT_VERSION = 'sr-v2';

function readJsonStorage(key, fallback) {
  if (typeof localStorage === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function writeJsonStorage(key, data) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

function mapSeedReviews() {
  return (SITE.reviews || []).map(function (r, i) {
    return {
      id: 'seed-' + i,
      date: new Date().toLocaleDateString('sr-RS'),
      name: r.name,
      text: r.text,
      stars: r.stars,
      vozilo: '',
      usluga: '',
      seeded: true,
    };
  });
}

function seedReviewsIfNeeded() {
  if (typeof localStorage === 'undefined') return;

  const textVersion = localStorage.getItem('bg_auto_spa_reviews_text_version');
  const approved = readJsonStorage(REVIEWS_APPROVED_KEY, []);
  const onlySeeded =
    approved.length > 0 && approved.every(function (r) {
      return r.seeded;
    });

  if (textVersion !== REVIEWS_TEXT_VERSION && (onlySeeded || !localStorage.getItem(REVIEWS_SEEDED_KEY))) {
    writeJsonStorage(REVIEWS_APPROVED_KEY, mapSeedReviews());
    localStorage.setItem(REVIEWS_SEEDED_KEY, '1');
    localStorage.setItem('bg_auto_spa_reviews_text_version', REVIEWS_TEXT_VERSION);
    return;
  }

  if (localStorage.getItem(REVIEWS_SEEDED_KEY)) return;

  writeJsonStorage(REVIEWS_APPROVED_KEY, mapSeedReviews());
  localStorage.setItem(REVIEWS_SEEDED_KEY, '1');
  localStorage.setItem('bg_auto_spa_reviews_text_version', REVIEWS_TEXT_VERSION);
}

function getPendingReviews() {
  return readJsonStorage(REVIEWS_PENDING_KEY, []);
}

function getApprovedReviews() {
  seedReviewsIfNeeded();
  return readJsonStorage(REVIEWS_APPROVED_KEY, []);
}

function getPublishedReviews() {
  return getApprovedReviews()
    .slice()
    .sort(function (a, b) {
      return Number(b.id) - Number(a.id);
    });
}

function formatReviewDisplayText(review) {
  const parts = [];
  if (review.usluga) parts.push(review.usluga);
  if (review.vozilo) parts.push(review.vozilo);
  if (parts.length && review.text && review.text.indexOf(parts[0]) === -1) {
    return parts.join(' — ') + ' — ' + review.text;
  }
  return review.text || '';
}

function submitClientReview(data) {
  const name = String(data.name || '').trim();
  const text = String(data.text || '').trim();
  const vozilo = String(data.vozilo || '').trim();
  const usluga = String(data.usluga || '').trim();
  const stars = Math.min(5, Math.max(1, Number(data.stars) || 5));

  if (!name) {
    return { ok: false, error: 'Unesite ime (može inicijali, npr. Marko P.).' };
  }
  if (text.length < 10) {
    return { ok: false, error: 'Komentar mora imati najmanje 10 karaktera.' };
  }

  const pending = getPendingReviews();
  pending.unshift({
    id: Date.now(),
    date: new Date().toLocaleDateString('sr-RS'),
    name: name,
    vozilo: vozilo,
    usluga: usluga,
    text: text,
    stars: stars,
  });
  writeJsonStorage(REVIEWS_PENDING_KEY, pending);
  return { ok: true };
}

function approveClientReview(id) {
  const pending = getPendingReviews();
  const idx = pending.findIndex(function (r) {
    return r.id === id;
  });
  if (idx === -1) return false;

  const item = pending.splice(idx, 1)[0];
  const approved = getApprovedReviews();
  approved.unshift(item);
  writeJsonStorage(REVIEWS_PENDING_KEY, pending);
  writeJsonStorage(REVIEWS_APPROVED_KEY, approved);
  return true;
}

function rejectClientReview(id) {
  const pending = getPendingReviews().filter(function (r) {
    return r.id !== id;
  });
  writeJsonStorage(REVIEWS_PENDING_KEY, pending);
  return true;
}

function deletePublishedReview(id) {
  const approved = getApprovedReviews().filter(function (r) {
    return r.id !== id;
  });
  writeJsonStorage(REVIEWS_APPROVED_KEY, approved);
  return true;
}

function getSiteConfig() {
  const base = {
    ...SITE,
    reviews: SITE.reviews ? SITE.reviews.slice() : [],
    whyUs: SITE.whyUs ? SITE.whyUs.slice() : [],
    gallery: SITE.gallery ? SITE.gallery.slice() : [],
    hours: SITE.hours ? SITE.hours.slice() : [],
  };
  const allowed = [
    'name',
    'tagline',
    'description',
    'siteUrl',
    'phone',
    'whatsapp',
    'address',
    'addressDetail',
    'mapsLink',
    'mapsEmbed',
    'instagram',
    'instagramHandle',
  ];
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      allowed.forEach(function (key) {
        if (parsed[key] != null && parsed[key] !== '') {
          base[key] = parsed[key];
        }
      });
    }
  } catch (e) {
    /* ignore */
  }
  return base;
}

if (typeof module !== 'undefined') {
  module.exports = {
    SITE,
    getSiteConfig,
    STORAGE_KEY,
    SETTINGS_KEY,
    getPublishedReviews,
    submitClientReview,
    approveClientReview,
    rejectClientReview,
    deletePublishedReview,
    getPendingReviews,
  };
}
