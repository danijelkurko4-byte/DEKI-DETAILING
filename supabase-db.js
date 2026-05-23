(function (global) {
  let client = null;

  function getClient() {
    if (!isSupabaseConfigured()) return null;
    if (client) return client;
    if (typeof supabase === 'undefined' || !supabase.createClient) {
      console.warn('Supabase JS nije učitan.');
      return null;
    }
    client = supabase.createClient(
      SUPABASE_CONFIG.url.trim(),
      SUPABASE_CONFIG.anonKey.trim()
    );
    return client;
  }

  function mapInquiryRow(row) {
    return {
      id: Number(row.id),
      date: row.date || '',
      ime: row.ime || '',
      telefon: row.telefon || '',
      vozilo: row.vozilo || '',
      usluga: row.usluga || '',
      status: row.status || 'Novo',
      cena: Number(row.cena) || 0,
      napomena: row.napomena || '',
    };
  }

  function mapReviewRow(row) {
    return {
      id: Number(row.id),
      date: row.date || '',
      name: row.name || '',
      text: row.text || '',
      stars: Number(row.stars) || 5,
      vozilo: row.vozilo || '',
      usluga: row.usluga || '',
      seeded: !!row.seeded,
      status: row.status,
    };
  }

  async function fetchInquiries() {
    const sb = getClient();
    if (!sb) return null;
    const { data, error } = await sb
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapInquiryRow);
  }

  async function insertInquiry(item) {
    const sb = getClient();
    if (!sb) return { ok: false, error: 'Supabase nije podešen.' };
    const row = {
      id: item.id || Date.now(),
      date: item.date || new Date().toLocaleDateString('sr-RS'),
      ime: item.ime,
      telefon: item.telefon,
      vozilo: item.vozilo || '',
      usluga: item.usluga || '',
      status: item.status || 'Novo',
      cena: item.cena || 0,
      napomena: item.napomena || '',
    };
    const { error } = await sb.from('inquiries').insert(row);
    if (error) return { ok: false, error: error.message };
    return { ok: true, item: mapInquiryRow(row) };
  }

  async function updateInquiry(item) {
    const sb = getClient();
    if (!sb) return { ok: false, error: 'Supabase nije podešen.' };
    const { error } = await sb
      .from('inquiries')
      .update({
        status: item.status,
        cena: item.cena,
        napomena: item.napomena,
        usluga: item.usluga,
        vozilo: item.vozilo,
        ime: item.ime,
        telefon: item.telefon,
        date: item.date,
      })
      .eq('id', item.id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }

  async function deleteInquiryById(id) {
    const sb = getClient();
    if (!sb) return { ok: false, error: 'Supabase nije podešen.' };
    const { error } = await sb.from('inquiries').delete().eq('id', id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }

  async function fetchReviewsByStatus(status) {
    const sb = getClient();
    if (!sb) return null;
    const { data, error } = await sb
      .from('reviews')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapReviewRow);
  }

  async function insertPendingReview(review) {
    const sb = getClient();
    if (!sb) return { ok: false, error: 'Supabase nije podešen.' };
    const row = {
      id: review.id || Date.now(),
      date: review.date || new Date().toLocaleDateString('sr-RS'),
      name: review.name,
      text: review.text,
      stars: review.stars,
      vozilo: review.vozilo || '',
      usluga: review.usluga || '',
      status: 'pending',
      seeded: false,
    };
    const { error } = await sb.from('reviews').insert(row);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }

  async function setReviewStatus(id, status) {
    const sb = getClient();
    if (!sb) return { ok: false, error: 'Supabase nije podešen.' };
    const { error } = await sb.from('reviews').update({ status: status }).eq('id', id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }

  async function deleteReviewById(id) {
    const sb = getClient();
    if (!sb) return { ok: false, error: 'Supabase nije podešen.' };
    const { error } = await sb.from('reviews').delete().eq('id', id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }

  async function seedReviewsIfEmpty(seedList) {
    const sb = getClient();
    if (!sb || !seedList || !seedList.length) return;
    const { count, error: countErr } = await sb
      .from('reviews')
      .select('*', { count: 'exact', head: true });
    if (countErr) throw countErr;
    if (count > 0) return;

    const rows = seedList.map(function (r, i) {
      return {
        id: Date.now() + i,
        date: new Date().toLocaleDateString('sr-RS'),
        name: r.name,
        text: r.text,
        stars: r.stars || 5,
        vozilo: '',
        usluga: '',
        status: 'approved',
        seeded: true,
      };
    });
    const { error } = await sb.from('reviews').insert(rows);
    if (error) throw error;
  }

  async function fetchSiteSettings() {
    const sb = getClient();
    if (!sb) return null;
    const { data, error } = await sb.from('site_settings').select('data').eq('id', 1).maybeSingle();
    if (error) throw error;
    return (data && data.data) || {};
  }

  async function saveSiteSettings(data) {
    const sb = getClient();
    if (!sb) return { ok: false, error: 'Supabase nije podešen.' };
    const { error } = await sb
      .from('site_settings')
      .upsert({ id: 1, data: data, updated_at: new Date().toISOString() });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }

  async function signInAdmin(email, password) {
    const sb = getClient();
    if (!sb) return { ok: false, error: 'Supabase nije podešen.' };
    const { data, error } = await sb.auth.signInWithPassword({ email: email, password: password });
    if (error) return { ok: false, error: error.message };
    return { ok: true, session: data.session };
  }

  async function signOutAdmin() {
    const sb = getClient();
    if (!sb) return;
    await sb.auth.signOut();
  }

  async function getAdminSession() {
    const sb = getClient();
    if (!sb) return null;
    const { data } = await sb.auth.getSession();
    return data.session;
  }

  global.BgSupabase = {
    getClient: getClient,
    fetchInquiries: fetchInquiries,
    insertInquiry: insertInquiry,
    updateInquiry: updateInquiry,
    deleteInquiryById: deleteInquiryById,
    fetchReviewsByStatus: fetchReviewsByStatus,
    insertPendingReview: insertPendingReview,
    setReviewStatus: setReviewStatus,
    deleteReviewById: deleteReviewById,
    seedReviewsIfEmpty: seedReviewsIfEmpty,
    fetchSiteSettings: fetchSiteSettings,
    saveSiteSettings: saveSiteSettings,
    signInAdmin: signInAdmin,
    signOutAdmin: signOutAdmin,
    getAdminSession: getAdminSession,
  };
})(typeof window !== 'undefined' ? window : global);
