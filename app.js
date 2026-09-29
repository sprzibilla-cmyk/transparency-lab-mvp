const AUDIT_ITEMS = [
  { id: 'modules', label: 'Module spezifiziert', hint: 'Hersteller, Typ, Anzahl und Leistung', keywords: ['modul', 'module', 'wp', 'watt peak', 'solarmodul'] },
  { id: 'inverter', label: 'Wechselrichter', hint: 'Hersteller, Typ und Leistung', keywords: ['wechselrichter', 'inverter'] },
  { id: 'mounting', label: 'Montagesystem', hint: 'Unterkonstruktion, Dachhaken, Schienen', keywords: ['montagesystem', 'unterkonstruktion', 'dachhaken', 'alu-schienen', 'schienen'] },
  { id: 'scaffold', label: 'Gerüst / Absturzsicherung', hint: 'Enthalten, separat oder bauseits?', keywords: ['gerüst', 'absturz', 'fanggerüst', 'sicherung'] },
  { id: 'dc', label: 'DC-Verkabelung', hint: 'Stringkabel, Stecker, Erdung, Leitungsweg', keywords: ['solarkabel', 'stringkabel', 'dc-kabel', 'dc-verkabel', 'dc verkabel', 'erdung'] },
  { id: 'ac', label: 'AC-Elektroarbeiten', hint: 'Anschluss Wechselrichter bis Zähler / Unterverteilung', keywords: ['ac-kabel', 'ac-anschluss', 'ac anschluss', 'elektroarbeiten', 'unterverteilung', 'elektrischer anschluss'] },
  { id: 'meter', label: 'Zählerschrank', hint: 'Umbau / Erneuerung / Zusatzkosten geklärt?', keywords: ['zählerschrank', 'zaehlerschrank', 'zählerplatz', 'zaehlerplatz'] },
  { id: 'storage', label: 'Batteriespeicher', hint: 'Hersteller, Typ, nutzbare Kapazität, Montage', keywords: ['batterie', 'speicher', 'stromspeicher', 'kwh'] },
  { id: 'grid', label: 'Netzanschluss & Inbetriebnahme', hint: 'Netzbetreiber, Inbetriebnahme, Dokumentation', keywords: ['netzbetreiber', 'netzanschluss', 'inbetriebnahme', 'anmeldung'] },
  { id: 'yield', label: 'Ertragsprognose', hint: 'Erwarteter Jahresertrag / Annahmen', keywords: ['ertrag', 'jahresertrag', 'kwh/a', 'prognose'] },
  { id: 'monitoring', label: 'Monitoring / App', hint: 'Portal, Datenlogger oder Energiemanagement', keywords: ['monitoring', 'app', 'datenlogger', 'energiemanagement', 'ems'] },
  { id: 'docs', label: 'Dokumentation & Übergabe', hint: 'Schaltpläne, Datenblätter, Anlagen-/Speicherpass', keywords: ['dokumentation', 'datenblatt', 'schaltplan', 'anlagenpass', 'speicherpass', 'übergabe'] },
  { id: 'warranty', label: 'Garantien / Gewährleistung', hint: 'Produkt-, Leistungs- und Montagebedingungen', keywords: ['garantie', 'gewährleistung', 'gewaehrleistung', 'leistungsgarantie'] }
];

const HEADING_ALIASES = {
  modules: ['Module spezifiziert','PV-Module','Solarmodule','Modulfeld','Module','PV Module','PV Generator','Generatorfeld','PV-Generator'],
  inverter: ['Wechselrichter','Inverter','WR','Leistungselektronik'],
  mounting: ['Montagesystem','Unterkonstruktion','Dachmontage','Unterkonstruktion / Montage','Dachbefestigung','Befestigungssystem'],
  scaffold: ['Gerüst / Absturzsicherung','Gerüst','Absturzsicherung','Baustellensicherung','Arbeitsschutz'],
  dc: ['DC-Verkabelung','DC-Seite','Gleichstromverkabelung','DC Installation'],
  ac: ['AC-Elektroarbeiten','AC-Seite','Elektroinstallation','Wechselstromanschluss','AC Installation'],
  meter: ['Zählerschrank','Zähleranlage','Zählerplatz','Zähleranlage / Zählerschrank','Messkonzept','Messkonzept / Zähler','Zählertechnik'],
  storage: ['Batteriespeicher','Speichersystem','Batterie','Energiespeicher','Akkusystem'],
  grid: ['Netzanschluss & Inbetriebnahme','Netzanmeldung / Inbetriebnahme','Netzservice','Netzanschluss','Inbetriebnahme','Netzformalitäten','Netzservice / Inbetriebsetzung'],
  yield: ['Ertragsprognose','Erwarteter Jahresertrag','Simulation / Ertrag','Ertragssimulation'],
  monitoring: ['Monitoring / App','Monitoring','Anlagenüberwachung','Portal / Fernüberwachung','Fernüberwachung'],
  docs: ['Dokumentation & Übergabe','Übergabeunterlagen','Dokumentation','Unterlagen','Anlagendokumente','Projektunterlagen'],
  warranty: ['Garantien / Gewährleistung','Garantiebedingungen','Gewährleistung','Garantie','Service / Garantie']
};
const NEGATIVE_MARKERS = ['nicht enthalten','nicht inklusive','bauseits','zzgl.','zzgl ','optional','gegen aufpreis','gegen mehrpreis','separat','nicht bestandteil','kundenseitig','nicht im preis','nicht im lieferumfang','nicht berücksichtigt','separat abgerechnet','nicht im grundpreis','separat bereitzustellen','separat angeboten'];
const UNCLEAR_MARKERS = ['nach aufwand','nach technischer prüfung','bei bedarf','wird geprüft','wird bewertet','projektbezogen','wird abgestimmt','nach örtlicher','örtlichen gegebenheiten','je nach technischer verfügbarkeit','geltenden vorgaben','abhängig von','jeweiligen garantiebedingungen','final geklärt','wird im projektverlauf','vorbehaltlich','nach ortsbesichtigung','nach aufmaß','abhängig vom bestand','preis noch offen','umfang offen','wird nach finaler','wird projektbezogen festgelegt','wird mit der auftragsbestätigung konkretisiert','im beratungstermin festgelegt','noch abgestimmt','preis auf anfrage','noch zu klären','noch offen','vorbehalt','nach klärung','gegebenenfalls','ggf.','nach rücksprache','nach besichtigung','gesondert geklärt','abhängig'];
const POSITIVE_MARKERS = ['enthalten','inklusive','im festpreis','im angebotspreis','bestandteil','vollständig','eingerechnet','einkalkuliert','berücksichtigt','lieferumfang','wird eingerichtet','werden übergeben','erhalten sie','gelten 5 jahre','komplett enthalten','im pauschalpreis','im preis enthalten'];
const NA_STORAGE_MARKERS = ['kein batteriespeicher','ohne speicher','ohne batteriespeicher','speicher nicht vorgesehen','kein speicher vorgesehen'];
const form = document.getElementById('audit-form');
const matrixBody = document.getElementById('scope-body');
const results = document.getElementById('results');
const demoButton = document.getElementById('load-demo');
const resetButton = document.getElementById('reset-audit');
const downloadButton = document.getElementById('download-report');
const copyQuestionsButton = document.getElementById('copy-questions');
const pdfState = { a: false, b: false };
let demoMode = false;

if (window.pdfjsLib) {
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

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


function setPdfStatus(prefix, message, state) {
  const el = document.getElementById(prefix + '-pdf-status');
  const drop = document.querySelector('label[for="' + prefix + '-pdf"]');
  if (el) el.textContent = message;
  if (drop) {
    drop.classList.remove('is-ready', 'is-error', 'is-loading');
    if (state) drop.classList.add('is-' + state);
  }
}

function parseLocaleNumber(raw) {
  if (!raw) return NaN;
  let value = String(raw).replace(/\s/g, '').replace(/[^\d,.-]/g, '');
  if (value.includes(',') && value.includes('.')) {
    value = value.lastIndexOf(',') > value.lastIndexOf('.')
      ? value.replace(/\./g, '').replace(',', '.')
      : value.replace(/,/g, '');
  } else if (value.includes(',')) {
    value = value.replace(',', '.');
  }
  return parseFloat(value);
}

function inferOfferFields(prefix, text, fileName) {
  const cleanName = String(fileName || '')
    .replace(/\.pdf$/i, '')
    .replace(/[_-]+/g, ' ')
    .trim();
  if (cleanName) field(prefix, 'name').value = cleanName;

  const kwpMatch = text.match(/(\d{1,3}(?:[.,]\d{1,2})?)\s*kWp\b/i);
  if (kwpMatch && !field(prefix, 'kwp').value) {
    const kwp = parseLocaleNumber(kwpMatch[1]);
    if (Number.isFinite(kwp) && kwp > 0 && kwp < 500) field(prefix, 'kwp').value = kwp;
  }

  const storagePatterns = [
    /(?:batteriespeicher|stromspeicher|speicher|batterie|energiespeicher|akkusystem)[\s\S]{0,90}?(\d{1,3}(?:[.,]\d{1,2})?)\s*kWh\b/i,
    /(\d{1,3}(?:[.,]\d{1,2})?)\s*kWh\b[\s\S]{0,60}?(?:batteriespeicher|stromspeicher|speicher|batterie|energiespeicher|akkusystem)/i
  ];
  for (const pattern of storagePatterns) {
    const match = text.match(pattern);
    if (match && !field(prefix, 'storage').value) {
      const kwh = parseLocaleNumber(match[1]);
      if (Number.isFinite(kwh) && kwh > 0 && kwh < 500) field(prefix, 'storage').value = kwh;
      break;
    }
  }

  const pricePatterns = [
    /(?:gesamtpreis|gesamtsumme|bruttosumme|endbetrag|gesamt\s*brutto|summe\s*brutto)[^\d€]{0,35}([\d.\s]+(?:,\d{1,2})?)\s*(?:€|EUR)/i,
    /(?:gesamtpreis|gesamtsumme|bruttosumme|endbetrag|gesamt\s*brutto|summe\s*brutto)[^€]{0,35}(?:€|EUR)\s*([\d.\s]+(?:,\d{1,2})?)/i
  ];
  for (const pattern of pricePatterns) {
    const match = text.match(pattern);
    if (match && !field(prefix, 'total').value) {
      const total = parseLocaleNumber(match[1]);
      if (Number.isFinite(total) && total > 1000 && total < 500000) field(prefix, 'total').value = Math.round(total * 100) / 100;
      break;
    }
  }
}

async function extractPdfText(file) {
  if (!window.pdfjsLib) throw new Error('PDF-Engine konnte nicht geladen werden.');
  if (!file || file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) {
    throw new Error('Bitte eine PDF-Datei auswählen.');
  }
  if (file.size > 20 * 1024 * 1024) {
    throw new Error('PDF ist größer als 20 MB.');
  }

  const bytes = await file.arrayBuffer();
  const task = window.pdfjsLib.getDocument({ data: bytes });
  const pdf = await task.promise;
  const pages = [];

  for (let pageNo = 1; pageNo <= pdf.numPages; pageNo += 1) {
    const page = await pdf.getPage(pageNo);
    const content = await page.getTextContent();
    const lines = [];
    let lastY = null;
    let line = [];

    content.items.forEach(function(item) {
      const y = item.transform ? Math.round(item.transform[5]) : null;
      if (lastY !== null && y !== null && Math.abs(y - lastY) > 3 && line.length) {
        lines.push(line.join(' '));
        line = [];
      }
      if (item.str) line.push(item.str);
      lastY = y;
    });
    if (line.length) lines.push(line.join(' '));
    pages.push(lines.join('\n'));
  }

  const text = pages.join('\n\n').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  if (text.length < 80) {
    throw new Error('Keine ausreichende Textschicht erkannt. Das PDF ist vermutlich gescannt; OCR ist in diesem MVP noch nicht aktiv.');
  }
  return { text: text, pages: pdf.numPages };
}

async function handlePdf(prefix, file) {
  pdfState[prefix] = false;
  demoMode = false;
  results.hidden = true;
  field(prefix, 'text').value = '';
  setPdfStatus(prefix, 'PDF wird lokal gelesen …', 'loading');
  const errorEl = document.getElementById('audit-error');
  errorEl.hidden = true;

  try {
    const parsed = await extractPdfText(file);
    field(prefix, 'text').value = parsed.text;
    inferOfferFields(prefix, parsed.text, file.name);
    analyseText(prefix);
    pdfState[prefix] = true;
    setPdfStatus(prefix, file.name + ' · ' + parsed.pages + ' Seite(n) · Text erkannt', 'ready');
  } catch (error) {
    setPdfStatus(prefix, error.message || 'PDF konnte nicht gelesen werden.', 'error');
    errorEl.textContent = (prefix === 'a' ? 'Angebot A: ' : 'Angebot B: ') + (error.message || 'PDF konnte nicht gelesen werden.');
    errorEl.hidden = false;
  }
}

document.getElementById('a-pdf').addEventListener('change', function(event) {
  const file = event.target.files && event.target.files[0];
  if (file) handlePdf('a', file);
});

document.getElementById('b-pdf').addEventListener('change', function(event) {
  const file = event.target.files && event.target.files[0];
  if (file) handlePdf('b', file);
});

function normalizedText(value) {
  return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function markerIn(text, markers) {
  return markers.some(function(marker) { return text.includes(marker); });
}

function buildSectionEvidence(text) {
  const lines = text.split(/\n/).map(function(line) { return line.trim(); }).filter(Boolean);
  const headingMap = {};
  Object.keys(HEADING_ALIASES).forEach(function(id) {
    HEADING_ALIASES[id].forEach(function(alias) { headingMap[normalizedText(alias)] = id; });
  });
  const candidates = {};
  AUDIT_ITEMS.forEach(function(item) { candidates[item.id] = []; });

  lines.forEach(function(line, index) {
    const id = headingMap[normalizedText(line)];
    if (!id) return;
    const buffer = [line];
    for (let j = index + 1; j < Math.min(lines.length, index + 6); j += 1) {
      const next = normalizedText(lines[j]);
      if (headingMap[next]) break;
      if (/^(gesamtsumme|gesamtpreis|summe brutto|endbetrag brutto)/i.test(next)) break;
      buffer.push(lines[j]);
    }
    const evidence = buffer.join(' ');
    const lower = normalizedText(evidence);
    let score = markerIn(lower, NEGATIVE_MARKERS) ? 10 :
      markerIn(lower, UNCLEAR_MARKERS) ? 8 :
      markerIn(lower, POSITIVE_MARKERS) ? 6 : 2;
    if (buffer.length > 1) score += 1;
    candidates[id].push({ score: score, index: index, evidence: evidence });
  });

  const result = {};
  Object.keys(candidates).forEach(function(id) {
    if (!candidates[id].length) return;
    candidates[id].sort(function(a, b) { return b.score - a.score || b.index - a.index; });
    result[id] = candidates[id][0].evidence;
  });
  return result;
}

function fallbackEvidence(text, item) {
  const lower = text.toLowerCase();
  const aliases = (HEADING_ALIASES[item.id] || []).map(function(x) { return x.toLowerCase(); });
  const terms = item.keywords.concat(aliases);
  const candidates = [];

  terms.forEach(function(term) {
    let from = 0;
    while (from < lower.length) {
      const idx = lower.indexOf(term, from);
      if (idx < 0) break;
      const left = Math.max(lower.lastIndexOf('\n', idx), lower.lastIndexOf('.', idx), lower.lastIndexOf('!', idx), lower.lastIndexOf('?', idx)) + 1;
      const ends = [lower.indexOf('\n', idx), lower.indexOf('.', idx), lower.indexOf('!', idx), lower.indexOf('?', idx)].filter(function(x) { return x >= 0; });
      const right = ends.length ? Math.min.apply(null, ends) + 1 : Math.min(text.length, idx + 250);
      const evidence = text.slice(left, right).replace(/\s+/g, ' ').trim();
      const evLower = normalizedText(evidence);
      const score = markerIn(evLower, NEGATIVE_MARKERS) ? 5 :
        markerIn(evLower, UNCLEAR_MARKERS) ? 4 :
        markerIn(evLower, POSITIVE_MARKERS) ? 3 : 1;
      candidates.push({ score: score, evidence: evidence });
      from = idx + Math.max(1, term.length);
    }
  });
  candidates.sort(function(a, b) { return b.score - a.score || b.evidence.length - a.evidence.length; });
  return candidates.length ? candidates[0].evidence : '';
}

function extractAddOnCost(evidence) {
  const patterns = [
    /(?:zusatzkosten|mehrkosten|aufpreis|mehrpreis|kalkulationshinweis)[^€\d]{0,50}([\d.\s]+(?:,\d{1,2})?)\s*€/i,
    /(?:zusatzkosten|mehrkosten|aufpreis|mehrpreis|kalkulationshinweis)[^€]{0,50}€\s*([\d.\s]+(?:,\d{1,2})?)/i
  ];
  for (const pattern of patterns) {
    const match = evidence.match(pattern);
    if (!match) continue;
    const value = parseLocaleNumber(match[1]);
    if (Number.isFinite(value) && value > 0 && value < 100000) return value;
  }
  return 0;
}

function analyseText(prefix) {
  const offer = getOffer(prefix);
  const sections = buildSectionEvidence(offer.text);

  AUDIT_ITEMS.forEach(function(item) {
    const status = document.getElementById(prefix + '-' + item.id + '-status');
    const evidenceEl = document.getElementById(prefix + '-' + item.id + '-evidence');
    const costEl = document.getElementById(prefix + '-' + item.id + '-cost');
    const evidence = sections[item.id] || fallbackEvidence(offer.text, item);
    const evLower = normalizedText(evidence);

    let value = 'unclear';
    if (item.id === 'storage' && markerIn(evLower, NA_STORAGE_MARKERS)) {
      value = 'na';
    } else if (!evidence) {
      value = 'unclear';
    } else if (markerIn(evLower, NEGATIVE_MARKERS)) {
      value = 'excluded';
    } else if (markerIn(evLower, UNCLEAR_MARKERS)) {
      value = 'unclear';
    } else if (item.id === 'storage' && offer.storage <= 0 && !/\d+(?:[.,]\d+)?\s*kwh/i.test(evLower)) {
      value = 'na';
    } else if (markerIn(evLower, POSITIVE_MARKERS)) {
      value = 'included';
    } else if (item.id === 'yield' && /\d[\d.\s]*(?:[.,]\d+)?\s*kwh/i.test(evLower)) {
      value = 'included';
    } else if (item.id === 'modules' && (/\d+(?:[.,]\d+)?\s*kwp/i.test(evLower) || evLower.includes('modul'))) {
      value = 'included';
    } else if (item.id === 'warranty' && /\d+\s*(?:jahre|jahr)/i.test(evLower)) {
      value = 'included';
    } else {
      value = 'unclear';
    }

    status.value = value;
    evidenceEl.textContent = evidence ? 'Beleg: “' + evidence.replace(/\s+/g, ' ').trim() + '”' : 'Kein belastbarer Beleg erkannt';

    if (value === 'excluded' || value === 'unclear') {
      const addOn = extractAddOnCost(evidence);
      if (addOn > 0) costEl.value = addOn;
    } else {
      costEl.value = '';
    }
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
  demoMode = false;
  pdfState.a = false;
  pdfState.b = false;
  field('a', 'name').value = 'Angebot A';
  field('b', 'name').value = 'Angebot B';
  setPdfStatus('a', 'Noch keine Datei geladen');
  setPdfStatus('b', 'Noch keine Datei geladen');
  const errorEl = document.getElementById('audit-error');
  errorEl.hidden = true;
  buildMatrix();
  results.hidden = true;
}

function loadDemo() {
  clearAudit();
  demoMode = true;
  setPdfStatus('a', 'Demo-Datensatz statt PDF', 'ready');
  setPdfStatus('b', 'Demo-Datensatz statt PDF', 'ready');
  field('a', 'name').value = 'Solarwerk';
  field('a', 'total').value = '18500';
  field('a', 'kwp').value = '10.8';
  field('a', 'storage').value = '10';
  field('a', 'battery-price').value = '4500';
  field('a', 'text').value = [
    'Module spezifiziert', '24 Solarmodule à 450 Wp mit insgesamt 10,8 kWp sind enthalten.',
    'Wechselrichter', 'Wechselrichter Fronius inklusive Lieferung und Parametrierung.',
    'Batteriespeicher', 'Batteriespeicher mit 10 kWh inklusive Montage.',
    'Montagesystem', 'Dachhaken und Schienen sind im Festpreis enthalten.',
    'Gerüst / Absturzsicherung', 'Gerüst und Absturzsicherung inklusive.',
    'DC-Verkabelung', 'Solarkabel, Stringkabel und Erdung enthalten.',
    'AC-Elektroarbeiten', 'AC-Anschluss bis Zählerschrank enthalten.',
    'Zählerschrank', 'Anpassung Zählerschrank inklusive.',
    'Netzanschluss & Inbetriebnahme', 'Anmeldung beim Netzbetreiber und Inbetriebnahme inklusive.',
    'Ertragsprognose', 'Ertragsprognose 10.300 kWh/a.',
    'Monitoring / App', 'Monitoring App inklusive.',
    'Dokumentation & Übergabe', 'Dokumentation und Datenblätter werden bei Übergabe übergeben.',
    'Garantien / Gewährleistung', '5 Jahre Montagegarantie.'
  ].join('\n');

  field('b', 'name').value = 'PV Direkt';
  field('b', 'total').value = '17400';
  field('b', 'kwp').value = '10.8';
  field('b', 'storage').value = '10';
  field('b', 'battery-price').value = '3900';
  field('b', 'text').value = [
    'Module spezifiziert', '24 Module à 450 Wp mit 10,8 kWp sind enthalten.',
    'Wechselrichter', 'Wechselrichter inklusive.',
    'Batteriespeicher', '10 kWh Stromspeicher inklusive.',
    'Montagesystem', 'Unterkonstruktion inklusive.',
    'DC-Verkabelung', 'DC-Verkabelung inklusive.',
    'Gerüst / Absturzsicherung', 'Gerüst bauseits.',
    'AC-Elektroarbeiten', 'AC-Elektroarbeiten inklusive.',
    'Zählerschrank', 'Zählerschrank bei Bedarf gegen Aufpreis.',
    'Netzanschluss & Inbetriebnahme', 'Netzbetreiber-Anmeldung und Inbetriebnahme inklusive.',
    'Monitoring / App', 'Monitoring über App inklusive.',
    'Garantien / Gewährleistung', 'Produktgarantien gemäß Herstellerbedingungen.'
  ].join('\n');

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
  const errorEl = document.getElementById('audit-error');
  errorEl.hidden = true;

  if (!demoMode && (!pdfState.a || !pdfState.b)) {
    errorEl.textContent = 'Für einen echten Audit müssen Angebot A und Angebot B jeweils als lesbare PDF geladen sein.';
    errorEl.hidden = false;
    return;
  }

  if (!field('a', 'total').value || !field('b', 'total').value || !field('a', 'kwp').value || !field('b', 'kwp').value) {
    errorEl.textContent = 'Bitte Gesamtpreis und kWp beider Angebote prüfen bzw. ergänzen. Diese Werte konnten nicht in jedem PDF eindeutig erkannt werden.';
    errorEl.hidden = false;
    return;
  }

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