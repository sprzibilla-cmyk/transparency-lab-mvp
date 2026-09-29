# Transparency Lab — Synthetic PV Benchmark v1 Baseline

**Tested build:** current `main` audit logic at 2026-09-29  
**Dataset:** 30 synthetic PV offer PDFs / 390 scope labels / 3 difficulty levels

## Executive result

The current MVP is **not yet reliable enough for an autonomous customer-facing quote audit**.

| Metric | Result |
|---|---:|
| Scope status accuracy | 68.2% |
| Easy | 82.3% |
| Realistic | 68.5% |
| Adversarial | 53.8% |
| Included recall | 100.0% |
| Excluded recall | 11.7% |
| Unclear recall | 0.0% |
| n/a recall | 0.0% |
| False-Included rate on true excluded/unclear | 94.2% |
| Total-price extraction | 100.0% |
| kWp extraction | 100.0% |
| Storage-kWh extraction | 73.3% |
| Auto normalized-floor exact | 16.7% |
| Auto normalized-floor MAE | €1,555 |

## Interpretation

The strong part is basic numeric extraction: total price and kWp were extracted correctly in all 30 synthetic PDFs.

The critical weakness is scope semantics. The current keyword-first classifier frequently sees a section heading such as `Zählerschrank`, `Dokumentation` or `Gerüst` before the sentence that says the item is excluded or unresolved. It therefore labels the item as `included`. This produces a **94.2% false-included rate across genuinely excluded or unclear positions**, which is the most dangerous error direction for the product.

`unclear` is never recovered in this benchmark because the current classifier has only two effective outcomes once a keyword is found: `included` or `excluded`. The generated PDFs deliberately contain realistic phrases such as “nach Aufwand”, “nach technischer Prüfung” and “projektbezogen”, which need a dedicated uncertainty lexicon / semantic rule.

Storage extraction succeeds in 73.3% of cases. Failures occur when capacity is separated from the word “Speicher” by layout/newlines or when the storage scope itself is unclear/excluded.

The automatic normalized cost floor is exact in only 16.7% of offers, with mean absolute error of about €1,555. The main reason is structural: the current MVP does not extract explicit reserve/add-on euro amounts from the PDF into the normalization model; it expects manual entry.

## Priority fixes before public pilot

1. **Section-aware extraction:** evaluate the content following a scope heading, not the first keyword occurrence.
2. **Three-way semantics:** explicit `included` / `excluded` / `unclear` markers, including “nach Aufwand”, “bei Bedarf”, “nach Prüfung”, “projektbezogen”.
3. **Storage parsing across line breaks and tables.**
4. **Add-on cost extraction:** bind euro amounts to excluded/unclear scope positions.
5. **Safety rule:** when evidence conflicts or confidence is low, default to `unclear`, never `included`.
6. Re-run this exact frozen benchmark after each change; do not tune the dataset itself to make the score improve.

## Release gate proposed for the next version

Before calling the audit autonomous:
- overall scope accuracy ≥ 90%
- excluded recall ≥ 95%
- unclear recall ≥ 85%
- false-included rate on excluded/unclear ≤ 5%
- total and kWp extraction ≥ 98%
- storage extraction ≥ 95%
- normalized-floor exact ≥ 90% on cases with explicit add-on amounts

## Method caveat

This is an automated **engine-parity baseline**: the current JavaScript rules were reproduced against text extracted from the same generated PDFs. PDF text extraction in the live browser uses PDF.js, while this batch harness used a local PDF text extractor. Therefore these numbers measure the audit logic robustly but are not a substitute for a separate browser end-to-end regression suite. The benchmark should retain both layers going forward.
