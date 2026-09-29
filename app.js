const AUDIT_ITEMS = [
  { id: 'modules', label: 'Module spezifiziert', hint: 'Hersteller, Typ, Anzahl und Leistung', keywords: ['modul', 'module', 'wp', 'watt peak', 'solarmodul'] },
  { id: 'inverter', label: 'Wechselrichter', hint: 'Hersteller, Typ und Leistung', keywords: ['wechselrichter', 'inverter'] },
  { id: 'mounting', label: 'Montagesystem', hint: 'Unterkonstruktion, Dachhaken, Schienen', keywords: ['montagesystem', 'unterkonstruktion', 'dachhaken', 'alu-schienen', 'schienen'] },
  { id: 'scaffold', label: 'Gerüst / Absturzsicherung', hint: 'Enthalten, separat oder bauseits?', keywords: ['gerüst', 'absturz', 'fanggerüst', 'sicherung'] },
  { id: 'dc', label: 'DC-Verkabelung', hint: 'Stringkabel, Stecker, Erdung, Leitungsweg', keywords: ['solarkabel', 'stringkabel', 'dc-kabel', 'dc verkabel', 'erdung'] },
  { id: 'ac', label: 'AC-Elektroarbeiten', hint: 'Anschluss Wechselrichter bis Zähler / Unterverteilung', keywords: ['ac-kabel', 'ac anschluss', 'elektroarbeiten', 'unterverteilung', 'elektrischer anschluss'] },
  { id: 'meter', label: 'Zählerschrank', hint: 'Umbau / Erneuerung / Zusatzkosten geklärt?', keywords: ['zählerschrank', 'zaehlerschrank', 'zählerplatz', 'zaehlerplatz'] },
  { id: 'storage', label: 'Batteriespeicher', hint: 'Hersteller, Typ, nutzbare Kapazität, Montage', keywords: ['batterie', 'speicher', 'stromspeicher', 'kwh'] },
  { id: 'grid', label: 'Netzanschluss & Inbetriebnahme', hint: 'Netzbetreiber, Inbetriebnahme, Dokumentation', keywords: ['netzbetreiber', 'netzanschluss', 'inbetriebnahme', 'anmeldung'] },
  { id: 'yield', label: 'Ertragsprognose', hint: 'Erwarteter Jahresertrag / Annahmen', keywords: ['ertrag', 'jahresertrag', 'kwh/a', 'prognose'] },
  { id: 'monitoring', label: 'Monitoring / App', hint: 'Portal, Datenlogger oder Energiemanagement', keywords: ['monitoring', 'app', 'datenlogger', 'energiemanagement', 'ems'] },
  { id: 'docs', label: 'Dokumentation & Übergabe', hint: 'Schaltpläne, Datenblätter, Anlagen-/Speicherpass', keywords: ['dokumentation', 'datenblatt', 'schaltplan', 'anlagenpass', 'speicherpass', 'übergabe'] },
  { id: 'warranty', label: 'Garantien / Gewährleistung', hint: 'Produkt-, Leistungs- und Montagebedingungen', keywords: ['garantie', 'gewährleistung', 'gewaehrleistung', 'leistungsgarantie'] }
];

const NEGATIVE_MARKERS = ['nicht enthalten', 'nicht inklusive', 'bauseits', 'zzgl.', 'zzgl ', 'optional', 'gegen aufpreis', 'separat', 'nicht Bestandteil', 'nicht bestandteil'];
const form = document.getElementById('audit-form');
const matrixBody = document.getElementById('scope-body');
const results = document.getElementById('results');
const demoButton = document.getElementById('load-demo');
const resetButton = document.getElementById('reset-audit');
const downloadButton = document.getElementById('download-report');
const copyQuestionsButton = document.getElementById('copy-questions');

function money(value) {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}

function number(value, digits) {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('de-DE', { maximumFractionDigits: digits == null ? 1 : digits }).format(value);
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function field(prefix, name) {
  return document.getElementById(prefix + '-' + name);
}

function buildMatrix() {
  matrixBody.innerHTML = '';
  AUDIT_ITEMS.forEach(function(item) {
    const tr = document.createElement('tr');
    tr.innerHTML =
      '<th scope="row"><span class="check-name">' + escapeHtml(item.label) + '</span><small>' + escapeHtml(item.hint) + '</small></th>' +
      offerCell('a', item) + offerCell('b', item);
    matrixBody.appendChild(tr);
  });
}

function offerCell(prefix, item) {
  return '<td>' +
    '<select class="status-select" id="' + prefix + '-' + item.id + '-status" aria-label="' + escapeHtml(item.label) + ' Status ' + prefix.toUpperCase() + '">' +
      '<option value="unclear">Unklar</option>' +
      '<option value="included">Enthalten</option>' +
      '<option value="excluded">Nicht enthalten</option>' +
      '<option value="na">Nicht relevant</option>' +
    '</select>' +
    '<div class="cost-row"><span>Reserve €</span><input inputmode="decimal" type="number" min="0" step="50" id="' + prefix + '-' + item.id + '-cost" placeholder="0"></div>' +
    '<div class="evidence" id="' + prefix + '-' + item.id + '-evidence">Kein Beleg erkannt</div>' +
  '</td>';
}

function getOffer(prefix) {
  return {
    prefix: prefix,
    name: field(prefix, 'name').value.trim() || ('Angebot ' + prefix.toUpperCase()),
    total: parseFloat(field(prefix, 'total').value) || 0,
    kwp: parseFloat(field(prefix, 'kwp').value) || 0,
    storage: parseFloat(field(prefix, 'storage').value) || 0,
    batteryPrice: parseFloat(field(prefix, 'battery-price').value) || 0,
    text: field(prefix, 'text').value || ''
  };
}

function analyseText(prefix) {
  const offer = getOffer(prefix);
  const lower = offer.text.toLowerCase();

  AUDIT_ITEMS.forEach(function(item) {
    const status = document.getElementById(prefix + '-' + item.id + '-status');
    const evidence = document.getElementById(prefix + '-' + item.id + '-evidence');

    if (item.id === 'storage' && offer.storage <= 0 && !item.keywords.some(function(k) { return lower.includes(k); })) {
      status.value = 'na';
      evidence.textContent = 'Kein Speicher angegeben';
      return;
    }

    let bestIndex = -1;
    let matchedKeyword = '';
    item.keywords.some(function(keyword) {
      const idx = lower.indexOf(keyword);
      if (idx >= 0) {
        bestIndex = idx;
        matchedKeyword = keyword;
        return true;
      }
      return false;
    });

    if (bestIndex < 0) {
      status.value = 'unclear';
      evidence.textContent = 'Im eingefügten Text nicht gefunden';
      return;
    }

    const start = Math.max(0, bestIndex - 100);
    const end = Math.min(offer.text.length, bestIndex + matchedKeyword.length + 140);
    const snippet = offer.text.slice(start, end).replace(/\s+/g, ' ').trim();
    const windowLower = lower.slice(start, end);
    const isNegative = NEGATIVE_MARKERS.some(function(marker) { return windowLower.includes(marker.toLowerCase()); });

    status.value = isNegative ? 'excluded' : 'included';
    evidence.textContent = 'Beleg: “' + snippet + (end < offer.text.length ? '…' : '') + '”';
  });
}

function getAudit(prefix) {
  const offer = getOffer(prefix);
  let included = 0;
  let excluded = 0;
  let unclear = 0;
  let applicable = 0;
  let knownAddOns = 0;
  let uncertaintyReserve = 0;
  let unpricedGaps = 0;
  const items = [];

  AUDIT_ITEMS.forEach(function(item) {
    const status = document.getElementById(prefix + '-' + item.id + '-status').value;
    const reserve = parseFloat(document.getElementById(prefix + '-' + item.id + '-cost').value) || 0;
    const evidence = document.getElementById(prefix + '-' + item.id + '-evidence').textContent;

    if (status !== 'na') applicable += 1;
    if (status === 'included') included += 1;
    if (status === 'excluded') {
      excluded += 1;
      if (reserve > 0) knownAddOns += reserve;
      else unpricedGaps += 1;
    }
    if (status === 'unclear') {
      unclear += 1;
      if (reserve > 0) uncertaintyReserve += reserve;
      else unpricedGaps += 1;
    }
    items.push({ item: item, status: status, reserve: reserve, evidence: evidence });
  });

  const clarity = applicable ? Math.round(((included + excluded) / applicable) * 100) : 100;
  const coverage = applicable ? Math.round((included / applicable) * 100) : 100;
  const floor = offer.total + knownAddOns;
  const ceiling = floor + uncertaintyReserve;
  const headlinePerKwp = offer.kwp > 0 ? offer.total / offer.kwp : NaN;
  const corePrice = offer.batteryPrice > 0 ? offer.total - offer.batteryPrice : NaN;
  const corePerKwp = offer.kwp > 0 && Number.isFinite(corePrice) ? corePrice / offer.kwp : NaN;
  const batteryPerKwh = offer.storage > 0 && offer.batteryPrice > 0 ? offer.batteryPrice / offer.storage : NaN;

  return {
    offer: offer,
    items: items,
    included: included,
    excluded: excluded,
    unclear: unclear,
    applicable: applicable,
    clarity: clarity,
    coverage: coverage,
    knownAddOns: knownAddOns,
    uncertaintyReserve: uncertaintyReserve,
    unpricedGaps: unpricedGaps,
    floor: floor,
    ceiling: ceiling,
    headlinePerKwp: headlinePerKwp,
    corePerKwp: corePerKwp,
    batteryPerKwh: batteryPerKwh
  };
}

function statusLabel(status) {
  return { included: 'Enthalten', excluded: 'Nicht enthalten', unclear: 'Unklar', na: 'n/a' }[status] || status;
}

function deltaSentence(a, b) {
  const nominal = b.offer.total - a.offer.total;
  const floor = b.floor - a.floor;
  const ceiling = b.ceiling - a.ceiling;
  const nominalText = nominal === 0 ? 'gleich teuer' : (nominal < 0 ? money(Math.abs(nominal)) + ' günstiger' : money(nominal) + ' teurer');
  let text = '<strong>Headline:</strong> ' + escapeHtml(b.offer.name) + ' ist ' + nominalText + ' als ' + escapeHtml(a.offer.name) + '. ';

  if (a.unpricedGaps + b.unpricedGaps > 0) {
    text += 'Nach bekannten Zusatzkosten liegt die Differenz bei <strong>' + money(Math.abs(floor)) + '</strong> ' +
      (floor < 0 ? 'zugunsten von ' + escapeHtml(b.offer.name) : floor > 0 ? 'zugunsten von ' + escapeHtml(a.offer.name) : 'ohne Kostenvorteil') +
      '. <strong>' + (a.unpricedGaps + b.unpricedGaps) + ' offene Position(en) sind noch ohne €-Wert.</strong>';
  } else {
    text += 'Nach Normalisierung liegt die Differenz bei <strong>' + money(Math.abs(floor)) + '</strong> ' +
      (floor < 0 ? 'zugunsten von ' + escapeHtml(b.offer.name) : floor > 0 ? 'zugunsten von ' + escapeHtml(a.offer.name) : 'ohne Kostenvorteil') + '.';
  }

  if (a.uncertaintyReserve + b.uncertaintyReserve > 0 && ceiling !== floor) {
    text += ' Unter den eingetragenen Unsicherheitsreserven verschiebt sich die Differenz auf <strong>' + money(Math.abs(ceiling)) + '</strong>.';
  }
  return text;
}

function metricCard(audit, tone) {
  return '<article class="result-card ' + tone + '">' +
    '<div class="result-card-head"><span>' + escapeHtml(audit.offer.name) + '</span><b>' + money(audit.offer.total) + '</b></div>' +
    '<dl>' +
      '<div><dt>Normalisierte Untergrenze</dt><dd>' + money(audit.floor) + '</dd></div>' +
      '<div><dt>Risiko-Obergrenze*</dt><dd>' + money(audit.ceiling) + '</dd></div>' +
      '<div><dt>Headline €/kWp</dt><dd>' + (Number.isFinite(audit.headlinePerKwp) ? money(audit.headlinePerKwp) : '—') + '</dd></div>' +
      '<div><dt>PV-Kern €/kWp**</dt><dd>' + (Number.isFinite(audit.corePerKwp) ? money(audit.corePerKwp) : '—') + '</dd></div>' +
      '<div><dt>Speicher €/kWh**</dt><dd>' + (Number.isFinite(audit.batteryPerKwh) ? money(audit.batteryPerKwh) : '—') + '</dd></div>' +
      '<div><dt>Scope-Klarheit</dt><dd>' + audit.clarity + '%</dd></div>' +
      '<div><dt>Enthaltener Scope</dt><dd>' + audit.coverage + '%</dd></div>' +
      '<div><dt>Offene Positionen ohne €</dt><dd>' + audit.unpricedGaps + '</dd></div>' +
    '</dl>' +
  '</article>';
}

function renderLedger(a, b) {
  const rows = [];
  AUDIT_ITEMS.forEach(function(item, index) {
    const ai = a.items[index];
    const bi = b.items[index];
    if (ai.status !== bi.status || ai.status === 'unclear' || bi.status === 'unclear' || ai.status === 'excluded' || bi.status === 'excluded') {
      rows.push('<tr>' +
        '<th scope="row">' + escapeHtml(item.label) + '</th>' +
        '<td><span class="pill status-' + ai.status + '">' + statusLabel(ai.status) + '</span><small>' + escapeHtml(ai.evidence) + '</small>' + (ai.reserve ? '<em>Reserve: ' + money(ai.reserve) + '</em>' : '') + '</td>' +
        '<td><span class="pill status-' + bi.status + '">' + statusLabel(bi.status) + '</span><small>' + escapeHtml(bi.evidence) + '</small>' + (bi.reserve ? '<em>Reserve: ' + money(bi.reserve) + '</em>' : '') + '</td>' +
      '</tr>');
    }
  });
  return rows.length ? rows.join('') : '<tr><td colspan="3">Keine Scope-Abweichungen erkannt.</td></tr>';
}

function buildQuestions(a, b) {
  const questions = [];
  [a, b].forEach(function(audit) {
    audit.items.forEach(function(entry) {
      if (entry.status === 'unclear') {
        questions.push(audit.offer.name + ': Bitte bestätigen Sie, ob „' + entry.item.label + '“ vollständig im Festpreis enthalten ist und nennen Sie andernfalls die Mehrkosten.');
      } else if (entry.status === 'excluded' && entry.reserve === 0) {
        questions.push(audit.offer.name + ': „' + entry.item.label + '“ ist als nicht enthalten markiert. Welche konkreten Zusatzkosten entstehen dafür?');
      }
    });
  });
  return questions;
}

function renderResults() {
  const a = getAudit('a');
  const b = getAudit('b');
  const questions = buildQuestions(a, b);

  document.getElementById('comparison-summary').innerHTML = deltaSentence(a, b);
  document.getElementById('result-cards').innerHTML = metricCard(a, 'tone-a') + metricCard(b, 'tone-b');
  document.getElementById('ledger-body').innerHTML = renderLedger(a, b);
  document.getElementById('question-list').innerHTML = questions.length
    ? questions.map(function(q) { return '<li>' + escapeHtml(q) + '</li>'; }).join('')
    : '<li>Keine offenen Scope-Fragen aus dem aktuellen Audit.</li>';

  document.getElementById('result-footnote').innerHTML =
    '* Die Risiko-Obergrenze addiert nur Reserven, die du selbst eingetragen hast. Unbekannte Kosten bleiben ausdrücklich unbekannt.<br>' +
    '** Nur berechnet, wenn ein separater Speicherpreis angegeben wurde.';

  results.hidden = false;
  results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function clearAudit() {
  form.reset();
  field('a', 'name').value = 'Angebot A';
  field('b', 'name').value = 'Angebot B';
  buildMatrix();
  results.hidden = true;
}

function loadDemo() {
  clearAudit();
  field('a', 'name').value = 'Solarwerk';
  field('a', 'total').value = '18500';
  field('a', 'kwp').value = '10.8';
  field('a', 'storage').value = '10';
  field('a', 'battery-price').value = '4500';
  field('a', 'text').value =
    'PV-Anlage 10,8 kWp mit 24 Solarmodulen à 450 Wp. Wechselrichter Fronius. 10 kWh Batteriespeicher inklusive Montage. ' +
    'Montagesystem mit Dachhaken und Schienen, Gerüst und Absturzsicherung inklusive. Solarkabel, Stringkabel und Erdung enthalten. ' +
    'AC-Anschluss bis Zählerschrank enthalten. Anpassung Zählerschrank inklusive. Anmeldung beim Netzbetreiber und Inbetriebnahme inklusive. ' +
    'Ertragsprognose 10.300 kWh/a. Monitoring App inklusive. Dokumentation und Datenblätter bei Übergabe. 5 Jahre Montagegarantie.';

  field('b', 'name').value = 'PV Direkt';
  field('b', 'total').value = '17400';
  field('b', 'kwp').value = '10.8';
  field('b', 'storage').value = '10';
  field('b', 'battery-price').value = '3900';
  field('b', 'text').value =
    '10,8 kWp Photovoltaikanlage, 24 Module 450 Wp, Wechselrichter und 10 kWh Stromspeicher. Unterkonstruktion und DC-Verkabelung inklusive. ' +
    'Gerüst bauseits. AC-Elektroarbeiten inklusive. Zählerschrank bei Bedarf gegen Aufpreis. Netzbetreiber-Anmeldung und Inbetriebnahme inklusive. ' +
    'Monitoring über App. Produktgarantien gemäß Herstellerbedingungen.';

  analyseText('a');
  analyseText('b');
  document.getElementById('b-scaffold-cost').value = '1200';
  document.getElementById('b-meter-cost').value = '1500';
  renderResults();
}

function reportText() {
  const a = getAudit('a');
  const b = getAudit('b');
  const questions = buildQuestions(a, b);
  const lines = [
    'TRANSPARENCY LAB — PV QUOTE AUDIT',
    '',
    a.offer.name + ': ' + money(a.offer.total) + ' | normalisierte Untergrenze ' + money(a.floor) + ' | Scope-Klarheit ' + a.clarity + '%',
    b.offer.name + ': ' + money(b.offer.total) + ' | normalisierte Untergrenze ' + money(b.floor) + ' | Scope-Klarheit ' + b.clarity + '%',
    '',
    'ABWEICHUNGEN'
  ];

  AUDIT_ITEMS.forEach(function(item, index) {
    const ai = a.items[index];
    const bi = b.items[index];
    if (ai.status !== bi.status || ['unclear', 'excluded'].includes(ai.status) || ['unclear', 'excluded'].includes(bi.status)) {
      lines.push('- ' + item.label + ': ' + a.offer.name + ' = ' + statusLabel(ai.status) + ', ' + b.offer.name + ' = ' + statusLabel(bi.status));
    }
  });

  lines.push('', 'RÜCKFRAGEN');
  if (questions.length) questions.forEach(function(q) { lines.push('- ' + q); });
  else lines.push('- Keine offenen Scope-Fragen.');

  lines.push('', 'Hinweis: Keine erfundenen Marktpreise. Reserven stammen ausschließlich aus den vom Nutzer eingegebenen Werten.');
  return lines.join('\n');
}

form.addEventListener('submit', function(event) {
  event.preventDefault();
  analyseText('a');
  analyseText('b');
  renderResults();
});

demoButton.addEventListener('click', loadDemo);
resetButton.addEventListener('click', clearAudit);

downloadButton.addEventListener('click', function() {
  const blob = new Blob([reportText()], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'pv-quote-audit.txt';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
});

copyQuestionsButton.addEventListener('click', function() {
  const questions = buildQuestions(getAudit('a'), getAudit('b'));
  const text = questions.join('\n');
  if (!text) return;
  navigator.clipboard.writeText(text).then(function() {
    copyQuestionsButton.textContent = 'Kopiert';
    setTimeout(function() { copyQuestionsButton.textContent = 'Rückfragen kopieren'; }, 1400);
  });
});

buildMatrix();