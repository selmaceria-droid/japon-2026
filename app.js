/* ============================================================
   Japon 2026 — rendu de l'app. Les données sont dans data.js.
   ============================================================ */
const $ = s => document.querySelector(s);
const D = s => new Date(s + 'T00:00:00');
const fWd = new Intl.DateTimeFormat('fr-FR', {weekday: 'short'});
const fDm = new Intl.DateTimeFormat('fr-FR', {day: 'numeric', month: 'short'});
const fLong = new Intl.DateTimeFormat('fr-FR', {weekday: 'long', day: 'numeric', month: 'long'});
const ymdLocal = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
// « Maintenant » vient de l'horloge du téléphone, donc du fuseau où on se trouve.
// ?jour=2026-10-17 dans l'adresse permet de voir l'app comme si on y était.
const forceJour = new URLSearchParams(location.search).get('jour');
const MAINTENANT = /^\d{4}-\d{2}-\d{2}$/.test(forceJour || '') ? new Date(forceJour + 'T12:00:00') : new Date();
const todayStr = ymdLocal(MAINTENANT);
// Un jour bascule dans le tiroir « jours passés » à 6 h du matin le lendemain.
const ANCRE = (() => { const d = new Date(MAINTENANT); if (d.getHours() < 6) d.setDate(d.getDate() - 1); return ymdLocal(d); })();
const passe = date => date < ANCRE;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const maps = q => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
const flightaware = v => 'https://fr.flightaware.com/live/flight/' + encodeURIComponent(v);
const route = (a, b, m) => `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(a)}&destination=${encodeURIComponent(b)}&travelmode=${m || 'transit'}`;
const NOM = {Kawaguchiko: 'Mont Fuji · Kawaguchiko'};
// Clé d'un billet : la même que dans selma.html, pour partager la même réserve.
const idBillet = a => 'b-' + a.date + '-' + a.titre.replace(/[^a-zA-Z0-9]+/g, '').slice(0, 20);
const addDays = (ymd, n) => { const d = D(ymd); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
// Replie une liste d'éléments déjà passés dans un <details>.
function tiroir(html, n, mots) {
  if (!html) return '';
  return `<details class="passes"><summary>${I.histo}<span>${n} ${n > 1 ? mots[1] : mots[0]}</span>`
    + I.chev.replace('<svg ', '<svg class="chev" ') + `</summary><div class="passesIn">${html}</div></details>`;
}
const CIEL = {soleil: 'Plutôt ensoleillé', eclaircies: 'Éclaircies', nuages: 'Nuageux', averses: "Risque d'averses", pluie: 'Pluie probable'};
const TENUE = d => d.max >= 24 ? 'T-shirt' : d.max >= 19 ? 'Veste légère' : 'Pull + veste';

// Tri : les activités sans horaire héritent de l'heure de la précédente,
// sinon « Gion » passerait avant le train de 10h20 le jour du trajet.
const ACTS = (() => {
  const jours = {};
  ACTIVITES.forEach((a, i) => (jours[a.date] ||= []).push({a, i}));
  return Object.keys(jours).sort().flatMap(date => {
    let derniere = '00:00';
    return jours[date]
      .map(({a, i}) => {
        if (/^\d{2}:\d{2}$/.test(a.heure || '')) derniere = a.heure;
        return {a, i, cle: derniere};
      })
      .sort((x, y) => x.cle.localeCompare(y.cle) || x.i - y.i)
      .map(x => x.a);
  });
})();

// Jauge de marche : on additionne le poids « marche » des activités du jour.
// C'est une estimation de ressenti, pas une distance.
const PALIERS = [[0, 'Repos'], [2, 'Tranquille'], [5, 'Modérée'], [8, 'Soutenue'], [99, 'Grosse journée']];
function jauge(date, extra) {
  const jour = ACTS.filter(a => a.date === date);
  if (!jour.length) return '';
  const total = jour.reduce((t, a) => t + (Number(a.marche) || 0), 0);
  const i = PALIERS.findIndex(([max]) => total <= max);
  return `<span class="walk l${i} ${extra || ''}" title="Marche estimée d'après les activités du jour">`
    + [0, 1, 2, 3].map(k => `<i class="${k < i ? 'on' : ''}"></i>`).join('')
    + `<span class="mot">${PALIERS[i][1]}</span></span>`;
}
const DEBUT = '2026-10-13', FIN = '2026-11-04';
const JOURS = Math.round((new Date(FIN) - new Date(DEBUT)) / 864e5) + 1;

/* ---------- petits pictos ---------- */
const I = {
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21.2s-6.8-6-6.8-11.2a6.8 6.8 0 0 1 13.6 0c0 5.2-6.8 11.2-6.8 11.2z"/><circle cx="12" cy="9.6" r="2.4"/></svg>',
  train: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="13.5" rx="4"/><path d="M5 11h14M8.5 21l2-4.5M15.5 21l-2-4.5"/><circle cx="9" cy="7.5" r=".6" fill="currentColor"/><circle cx="15" cy="7.5" r=".6" fill="currentColor"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.8 2H4.2z"/><path d="M10 21.5h4"/></svg>',
  chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  drop: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5c4 5.3 6.2 8.4 6.2 11.1A6.2 6.2 0 0 1 5.8 13.6C5.8 10.9 8 7.8 12 2.5z"/></svg>',
  shirt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3 4 5.5 5.5 10 8 9v11h8V9l2.5 1L20 5.5 15 3a3 3 0 0 1-6 0z"/></svg>',
  fleche: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg>',
  photo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5.5" width="18" height="14" rx="3.4"/><path d="m3.6 16.4 4.1-4a2 2 0 0 1 2.8 0l3.3 3.2M13.4 14l1.7-1.6a2 2 0 0 1 2.8 0l2.5 2.4"/><circle cx="8.6" cy="10.2" r="1.5"/></svg>',
  copie: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11.5" height="11.5" rx="3"/><path d="M15 6.2V6a2.5 2.5 0 0 0-2.5-2.5H6A2.5 2.5 0 0 0 3.5 6v6.5A2.5 2.5 0 0 0 6 15h.2"/></svg>',
  histo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3.2 10.4A9 9 0 1 1 4 15.5"/><path d="M2.6 5.6v4.8h4.8M12 7.6V12l3.2 1.9"/></svg>',
  ticket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V7a1.6 1.6 0 0 1 1.6-1.6h12.8A1.6 1.6 0 0 1 20 7v2a2.4 2.4 0 0 0 0 6v2a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 17v-2a2.4 2.4 0 0 0 0-6z"/><path d="M14.2 6.2v1.6M14.2 11.2v1.6M14.2 16.2v1.6"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"><path d="M12 5.5v13M5.5 12h13"/></svg>',
  croix: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg>',
  cadenas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="10.5" width="15" height="10" rx="2.6"/><path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7M12 14.6v2.4"/></svg>',
  corbeille: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9.5 7V4.8A1.3 1.3 0 0 1 10.8 3.5h2.4a1.3 1.3 0 0 1 1.3 1.3V7M6.5 7l.8 12.1a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4L17.5 7"/></svg>',
  plane: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.2 10.6 3.4 8.8a.6.6 0 0 1-.2-1l1-.8a.9.9 0 0 1 .8-.2l5.7 1.1 3-3a2.3 2.3 0 0 1 3.3 3.2l-3 3 1.1 5.8a.9.9 0 0 1-.2.8l-.8 1a.6.6 0 0 1-1-.2l-1.8-6.9-2.5 2.5.3 2.3a.8.8 0 0 1-.2.6l-.6.7a.5.5 0 0 1-.9-.2L7 16.9l-1.3-.4a.5.5 0 0 1-.2-.9l.7-.6a.8.8 0 0 1 .6-.2l2.3.3z"/></svg>',
  leaf: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.2 18.2 6.95 18.13 6.54 17.36 3.3 15.59 6.98 15.42 7.69 14.91 7.6 15.06 6.13 14.21 5.66 12.71 3.39 8.36 7.57 10.94 9.03 11.51 10.14 12.87 9.49 10.32 10.24 8.06 12 2.2 13.76 8.06 14.51 10.32 13.86 12.87 14.97 11.51 16.43 10.94 20.61 8.36 18.34 12.71 17.87 14.21 16.4 15.06 16.31 14.91 17.02 15.42 20.7 15.59 17.46 17.36 17.05 18.13 15.8 18.2Z"/><path stroke="currentColor" stroke-width="1.15" stroke-linecap="round" d="M12 17.3v5"/></svg>'
};

/* ============================================================
   Les feuilles qui tombent
   ============================================================ */
const FEUILLES = {
  momiji: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M8.2 18.2 6.95 18.13 6.54 17.36 3.3 15.59 6.98 15.42 7.69 14.91 7.6 15.06 6.13 14.21 5.66 12.71 3.39 8.36 7.57 10.94 9.03 11.51 10.14 12.87 9.49 10.32 10.24 8.06 12 2.2 13.76 8.06 14.51 10.32 13.86 12.87 14.97 11.51 16.43 10.94 20.61 8.36 18.34 12.71 17.87 14.21 16.4 15.06 16.31 14.91 17.02 15.42 20.7 15.59 17.46 17.36 17.05 18.13 15.8 18.2Z"/><path stroke="currentColor" stroke-width="1.15" stroke-linecap="round" d="M12 17.3v5"/></svg>',
  ginkgo: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2.4c3.4 2.5 6 7 7 12.1-2.1 1.3-4.5 2-7 2s-4.9-.7-7-2c1-5.1 3.6-9.6 7-12.1z"/><path stroke="currentColor" stroke-width="1.4" stroke-linecap="round" d="M12 17v4.6"/></svg>',
  sakura: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2.8c3 2.2 4.9 5.2 4.9 8 0 3-2.2 5.4-4.9 5.4S7.1 13.8 7.1 10.8c0-2.8 1.9-5.8 4.9-8z"/></svg>'
};
const TONS = ['#E0A944', '#D2522F', '#E07A3E', '#CE9240', '#E79BB0', '#C25A34'];

function semerFeuilles(hote, n, o) {
  if (!hote) return;
  const noms = Object.keys(FEUILLES);
  let html = '';
  for (let i = 0; i < n; i++) {
    const t = FEUILLES[noms[(Math.random() * noms.length) | 0]];
    const taille = (o.min + Math.random() * (o.max - o.min)).toFixed(0);
    const duree = (o.dur[0] + Math.random() * (o.dur[1] - o.dur[0])).toFixed(1);
    html += `<b style="left:${(Math.random() * 104 - 2).toFixed(1)}%;width:${taille}px;height:${taille}px;`
      + `color:${TONS[(Math.random() * TONS.length) | 0]};`
      + `--dx:${(Math.random() * 130 - 65) | 0}px;--rot:${(Math.random() * 640 - 240) | 0}deg;`
      + `--fallto:${o.dist};--o:${o.op};`
      + `animation-duration:${duree}s;animation-delay:-${(Math.random() * duree).toFixed(1)}s">${t}</b>`;
  }
  hote.innerHTML = html;
}
function feuillage() {
  const h = document.querySelector('.top').offsetHeight;
  semerFeuilles($('#headLeaves'), 9, {min: 11, max: 22, dur: [9, 17], dist: (h + 60) + 'px', op: .62});
  semerFeuilles($('#petals'), 7, {min: 13, max: 26, dur: [18, 32], dist: '115vh', op: .13});
}

/* ============================================================
   Icônes météo
   ============================================================ */
function wicon(k, w) {
  const sun = (cx, cy, r) => `<g style="transform-origin:${cx}px ${cy}px;animation:spin 26s linear infinite">`
    + Array.from({length: 8}, (_, i) => { const a = i * Math.PI / 4, d1 = r + 3.2, d2 = r + 9.5;
        return `<line x1="${(cx + Math.cos(a) * d1).toFixed(1)}" y1="${(cy + Math.sin(a) * d1).toFixed(1)}" x2="${(cx + Math.cos(a) * d2).toFixed(1)}" y2="${(cy + Math.sin(a) * d2).toFixed(1)}" stroke="url(#gSun)" stroke-width="2.6" stroke-linecap="round"/>`; }).join('')
    + `</g><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#gSun)"/>`;
  const cloud = (dx, dy, s, g) => `<g transform="translate(${dx} ${dy}) scale(${s})" fill="url(#${g || 'gCloud'})">`
    + `<circle cx="24" cy="26" r="10"/><circle cx="38" cy="28" r="8.2"/><circle cx="31" cy="21" r="9"/>`
    + `<rect x="15" y="29" width="31" height="11" rx="5.5"/></g>`;
  // Le <g> porte la position, le <path> porte l'animation : une transform CSS
  // sur l'élément remplacerait l'attribut transform, et la goutte partirait en 0,0.
  const gouttes = (n, dx) => Array.from({length: n}, (_, i) =>
    `<g transform="translate(${(dx || 20) + i * 9} 41) scale(.82)"><path d="M0 0c2.3 3 3.5 4.6 3.5 6.1a3.5 3.5 0 0 1-7 0C-3.5 4.6-2.3 3 0 0z" fill="url(#gDrop)" style="animation:rainfall 1.5s ${(i * .35).toFixed(2)}s ease-in infinite"/></g>`).join('');
  const corps = {
    soleil: sun(32, 25, 11),
    eclaircies: sun(19, 18, 8) + cloud(13, 10, .88),
    nuages: cloud(-5, -4, .82, 'gCloudD') + cloud(8, 5, .95),
    averses: sun(18, 16, 7) + cloud(14, 6, .84) + gouttes(2, 28),
    pluie: cloud(0, -2, .95, 'gCloudD') + gouttes(3)
  }[k] || '';
  return `<svg viewBox="0 0 64 52"${w ? ` style="width:${w}px"` : ''} aria-hidden="true">${corps}</svg>`;
}

/* ============================================================
   Bandeau : compte à rebours + où on est
   ============================================================ */
(() => {
  const debut = D(DEBUT), fin = D(FIN), now = D(todayStr);
  const n = Math.round((debut - now) / 864e5);
  $('#count').textContent = n > 1 ? `Départ dans ${n} jours`
    : n === 1 ? 'Départ demain !'
    : now <= fin ? `Jour ${Math.round((now - debut) / 864e5) + 1} sur ${JOURS}`
    : 'Bon retour à Paris';
  const ici = ETAPES.find(e => todayStr >= e.du && todayStr <= e.au);
  const w = $('#where');
  if (ici) { w.textContent = '📍 ' + (NOM[ici.lieu] || ici.lieu); w.hidden = false; }
  else if (n > 0) { w.textContent = `${ETAPES.length} étapes · ${JOURS} jours`; w.hidden = false; }
})();

/* ============================================================
   Onglet Météo
   ============================================================ */
(() => {
  const toutes = METEO.flatMap(d => [d.max, d.min]);
  const lo = Math.min(...toutes) - 1, hi = Math.max(...toutes) + 1;
  const p = v => (v - lo) / (hi - lo) * 100;
  const seau = {p: '', v: ''}, dernier = {p: null, v: null};
  let i = 0, nbPasses = 0;
  for (let k = 0; k < METEO.length; k++) {
    const d = METEO[k], b = passe(d.date) ? 'p' : 'v';
    if (b === 'p') nbPasses++;
    if (dernier[b] !== d.lieu) {
      // la série s'arrête au changement de lieu, mais aussi au bord du tiroir
      let j = k;
      while (j + 1 < METEO.length && METEO[j + 1].lieu === d.lieu && (passe(METEO[j + 1].date) ? 'p' : 'v') === b) j++;
      const finEtape = METEO[j].date;
      seau[b] += `<div class="stage-h stagger" style="--i:${i++}"><b>${esc(NOM[d.lieu] || d.lieu)}</b>`
        + `<span>${fDm.format(D(d.date))}${finEtape !== d.date ? ' → ' + fDm.format(D(finEtape)) : ''}</span></div>`;
      dernier[b] = d.lieu;
    }
    const hist = Object.entries(d.hist || {});
    const ligneH = hist.map(([y, [mx, mn, mm]]) => `<tr><td>${y}</td><td>${mx}° / ${mn}°</td><td>${mm >= 1 ? '☂ ' + String(mm).replace('.', ',') + ' mm' : 'sec'}</td></tr>`).join('');
    const ligneS = d.src ? Object.entries(d.src).map(([s, [mx, mn, pc]]) => `<tr><td>${esc(s)}</td><td>${mx}° / ${mn}°</td><td>${pc == null ? '—' : pc + ' % pluie'}</td></tr>`).join('') : '';
    const detail = (ligneS ? `<tr><th>Prévisions</th><th></th><th></th></tr>` + ligneS : '')
                 + (ligneH ? `<tr><th>Même jour, les années passées</th><th></th><th></th></tr>` + ligneH : '');
    const tags = [
      `<span class="tag wear">${I.shirt}${TENUE(d)}</span>`,
      d.pluie != null ? `<span class="tag rain">${I.drop}${d.pluie} % de pluie</span>` : '',
      d.rainy != null ? `<span class="tag ${d.rainy ? 'rain' : 'dry'}" title="Années où il a plu ce jour-là">${d.rainy ? I.drop : ''}${d.rainy ? d.rainy + '/3 ans de pluie' : '3 ans au sec'}</span>` : '',
      jauge(d.date, 'tag'),
    ].filter(Boolean).join('');
    seau[b] += `<article class="day stagger${d.type === 'tendance' ? ' tend' : ''}${d.date === todayStr ? ' today' : ''}" id="j-${d.date}" style="--i:${i++}">
      <div class="dayTop">
        <div class="dnum"><small>${fWd.format(D(d.date)).replace('.', '')}</small><strong>${D(d.date).getDate()}</strong></div>
        <div class="dico">${wicon(d.ciel)}</div>
        <div class="dmain">
          <div class="dtemps"><b class="mx">${d.max}°</b><span class="mn">${d.min}°</span></div>
          <div class="bar"><span style="left:${p(d.min).toFixed(1)}%;width:${(p(d.max) - p(d.min)).toFixed(1)}%"></span></div>
          <div class="ciel">${CIEL[d.ciel]}${d.type === 'tendance' ? ' · tendance' : ''}</div>
        </div>
      </div>
      <div class="tags">${tags}</div>
      ${detail ? `<details class="more"><summary>Les chiffres source ${I.chev}</summary><table class="mini">${detail}</table></details>` : ''}
    </article>`;
  }
  $('#meteo').innerHTML = tiroir(seau.p, nbPasses, ['jour passé', 'jours passés']) + seau.v;
  $('#maj').textContent = `Prévisions relevées le ${METEO_MAJ} (JMA, Weather Company, AccuWeather). Les relevés des années passées viennent de l'agence météo japonaise.`;
})();

/* ============================================================
   Onglet Itinéraire
   ============================================================ */
(() => {
  const passees = [], aVenir = [];
  ETAPES.forEach((e, i) => (passe(e.au) ? passees : aVenir).push(((e, i) => {
    const prec = ETAPES[i - 1], t = e.trajet;
    const quand = e.du === e.au ? fDm.format(D(e.du)) : `${fDm.format(D(e.du))} → ${fDm.format(D(e.au))}`;
    const depuis = t && t.depart ? t.depart : prec && (prec.lieu + ', Japon');
    const vers = t && t.arrivee ? t.arrivee : e.lieu + ', Japon';
    // Les billets du trajet : les activités « transport » du jour d'arrivée (un → dans le titre).
    const billetsJour = t ? ACTS.filter(a => a.date === e.du && a.billet && a.titre.includes('→')) : [];
    const pieces = billetsJour.map(a => `<div class="pieces" data-pieces="${idBillet(a)}" data-cap="${esc(a.titre.split('·')[0].trim())}" data-jour="${a.date}"></div>`).join('');
    const bloc = t ? `<div class="trajet">
        <div class="mode">${I.train}<span>${esc(t.mode || 'Trajet')}${t.duree ? ' · ' + esc(t.duree) : ''}</span>${t.prix ? `<span class="tag">${esc(t.prix)}</span>` : ''}${t.aVerifier ? '<span class="tag est">à confirmer</span>' : ''}</div>
        ${t.depart || t.arrivee ? `<div class="path"><i></i>${esc(t.depart || '?')}<em>—</em><i class="end"></i>${esc(t.arrivee || '?')}</div>` : ''}
        ${[].concat(t.details || []).map(x => `<div class="det">${esc(x)}</div>`).join('')}
        ${pieces ? `<div class="billetsTrajet">${pieces}</div>` : ''}
      </div>` : '';
    return `<div class="leg stagger" style="--i:${i}">
      <div class="rail"><span class="dot">${I.leaf}</span><span class="line"></span></div>
      <div class="card">
        <div class="stage-top"><h3>${esc(NOM[e.lieu] || e.lieu)}</h3><span class="nights">${e.nuits ? e.nuits + (e.nuits > 1 ? ' nuits' : ' nuit') : 'de passage'}</span></div>
        <div class="meta">${quand}</div>
        ${e.note ? `<p class="note">${esc(e.note)}</p>` : ''}
        ${bloc}
        <div class="btns">
          <a class="btn" href="${maps(e.lieu + ', Japon')}" target="_blank" rel="noopener">${I.pin}Carte</a>
          ${prec ? `<a class="btn pri" href="${route(depuis, vers)}" target="_blank" rel="noopener">${I.train}Trajet</a>` : ''}
        </div>
      </div></div>`;
  })(e, i)));
  $('#itin').innerHTML = tiroir(passees.join(''), passees.length, ['étape passée', 'étapes passées']) + aVenir.join('');
})();

/* ============================================================
   Onglet Activités
   ============================================================ */
(() => {
  if (!ACTS.length) {
    const branche = `<svg class="art" viewBox="0 0 100 100" aria-hidden="true">
      <path d="M8 92c22-6 36-20 44-36 6-12 14-22 26-30" fill="none" stroke="var(--line)" stroke-width="3" stroke-linecap="round"/>
      <path d="M46 62c8-4 16-4 24 2M34 76c-6-6-14-8-22-7" fill="none" stroke="var(--line)" stroke-width="2.5" stroke-linecap="round"/>
      ${[[72, 24, 13], [68, 66, 10], [11, 68, 9], [52, 48, 7]].map(([x, y, r]) =>
        `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map(a =>
          `<ellipse rx="${(r * .44).toFixed(1)}" ry="${(r * .66).toFixed(1)}" cy="${(-r * .46).toFixed(1)}" transform="rotate(${a})" fill="currentColor"/>`).join('')}<circle r="${(r * .22).toFixed(1)}" fill="var(--kin)"/></g>`).join('')}
    </svg>`;
    $('#acts').innerHTML = `<div class="empty stagger">${branche}<b>Pas encore d'activités</b>
      <p>Ajoutez-les dans <em>data.js</em>, une ligne par activité. Le lien Google Maps se fabrique tout seul à partir de l'adresse.</p>
      <code>{ date: "2026-10-21", heure: "08:00",
  titre: "Fushimi Inari",
  adresse: "68 Fukakusa Yabunouchicho, Kyoto",
  note: "Y aller tôt" },</code></div>`;
    return;
  }
  const parJour = {};
  ACTS.forEach((a, i) => (parJour[a.date] ||= []).push({...a, i}));
  let n = 0;
  const passees = [], aVenir = [];
  Object.entries(parJour).forEach(([date, liste]) => {
    const m = METEO.find(x => x.date === date);
    (passe(date) ? passees : aVenir).push(`<div class="act-day stagger${date === todayStr ? ' today' : ''}" id="a-${date}" style="--i:${n++}">
        <b>${esc(fLong.format(D(date)))}</b>
        <span class="dmeta">${m ? `<span class="w">${wicon(m.ciel, 28)}${m.max}° / ${m.min}°</span>` : ''}${jauge(date)}</span>
      </div>`
      + liste.map(a => `<div class="card act stagger${a.heure ? '' : ' noh'}" style="--i:${n++}">
          ${a.heure ? `<div class="time">${esc(a.heure)}</div>` : ''}
          <div>
            <h3>${esc(a.titre)}</h3>
            ${a.adresse ? `<div class="addr">${I.pin}<span>${esc(a.adresse)}</span></div>` : ''}
            ${a.note ? `<p class="note">${esc(a.note)}</p>` : ''}
            ${a.billet ? `<div class="billet ${a.billet === 'pris' ? 'ok' : 'att'}">${I.ticket}<span>${a.billet === 'pris' ? 'Billet en main' : 'Billet à récupérer auprès de Selma'}</span></div>
            <div class="pieces" data-pieces="${idBillet(a)}" data-joindre></div>` : ''}
            <div class="btns">
              ${a.adresse ? `<a class="btn pri" href="${maps(a.adresse)}" target="_blank" rel="noopener">${I.pin}Google Maps</a>` : ''}
              ${a.vol ? `<a class="btn" href="${flightaware(a.vol)}" target="_blank" rel="noopener">${I.plane}Suivre le vol</a>` : ''}
              <button class="btn" data-ics="${a.i}">${I.bell}${a.heure ? 'Rappel' : 'Calendrier'}</button>
            </div>
          </div></div>`).join(''));
  });
  $('#acts').innerHTML = tiroir(passees.join(''), passees.length, ['jour passé', 'jours passés']) + aVenir.join('');
  const attendus = ACTS.filter(a => a.billet === 'attendu' && !passe(a.date)).length;
  const pris = ACTS.filter(a => a.billet === 'pris' && !passe(a.date)).length;
  if (attendus || pris) $('#billets').innerHTML =
    `<a class="recap" href="selma.html">${I.ticket}<span>${attendus ? `<b>${attendus}</b> billet${attendus > 1 ? 's' : ''} à récupérer auprès de Selma` : ''}`
    + `${attendus && pris ? ' · ' : ''}${pris ? `<b>${pris}</b> en main` : ''}<em>Ouvrir sa to-do</em></span>`
    + I.fleche.replace('<svg ', '<svg class="f" ') + `</a>`;

  $('#acts').addEventListener('click', ev => {
    const b = ev.target.closest('[data-ics]'); if (!b) return;
    const a = ACTS[+b.dataset.ics];
    telecharge(buildIcs([evtActivite(a)]), a.titre);
  });
})();

/* ============================================================
   Onglet Billets : tout ce qui a un billet, dans l'ordre du voyage.
   Les vignettes sont posées par le module « billets » plus bas.
   ============================================================ */
(() => {
  const liste = ACTS.map((a, i) => ({a, i})).filter(x => x.a.billet);
  if (!liste.length) { $('#billetsListe').innerHTML = '<div class="empty stagger"><b>Aucun billet à suivre</b></div>'; return; }
  let n = 0;
  const carte = ({a}) => `<div class="card bil stagger" style="--i:${n++}">
      <div class="quand">${esc(fLong.format(D(a.date)))}${a.heure ? ' · ' + esc(a.heure) : ''}</div>
      <h3>${esc(a.titre)}</h3>
      <div class="billet ${a.billet === 'pris' ? 'ok' : 'att'}">${I.ticket}<span>${a.billet === 'pris' ? 'Billet en main' : 'Billet à récupérer auprès de Selma'}</span></div>
      <div class="pieces" data-pieces="${idBillet(a)}" data-joindre></div>
    </div>`;
  const passees = liste.filter(x => passe(x.a.date)).map(carte), aVenir = liste.filter(x => !passe(x.a.date)).map(carte);
  $('#billetsListe').innerHTML = tiroir(passees.join(''), passees.length, ['billet expiré', 'billets expirés']) + aVenir.join('');
})();

/* ============================================================
   Onglet Les apps sur place
   Un appui tente d'ouvrir l'app installée via son schéma d'URL ;
   si rien ne se passe, on bascule sur l'App Store. Les schémas ne
   sont pas documentés par les éditeurs : celui qui échoue est
   retenu une fois pour toutes, et l'appui suivant va droit au but.
   ============================================================ */
(() => {
  const liste = typeof APPS !== 'undefined' ? APPS : [];
  const icones = typeof ICONES_APPS !== 'undefined' ? ICONES_APPS : {};
  if (!liste.length) return;
  const CLE = 'japon.schemas.hs';
  const lireHS = () => { try { return new Set(JSON.parse(localStorage.getItem(CLE) || '[]')); } catch { return new Set(); } };
  const ecrireHS = s => { try { localStorage.setItem(CLE, JSON.stringify([...s])); } catch {} };
  const boutique = a => `https://apps.apple.com/fr/app/id${a.id}`;

  $('#apps').innerHTML = liste.map((a, i) => `
    <div class="card appli stagger" data-appli="${i}" role="link" tabindex="0" style="--i:${i}">
      ${icones[a.id] ? `<img src="${icones[a.id]}" alt="" width="52" height="52">` : '<span class="vide"></span>'}
      <div class="role">${esc(a.role || a.nom)}</div>
      ${I.fleche.replace('<svg ', '<svg class="fleche" ')}
      <div class="nom">${esc(a.nom)}${a.schema && a.aVerifier ? '<span class="tag est">ouverture à tester</span>' : ''}</div>
      <div class="desc">${esc(a.desc || '')}</div>
    </div>`).join('');

  function ouvrir(a) {
    const hs = lireHS();
    if (!a.schema || hs.has(String(a.id))) { location.href = boutique(a); return; }
    let parti = false;
    const vu = () => { parti = true; };
    document.addEventListener('visibilitychange', vu, {once: true});
    window.addEventListener('pagehide', vu, {once: true});
    location.href = a.schema;
    setTimeout(() => {
      document.removeEventListener('visibilitychange', vu);
      window.removeEventListener('pagehide', vu);
      if (parti || document.hidden) { hs.delete(String(a.id)); ecrireHS(hs); return; }
      hs.add(String(a.id)); ecrireHS(hs);        // ce schéma ne marche pas : on ne réessaie plus
      location.href = boutique(a);
    }, 1400);
  }

  const cible = ev => { const c = ev.target.closest('[data-appli]'); return c ? liste[+c.dataset.appli] : null; };
  $('#apps').addEventListener('click', ev => { const a = cible(ev); if (a) ouvrir(a); });
  $('#apps').addEventListener('keydown', ev => {
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    const a = cible(ev); if (a) { ev.preventDefault(); ouvrir(a); }
  });
})();

/* ============================================================
   Onglet Album partagé
   Apple refuse l'affichage dans un cadre (X-Frame-Options), donc
   on ouvre l'album : sur iPhone le lien bascule dans l'app Photos.
   ============================================================ */
(() => {
  const al = typeof ALBUM !== 'undefined' ? ALBUM : null;
  if (!al || !al.lien) {
    $('#album').innerHTML = `<div class="empty stagger"><b>Pas encore d'album</b>
      <p>Ajoutez le lien de votre album iCloud partagé dans <em>data.js</em>.</p></div>`;
    return;
  }
  $('#album').innerHTML = `<div class="card albumCard stagger">
      <div class="pile"><span>${I.photo}</span><span>${I.photo}</span><span>${I.leaf}</span></div>
      <h3>${esc(al.titre || 'Album partagé')}</h3>
      <p class="note">Sur iPhone, le lien ouvre directement l'app Photos. Chacun peut y déposer ses photos et ses vidéos, et voir celles des autres.</p>
      <div class="btns">
        <a class="btn warm" href="${esc(al.lien)}" target="_blank" rel="noopener">${I.photo}Ouvrir l'album</a>
        <button class="btn" id="copierAlbum">${I.copie}Copier le lien</button>
      </div>
    </div>
    <p class="copie" id="copieOk"></p>`;

  $('#copierAlbum').addEventListener('click', async () => {
    const dire = m => { $('#copieOk').textContent = m; setTimeout(() => ($('#copieOk').textContent = ''), 2600); };
    try {
      await navigator.clipboard.writeText(al.lien);
      dire('Lien copié, prêt à envoyer');
    } catch {
      // Safari refuse le presse-papiers hors geste direct : on sélectionne à la place
      const z = document.createElement('textarea');
      z.value = al.lien; z.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(z); z.select();
      dire(document.execCommand('copy') ? 'Lien copié, prêt à envoyer' : 'Copie refusée, ouvrez l\'album et partagez depuis Photos');
      z.remove();
    }
  });
})();

/* ============================================================
   Calendrier : la notification vient du calendrier du
   téléphone, à l'heure de Tokyo. Gratuit, sans serveur.
   ============================================================ */
const TZ_DEFAUT = 'Asia/Tokyo';
const fixe = (id, dec, nom) => ['BEGIN:VTIMEZONE', 'TZID:' + id, 'BEGIN:STANDARD', 'DTSTART:19700101T000000',
  'TZOFFSETFROM:' + dec, 'TZOFFSETTO:' + dec, 'TZNAME:' + nom, 'END:STANDARD', 'END:VTIMEZONE'];
const FUSEAUX = {
  'Asia/Tokyo': fixe('Asia/Tokyo', '+0900', 'JST'),
  'Asia/Ho_Chi_Minh': fixe('Asia/Ho_Chi_Minh', '+0700', 'ICT'),
  // Paris change d'heure : le 13 octobre on est encore en CEST, le 4 novembre en CET.
  'Europe/Paris': ['BEGIN:VTIMEZONE', 'TZID:Europe/Paris',
    'BEGIN:DAYLIGHT', 'DTSTART:19700329T020000', 'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
    'TZOFFSETFROM:+0100', 'TZOFFSETTO:+0200', 'TZNAME:CEST', 'END:DAYLIGHT',
    'BEGIN:STANDARD', 'DTSTART:19701025T030000', 'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
    'TZOFFSETFROM:+0200', 'TZOFFSETTO:+0100', 'TZNAME:CET', 'END:STANDARD', 'END:VTIMEZONE']
};
const icsTxt = s => String(s ?? '').replace(/\\/g, '\\\\').replace(/[,;]/g, m => '\\' + m).replace(/\r?\n/g, '\\n');
const ymd = d => d.replace(/-/g, '');
const stamp = () => new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
const slug = s => String(s || 'japon').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w]+/g, '_').replace(/^_|_$/g, '').slice(0, 40) || 'japon';

// Une ligne ICS ne doit pas dépasser 75 octets : on la replie avec une espace.
function fold(line) {
  const enc = new TextEncoder(); let out = '', cur = '';
  for (const ch of line) {
    if (enc.encode(cur + ch).length > 72) { out += cur + '\r\n'; cur = ' ' + ch; }
    else cur += ch;
  }
  return out + cur;
}
function evtActivite(a) {
  // l'UID doit être unique : sinon le calendrier fusionne deux activités du même jour
  const base = {
    uid: ymd(a.date) + '-' + slug(a.titre), titre: a.titre, lieu: a.adresse,
    tz: FUSEAUX[a.tz] ? a.tz : TZ_DEFAUT,
    desc: [a.note, a.adresse && maps(a.adresse), a.vol && flightaware(a.vol)].filter(Boolean).join('\n')
  };
  // sans horaire, on pose une journée entière plutôt qu'une fausse alerte à 9 h
  if (!/^\d{2}:\d{2}$/.test(a.heure || ''))
    return {...base, allDay: true, start: ymd(a.date), end: ymd(addDays(a.date, 1))};
  const deb = (+a.heure.slice(0, 2)) * 60 + (+a.heure.slice(3, 5));
  const fin = Math.min(deb + (Number(a.duree) > 0 ? Number(a.duree) : 120), 23 * 60 + 59);
  const hm = m => String(Math.floor(m / 60)).padStart(2, '0') + String(m % 60).padStart(2, '0') + '00';
  return {...base, start: ymd(a.date) + 'T' + hm(deb), end: ymd(a.date) + 'T' + hm(fin), alarm: '1H'};
}
function evtEtape(e, i) {
  const t = e.trajet;
  return {
    uid: ymd(e.du) + '-etape' + i, allDay: true, titre: 'Japon · ' + (NOM[e.lieu] || e.lieu),
    lieu: e.lieu + ', Japon', start: ymd(e.du), end: ymd(e.nuits ? e.au : addDays(e.du, 1)),
    desc: [e.note, t && [t.mode, t.duree, t.depart && t.depart + ' → ' + t.arrivee, t.details].filter(Boolean).join(' · ')].filter(Boolean).join('\n')
  };
}
function buildIcs(events) {
  const zones = [...new Set(events.filter(e => !e.allDay).map(e => e.tz || TZ_DEFAUT))];
  const L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Japon 2026//FR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'X-WR-CALNAME:Japon 2026', 'X-WR-TIMEZONE:Asia/Tokyo', ...zones.flatMap(z => FUSEAUX[z])];
  for (const ev of events) {
    L.push('BEGIN:VEVENT', 'UID:' + ev.uid + '@japon2026', 'DTSTAMP:' + stamp());
    if (ev.allDay) L.push('DTSTART;VALUE=DATE:' + ev.start, 'DTEND;VALUE=DATE:' + ev.end);
    else { const z = ev.tz || TZ_DEFAUT; L.push('DTSTART;TZID=' + z + ':' + ev.start, 'DTEND;TZID=' + z + ':' + ev.end); }
    L.push('SUMMARY:' + icsTxt(ev.titre));
    if (ev.lieu) L.push('LOCATION:' + icsTxt(ev.lieu));
    if (ev.desc) L.push('DESCRIPTION:' + icsTxt(ev.desc));
    if (ev.alarm) L.push('BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + icsTxt(ev.titre), 'TRIGGER:-PT' + ev.alarm, 'END:VALARM');
    L.push('END:VEVENT');
  }
  L.push('END:VCALENDAR');
  return L.map(fold).join('\r\n') + '\r\n';
}
function telecharge(texte, nom) {
  const url = URL.createObjectURL(new Blob([texte], {type: 'text/calendar;charset=utf-8'}));
  const l = document.createElement('a');
  l.href = url; l.download = slug(nom) + '.ics'; l.rel = 'noopener';
  document.body.appendChild(l); l.click(); l.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
document.querySelectorAll('[data-cal-all]').forEach(b => b.addEventListener('click', () => {
  telecharge(buildIcs([...ETAPES.map(evtEtape), ...ACTS.map(evtActivite)]), 'japon-2026');
}));

/* ============================================================
   Billets sur ce téléphone
   Le dépôt est public : un QR de billet n'y a pas sa place, qui le
   scanne monte à notre place. Chacun joint donc ses captures ici ;
   elles restent dans le téléphone (IndexedDB, la même réserve que
   la to-do de Selma) et s'affichent hors ligne, au portique.
   ============================================================ */
const PIECES = (() => {
  let base = null;
  const ouvrir = () => base ? Promise.resolve(base) : new Promise((ok, ko) => {
    if (!('indexedDB' in window)) return ko(new Error('pas de stockage'));
    const r = indexedDB.open('japon-billets', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('f', {keyPath: 'id'});
    r.onsuccess = () => { base = r.result; ok(base); };
    r.onerror = () => ko(r.error);
  });
  const req = (mode, fn) => ouvrir().then(d => new Promise((ok, ko) => {
    const r = fn(d.transaction('f', mode).objectStore('f'));
    r.onsuccess = () => ok(r.result); r.onerror = () => ko(r.error);
  }));
  return {
    lister: () => req('readonly', c => c.getAll()).then(l => l || []).catch(() => []),
    ajouter: (billet, f) => req('readwrite', c => c.add({
      id: billet + '|' + Date.now() + '|' + Math.random().toString(36).slice(2, 7),
      billet, nom: f.name, type: f.type, taille: f.size, blob: f })),
    retirer: id => req('readwrite', c => c.delete(id)).catch(() => {})
  };
})();

/* Les billets livrés avec l'app sont chiffrés dans le dépôt (outils/chiffrer-billets.mjs).
   Le mot de passe, donné une fois, reste dans le téléphone ; la clé en est dérivée
   à chaque ouverture, et les images déchiffrées ne vivent qu'en mémoire. */
const COFFRE = (() => {
  const CLE = 'japon.billets.mdp', enc = new TextEncoder(), SEL = enc.encode('japon-2026-billets');
  let cle = null, mdpCle = null; const clair = {};
  const lireMdp = () => { try { return localStorage.getItem(CLE) || ''; } catch { return ''; } };
  async function derive(mdp) {
    if (cle && mdpCle === mdp) return cle;
    const base = await crypto.subtle.importKey('raw', enc.encode(mdp), 'PBKDF2', false, ['deriveKey']);
    cle = await crypto.subtle.deriveKey({name: 'PBKDF2', salt: SEL, iterations: 200000, hash: 'SHA-256'},
      base, {name: 'AES-GCM', length: 256}, false, ['decrypt']);
    mdpCle = mdp; return cle;
  }
  // Rend l'URL d'une image déchiffrée. Un mauvais mot de passe fait échouer AES-GCM : on le sait tout de suite.
  async function ouvrir(src, mdp) {
    if (clair[src]) return clair[src];
    const r = await fetch(src); if (!r.ok) throw new Error('fichier absent');
    const buf = new Uint8Array(await r.arrayBuffer());
    if (buf[0] !== 74 || buf[1] !== 66 || buf[2] !== 49) throw new Error('format');   // « JB1 »
    const donnees = await crypto.subtle.decrypt({name: 'AES-GCM', iv: buf.slice(3, 15)}, await derive(mdp), buf.slice(15));
    return (clair[src] = URL.createObjectURL(new Blob([donnees], {type: 'image/jpeg'})));
  }
  return {
    lireMdp, ouvrir,
    garderMdp: m => { try { localStorage.setItem(CLE, m); } catch {} },
    oublier: () => { try { localStorage.removeItem(CLE); } catch {} cle = null; mdpCle = null; },
    possible: !!(window.crypto && crypto.subtle)
  };
})();

(() => {
  const conts = [...document.querySelectorAll('[data-pieces]')];
  if (!conts.length) return;
  let urls = [], parId = {};
  const url = f => { const u = URL.createObjectURL(f.blob); urls.push(u); return u; };
  const image = f => /^image\//.test(f.type || '');
  // Les billets livrés avec l'app (champ fichiers dans data.js), par clé d'activité.
  const FIXES = {};
  ACTS.forEach(a => { if (a.fichiers && a.fichiers.length) FIXES[idBillet(a)] = a.fichiers; });
  const chiffre = f => /\.enc$/i.test(f.src);
  let verrou = '';   // message quand les billets chiffrés ne sont pas lisibles

  // Déchiffre ce qui peut l'être avec le mot de passe en mémoire ; sinon pose le verrou.
  async function dechiffrerTout() {
    const encs = [...new Set(Object.values(FIXES).flat().filter(chiffre).map(f => f.src))];
    const urlsClair = {};
    if (!encs.length) return urlsClair;
    if (!COFFRE.possible) { verrou = 'Ce navigateur ne sait pas déchiffrer les billets (il faut Safari ou Chrome, en https).'; return urlsClair; }
    const mdp = COFFRE.lireMdp();
    if (!mdp) { verrou = 'mdp'; return urlsClair; }
    try {
      await Promise.all(encs.map(async s => { urlsClair[s] = await COFFRE.ouvrir(s, mdp); }));
      verrou = '';
    } catch (e) {
      if (e && e.name === 'OperationError') { COFFRE.oublier(); verrou = 'mdp'; }
      else verrou = 'Billets indisponibles pour l’instant (pas de réseau ?).';
    }
    return urlsClair;
  }

  // L'état du coffre, en tête de l'onglet Billets.
  function etatCoffre() {
    const z = $('#coffreEtat'); if (!z) return;
    if (!Object.values(FIXES).flat().some(chiffre)) { z.innerHTML = ''; return; }
    if (!verrou) z.innerHTML = `<div class="coffre ok"><span class="ico">${I.cadenas}</span><span class="txt"><b>Billets du groupe déverrouillés</b>Ils restent lisibles sur ce téléphone, même sans réseau.</span>
        <button type="button" class="btn" data-verrouiller>Verrouiller</button></div>`;
    else if (verrou === 'mdp') z.innerHTML = `<div class="coffre"><span class="ico">${I.cadenas}</span><span class="txt"><b>Billets du groupe protégés</b>Le mot de passe est dans la conversation du groupe, à taper une fois.</span>
        <button type="button" class="btn pri" data-cadenas>Mot de passe</button></div>`;
    else z.innerHTML = `<div class="coffre"><span class="ico">${I.cadenas}</span><span class="txt"><b>Billets du groupe indisponibles</b>${esc(verrou)}</span></div>`;
  }

  async function rafraichir() {
    urls.forEach(URL.revokeObjectURL); urls = []; parId = {};
    const [tous, clair] = await Promise.all([PIECES.lister(), dechiffrerTout()]);
    etatCoffre();
    tous.forEach(f => (parId[f.id] = f));
    conts.forEach(c => {
      const fixes = FIXES[c.dataset.pieces] || [];
      const miens = tous.filter(f => f.billet === c.dataset.pieces);
      const vign = fixes.map(f => {
          const src = chiffre(f) ? clair[f.src] : f.src;
          if (!src) return '';
          return `<button type="button" class="piece fixe" data-voir-src="${esc(src)}" data-nom="${esc(f.nom || '')}" aria-label="Afficher ${esc(f.nom || 'le billet')}">`
            + `<img src="${esc(src)}" alt="">${f.nom ? `<span class="lbl">${esc(f.nom.replace(/^Place /, ''))}</span>` : ''}</button>`;
        }).join('')
        + miens.map(f => `<button type="button" class="piece" data-voir="${esc(f.id)}" aria-label="Afficher ${esc(f.nom)}">`
          + (image(f) ? `<img src="${url(f)}" alt="">` : '<span class="pdf">PDF</span>') + '</button>').join('');
      const nbVerrou = fixes.filter(f => chiffre(f) && !clair[f.src]).length;
      const cadenas = !nbVerrou ? '' : verrou === 'mdp'
        ? `<button type="button" class="btn cadenas" data-cadenas>${I.cadenas}${nbVerrou} billet${nbVerrou > 1 ? 's' : ''} · mot de passe</button>`
        : `<span class="verrou">${I.cadenas}${esc(verrou)}</span>`;
      if ('joindre' in c.dataset) {
        c.innerHTML = vign + cadenas + `<label class="btn joindre">${I.plus}${vign ? 'Ajouter' : 'Joindre le billet'}`
          + `<input type="file" accept="image/*,application/pdf" multiple hidden data-pour="${esc(c.dataset.pieces)}"></label>`;
      } else {
        // dans l'itinéraire : les vignettes, ou un renvoi vers le jour dans Activités
        c.innerHTML = `<span class="cap">${esc(c.dataset.cap || 'Billet')}</span>` + vign + cadenas
          + (vign || cadenas ? '' : `<button type="button" class="lien" data-aller="a-${esc(c.dataset.jour)}">joindre depuis Activités ${I.fleche}</button>`);
      }
    });
  }

  // L'écran du mot de passe. Il est demandé une fois par téléphone.
  document.body.insertAdjacentHTML('beforeend', `<div class="voir cadenasVue" id="cadenasVue" hidden>
      <form id="cadenasForm" autocomplete="off">
        <span class="gros">${I.cadenas}</span>
        <h3>Les billets sont protégés</h3>
        <p>Le mot de passe est dans la conversation du groupe. Il suffit de le taper une fois sur ce téléphone.</p>
        <input type="password" id="cadenasMdp" placeholder="Mot de passe" autocapitalize="none" autocorrect="off" spellcheck="false" required>
        <p class="err" id="cadenasErr"></p>
        <div class="btns"><button type="button" class="btn" id="cadenasFermer">${I.croix}Plus tard</button>
          <button type="submit" class="btn pri" id="cadenasOk">${I.cadenas}Déverrouiller</button></div>
      </form></div>`);
  const cadenasVue = $('#cadenasVue');
  document.addEventListener('click', ev => {
    if (!ev.target.closest('[data-cadenas]')) return;
    $('#cadenasErr').textContent = ''; $('#cadenasMdp').value = '';
    cadenasVue.hidden = false; setTimeout(() => $('#cadenasMdp').focus(), 50);
  });
  $('#cadenasFermer').addEventListener('click', () => { cadenasVue.hidden = true; });
  document.addEventListener('click', ev => {
    if (!ev.target.closest('[data-verrouiller]')) return;
    COFFRE.oublier(); rafraichir();
  });
  $('#cadenasForm').addEventListener('submit', async ev => {
    ev.preventDefault();
    const mdp = $('#cadenasMdp').value.trim(), ok = $('#cadenasOk');
    if (!mdp) return;
    ok.disabled = true; ok.textContent = 'Vérification…'; $('#cadenasErr').textContent = '';
    const premier = Object.values(FIXES).flat().find(chiffre);
    try {
      await COFFRE.ouvrir(premier.src, mdp);
      COFFRE.garderMdp(mdp); cadenasVue.hidden = true; await rafraichir();
    } catch (e) {
      $('#cadenasErr').textContent = e && e.name === 'OperationError' ? 'Ce n’est pas le bon mot de passe.' : 'Impossible de lire le billet (réseau ?). Réessaie.';
    }
    ok.disabled = false; ok.innerHTML = `${I.cadenas}Déverrouiller`;
  });

  // Le visualiseur : fond blanc et image en grand, pour que le portique lise le QR.
  document.body.insertAdjacentHTML('beforeend', `<div class="voir" id="voir" hidden>
      <img alt="" id="voirImg">
      <p id="voirNom"></p>
      <div class="btns"><button type="button" class="btn" id="voirFermer">${I.croix}Fermer</button>
        <button type="button" class="btn" id="voirRetirer">${I.corbeille}Retirer</button></div>
    </div>`);
  const voir = $('#voir'); let ouvert = null;
  const fermer = () => { voir.hidden = true; $('#voirImg').src = ''; ouvert = null; };
  const montrer = (src, nom, retirable) => {
    $('#voirImg').src = src; $('#voirNom').textContent = nom || '';
    $('#voirRetirer').hidden = !retirable; voir.hidden = false;
  };
  document.addEventListener('click', ev => {
    const fixe = ev.target.closest('[data-voir-src]');
    if (fixe) { ouvert = null; montrer(fixe.dataset.voirSrc, fixe.dataset.nom, false); return; }
    const b = ev.target.closest('[data-voir]'); if (!b) return;
    const f = parId[b.dataset.voir]; if (!f) return;
    if (!image(f)) { window.open(url(f), '_blank'); return; }
    ouvert = f; montrer(url(f), f.nom, true);
  });
  $('#voirFermer').addEventListener('click', fermer);
  $('#voirImg').addEventListener('click', fermer);
  $('#voirRetirer').addEventListener('click', () => {
    if (!ouvert || !confirm('Retirer ce billet de ce téléphone ?')) return;
    PIECES.retirer(ouvert.id).then(() => { fermer(); rafraichir(); });
  });

  document.addEventListener('change', ev => {
    const inp = ev.target.closest('input[type=file][data-pour]');
    if (!inp || !inp.files || !inp.files.length) return;
    const pour = inp.dataset.pour, fs = [...inp.files];
    inp.value = '';
    Promise.all(fs.map(f => PIECES.ajouter(pour, f))).then(rafraichir)
      .catch(() => alert('Ce fichier n’a pas pu être gardé sur le téléphone.'));
  });

  document.addEventListener('click', ev => {
    const b = ev.target.closest('[data-aller]'); if (!b) return;
    document.querySelector('nav button[data-v="act"]').click();
    setTimeout(() => { const c = document.getElementById(b.dataset.aller); if (c) c.scrollIntoView({block: 'start', behavior: 'smooth'}); }, 420);
  });

  rafraichir();
})();

/* ============================================================
   Navigation
   ============================================================ */
// Chaque onglet a son repère du jour : on y va s'il existe, sinon on remonte.
function versAujourdhui(vue) {
  const v = document.getElementById('v-' + vue);
  const cible = v && (v.querySelector('[id="j-' + todayStr + '"]') || v.querySelector('[id="a-' + todayStr + '"]'));
  if (cible) cible.scrollIntoView({block: 'center', behavior: 'smooth'});
  else window.scrollTo({top: 0, behavior: 'smooth'});
}

(() => {
  const btns = [...document.querySelectorAll('nav button')], ind = $('#ind');
  ind.style.width = `calc((100% - 12px) / ${btns.length})`;
  btns.forEach((b, i) => b.addEventListener('click', () => {
    btns.forEach(x => x.classList.toggle('on', x === b));
    document.querySelectorAll('.view').forEach(v => v.classList.toggle('on', v.id === 'v-' + b.dataset.v));
    ind.style.transform = `translateX(${i * 100}%)`;
    window.scrollTo({top: 0});
    setTimeout(() => versAujourdhui(b.dataset.v), 60);
  }));
})();

addEventListener('load', () => {
  feuillage();
  const actif = document.querySelector('nav button.on');
  if (actif) setTimeout(() => versAujourdhui(actif.dataset.v), 450);
});
let redim; addEventListener('resize', () => { clearTimeout(redim); redim = setTimeout(feuillage, 400); });

/* ---------- rappel d'installation ----------
   Visible seulement pour qui ouvre le lien dans un navigateur :
   une fois l'app sur l'écran d'accueil, elle disparaît. */
(() => {
  const posee = window.navigator.standalone === true || matchMedia('(display-mode: standalone)').matches;
  if (posee) return;
  document.querySelector('main').insertAdjacentHTML('beforeend',
    `<a class="installe" href="installer.html">${I.photo.replace(I.photo, '')}
      <span><b>Ajoute l'app à ton écran d'accueil</b>Elle s'ouvrira en plein écran et marchera sans réseau.</span>
      ${I.fleche.replace('<svg ', '<svg class="f" ')}</a>`);
})();

/* ---------- hors ligne ---------- */
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
