'use strict';
/* Wealth Tax Supporters: a static, single-page front end over data/*.json built by scripts/build_site.py. */
const REPO = 'Egalitaristen/wealth-tax-supporters';
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const enc = encodeURIComponent;
const safeUrl = u => /^https?:\/\//i.test(u || '') ? u : '';
const fmt = n => Number(n || 0).toLocaleString('en');
const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const year = d => (d || '').slice(0, 4);
const issueUrl = (title, fields = {}) =>
  `https://github.com/${REPO}/issues/new?template=data-report.yml&title=${enc(title)}` +
  Object.entries(fields).map(([k, v]) => `&${k}=${enc(v)}`).join('');
const DISCORD = 'https://discord.gg/yCjEK47aeh';
// The site's own suggestion form (no account needed), prefilled with a country and place where known.
const suggestUrl = (fields = {}) => '/suggest' + (Object.keys(fields).length ? '?' + new URLSearchParams(fields) : '');
const githubSuggestUrl = (fields = {}) =>
  `https://github.com/${REPO}/issues/new?template=suggest-supporter.yml` + Object.entries(fields).map(([k, v]) => `&${k}=${enc(v)}`).join('');
const ext = (href, text, cls = '') => `<a class="${cls}" href="${esc(href)}" target="_blank" rel="noopener noreferrer nofollow">${text}</a>`;

const TYPE = {politician: 'Politician', party: 'Party', government_body: 'Council or public body', academic: 'Academic', economist: 'Economist', think_tank: 'Think tank', ngo_campaign: 'Campaign group', union: 'Union', union_official: 'Union official', journalist: 'Commentator', media_outlet: 'Media outlet', legal_tax_professional: 'Legal or tax expert', wealthy_individual: 'Wealthy individual', business_leader: 'Business leader', faith: 'Faith leader or body', cultural_figure: 'Cultural figure', campaigner: 'Campaigner', international_body: 'International body', funder: 'Funder'};
const TYPES_PL = {politician: 'Politicians', party: 'Parties', government_body: 'Councils and bodies', academic: 'Academics', economist: 'Economists', think_tank: 'Think tanks', ngo_campaign: 'Campaign groups', union: 'Unions', union_official: 'Union officials', journalist: 'Commentators', media_outlet: 'Media outlets', legal_tax_professional: 'Legal and tax experts', wealthy_individual: 'Wealthy individuals', business_leader: 'Business leaders', faith: 'Faith', cultural_figure: 'Cultural figures', campaigner: 'Campaigners', international_body: 'International bodies', funder: 'Funders'};
const DES = {annual_net_wealth: 'Annual net wealth tax', one_off_levy: 'One-off wealth levy', billionaire_minimum: 'Billionaire minimum tax', unrealised_gains: 'Tax on unrealised gains', exit_tax: 'Exit tax', partial_wealth: 'Partial wealth tax', defend_existing: 'Keep an existing wealth tax', wealth_tax_unspecified: 'A wealth tax, design open'};
const EVT = {open_letter: 'Open letter', motion_signature: 'Signed a motion', motion: 'Motion', vote: 'Vote', campaign: 'Campaign', op_ed: 'Op-ed', editorial: 'Editorial', speech: 'Speech', statement: 'Statement', policy_adoption: 'Adopted policy', publication: 'Publication', report: 'Report', funding: 'Funding', coalition_membership: 'Coalition member', interview: 'Interview', manifesto: 'Manifesto', bill_sponsorship: 'Bill sponsor', testimony: 'Testimony', social_post: 'Social post', petition: 'Petition', other: 'Other'};
const PLAT = {official_page: 'Official page', website: 'Website', x: 'X', bluesky: 'Bluesky', mastodon: 'Mastodon', instagram: 'Instagram', facebook: 'Facebook', youtube: 'YouTube', tiktok: 'TikTok', linkedin: 'LinkedIn', substack: 'Substack', wikipedia: 'Wikipedia'};
const GRADE = {A: 'Explicit', B: 'Named', C: 'Implied'};
const GRADE_LONG = {A: 'Explicit support: a formal act or a specific proposal', B: 'Named support for a wealth tax', C: 'Implied support, read from context'};
const LEVEL = {national: 'National', regional: 'Regional', local: 'Local', supranational: 'International'};
// Public opinion polls from meta.json: [{support, support_text, oppose, scope, question, pollster, commissioned_by, published, url, ...}]
const pollFig = p => p.support_text || `${p.support}%`;
const pollDate = d => { const [y, m] = String(d || '').split('-'); return m ? new Date(+y, +m - 1, 1).toLocaleString('en', {month: 'short', year: 'numeric'}) : (y || ''); };
const pollSource = p => [p.pollster, p.commissioned_by ? `for ${p.commissioned_by}` : '', pollDate(p.published)].filter(Boolean).join(', ');
const glyph = g => `<i class="g ${esc(g)}" title="${esc(GRADE_LONG[g] || '')}"></i>`;
const label = (map, k) => map[k] || String(k || '').replace(/_/g, ' ').replace(/^./, c => c.toUpperCase());
// People rows from build_site.py
const P_ = {id: 0, name: 1, kind: 2, type: 3, role: 4, aff: 5, level: 6, loc: 7, grade: 8, n: 9, first: 10, last: 11, des: 12, notes: 13, web: 14, party: 15, other: 16, prof: 17, qid: 18};
const E_ = {actor: 0, date: 1, grade: 2, type: 3, des: 4, detail: 5, quote: 6, url: 7, title: 8, pub: 9, archive: 10, id: 11};

// ---------- data ----------
const cache = {};
const getJSON = url => cache[url] || (cache[url] = fetch(url).then(r => { if (!r.ok) throw new Error(r.status + ' ' + url); return r.json(); }));
const WORLD = () => getJSON('/data/world.json');
const INDEX = () => getJSON('/data/index.json');
const prepared = {};
function loadCountry(slug) {
  return prepared[slug] || (prepared[slug] = getJSON(`/data/${slug}.json`).then(D => {
    D.byId = Object.fromEntries(D.P.map(p => [p[P_.id], p]));
    // C[8] is an index into UP, the parent's place path; rebuild the unit's own path from it.
    if (D.UP) D.C.forEach(c => { if (typeof c[8] === 'number') c[8] = (D.UP[c[8]] ? D.UP[c[8]] + ' > ' : '') + c[0]; });
    D.evBy = {};
    D.E.forEach(e => (D.evBy[e[E_.actor]] = D.evBy[e[E_.actor]] || []).push(e));
    // Every place that can be selected: map units (C) and unmapped units with people (O).
    D.places = [
      ...D.C.map(c => ({name: c[0], path: c[8], ids: c[6], state: c[2], sweep: c[3], notes: c[5], mapped: true})),
      ...D.O.map(o => ({name: o[0], path: o[5], ids: o[4], state: 'support', sweep: o[2], notes: o[3], mapped: false}))];
    // The list of places to browse: every area and every region above it, counting everyone inside.
    // Built in one pass with maps: a commune map has tens of thousands of places.
    const own = new Map(), agg = new Map();
    D.places.forEach(pl => {
      own.set(pl.path, pl);
      const parts = pl.path.split(' > ');
      for (let i = 1; i < parts.length; i++) {
        const path = parts.slice(0, i + 1).join(' > ');
        const a = agg.get(path) || agg.set(path, {ids: new Set(), mapped: false}).get(path);
        pl.ids.forEach(x => a.ids.add(x));
        if (pl.mapped) a.mapped = true;
      }
    });
    D.placeList = [...agg].map(([path, a]) => { const o = own.get(path);
      return {path, name: path.split(' > ').pop(), n: a.ids.size, state: o ? o.state : 'support', notes: o ? o.notes : '', mapped: a.mapped}; });
    // A city-state is both a region and its only area (Berlin in Berlin): list it once.
    const byPath = new Map(D.placeList.map(p => [p.path, p]));
    D.placeList = D.placeList.filter(pl => { const parts = pl.path.split(' > '), parent = byPath.get(parts.slice(0, -1).join(' > '));
      return !(parent && parts.length > 2 && parts[parts.length - 1] === parts[parts.length - 2] && parent.n === pl.n) || !pl.mapped; });
    const root = D.places.find(pl => !pl.path.includes(' > '));
    D.nationalOnly = root ? root.ids.length : 0;
    return D;
  }));
}
function idsForPlace(D, path) {
  const out = new Set();
  D.places.forEach(pl => { if (pl.path === path || pl.path.startsWith(path + ' > ')) pl.ids.forEach(i => out.add(i)); });
  return out;
}
const rank = p => ({A: 0, B: 1, C: 2}[p[P_.grade]] ?? 3);
const byStrength = (a, b) => rank(a) - rank(b) || b[P_.n] - a[P_.n] || (b[P_.last] || '').localeCompare(a[P_.last] || '') || a[P_.name].localeCompare(b[P_.name]);
const placeShort = loc => { const p = (loc || '').split('>').map(s => s.trim()).filter(Boolean); return p.length > 1 ? p.slice(-2).join(', ') : (p[0] || ''); };

// ---------- routing ----------
const main = $('#main');
let leaving = () => {};
function go(url, {replace = false} = {}) {
  history[replace ? 'replaceState' : 'pushState'](null, '', url);
  render(true);
}
document.addEventListener('click', e => {
  const a = e.target.closest('a[href]');
  if (!a || a.target || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const u = new URL(a.href, location.href);
  if (u.origin !== location.origin || /^\/(data|download)\//.test(u.pathname) || a.hasAttribute('download')) return;
  e.preventDefault();
  closePalette();
  if (u.pathname === location.pathname && u.search === location.search) {
    if (u.hash) { history.replaceState(null, '', u.hash); scrollToHash(); } else window.scrollTo({top: 0});
    return;
  }
  go(u.pathname + u.search + u.hash);
});
window.addEventListener('popstate', () => render(false));
function scrollToHash() {
  const el = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (el) el.scrollIntoView({block: 'start'});
}
async function render(fresh) {
  leaving(); leaving = () => {};
  const parts = location.pathname.split('/').filter(Boolean).map(decodeURIComponent);
  const params = new URLSearchParams(location.search);
  $$('.nav a').forEach(a => a.removeAttribute('aria-current'));
  try {
    const W = await WORLD();
    $('#built').textContent = `Data built ${W.built} · ${W.countries.length} countries · ${fmt(W.countries.reduce((n, c) => n + c.supporters, 0))} supporters`;
    const country = W.countries.find(c => c.slug === (parts[0] || '').toLowerCase());
    if (!parts.length) await home(W);
    else if (parts[0] === 'about' && parts.length === 1) aboutPage(W);
    else if (parts[0] === 'contribute' && parts.length === 1) contributePage(W);
    else if (parts[0] === 'suggest' && parts.length === 1) suggestPage(W, params);
    else if (country && parts.length === 1) await countryPage(country.slug, params);
    else if (country && parts.length === 2 && SECTIONS[parts[1]]) await countryPage(country.slug, params, parts[1]);
    else if (country && parts.length === 2) await personPage(country.slug, parts[1]);
    else notFound();
    const navKey = {about: '/about', contribute: '/contribute', suggest: '/suggest'}[parts[0]] || null;
    if (navKey) $$('.nav a').forEach(a => { if (a.getAttribute('href') === navKey) a.setAttribute('aria-current', 'page'); });
  } catch (err) {
    console.error(err);
    main.innerHTML = `<div class="wrap page-head"><div class="kicker">Something went wrong</div><h1>Could not load the data.</h1>
      <p class="lede" style="margin-top:20px">Try reloading the page. If you opened the file directly, serve the built site instead: <code>python scripts/serve.py</code>.</p></div>`;
  }
  if (location.hash) requestAnimationFrame(scrollToHash);
  else if (fresh) window.scrollTo({top: 0});
}
function setTitle(t) { document.title = t ? `${t} · Wealth Tax Supporters` : 'Wealth Tax Supporters: who backs a wealth tax near you?'; }
function notFound() {
  setTitle('Not found');
  main.innerHTML = `<div class="wrap page-head fade"><div class="kicker">404</div><h1>Nothing <em>here.</em></h1>
    <p class="lede" style="margin:22px 0 28px">This page does not exist, or the entry has moved. Try searching for the person, organisation or place.</p>
    <p><a class="btn" href="/">Back to the start</a></p></div><div style="height:80px"></div>`;
}

// ---------- search ----------
let SEARCH = null;
async function searchData() {
  if (SEARCH) return SEARCH;
  const [I, W] = await Promise.all([INDEX(), WORLD()]);
  const cname = Object.fromEntries(W.countries.map(c => [c.slug, c.name])), ciso = Object.fromEntries(W.countries.map(c => [c.slug, c.iso2]));
  SEARCH = {
    people: I.people.map(r => ({slug: r[0], id: r[1], name: r[2], type: r[3], role: r[4], place: r[5], grade: r[6], n: r[7],
      nkey: norm(r[2]), key: norm([r[2], r[4], r[5], TYPE[r[3]] || '', TYPES_PL[r[3]] || '', cname[r[0]]].join(' '))})),
    places: I.places.map(r => ({slug: r[0], path: r[1], n: r[2], name: r[1].split(' > ').pop(), key: norm(r[1])})),
    countries: W.countries.map(c => ({slug: c.slug, name: c.name, n: c.supporters, key: norm(c.name + ' ' + c.iso2)})),
    cname, ciso};
  return SEARCH;
}
function runSearch(S, q) {
  const toks = norm(q).trim().split(/\s+/).filter(Boolean);
  if (!toks.length) return null;
  const hit = k => toks.every(t => k.includes(t));
  const countries = S.countries.filter(c => hit(c.key));
  const places = S.places.filter(p => hit(norm(p.name)) || (toks.length > 1 && hit(p.key)))
    .sort((a, b) => (norm(b.name).startsWith(toks[0]) - norm(a.name).startsWith(toks[0])) || b.n - a.n).slice(0, 6);
  const people = S.people.filter(p => hit(p.key)).map(p => {
    let s = 0;
    if (p.nkey.startsWith(toks[0])) s += 4; else if (p.nkey.split(/\s+/).some(w => w.startsWith(toks[0]))) s += 3; else if (hit(p.nkey)) s += 2;
    s += {A: .6, B: .3, C: 0}[p.grade] || 0;
    return [s + Math.min(p.n, 10) / 40, p];
  }).sort((a, b) => b[0] - a[0]).map(x => x[1]);
  return {countries, places, people: people.slice(0, 14), total: people.length};
}
function mark(text, q) {
  const toks = norm(q).trim().split(/\s+/).filter(t => t.length > 1);
  let out = esc(text);
  if (!toks.length) return out;
  const n = norm(text);
  // Highlight the first match of the first token only when lengths line up (no accents changed lengths).
  if (n.length !== text.length) return out;
  const i = n.indexOf(toks[0]);
  if (i < 0) return out;
  return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + toks[0].length)) + '</mark>' + esc(text.slice(i + toks[0].length));
}
function resultsHtml(S, res, q) {
  if (!res) return '';
  const groups = [];
  if (res.countries.length) groups.push(`<div class="rgroup">Countries</div>` + res.countries.map(c =>
    `<a class="ritem" href="/${c.slug}"><span class="rm"><span class="rn">${mark(c.name, q)}</span><span class="rs">${fmt(c.n)} on record so far</span></span><span class="rc">Country</span></a>`).join(''));
  if (res.places.length) groups.push(`<div class="rgroup">Places</div>` + res.places.map(p =>
    `<a class="ritem" href="/${p.slug}?place=${enc(p.path)}"><span class="rm"><span class="rn">${mark(p.name, q)}</span><span class="rs">${esc(p.path)}</span></span><span class="rc">${fmt(p.n)}</span></a>`).join(''));
  if (res.people.length) groups.push(`<div class="rgroup">People and organisations${res.total > res.people.length ? ` · top ${res.people.length} of ${fmt(res.total)}` : ''}</div>` + res.people.map(p =>
    `<a class="ritem" href="/${p.slug}/${enc(p.id)}">${glyph(p.grade)}<span class="rm"><span class="rn">${mark(p.name, q)}</span><span class="rs">${esc([TYPE[p.type], p.role, p.place].filter(Boolean).join(' · '))}</span></span><span class="rc" title="${esc(S.cname[p.slug])}">${esc(S.ciso[p.slug])}</span></a>`).join(''));
  return groups.join('') || `<div class="rempty">No match for “${esc(q)}”. Try a surname, a town, or a type such as “economists”.</div>`;
}
function attachSearch(input, box, {onOpen = () => {}, onClose = () => {}} = {}) {
  let act = -1;
  const items = () => $$('.ritem', box);
  const setAct = i => { const it = items(); act = Math.max(-1, Math.min(it.length - 1, i)); it.forEach((el, j) => el.classList.toggle('act', j === act)); if (it[act]) it[act].scrollIntoView({block: 'nearest'}); };
  const update = async () => {
    const S = await searchData(), q = input.value;
    const res = runSearch(S, q);
    box.innerHTML = resultsHtml(S, res, q);
    box.hidden = !res; act = -1;
    if (res) { setAct(0); onOpen(); } else onClose();
  };
  input.addEventListener('input', update);
  input.addEventListener('focus', () => { if (input.value.trim()) update(); });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setAct(act + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setAct(act - 1); }
    else if (e.key === 'Enter') { const it = items()[act] || items()[0]; if (it) { e.preventDefault(); it.click(); } }
  });
  return update;
}
// The palette opens from the header button or the "/" key.
const pal = $('#palette'), palQ = $('#pal-q'), palRes = $('#pal-res');
function openPalette(q = '') {
  pal.hidden = false; palQ.value = q; palQ.focus();
  if (q) palUpdate(); else palRes.innerHTML = `<div class="rempty">Search ${'people, organisations, places and countries'}. Use ↑ ↓ and Enter.</div>`;
  searchData();
}
function closePalette() { if (!pal.hidden) pal.hidden = true; }
const palUpdate = attachSearch(palQ, palRes, {onClose: () => { palRes.hidden = false; palRes.innerHTML = ''; }});
$('#open-search').addEventListener('click', () => openPalette());
$('#pal-close').addEventListener('click', closePalette);
pal.addEventListener('click', e => { if (e.target === pal) closePalette(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closePalette();
  const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
  if (!typing && (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'))) { e.preventDefault(); openPalette(); }
});

// ---------- theme ----------
const dark = () => document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
$('#theme').addEventListener('click', () => {
  const t = dark() ? 'light' : 'dark';
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem('theme', t); } catch (e) { /* storage blocked: the choice lasts for this page only */ }
  window.dispatchEvent(new Event('themechange'));
});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => window.dispatchEvent(new Event('themechange')));
const css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

// ---------- tooltip ----------
const tip = $('#tip');
function showTip(html, x, y) { tip.innerHTML = html; tip.hidden = false; tip.style.left = x + 'px'; tip.style.top = y + 'px'; }
function hideTip() { tip.hidden = true; }
window.addEventListener('scroll', hideTip, {passive: true});

// ---------- home ----------
async function home(W) {
  setTitle('');
  const cs = W.countries;
  const tot = k => cs.reduce((n, c) => n + (c[k] || 0), 0);
  const latest = cs.map(c => c.updated).sort().pop() || W.built;
  const types = {}, designs = {};
  cs.forEach(c => { Object.entries(c.types || {}).forEach(([k, v]) => types[k] = (types[k] || 0) + v); Object.entries(c.designs || {}).forEach(([k, v]) => designs[k] = (designs[k] || 0) + v); });
  // Interleave featured quotes across countries, one per person.
  const feats = [], used = new Set(), lists = cs.map(c => (c.featured || []).map(f => [c, f]));
  for (let i = 0; feats.length < 6 && lists.some(l => l[i]); i++) lists.forEach(l => {
    if (l[i] && feats.length < 6 && !used.has(norm(l[i][1][1])) && !used.has(norm(l[i][1][4]))) { used.add(norm(l[i][1][1])); used.add(norm(l[i][1][4])); feats.push(l[i]); }
  });
  const bars = (obj, labels, link) => {
    const rows = Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, 9), mx = rows[0] ? rows[0][1] : 1;
    return rows.map(([k, v]) => `<div class="hb"><span>${esc(label(labels, k))}</span><span class="hb-bar"><i style="width:${(v / mx * 100).toFixed(1)}%"></i></span><span class="n">${fmt(v)}</span></div>`).join('');
  };
  const tries = ['Leeds', 'California', 'Stockholm', 'economists', 'unions'];
  main.innerHTML = `
  <section class="wrap hero fade">
    <div class="kicker">An open, sourced register · <b>${cs.length} ${cs.length === 1 ? 'country' : 'countries'} so far</b> · updated ${esc(latest)}</div>
    <div class="hero-grid">
      <div>
        <h1>Who backs a wealth tax <em>near you?</em></h1>
        <p class="lede">${fmt(tot('supporters'))} public figures and organisations on the record, found so far: politicians, economists, unions, campaigners and millionaires. A register of who has said it in public, not a poll. Every name links to the source.</p>
        <div class="big-search">
          <div class="box">
            <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5"/><path d="M13 13l4.5 4.5"/></svg>
            <input id="hq" type="search" placeholder="Search a name, a town, a party…" autocomplete="off" spellcheck="false" aria-label="Search supporters and places">
            <button class="btn" id="hgo" type="button">Search</button>
          </div>
          <div class="drop results" id="hres" hidden></div>
        </div>
        <div class="try">Try ${tries.map(t => `<button class="chip" type="button" data-try="${esc(t)}">${esc(t)}</button>`).join('')}</div>
      </div>
      <div class="hero-side">
        <div class="ledger">
          <div><b>${fmt(tot('supporters'))}</b><span>public figures and organisations found <em>so far</em></span></div>
          <div><b>${fmt(tot('evidence'))}</b><span>sourced statements</span></div>
          <div><b>${fmt(tot('A'))}</b><span>with explicit support</span></div>
          <div><b>${cs.length}</b><span>${cs.length === 1 ? 'country' : 'countries'}, and counting</span></div>
        </div>
      </div>
    </div>
  </section>

  ${cs.some(c => (c.polls || []).length) ? `<section class="sec opinion"><div class="wrap">
    <div class="sec-head"><div><div class="kicker">Public opinion</div><h2>Most people <em>already agree</em></h2></div>
      <p>The register counts who has said it in public. Polls show how many more agree. Each figure is for the design the poll asked about.</p></div>
    <div class="polls home">${cs.filter(c => (c.polls || []).length).map(c => { const p = c.polls[0]; return `<div class="poll">
      <div class="poll-fig"><b>${esc(pollFig(p))}</b><span>${esc(c.name)}</span></div>
      <div class="poll-body"><p>back ${esc(p.question.replace(/^./, x => x.toLowerCase()))}.</p>
        <div class="poll-meta">${ext(p.url, esc(pollSource(p)) + ' ↗')} · <a href="/${c.slug}/method#polls">all polls</a></div></div>
    </div>`; }).join('')}</div>
  </div></section>` : ''}

  <section class="sec" id="countries"><div class="wrap">
    <div class="sec-head"><div><div class="kicker">The map so far</div><h2>Country <em>by</em> country</h2></div>
      <p>Each country is researched separately, from parliaments and councils down to unions and open letters. Pick one to see who is on record there.</p></div>
    <div class="worldmap" id="world">
      <div class="crumb"></div>
      <div class="zoomer"><button type="button" data-z="in" aria-label="Zoom in">+</button><button type="button" data-z="out" aria-label="Zoom out">−</button><button type="button" data-z="fit" aria-label="Show the whole world">⤢</button></div>
    </div>
    <div class="countries">
      ${cs.slice().sort((a, b) => b.supporters - a.supporters).map(c => `
      <a class="crow" href="/${c.slug}">
        <span class="iso">${esc(c.iso2)}</span>
        <span class="nm">${esc(c.name)}</span>
        <span class="st"><b>${fmt(c.supporters)}</b><span>on record so far</span></span>
        <span class="st hide-s"><b>${fmt(c.evidence)}</b><span>statements</span></span>
        <span class="st hide-s"><b>${c.units ? fmt(c.units_with_supporters) + '<span style="color:var(--ink-3);font-weight:400"> / ' + fmt(c.units) + '</span>' : '·'}</b><span>areas with a supporter</span></span>
        <span class="arrow">→</span>
      </a>`).join('')}
      <a class="crow add" href="/contribute"><span class="iso">+</span><span class="nm">Your country next?</span><span class="st hide-s"></span><span class="st hide-s"></span><span class="st"><span class="muted" style="font-size:14px">Start a register</span></span><span class="arrow">→</span></a>
    </div>
  </div></section>

  ${feats.length ? `<section class="sec"><div class="wrap">
    <div class="sec-head"><div><div class="kicker">On the record</div><h2>In their <em>own words</em></h2></div>
      <p>Short extracts from speeches, letters, articles and parliamentary records. Follow the link to read the full source.</p></div>
    <div class="quotes">${feats.map(([c, f]) => `
      <figure class="quote" style="margin:0">
        <blockquote>${esc(f[4])}</blockquote>
        <figcaption class="who"><div><a class="name" href="/${c.slug}/${enc(f[0])}">${esc(f[1])}</a><span>${esc(label(TYPE, f[2]))} · ${esc(c.name)}${f[7] ? ' · ' + esc(year(f[7])) : ''}</span></div>
          ${safeUrl(f[5]) ? ext(f[5], 'Source ↗', 'src') : ''}</figcaption>
      </figure>`).join('')}</div>
  </div></section>` : ''}

  <section class="sec"><div class="wrap">
    <div class="sec-head"><div><div class="kicker">Across every country</div><h2>Who they are, <em>what they back</em></h2></div>
      <p>Supporters by type, and the kinds of wealth tax they have backed. One supporter can back more than one design.</p></div>
    <div class="split">
      <div><div class="kicker" style="margin-bottom:10px">Supporters by type</div><div class="hbars">${bars(types, TYPES_PL)}</div></div>
      <div><div class="kicker" style="margin-bottom:10px">Designs backed</div><div class="hbars">${bars(designs, DES)}</div></div>
    </div>
  </div></section>

  <section class="sec"><div class="wrap">
    <div class="sec-head"><div><div class="kicker">How it works</div><h2>Sourced, graded, <em>open</em></h2></div></div>
    <div class="principles">
      <div><div class="kicker">01</div><h3>Sourced</h3><p>Nobody is listed on opinion or rumour. Each entry rests on a public statement, vote, motion or letter, quoted word for word and linked to where it was said.</p></div>
      <div><div class="kicker">02</div><h3>Graded</h3>
        <div class="grades">${['A', 'B', 'C'].map(g => `<div>${glyph(g)}<span><b>${GRADE[g]}</b> · ${esc(GRADE_LONG[g].split(': ').pop().replace(/^./, c => c.toLowerCase()))}</span></div>`).join('')}</div>
        <p>Only an actual tax on wealth counts. Higher income or capital gains taxes alone do not.</p></div>
      <div><div class="kicker">03</div><h3>Open</h3><p>The data is free to reuse under CC BY 4.0, with CSV downloads for every country. Errors are reported in public on GitHub and fixed in the open.</p><p><a href="/about">Read the method →</a></p></div>
    </div>
  </div></section>

  <section class="wrap" style="padding:8px var(--gut) 40px"><div class="cta">
    <div><div class="kicker" style="color:inherit;opacity:.6">Contribute</div><h2 style="margin-top:12px">Your country isn't <em>on the map</em> yet?</h2>
      <p>Registers are built country by country with an open research workflow. Start one for your country, or help check the entries that are already here.</p></div>
    <div class="acts"><a class="btn" href="/contribute">Start a country</a><a class="btn ghost" href="/about">How it's built</a></div>
  </div></section>`;

  const hq = $('#hq'), hres = $('#hres');
  attachSearch(hq, hres);
  $('#hgo').addEventListener('click', () => { if (hq.value.trim()) { const first = $('.ritem', hres); if (first) first.click(); else hq.focus(); } else hq.focus(); });
  $$('[data-try]').forEach(b => b.addEventListener('click', () => { hq.value = b.dataset.try; hq.dispatchEvent(new Event('input')); hq.focus(); }));
  const outside = e => { if (!e.target.closest('.big-search')) hres.hidden = true; };
  document.addEventListener('click', outside);
  const stopWorld = worldMap($('#world'), W);
  leaving = () => { document.removeEventListener('click', outside); stopWorld(); };
}

// Pan and zoom for any map element. The view is a rectangle [x, y, w, h] in map units and onView draws it.
// Drag pans, the wheel zooms toward the pointer, a double click zooms in; a click without a drag calls onTap.
function panZoom(el, base, {onView, onTap = () => {}, onHover = () => {}, onWheel = () => {}, maxOut = 2, maxIn = 80} = {}) {
  const [bx, by, bw, bh] = base;
  let x = bx, y = by, w = bw, h = bh, anim = 0, drag = null, moved = false;
  const set = () => onView(x, y, w, h);
  const aspect = () => { const r = el.getBoundingClientRect(); return r.width > 2 && r.height > 2 ? r.width / r.height : bw / bh; };
  // The view that shows a box with padding at the element's current aspect ratio.
  function target(tx, ty, tw, th, pad = .08) {
    const a = aspect();
    let nw = tw * (1 + pad * 2), nh = th * (1 + pad * 2);
    if (nw / nh > a) nh = nw / a; else nw = nh * a;
    return [tx + (tw - nw) / 2, ty + (th - nh) / 2, nw, nh];
  }
  function animate(to, done) {
    cancelAnimationFrame(anim);
    const from = [x, y, w, h], t0 = performance.now(), dur = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 480;
    const step = now => {
      const k = dur ? Math.min(1, (now - t0) / dur) : 1, e = 1 - Math.pow(1 - k, 3);
      [x, y, w, h] = from.map((v, i) => v + (to[i] - v) * e); set();
      if (k < 1) anim = requestAnimationFrame(step); else if (done) done();
    };
    anim = requestAnimationFrame(step);
  }
  const fitView = () => target(bx, by, bw, bh, .02);
  const fit = (smooth = true) => { const v = fitView(); if (smooth) animate(v); else { [x, y, w, h] = v; set(); } };
  function zoomAt(f, fx = .5, fy = .5, smooth = true) {
    const nw = Math.min(fitView()[2] * maxOut, Math.max(bw / maxIn, w * f)), nh = h * nw / w;
    const v = [x + (w - nw) * fx, y + (h - nh) * fy, nw, nh];
    if (smooth) animate(v); else { cancelAnimationFrame(anim); [x, y, w, h] = v; set(); }
  }
  const frac = e => { const r = el.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; };
  el.addEventListener('pointerdown', e => { if (e.button) return; drag = {x: e.clientX, y: e.clientY}; moved = false; });
  el.addEventListener('pointermove', e => {
    if (drag) {
      const r = el.getBoundingClientRect(), dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!moved && Math.abs(dx) + Math.abs(dy) > 4) { moved = true; el.setPointerCapture(e.pointerId); el.classList.add('dragging'); }
      if (moved) { cancelAnimationFrame(anim); x -= dx * w / r.width; y -= dy * h / r.height; drag = {x: e.clientX, y: e.clientY}; set(); hideTip(); return; }
    }
    onHover(e);
  });
  el.addEventListener('pointerup', e => { const was = moved; drag = null; moved = false; el.classList.remove('dragging'); if (!was) onTap(e); });
  el.addEventListener('pointercancel', () => { drag = null; moved = false; el.classList.remove('dragging'); });
  el.addEventListener('wheel', e => {
    e.preventDefault(); hideTip();
    const f = Math.exp(Math.max(-1, Math.min(1, e.deltaY * (e.deltaMode ? 33 : 1) / 300)));
    const [fx, fy] = frac(e);
    zoomAt(f, fx, fy, false);
    onWheel(f, e);
  }, {passive: false});
  el.addEventListener('dblclick', e => { e.preventDefault(); const [fx, fy] = frac(e); zoomAt(.5, fx, fy); });
  return {fit, fitView, zoomAt, animate, target, aspect, view: () => [x, y, w, h], set: v => { cancelAnimationFrame(anim); [x, y, w, h] = v; set(); },
    toWorld: e => { const [fx, fy] = frac(e); return [x + fx * w, y + fy * h]; }};
}

// Bounding boxes for each country: the whole outline, and its largest ring (used to zoom to it, so the
// US box does not stretch across the Aleutians), plus the extent of the world map.
let WORLDBOX = null;
function worldBoxes(W) {
  if (WORLDBOX) return WORLDBOX;
  const boxes = {}, mains = {};
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const id of Object.keys(W.paths)) {
    let best = -1;
    W.paths[id].path.split('Z').forEach(ring => {
      const n = ring.match(/-?\d+(\.\d+)?/g) || [];
      if (n.length < 6) return;
      let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity;
      for (let i = 0; i + 1 < n.length; i += 2) { const x = +n[i], y = +n[i + 1]; if (x < a) a = x; if (x > c) c = x; if (y < b) b = y; if (y > d) d = y; }
      if ((c - a) * (d - b) > best) { best = (c - a) * (d - b); mains[id] = [a, b, c - a, d - b]; }
      x0 = Math.min(x0, a); y0 = Math.min(y0, b); x1 = Math.max(x1, c); y1 = Math.max(y1, d);
    });
  }
  y1 = y0 + (y1 - y0) * .93; // trim the empty far south
  WORLDBOX = {mains, extent: [x0, y0, x1 - x0, y1 - y0]};
  return WORLDBOX;
}

// The home page map: a world map shaded like the country maps. Scroll to zoom, drag to pan, and click a
// shaded country to open its page.
function worldMap(box, W) {
  const crumb = $('.crumb', box);
  const byNum = {}; W.countries.forEach(c => { if (c.numeric) byNum[c.numeric] = c; });
  const {mains, extent} = worldBoxes(W);
  const mx = Math.max(1, ...W.countries.map(c => c.supporters));
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', 'World map. Countries with a register are shaded.');
  svg.innerHTML = `<g>${Object.entries(W.paths).map(([id, p]) => { const c = byNum[id], tt = c ? (.35 + .65 * Math.log(c.supporters + 1) / Math.log(mx + 1)).toFixed(3) : 0;
    return `<path data-id="${id}" class="${c ? 'u-sup' : 'u-none'}"${c ? ` style="--t:${tt}"` : ''} d="${p.path}"/>`; }).join('')}</g>`;
  box.prepend(svg);
  const countryAt = e => { const p = e.target.closest && e.target.closest('path[data-id]'); return p ? p.dataset.id : null; };
  const pz = panZoom(svg, extent, {
    maxOut: 1, maxIn: 60,
    onView: (x, y, w, h) => svg.setAttribute('viewBox', `${x} ${y} ${w} ${h}`),
    onHover: e => {
      const id = countryAt(e);
      if (!id) return hideTip();
      const c = byNum[id];
      showTip(c ? `<b>${esc(c.name)}</b><span>${fmt(c.supporters)} on record so far →</span>` : `<b>${esc(W.paths[id].name)}</b><span>no register yet</span>`, e.clientX, e.clientY);
    },
    onTap: e => {
      const id = countryAt(e); if (!id) return;
      hideTip();
      if (byNum[id]) go(`/${byNum[id].slug}`);
      else { const m = mains[id]; pz.animate(pz.target(m[0], m[1], m[2], m[3], .6)); }
    }});
  svg.addEventListener('pointerleave', hideTip);
  crumb.innerHTML = `<b>World</b><span class="muted">Scroll to zoom · click a shaded country to open it</span>`;
  $('.zoomer', box).addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.z === 'in') pz.zoomAt(.6); else if (b.dataset.z === 'out') pz.zoomAt(1 / .6); else pz.fit();
  });
  pz.fit(false);
  let lastW = svg.clientWidth;
  const ro = new ResizeObserver(() => { if (Math.abs(svg.clientWidth - lastW) > 1) { lastW = svg.clientWidth; pz.fit(false); } });
  ro.observe(svg);
  return () => { ro.disconnect(); hideTip(); };
}

// ---------- country ----------
// A country has four pages: /gb (overview and map), /gb/directory, /gb/time and /gb/method.
const SECTIONS = {map: 'Map', directory: 'Directory', time: 'Over time', method: 'Method'};
function countryStats(D) {
  const perYear = {};
  D.E.forEach(e => { const y = +year(e[E_.date]); if (y) perYear[y] = (perYear[y] || 0) + 1; });
  const years = Object.keys(perYear).map(Number).sort((a, b) => a - b);
  const tally = f => { const o = {}; D.P.forEach(p => f(p).forEach(k => { if (k) o[k] = (o[k] || 0) + 1; })); return Object.entries(o).sort((a, b) => b[1] - a[1]); };
  return {perYear, years, tally, types: tally(p => [p[P_.type], ...p[P_.other]]), designs: tally(p => p[P_.des])};
}
async function countryPage(slug, params, section = 'map') {
  main.innerHTML = '<div class="loading">Loading</div>';
  const D = await loadCountry(slug), m = D.meta, S = countryStats(D);
  if (section === 'map' && !D.C.length) section = 'directory';
  setTitle(section === 'map' ? m.name : `${SECTIONS[section]} · ${m.name}`);
  const base = `/${slug}`;
  const {perYear, years} = S;
  const tab = (key, href, sub) => `<a href="${href}"${key === section ? ' class="on" aria-current="page"' : ''}><b>${SECTIONS[key]}</b><span>${sub}</span></a>`;
  main.innerHTML = `
  <div class="wrap fade">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/#countries">All countries</a><span>/</span>${section === 'map' ? `<span>${esc(m.name)}</span>` : `<a href="${base}">${esc(m.name)}</a><span>/</span><span>${SECTIONS[section]}</span>`}</nav>
    <div class="c-top">
      <div class="c-title">
        <h1>${esc(m.name)}</h1>
        <p>${fmt(m.supporters)} public figures and organisations on the record found so far, in ${fmt(m.evidence)} sourced statements. A register of who has said it in public, not a poll.</p>
        ${(m.polls || []).length ? (p => `<div class="c-poll"><b>${esc(pollFig(p))}</b><span><span class="kicker">In polls</span> back ${esc(p.question.replace(/^./, c => c.toLowerCase()))}. ${ext(p.url, esc(pollSource(p)) + ' ↗')}${m.polls.length > 1 ? ` · <a href="/${slug}/method#polls">${m.polls.length - 1} more poll${m.polls.length > 2 ? 's' : ''}</a>` : ''}</span></div>`)(m.polls[0]) : ''}
      </div>
      <div class="c-stats">
        <div><b>${fmt(m.supporters)}</b><span>public figures and organisations found so far</span></div>
        <div><b>${fmt(m.A)}</b><span>of them backed a specific tax or voted for one</span></div>
        <div><b>${fmt(m.evidence)}</b><span>sourced statements, votes and letters</span></div>
        <div><b>${fmt(m.units_with_supporters)}</b><span>local areas with a public supporter found</span></div>
      </div>
    </div>
    ${section === 'map' ? overviewHtml(D, S, base) : ''}
  </div>
  <nav class="c-tabs" aria-label="${esc(m.name)} pages"><div class="wrap">
    ${D.C.length ? tab('map', base, `${fmt(m.units_with_supporters)} areas with supporters`) : ''}
    ${tab('directory', `${base}/directory`, `${fmt(m.supporters)} entries`)}
    ${tab('time', `${base}/time`, years.length ? years[0] + '–' + years[years.length - 1] : 'by year')}
    ${tab('method', `${base}/method`, 'sources and downloads')}
  </div></nav>
  <div class="wrap" id="csec"></div>`;
  const box = $('#csec');
  if (section === 'map') mapSection(box, D, slug, params);
  else if (section === 'directory') directorySection(box, D, slug, params);
  else if (section === 'time') timeSection(box, D, slug, S);
  else methodSection(box, D, slug);
}
function overviewHtml(D, S, base) {
  const {perYear, years} = S;
  const span = years.slice(-10), yMax = Math.max(1, ...span.map(y => perYear[y]));
  const peak = years.reduce((a, y) => perYear[y] > (perYear[a] || 0) ? y : a, years[0]);
  const spark = span.length ? `<svg class="spark" viewBox="0 0 ${span.length * 12} 44" preserveAspectRatio="none" aria-hidden="true">${span.map((y, i) => {
    const h = Math.max(1.5, perYear[y] / yMax * 40); return `<rect x="${i * 12 + 1.5}" y="${44 - h}" width="9" height="${h}"${y === peak ? ' class="pk"' : ''}><title>${y}: ${perYear[y]}</title></rect>`; }).join('')}</svg>
    <div class="spark-x"><span>${span[0]}</span><span>${span[span.length - 1]}</span></div>` : '';
  const topDes = S.designs.slice(0, 3), desMax = topDes.length ? topDes[0][1] : 1;
  return `<div class="c-overview">
      <a class="ov" href="${base}/time">
        <div class="kicker">Statements per year</div>
        ${spark}
        <div class="ov-foot">Peak <b>${peak || '·'}</b> with ${fmt(perYear[peak] || 0)} · latest ${years.length ? years[years.length - 1] : '·'}</div>
      </a>
      <a class="ov" href="${base}/time">
        <div class="kicker">What they back</div>
        <div class="ov-bars">${topDes.map(([k, v]) => `<div><span>${esc(label(DES, k))}</span><i style="width:${(v / desMax * 100).toFixed(0)}%"></i><b>${fmt(v)}</b></div>`).join('')}</div>
      </a>
      <div class="ov">
        <div class="kicker">Who they are</div>
        <div class="ov-chips">${S.types.slice(0, 5).map(([k, v]) => `<a class="chip" href="${base}/directory?type=${enc(k)}">${esc(label(TYPES_PL, k))} <b>${fmt(v)}</b></a>`).join('')}</div>
      </div>
    </div>`;
}

function mapSection(box, D, slug, params) {
  box.innerHTML = `<section class="c-sec">
      <div class="sec-head"><div><div class="kicker">Explore by place</div><h2>Where they are</h2></div>
        <p>Darker areas have more supporters. The search is never finished, so an empty area means nobody recorded yet, not nobody there.</p></div>
      <div class="atlas">
        <div class="mapbox" id="mapbox">
          <div class="zoomer"><button type="button" data-z="in" aria-label="Zoom in">+</button><button type="button" data-z="out" aria-label="Zoom out">−</button><button type="button" data-z="fit" aria-label="Show the whole country">⤢</button></div>
          <div class="legend"><span><span class="ramp" style="display:inline-block;vertical-align:-1px;margin-right:6px"></span>Supporters</span>${D.C.some(c => c[9]) ? '<span><span class="ramp up" style="display:inline-block;vertical-align:-1px;margin-right:6px"></span>Supporters known only for the wider area</span>' : ''}<span><i class="sw none"></i>None recorded yet</span></div>
        </div>
        <div class="panel" id="panel"></div>
      </div>
    </section>`;
  const api = countryMap(D, slug, path => go(`/${slug}/directory?place=${enc(path)}`));
  const place = params.get('place');
  if (place) api.select(place, false);
}

function timeSection(box, D, slug, S) {
  const hbars = (rows, labels, link) => { const mx = rows[0] ? rows[0][1] : 1; return rows.slice(0, 10).map(([k, v]) =>
    `<${link ? `a href="${link(k)}"` : 'div'} class="hb"><span>${esc(label(labels, k))}</span><span class="hb-bar"><i style="width:${(v / mx * 100).toFixed(1)}%"></i></span><span class="n">${fmt(v)}</span></${link ? 'a' : 'div'}>`).join(''); };
  box.innerHTML = `<section class="c-sec">
      <div class="sec-head"><div><div class="kicker">Over time</div><h2>When they said it</h2></div>
        <p>Statements per year, by strength of evidence. A person who spoke out several times counts each time.</p></div>
      <div class="charts">
        <div><div class="kicker" style="margin-bottom:12px">Statements per year</div>${yearChart(D.E)}
          <div class="chart-key"><span><i style="background:var(--ink)"></i>Explicit</span><span><i style="background:var(--signal)"></i>Named</span><span><i style="background:var(--rule-2)"></i>Implied</span></div></div>
        <div><div class="kicker" style="margin-bottom:10px">What they back</div><div class="hbars">${hbars(S.designs, DES)}</div>
          <div class="kicker" style="margin:28px 0 10px">Who they are · click to see them</div><div class="hbars">${hbars(S.types, TYPES_PL, k => `/${slug}/directory?type=${enc(k)}`)}</div></div>
      </div>
    </section>`;
}

function methodSection(box, D, slug) {
  const m = D.meta, sup = D.places.filter(p => p.mapped && p.ids.length).length;
  box.innerHTML = `<section class="c-sec">
    ${(m.polls || []).length ? `<div id="polls" style="margin-bottom:48px">
      <div class="sec-head"><div><div class="kicker">Public opinion</div><h2>What polls say</h2></div>
        <p>The register lists who has said it in public. Polls show how many people agree. Support depends on the design asked about, so each poll is shown with its question.</p></div>
      <div class="polls">${m.polls.map(p => `<div class="poll">
        <div class="poll-fig"><b>${esc(pollFig(p))}</b><span>support</span></div>
        <div class="poll-body"><p>${esc(p.question)}.</p>
          ${p.question_original ? `<p class="poll-orig">“${esc(p.question_original)}”</p>` : ''}
          <div class="poll-meta">${esc([p.scope, p.sample, p.fieldwork ? 'fieldwork ' + p.fieldwork : ''].filter(Boolean).join(' · '))}</div>
          <div class="poll-meta">${ext(p.url, esc(pollSource(p)) + ' ↗')}</div></div>
      </div>`).join('')}</div></div>` : ''}
    <div class="sec-head"><div><div class="kicker">Method and gaps</div><h2>How this was built</h2></div></div>
    <div class="method">
    <div class="prose">
      ${m.notes ? `<p>${esc(m.notes)}</p>` : ''}
      <p>Researchers search parliaments, councils, parties, unions, campaigns, open letters and the press, and record only statements that back an actual wealth tax. Each statement is quoted word for word, linked to its source and graded by how explicit it is.</p>
      <p>The register grows with every research run and will never be complete. ${fmt(m.units_with_supporters)} of ${fmt(m.units)} areas have at least one recorded supporter so far; an empty area means <em>nobody recorded yet</em>, not <em>no supporters</em>. ${m.excluded ? `${fmt(m.excluded)} candidates were looked at and left out, for example because they backed other taxes on the rich but not a wealth tax.` : ''}</p>
      <p>See something wrong, or want an entry removed? Every entry has a report link, and reports are handled in public.</p>
      <p><a class="btn sm" href="${esc(issueUrl(`[${m.iso2}] Report: country data`, {country: slug}))}" target="_blank" rel="noopener">Report a problem with ${esc(m.name)} ↗</a></p>
    </div>
    <div>
      <dl class="kv" style="margin:0">
        <div><span>Last research run</span><b>${esc(m.updated || '·')}</b></div>
        <div><span>Explicit, named, implied</span><b>${fmt(m.A)} · ${fmt(m.B)} · ${fmt(m.C)}</b></div>
        <div><span>Sourced statements</span><b>${fmt(m.evidence)}</b></div>
        <div><span>Areas shown on the map with a supporter</span><b>${fmt(sup)}</b></div>
        <div><span>Candidates left out</span><b>${fmt(m.excluded)}</b></div>
      </dl>
      ${m.map_source ? `<p class="map-source">Map: ${esc(m.map_source)}${m.map_licence && m.map_licence[0] ? ` Licence: ${safeUrl(m.map_licence[1]) ? ext(m.map_licence[1], esc(m.map_licence[0]) + ' ↗') : esc(m.map_licence[0])}.` : ''}</p>` : ''}
      <div class="kicker" style="margin-top:28px">Download (CSV, CC BY 4.0)</div>
      <div class="downloads">${['actors', 'evidence', 'profiles', 'geo_units'].map(f => `<a class="chip" href="/download/${slug}/${f}.csv" download>${f}.csv</a>`).join('')}
        ${ext(`https://github.com/${REPO}/tree/main/data/${slug}`, 'All files on GitHub ↗', 'chip')}</div>
    </div>
    </div></section>`;
}

// The directory: filters kept in the URL, a list, and a preview of the selected entry beside it
// (a bottom sheet on narrow screens). A plain click previews; the full profile is one more click.
function directorySection(box, D, slug, params) {
  const ST = {q: params.get('q') || '', type: params.get('type') || '', party: params.get('party') || '', level: params.get('level') || '',
    grade: params.get('grade') || '', place: params.get('place') || '', sort: params.get('sort') || 'strength', sel: params.get('sel') || '', limit: 50};
  const syncUrl = () => {
    const u = new URLSearchParams();
    ['q', 'type', 'party', 'level', 'grade', 'place'].forEach(k => { if (ST[k]) u.set(k, ST[k]); });
    if (ST.sort !== 'strength') u.set('sort', ST.sort);
    if (ST.sel && new URLSearchParams(location.search).has('sel') || ST.picked) u.set('sel', ST.sel);
    const s = u.toString();
    history.replaceState(null, '', location.pathname + (s ? '?' + s : ''));
  };
  const count = f => { const o = {}; D.P.forEach(p => f(p).forEach(k => { if (k) o[k] = (o[k] || 0) + 1; })); return Object.entries(o).sort((a, b) => b[1] - a[1]); };
  const typeCounts = count(p => [p[P_.type], ...p[P_.other]]), partyCounts = count(p => [p[P_.party]]), levelCounts = count(p => [p[P_.level]]);
  box.innerHTML = `<section class="c-sec">
    <div class="dir-layout">
      <div class="dir-main">
        <div class="filters">
          <input class="field q" id="f-q" type="search" placeholder="Filter by name, role or place" value="${esc(ST.q)}" aria-label="Filter the directory">
          <select class="field" id="f-type" aria-label="Type"><option value="">All types</option>${typeCounts.map(([k, n]) => `<option value="${esc(k)}">${esc(label(TYPES_PL, k))} (${n})</option>`).join('')}</select>
          <select class="field" id="f-party" aria-label="Party" ${partyCounts.length ? '' : 'disabled'}><option value="">${partyCounts.length ? 'All parties' : 'No party data'}</option>${partyCounts.map(([k, n]) => `<option value="${esc(k)}">${esc(k)} (${n})</option>`).join('')}</select>
          <select class="field" id="f-grade" aria-label="Evidence"><option value="">Any evidence</option><option value="A">Explicit only</option><option value="AB">Explicit or named</option></select>
          <select class="field" id="f-sort" aria-label="Sort"><option value="strength">Strongest evidence</option><option value="recent">Most recent</option><option value="count">Most statements</option><option value="az">A to Z</option></select>
        </div>
        <div class="filter-row">
          <div class="seg" id="f-level" role="group" aria-label="Level"><button type="button" data-v="">All levels</button>${levelCounts.map(([k]) => `<button type="button" data-v="${esc(k)}">${esc(label(LEVEL, k))}</button>`).join('')}</div>
          <span id="f-place"></span>
        </div>
        <div class="count-line" id="count"></div>
        <div class="dir-head" role="row">
          <span></span>
          <button type="button" data-sort="az">Name</button>
          <span>Recorded location</span>
          <button type="button" data-sort="recent">Latest statement</button>
        </div>
        <ul class="dir" id="dir"></ul>
        <div class="more" id="more"></div>
        <p class="dir-suggest">Someone missing? <a href="${esc(suggestUrl({country: D.meta.name}))}">Suggest a supporter →</a></p>
      </div>
      <aside class="preview" id="preview" aria-live="polite"></aside>
    </div></section>`;
  const setSel = () => {
    $('#f-type').value = ST.type; $('#f-party').value = ST.party; $('#f-grade').value = ST.grade; $('#f-sort').value = ST.sort;
    $$('#f-level button').forEach(b => b.classList.toggle('on', b.dataset.v === ST.level));
    $$('.dir-head [data-sort]').forEach(b => b.classList.toggle('on', b.dataset.sort === ST.sort));
    $('#f-place').innerHTML = ST.place ? `<button class="chip on" type="button" id="clear-place">${esc(ST.place.split(' > ').pop())} <span class="x" aria-label="Remove place filter">×</span></button>` : '';
    const cp = $('#clear-place'); if (cp) cp.onclick = () => { ST.place = ''; changed(); };
  };
  let list = [];
  const filtered = () => {
    const toks = norm(ST.q).trim().split(/\s+/).filter(Boolean);
    const inPlace = ST.place ? idsForPlace(D, ST.place) : null;
    const out = D.P.filter(p =>
      (!ST.type || p[P_.type] === ST.type || p[P_.other].includes(ST.type)) &&
      (!ST.party || p[P_.party] === ST.party) &&
      (!ST.level || p[P_.level] === ST.level) &&
      (!ST.grade || ST.grade.includes(p[P_.grade])) &&
      (!inPlace || inPlace.has(p[P_.id])) &&
      (!toks.length || toks.every(t => norm([p[P_.name], p[P_.role], p[P_.aff], p[P_.loc], p[P_.party]].join(' ')).includes(t))));
    const sorts = {strength: byStrength, recent: (a, b) => (b[P_.last] || '').localeCompare(a[P_.last] || '') || byStrength(a, b),
      count: (a, b) => b[P_.n] - a[P_.n] || byStrength(a, b), az: (a, b) => a[P_.name].localeCompare(b[P_.name])};
    return out.sort(sorts[ST.sort] || byStrength);
  };
  const row = p => {
    const tags = [p[P_.type], ...p[P_.other]].slice(0, 2).map(t => `<span class="tag">${esc(label(TYPE, t))}</span>`).join('');
    return `<li><a class="drow${p[P_.id] === ST.sel ? ' sel' : ''}" data-id="${esc(p[P_.id])}" href="/${slug}/${enc(p[P_.id])}">
      ${glyph(p[P_.grade])}
      <span class="dm"><span class="dn">${esc(p[P_.name])}</span><span class="dr">${esc([p[P_.role], p[P_.aff]].filter(Boolean).join(' · ').slice(0, 140))}</span>
        <span class="dt">${tags}${p[P_.party] ? `<span class="tag signal">${esc(p[P_.party])}</span>` : ''}</span></span>
      <span class="dp">${esc(placeShort(p[P_.loc]))}</span>
      <span class="dd"><b>${esc(p[P_.last] ? p[P_.last].slice(0, 7) : '·')}</b>${p[P_.n]} statement${p[P_.n] === 1 ? '' : 's'}</span>
    </a></li>`;
  };
  const wide = () => matchMedia('(min-width: 1021px)').matches;
  function drawList() {
    list = filtered();
    const shown = list.slice(0, ST.limit);
    const active = ['q', 'type', 'party', 'level', 'grade', 'place'].some(k => ST[k]);
    $('#count').innerHTML = `<span>Showing <b>${fmt(shown.length)}</b> of <b>${fmt(list.length)}</b>${list.length !== D.P.length ? ` (${fmt(D.P.length)} in total)` : ''}</span>
      <span style="display:flex;gap:16px">${active ? '<a href="#" id="clear-all">Clear filters</a>' : ''}<span class="grade-key">${glyph('A')} explicit ${glyph('B')} named ${glyph('C')} implied</span></span>`;
    $('#dir').innerHTML = shown.map(row).join('') || `<li class="empty">Nobody matches these filters yet. The register is never complete, so that does not mean nobody there supports a wealth tax.</li>`;
    $('#more').innerHTML = list.length > shown.length ? `<button class="btn ghost" type="button" id="more-btn">Show ${Math.min(50, list.length - shown.length)} more</button>` : '';
    const mb = $('#more-btn'); if (mb) mb.onclick = () => { ST.limit += 50; drawList(); };
    const ca = $('#clear-all'); if (ca) ca.onclick = e => { e.preventDefault(); Object.assign(ST, {q: '', type: '', party: '', level: '', grade: '', place: ''}); $('#f-q').value = ''; changed(); };
    // On wide screens the preview always shows something: the selected entry, or the first one.
    if (wide() && (!ST.sel || !shown.some(p => p[P_.id] === ST.sel)) && list.length) preview(list[0][P_.id], false, true);
    else if (!list.length) $('#preview').innerHTML = '';
  }
  function changed() { ST.limit = 50; syncUrl(); setSel(); drawList(); }
  // auto: the first entry shown by default, which is not written to the URL.
  function preview(id, open = true, auto = false) {
    const p = D.byId[id]; if (!p) return;
    ST.sel = id; if (!auto) syncUrl();
    $$('#dir .drow.sel').forEach(a => a.classList.remove('sel'));
    const a = $(`#dir .drow[data-id="${CSS.escape(id)}"]`); if (a) a.classList.add('sel');
    const pv = $('#preview');
    pv.innerHTML = profilePreview(D, slug, p);
    pv.scrollTop = 0;
    $('.pv-close', pv).onclick = closeSheet;
    if (open && !wide()) { pv.classList.add('open'); document.body.classList.add('sheet-open'); }
  }
  function closeSheet() { $('#preview').classList.remove('open'); document.body.classList.remove('sheet-open'); }
  $('#dir').addEventListener('click', e => {
    const a = e.target.closest('a.drow');
    if (!a || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    ST.picked = true;
    preview(a.dataset.id);
  });
  // Arrow keys move through the list while the preview follows.
  const keys = e => {
    if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) || !pal.hidden) return;
    if (e.key === 'Escape') return closeSheet();
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Enter') return;
    const shown = list.slice(0, ST.limit), i = shown.findIndex(p => p[P_.id] === ST.sel);
    if (e.key === 'Enter') { if (ST.sel) go(`/${slug}/${enc(ST.sel)}`); return; }
    e.preventDefault();
    const j = Math.max(0, Math.min(shown.length - 1, i + (e.key === 'ArrowDown' ? 1 : -1)));
    ST.picked = true;
    if (shown[j]) { preview(shown[j][P_.id], false); const r = $(`#dir .drow[data-id="${CSS.escape(shown[j][P_.id])}"]`); if (r) r.scrollIntoView({block: 'nearest'}); }
  };
  document.addEventListener('keydown', keys);
  let qt;
  $('#f-q').addEventListener('input', e => { clearTimeout(qt); qt = setTimeout(() => { ST.q = e.target.value; changed(); }, 120); });
  [['#f-type', 'type'], ['#f-party', 'party'], ['#f-grade', 'grade'], ['#f-sort', 'sort']].forEach(([s, k]) => $(s).addEventListener('change', e => { ST[k] = e.target.value; changed(); }));
  $('#f-level').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { ST.level = b.dataset.v; changed(); } });
  // A column header sorts by that column; a second click goes back to the strongest evidence first.
  $('.dir-head').addEventListener('click', e => { const b = e.target.closest('[data-sort]'); if (b) { ST.sort = ST.sort === b.dataset.sort ? 'strength' : b.dataset.sort; changed(); } });
  setSel(); drawList();
  if (ST.sel && D.byId[ST.sel]) preview(ST.sel, false);
  const prev = leaving;
  leaving = () => { prev(); document.removeEventListener('keydown', keys); document.body.classList.remove('sheet-open'); };
}

// Shared pieces of a person's profile, used by the preview and the full page.
function profileLinks(p, limit = 99) {
  const prof = p[P_.prof].slice().sort((a, b) => Object.keys(PLAT).indexOf(a[0]) - Object.keys(PLAT).indexOf(b[0]));
  const web = safeUrl(p[P_.web]);
  return [web && !prof.some(x => x[1] === web) ? ext(web, 'Website ↗', 'primary') : '',
    ...prof.filter(x => safeUrl(x[1])).map((x, i) => ext(x[1], esc(label(PLAT, x[0])) + ' ↗', !web && i === 0 ? 'primary' : ''))].filter(Boolean).slice(0, limit).join('');
}
function placeCrumbs(D, slug, p) {
  const parts = (p[P_.loc] || '').split('>').map(s => s.trim()).filter(Boolean);
  const reg = D.places.map(pl => pl.path);
  return parts.map((part, i) => {
    const path = parts.slice(0, i + 1).join(' > ');
    const known = i > 0 && reg.some(r => norm(r) === norm(path) || norm(r).startsWith(norm(path) + ' > '));
    const real = known ? reg.find(r => norm(r) === norm(path)) || path : null;
    return known ? `<a href="/${slug}?place=${enc(real)}">${esc(part)}</a>` : `<span>${esc(part)}</span>`;
  }).join('<span class="sep">›</span>');
}
const PIN = '<svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:1.6;flex:none"><path d="M10 18s6-5.3 6-10a6 6 0 0 0-12 0c0 4.7 6 10 6 10z"/><circle cx="10" cy="8" r="2"/></svg>';
function profilePreview(D, slug, p) {
  const id = p[P_.id], m = D.meta;
  const ev = (D.evBy[id] || []).slice().sort((a, b) => (a[E_.grade] || 'Z').localeCompare(b[E_.grade] || 'Z') || (b[E_.date] || '').localeCompare(a[E_.date] || ''));
  const links = profileLinks(p, 4), crumbs = placeCrumbs(D, slug, p);
  const firstY = year(p[P_.first]), lastY = year(p[P_.last]);
  return `<div class="pv-in">
    <button type="button" class="pv-close" aria-label="Close preview">×</button>
    <div class="kicker">${esc(label(TYPE, p[P_.type]))}${p[P_.level] ? ' · ' + esc(label(LEVEL, p[P_.level])) : ''}</div>
    <h3>${esc(p[P_.name])}</h3>
    <div class="pv-role">${esc([p[P_.role], p[P_.aff]].filter(Boolean).join(' · '))}</div>
    <div class="p-tags">${p[P_.party] ? `<span class="tag signal">${esc(p[P_.party])}</span>` : ''}${p[P_.other].map(t => `<span class="tag">${esc(label(TYPE, t))}</span>`).join('')}</div>
    ${crumbs ? `<div class="p-place">${PIN}${crumbs}</div>` : ''}
    ${links ? `<div class="p-links">${links}</div>` : ''}
    <div class="pv-sum">${glyph(p[P_.grade])} <b>${esc(GRADE[p[P_.grade]] || '')}</b> · ${p[P_.n]} statement${p[P_.n] === 1 ? '' : 's'}${firstY ? `, ${firstY === lastY ? firstY : firstY + '–' + lastY}` : ''}</div>
    ${p[P_.des].length ? `<div class="pv-des">Backs ${p[P_.des].map(d => esc(label(DES, d).replace(/^./, c => c.toLowerCase()))).join(', ')}</div>` : ''}
    <div class="pv-ev">${ev.slice(0, 2).map(e => `<div class="pv-q">
        <div class="ev-meta"><span class="d">${esc(e[E_.date] || 'Undated')}</span><span>${esc(label(EVT, e[E_.type]))}</span></div>
        ${e[E_.quote] ? `<blockquote>${/^[a-z]/.test(e[E_.quote]) ? '…' : ''}${esc(e[E_.quote])}</blockquote>` : ''}
        ${safeUrl(e[E_.url]) ? ext(e[E_.url], esc(e[E_.pub] || e[E_.title] || 'Source') + ' ↗', 'pv-src') : ''}
      </div>`).join('')}
      ${ev.length > 2 ? `<div class="muted" style="font-size:13px">and ${ev.length - 2} more on the full profile</div>` : ''}</div>
    <div class="pv-acts"><a class="btn sm" href="/${slug}/${enc(id)}">Open full profile →</a>
      <a class="report" style="margin:0" href="${esc(issueUrl(`[${m.iso2}] Report: ${p[P_.name]}`, {country: slug, entry: id}))}" target="_blank" rel="noopener">Report ↗</a></div>
  </div>`;
}

function yearChart(E) {
  const by = {};
  E.forEach(e => { const y = +year(e[E_.date]); if (y) { by[y] = by[y] || {A: 0, B: 0, C: 0}; by[y][e[E_.grade]] = (by[y][e[E_.grade]] || 0) + 1; } });
  const ys = Object.keys(by).map(Number);
  if (!ys.length) return '<p class="empty">No dated statements yet.</p>';
  const y0 = Math.min(...ys), y1 = Math.max(...ys), n = y1 - y0 + 1;
  const tot = y => by[y] ? by[y].A + by[y].B + by[y].C : 0;
  const mx = Math.max(...ys.map(tot)), W = 720, H = 260, L = 34, B = 24, bw = (W - L) / n;
  const step = mx > 200 ? 100 : mx > 100 ? 50 : mx > 40 ? 20 : mx > 16 ? 10 : 5;
  let s = '';
  for (let v = 0; v <= mx; v += step) { const y = H - B - (v / mx) * (H - B - 10); s += `<line class="gl" x1="${L}" x2="${W}" y1="${y}" y2="${y}"/><text x="${L - 6}" y="${y + 3}" text-anchor="end">${v}</text>`; }
  const every = n > 24 ? 5 : n > 12 ? 2 : 1;
  for (let i = 0; i < n; i++) {
    const y = y0 + i, x = L + i * bw, d = by[y] || {A: 0, B: 0, C: 0};
    let top = H - B, g = `<g><title>${y}: ${tot(y)} statements (${d.A} explicit, ${d.B} named, ${d.C} implied)</title><rect class="hit" x="${x}" y="0" width="${bw}" height="${H - B}"/>`;
    ['A', 'B', 'C'].forEach(k => { const h = (d[k] / mx) * (H - B - 10); if (h > 0) { top -= h; g += `<rect class="${k}" x="${(x + bw * .14).toFixed(1)}" y="${top.toFixed(1)}" width="${(bw * .72).toFixed(1)}" height="${h.toFixed(1)}"/>`; } });
    s += g + '</g>';
    if ((y % every === 0) || n <= 12) s += `<text x="${x + bw / 2}" y="${H - 6}" text-anchor="middle">${n > 12 ? "'" + String(y).slice(2) : y}</text>`;
  }
  return `<svg class="yearchart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Statements per year from ${y0} to ${y1}">${s}</svg>`;
}

// The country map: pan by dragging, zoom with the buttons or a double click; a click selects an area.
function countryMap(D, slug, onShowAll) {
  const box = $('#mapbox'), panel = $('#panel');
  const [vx, vy, vw, vh] = D.vb;
  const mx = Math.max(1, ...D.C.map(c => c[6].length)), mxUp = Math.max(1, ...D.C.map(c => c[9] || 0));
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', `Map of ${D.meta.name} by area`);
  if (D.C.length > 2000) svg.classList.add('dense');
  // Areas with their own supporters are shaded from a clearly visible start; areas whose region has supporters
  // known only at a level above (a province, département, state or län) get a faint tint graded by how many are known
  // there, from 8% to 28%: always lighter than the 42% where real local supporters start, so the two never look
  // alike; region outlines go on top.
  svg.innerHTML = `<g>${D.C.map((c, i) => { const n = c[6].length, up = c[9] || 0;
      if (n) return `<path data-i="${i}" class="u-sup" style="--t:${(.42 + .58 * Math.log(n + 1) / Math.log(mx + 1)).toFixed(3)}" d="${c[7]}"/>`;
      if (up) return `<path data-i="${i}" class="u-up" style="--t:${(.08 + .2 * Math.log(up + 1) / Math.log(mxUp + 1)).toFixed(3)}" d="${c[7]}"/>`;
      return `<path data-i="${i}" class="u-none" d="${c[7]}"/>`; }).join('')}</g>
    ${(D.R || []).length ? `<g class="regions${(D.R2 || []).length ? ' lower' : ''}">${D.R.map(d => `<path d="${d}"/>`).join('')}</g>` : ''}
    ${(D.R2 || []).length ? `<g class="regions upper">${D.R2.map(d => `<path d="${d}"/>`).join('')}</g>` : ''}`;
  const frame = document.createElement('div'); frame.className = 'mapframe'; frame.appendChild(svg);
  box.prepend(frame);
  box.style.setProperty('--ar', Math.max(.75, Math.min(1.6, vw / vh)).toFixed(3));
  const pz = panZoom(svg, D.vb, {
    onView: (x, y, w, h) => svg.setAttribute('viewBox', `${x} ${y} ${w} ${h}`),
    onHover: e => {
      const p = e.target.closest('path[data-i]');
      if (p) { const c = D.C[+p.dataset.i], n = c[6].length;
        showTip(`<b>${esc(c[0])}</b><span>${n ? fmt(n) + ' supporter' + (n === 1 ? '' : 's') : c[9] ? `${fmt(c[9])} in ${esc(c[10])} with no local area` : 'none recorded yet'}</span>`, e.clientX, e.clientY); }
      else hideTip();
    },
    onTap: e => { const p = e.target.closest('path[data-i]'); if (p) select(D.C[+p.dataset.i][8]); }});
  svg.addEventListener('pointerleave', hideTip);
  const fit = smooth => pz.fit(smooth);
  box.querySelector('.zoomer').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.z === 'in') pz.zoomAt(.6); else if (b.dataset.z === 'out') pz.zoomAt(1 / .6); else { select(null); fit(); } });
  let selPath = null;
  const ro = new ResizeObserver(() => { if (!selPath) fit(false); });
  ro.observe(svg);

  function select(path, smooth = true) {
    selPath = path;
    $$('path.sel', svg).forEach(p => p.classList.remove('sel'));
    if (!path) { home(); fit(smooth); return; }
    const idx = D.C.map((c, i) => [c, i]).filter(([c]) => c[8] === path || c[8].startsWith(path + ' > ')).map(([, i]) => i);
    const els = idx.map(i => svg.querySelector(`path[data-i="${i}"]`)).filter(Boolean);
    els.forEach(p => { p.classList.add('sel'); p.parentNode.appendChild(p); });
    if (els.length) {
      let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity;
      els.forEach(p => { const bb = p.getBBox(); a = Math.min(a, bb.x); b = Math.min(b, bb.y); c = Math.max(c, bb.x + bb.width); d = Math.max(d, bb.y + bb.height); });
      const minW = vw / 6, cw = Math.max(c - a, minW), chh = Math.max(d - b, minW / pz.aspect());
      const v = pz.target((a + c) / 2 - cw / 2, (b + d) / 2 - chh / 2, cw, chh, .35);
      if (smooth) pz.animate(v); else pz.set(v);
    }
    detail(path);
  }
  function home() {
    const withSup = D.placeList.filter(p => p.n).sort((a, b) => b.n - a.n);
    panel.innerHTML = `<div class="kicker">All places</div><h3 style="margin-top:8px">${esc(D.meta.name)}</h3>
      <input class="field" id="pl-q" type="search" placeholder="Find a place" style="margin-top:14px;width:100%" aria-label="Find a place">
      <div class="scroll" id="pl-list"></div>
      <p class="note" style="margin-bottom:0">${fmt(D.meta.units_with_supporters)} of ${fmt(D.meta.units)} areas have a recorded supporter${D.nationalOnly ? `, and ${fmt(D.nationalOnly)} supporters work at national level with no local area` : ''}. Click an area on the map, or pick one here.</p>`;
    const list = $('#pl-list', panel);
    const draw = q => {
      const t = norm(q);
      const rows = (t ? D.placeList.filter(p => norm(p.name).includes(t)).sort((a, b) => b.n - a.n) : withSup).slice(0, 200);
      list.innerHTML = rows.map(p => `<button type="button" class="prow" data-p="${esc(p.path)}"><span>${esc(p.name)}<span class="sub">${esc(p.path.split(' > ').slice(1, -1).join(' › ') || D.meta.name)}</span></span><span class="n">${p.n || '·'}</span></button>`).join('')
        || '<p class="empty" style="padding:16px 0">No place by that name.</p>';
    };
    draw('');
    $('#pl-q', panel).addEventListener('input', e => draw(e.target.value));
    list.addEventListener('click', e => { const b = e.target.closest('[data-p]'); if (b) select(b.dataset.p); });
  }
  function detail(path) {
    const pl = D.placeList.find(p => p.path === path);
    const ids = [...idsForPlace(D, path)];
    const person = i => D.byId[i];
    const people = ids.map(person).filter(Boolean).sort(byStrength);
    const name = pl ? pl.name : path.split(' > ').pop();
    const state = people.length ? `${fmt(people.length)} supporter${people.length === 1 ? '' : 's'}` : 'Nobody recorded yet';
    const row = p => `<a class="prow" href="/${slug}/${enc(p[P_.id])}"><span>${glyph(p[P_.grade])}&nbsp; ${esc(p[P_.name])}<span class="sub">${esc([label(TYPE, p[P_.type]), p[P_.role]].filter(Boolean).join(' · ').slice(0, 80))}</span></span><span class="n">→</span></a>`;
    // The wider area: each level above this place (nearest first, then the country) with the supporters placed at
    // that level as a whole, such as a state's legislators. A place with nobody of its own shows the nearest of them.
    const parts = path.split(' > ');
    const own = new Map(D.places.map(q => [q.path, q.ids]));
    const wider = parts.slice(0, -1).map((_, k) => parts.slice(0, k + 1).join(' > ')).reverse()
      .map(a => ({path: a, name: a.includes(' > ') ? a.split(' > ').pop() : `${D.meta.name}, national level`,
                  ids: (own.get(a) || []).filter(i => person(i))}))
      .filter(w => w.ids.length);
    const near = !people.length && wider[0];
    const shown = near ? near.ids.map(person).sort(byStrength) : people;
    panel.innerHTML = `<div><button class="chip" type="button" id="pl-back">← All places</button></div>
      <h3 style="margin-top:16px">${esc(name)}</h3>
      <div class="path">${esc(path)}</div>
      <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap"><span class="tag ${people.length ? 'signal' : ''}">${esc(state)}</span></div>
      <div class="scroll">
        ${near ? `<div class="kicker" style="margin-top:6px">Known for ${esc(near.name)} as a whole · ${fmt(near.ids.length)}</div>` : ''}
        ${shown.slice(0, 40).map(row).join('')}
        ${wider.length ? `<div class="kicker" style="margin-top:18px">The wider area</div>
          ${wider.map((w, k) => `<button type="button" class="prow" data-up="${k}"><span>${esc(w.name)}<span class="sub">supporters for the area as a whole</span></span><span class="n">${fmt(w.ids.length)} →</span></button>`).join('')}` : ''}
        ${pl && pl.notes ? `<p class="note">${esc(pl.notes)}</p>` : ''}</div>
      <div class="pl-actions">
        ${people.length ? `<button class="btn sm ghost" type="button" id="pl-all">Show ${people.length > 40 ? 'all ' + fmt(people.length) : 'them'} in the directory ↓</button>`
          : near && near.ids.length > 40 ? `<button class="btn sm ghost" type="button" id="pl-near">Show all ${fmt(near.ids.length)} in ${esc(near.name)} ↓</button>` : ''}
        <a class="btn sm" href="${esc(suggestUrl({country: D.meta.name, place: path.split(' > ').slice(1).reverse().join(', ')}))}">Suggest a supporter from ${esc(name)} →</a>
      </div>`;
    $('#pl-back', panel).onclick = () => select(null);
    const all = $('#pl-all', panel); if (all) all.onclick = () => onShowAll(path);
    const nb = $('#pl-near', panel); if (nb) nb.onclick = () => onShowAll(near.path);
    $$('[data-up]', panel).forEach(b => b.onclick = () => { const w = wider[+b.dataset.up]; w.path.includes(' > ') ? select(w.path) : go(`/${slug}/directory?level=national`); });
  }
  fit(false); home();
  return {select};
}

// ---------- person ----------
async function personPage(slug, id) {
  main.innerHTML = '<div class="loading">Loading</div>';
  const D = await loadCountry(slug), m = D.meta, p = D.byId[id];
  if (!p) return notFound();
  setTitle(`${p[P_.name]} (${m.name})`);
  const ev = (D.evBy[id] || []).slice().sort((a, b) => (b[E_.date] || '').localeCompare(a[E_.date] || '') || (a[E_.grade] || '').localeCompare(b[E_.grade] || ''));
  const crumbs = placeCrumbs(D, slug, p), linkBtns = profileLinks(p);
  // Others in the same, most specific area.
  const mine = D.places.filter(pl => pl.ids.includes(id) && pl.path.includes(' > ')).sort((a, b) => b.path.length - a.path.length)[0];
  const near = mine ? [...idsForPlace(D, mine.path)].filter(i => i !== id).map(i => D.byId[i]).filter(Boolean).sort(byStrength).slice(0, 8) : [];
  const links = D.L.filter(l => l[0] === id || l[1] === id).map(l => [D.byId[l[0] === id ? l[1] : l[0]], l]).filter(x => x[0]);
  const firstY = year(p[P_.first]), lastY = year(p[P_.last]);
  main.innerHTML = `
  <div class="wrap fade">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/#countries">All countries</a><span>/</span><a href="/${slug}">${esc(m.name)}</a><span>/</span><a href="/${slug}/directory">Directory</a></nav>
    <div class="person">
      <aside class="p-side">
        <div class="kicker">${esc(label(TYPE, p[P_.type]))}${p[P_.level] ? ' · ' + esc(label(LEVEL, p[P_.level])) : ''}</div>
        <h1>${esc(p[P_.name])}</h1>
        <div class="p-role">${esc([p[P_.role], p[P_.aff]].filter(Boolean).join(' · '))}</div>
        <div class="p-tags">${p[P_.party] ? `<a class="tag signal" style="text-decoration:none" href="/${slug}/directory?party=${enc(p[P_.party])}">${esc(p[P_.party])}</a>` : ''}${p[P_.other].map(t => `<span class="tag">${esc(label(TYPE, t))}</span>`).join('')}</div>
        ${crumbs ? `<div class="p-place">${PIN}${crumbs}</div>` : ''}
        ${linkBtns ? `<div class="p-links">${linkBtns}</div>` : ''}
        <dl class="kv p-summary" style="margin-top:28px">
          <div><span>Strongest evidence</span><b>${glyph(p[P_.grade])}&nbsp; ${esc(GRADE[p[P_.grade]] || '')}</b></div>
          <div><span>Statements on record</span><b>${p[P_.n]}${firstY ? ` · ${firstY === lastY ? firstY : firstY + '–' + lastY}` : ''}</b></div>
          ${p[P_.des].length ? `<div><span>Backs</span><b>${p[P_.des].map(d => esc(label(DES, d))).join('<br>')}</b></div>` : ''}
        </dl>
        <div id="elsewhere"></div>
        ${p[P_.notes] ? `<p class="p-note">${esc(p[P_.notes])}</p>` : ''}
        <a class="report" href="${esc(issueUrl(`[${m.iso2}] Report: ${p[P_.name]}`, {country: slug, entry: id}))}" target="_blank" rel="noopener">Something wrong, or want this removed? Report it ↗</a>
      </aside>
      <div class="statements">
        <h2>On the record <span class="n">${ev.length} statement${ev.length === 1 ? '' : 's'}</span></h2>
        <div style="margin-top:18px">${ev.map(e => evCard(e, m, slug)).join('')}</div>
        ${near.length ? `<div class="nearby"><div class="kicker">Nearby</div><h3>Also in ${esc(mine.name)}</h3>
          <div class="mini">${near.map(q => `<a href="/${slug}/${enc(q[P_.id])}">${glyph(q[P_.grade])}&nbsp; ${esc(q[P_.name])}<span>${esc([label(TYPE, q[P_.type]), q[P_.role]].filter(Boolean).join(' · '))}</span></a>`).join('')}</div>
          <p style="margin-top:14px;font-size:14px"><a href="/${slug}/directory?place=${enc(mine.path)}">See everyone in ${esc(mine.name)} →</a></p></div>` : ''}
        ${links.length ? `<div class="nearby"><div class="kicker">Connections</div><h3>Linked entries</h3>
          <div class="mini">${links.map(([q, l]) => `<a href="/${slug}/${enc(q[P_.id])}">${esc(q[P_.name])}<span>${esc(label({}, l[2]))}${l[3] ? ' · ' + esc(l[3]) : ''}</span></a>`).join('')}</div></div>` : ''}
      </div>
    </div>
  </div>`;
  // The same person on other countries' registers, linked by their Wikidata ID.
  if (p[P_.qid]) Promise.all([INDEX(), WORLD()]).then(([I, W]) => {
    const names = Object.fromEntries((W.countries || []).map(c => [c.slug, c.name]));
    const other = I.people.filter(r => r[8] === p[P_.qid] && r[0] !== slug);
    const box = $('#elsewhere');
    if (box && other.length) box.innerHTML = `<p class="p-else">Also on the record in ${other.map(r => `<a href="/${r[0]}/${enc(r[1])}">${esc(names[r[0]] || r[0].toUpperCase())}</a>`).join(', ')}</p>`;
  });
}
function evCard(e, m, slug) {
  const url = safeUrl(e[E_.url]);
  return `<article class="ev">
    <div class="ev-meta"><span class="d">${esc(e[E_.date] || 'Undated')}</span><span>${esc(label(EVT, e[E_.type]))}</span><span>${glyph(e[E_.grade])}&nbsp; ${esc(GRADE[e[E_.grade]] || '')}</span>${e[E_.des] ? `<span>${esc(label(DES, e[E_.des]))}</span>` : ''}</div>
    ${e[E_.quote] ? `<blockquote>${/^[a-z]/.test(e[E_.quote]) ? '…' : ''}${esc(e[E_.quote])}</blockquote>` : ''}
    ${e[E_.detail] ? `<p class="muted" style="font-size:14px;margin-top:-4px">${esc(e[E_.detail])}</p>` : ''}
    <div class="ev-src">
      <div>${url ? ext(url, esc(e[E_.title] || e[E_.pub] || url) + ' ↗', 's') : esc(e[E_.title])}<span class="pub">${esc(e[E_.pub])}</span></div>
      <div class="ev-foot">${safeUrl(e[E_.archive]) ? `<a href="${esc(safeUrl(e[E_.archive]))}" target="_blank" rel="noopener">Archived copy</a> · ` : ''}<a href="${esc(issueUrl(`[${m.iso2}] Report: ${e[E_.id]}`, {country: slug, entry: e[E_.id]}))}" target="_blank" rel="noopener">Report</a></div>
    </div>
  </article>`;
}

// ---------- static pages ----------
function aboutPage(W) {
  setTitle('Method');
  main.innerHTML = `
  <div class="wrap page-head fade"><div class="kicker">Method</div><h1>How the register <em>is built</em></h1></div>
  <div class="wrap two" style="margin-top:36px">
    <div class="prose">
      <p class="lede" style="max-width:none">Wealth Tax Supporters lists public figures and organisations that have backed a wealth tax in public. It is a register of who has said it on the record, not a poll, and it grows with every research run. It exists so that supporters can find each other, from national parliaments down to a single town.</p>
      <h2>What counts as support</h2>
      <p>Only an actual tax on wealth: a tax on the stock of what people own rather than on what they earn. That covers</p>
      <ul>${Object.entries(DES).map(([k, v]) => `<li><b>${esc(v)}</b></li>`).join('')}</ul>
      <p>Backing higher income tax, higher capital gains tax or "making the rich pay more" is not enough on its own. People who argue for those instead of a wealth tax are left out, and the reasons are logged.</p>
      <h2>Grades</h2>
      <div class="grades">${['A', 'B', 'C'].map(g => `<div>${glyph(g)}<span><b>${GRADE[g]}.</b> ${esc(GRADE_LONG[g].split(': ').pop())}.</span></div>`).join('')}</div>
      <p>A supporter's grade is their strongest piece of evidence. A formal act such as a vote, a motion, a bill or a signed letter counts as explicit.</p>
      <h2>Sources and checking</h2>
      <p>Every statement is quoted word for word from its source and linked to it. Quotes are checked against the page automatically, and anyone can follow the link to read the source.</p>
      <h2>Made with AI, corrected in public</h2>
      <p>The research is done with an AI research workflow that searches parliaments, councils, parties, unions, campaigns and the press, and follows written rules for what counts. AI makes mistakes. That is why every claim carries its source and why anyone can report an error, which is then fixed in the open.</p>
      <h2>Coverage</h2>
      <p>Countries are researched layer by layer, national first. Regional and local areas are sampled first and searched further where they turn up supporters. The register is never finished: an empty area on a map means <em>nobody recorded yet</em>, not <em>no supporters</em>.</p>
      <h2>Removal and corrections</h2>
      <p>Anyone listed can ask to be removed or corrected. Use the report link on the entry, or open a report on GitHub. People who have died are removed.</p>
      <h2>Reuse</h2>
      <p>The data is free to reuse under the Creative Commons Attribution 4.0 licence. Quotes stay the copyright of their publishers. Each country page has CSV downloads.</p>
      <h2>What comes next</h2>
      <p>Today the register lists public figures and organisations only. A way for ordinary supporters to find each other in their own area is planned, with privacy and consent built in first. It is not open yet.</p>
    </div>
    <aside class="aside-card"><h3>Spotted a mistake?</h3><p>Reports are public GitHub issues. Say which entry is wrong and, if you can, link a source.</p>
      <p><a class="btn sm" href="${esc(issueUrl('Report: '))}" target="_blank" rel="noopener">Report a mistake ↗</a></p>
      <p style="margin:18px 0 0"><a href="https://github.com/${REPO}" target="_blank" rel="noopener">Read the full method on GitHub ↗</a></p></aside>
  </div>`;
}
function contributePage(W) {
  setTitle('Contribute');
  main.innerHTML = `
  <div class="wrap page-head fade"><div class="kicker">Contribute</div><h1>Put your country <em>on the map</em></h1></div>
  <div class="wrap two" style="margin-top:36px">
    <div class="prose">
      <p class="lede" style="max-width:none">Registers are built one country at a time, in the open. ${W.countries.length} ${W.countries.length === 1 ? 'country is' : 'countries are'} underway: ${W.countries.map(c => esc(c.name)).join(', ')}.</p>
      <h2>Start a country</h2>
      <ol>
        <li><b>Open a "new country" issue</b> on GitHub, so nobody else starts the same one. Pick a depth: a seed run finds the most prominent supporters in every layer and plans the next runs.</li>
        <li><b>Run the research workflow.</b> The repository has a written workflow (a Claude skill) with the rules for what counts, how to grade evidence and how to record sources. It sets up the country folder and the geography for the map.</li>
        <li><b>Open a pull request</b> with the new <code>data/&lt;country&gt;/</code> folder. Checks run automatically, and the site rebuilds once it is merged.</li>
      </ol>
      <h2>Help check what is here</h2>
      <p>Open an entry, follow the source, and report anything that does not match.</p>
      <h2>Suggest a supporter</h2>
      <p>Know someone who has backed a wealth tax in public? <a href="/suggest">Suggest them</a>: just their name, the country and a link to where they said it. No account needed.</p>
    </div>
    <aside class="aside-card"><h3>Get started</h3>
      <p><a class="btn sm" href="https://github.com/${REPO}/issues/new?template=new-country.yml" target="_blank" rel="noopener">Start a new country ↗</a></p>
      <p><a class="btn sm ghost" href="/suggest">Suggest a supporter →</a></p>
      <p style="margin:18px 0 0"><a href="https://github.com/${REPO}/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener">Contributing guide ↗</a><br><a href="https://github.com/${REPO}/blob/main/skill/SKILL.md" target="_blank" rel="noopener">The research workflow ↗</a></p></aside>
  </div>`;
}

// ---------- suggest a supporter ----------
function suggestPage(W, params) {
  setTitle('Suggest a supporter');
  const started = new Set(W.countries.map(c => c.name));
  const names = W.all_countries || [...started].sort();
  const val = k => esc(params.get(k) || '');
  main.innerHTML = `
  <div class="wrap page-head fade"><div class="kicker">Suggest a supporter</div><h1>Know someone <em>on the record?</em></h1>
    <p class="lede" style="margin-top:18px">Tell us about a public figure or organisation who has backed a wealth tax in public. No account needed: a name, a country and a link to where they said it is enough.</p></div>
  <div class="wrap two" style="margin-top:36px">
    <form class="suggest" id="suggest-form" novalidate>
      <label><span>Who <b>*</b></span><input class="field" name="name" required maxlength="200" placeholder="Name of the person or organisation" autocomplete="off"></label>
      <div class="pair">
        <label><span>Country <b>*</b></span><input class="field" name="country" required maxlength="80" list="sg-countries" value="${val('country')}" placeholder="Any country, type to search" autocomplete="off"><small>Any country. Where no register has started yet, we keep the suggestion for when one does.</small></label>
        <label><span>Where in the country</span><input class="field" name="place" maxlength="200" value="${val('place')}" placeholder="Town, region or constituency" autocomplete="off"></label>
      </div>
      <datalist id="sg-countries">${names.map(n => `<option value="${esc(n)}"${started.has(n) ? ' label="Register started"' : ''}>`).join('')}</datalist>
      <label><span>Where they said it <b>*</b></span><textarea class="field" name="links" rows="3" required maxlength="2000" placeholder="https://… one link per line: an article, video, post, letter or vote"></textarea></label>
      <label><span>What they said, or why they belong here</span><textarea class="field" name="said" rows="5" maxlength="3000" placeholder="A quote, or a few words on what they back (a tax on wealth, not just “tax the rich”)"></textarea></label>
      <label class="hp" aria-hidden="true">Leave this empty<input name="website" tabindex="-1" autocomplete="off"></label>
      <div class="suggest-foot"><button class="btn" type="submit" id="sg-send">Send suggestion</button><span class="sg-msg" id="sg-msg" role="status"></span></div>
      <p class="fine">We check every suggestion against its source before it appears, so it can take a while. We don't ask who you are. To stop spam we keep a scrambled code of your connection that changes every day and can't be traced back to you.</p>
    </form>
    <aside class="aside-card"><h3>Other ways</h3>
      <p>Prefer to talk it through, or have a whole list? Post it in the Discord and someone will pick it up.</p>
      <p><a class="btn sm" href="${DISCORD}" target="_blank" rel="noopener">Join the Discord ↗</a></p>
      <p style="margin-top:18px">Have a GitHub account? Open an issue, and follow it as it is checked.</p>
      <p><a class="btn sm ghost" href="${esc(githubSuggestUrl({country: params.get('country') || ''}))}" target="_blank" rel="noopener">Suggest on GitHub ↗</a></p>
      <p class="fine" style="margin-top:18px">What counts: a public statement, vote, letter or policy backing a tax on wealth (net assets), such as an annual wealth tax or a billionaire minimum tax. Read <a href="/about">the method</a>.</p></aside>
  </div>`;
  const form = $('#suggest-form'), msg = $('#sg-msg'), send = $('#sg-send');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    data.page = document.referrer && new URL(document.referrer).origin === location.origin ? new URL(document.referrer).pathname : '';
    if (!data.name.trim() || !data.country.trim() || !data.links.trim()) { msg.textContent = 'Please fill in who, the country and at least one link.'; msg.className = 'sg-msg err'; return; }
    send.disabled = true; msg.textContent = 'Sending…'; msg.className = 'sg-msg';
    try {
      const r = await fetch('/api/suggest', {method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify(data)});
      const out = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(out.error || 'Could not send it. Please try again, or post it on Discord.');
      form.innerHTML = `<div class="sg-done"><h2>Thank you.</h2><p>We'll check <b>${esc(data.name)}</b> against the source and add them if it holds up.</p>
        <p style="margin-top:18px"><a class="btn" href="/suggest${data.country ? '?country=' + enc(data.country) : ''}">Suggest someone else</a></p></div>`;
    } catch (err) {
      msg.textContent = err.message; msg.className = 'sg-msg err'; send.disabled = false;
    }
  });
}

// ---------- start ----------
$('#report-top').href = $('#report-foot').href = issueUrl('Report: ');
$('#repo-link').href = `https://github.com/${REPO}`;
render(false);
