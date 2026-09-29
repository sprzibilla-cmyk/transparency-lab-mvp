# PV Quote Audit — Benchmark & Release Gate

Date: 2026-09-29

## Objective

Develop the deterministic browser-only PV Quote Audit until it clears predefined MVP release gates without changing the frozen benchmark to improve the score.

## Release gates

- Overall scope accuracy >= 90%
- Excluded recall >= 95%
- Unclear recall >= 85%
- False-included rate on truly excluded/unclear scope <= 5%
- Total-price extraction >= 98%
- kWp extraction >= 98%
- Storage extraction >= 95%
- Normalized known-cost floor exact >= 90% where explicit add-on amounts are present

## Baseline (original engine)

Dataset: Synthetic PV Benchmark v1, 30 PDFs / 390 scope labels.

| Metric | Baseline |
|---|---:|
| Scope accuracy | 68.2% |
| Excluded recall | 11.7% |
| Unclear recall | 0.0% |
| False-included rate | 94.2% |
| Total price | 100.0% |
| kWp | 100.0% |
| Storage kWh | 73.3% |
| Normalized floor exact | 16.7% |
| Mean absolute floor error | EUR 1,555 |

Primary failure: first-keyword matching often classified a scope heading as included before reading the qualifying sentence below it.

## Final engine — frozen Benchmark v1

The original 30 PDFs and ground truth were not changed.

| Metric | Final |
|---|---:|
| Scope accuracy | 99.0% |
| Easy | 98.5% |
| Realistic | 100.0% |
| Adversarial | 98.5% |
| Included recall | 99.6% |
| Excluded recall | 100.0% |
| Unclear recall | 95.0% |
| n/a recall | 100.0% |
| False-included rate | 2.5% |
| Total price | 100.0% |
| kWp | 100.0% |
| Storage kWh | 100.0% |
| Normalized known-cost floor exact | 100.0% |
| Mean absolute floor error | EUR 0 |

## Frozen independent holdout

After the engine design was locked, a separate 60-PDF holdout was generated and frozen before evaluation.

Ground-truth SHA-256:
`2406cd53dac9e0fc3abf7948a40f9d71756d1de2856bdc9cd1c086571ce72dd8`

The holdout uses different wording, section names, orderings, prices, capacities and difficulty mixes.

| Metric | Holdout |
|---|---:|
| Scope accuracy | 94.0% |
| Easy | 93.1% |
| Realistic | 92.7% |
| Adversarial | 96.2% |
| Included recall | 92.4% |
| Excluded recall | 97.5% |
| Unclear recall | 100.0% |
| n/a recall | 100.0% |
| False-included rate | 0.0% |
| Total price | 100.0% |
| kWp | 100.0% |
| Storage kWh | 100.0% |
| Normalized known-cost floor exact | 100.0% |
| Mean absolute floor error | EUR 0 |

## Changes that produced the improvement

1. Section-aware evidence selection instead of first keyword occurrence.
2. Multiple heading aliases for each of the 13 PV scope concepts.
3. Explicit three-way semantics: included / excluded / unclear.
4. Fail-safe behavior: insufficient evidence defaults to unclear, never included.
5. Storage parsing across PDF line breaks.
6. Extraction of explicit add-on EUR amounts and automatic binding to the affected excluded/unclear scope item.
7. Multiple candidate sections are scored; negative/uncertain evidence outranks generic summary occurrences.

## Decision

All predefined synthetic release gates are cleared on both the unchanged original benchmark and the frozen holdout.

This qualifies the deterministic engine for an MVP/pilot, not as proof of production accuracy on arbitrary real-world PV offers. Remaining validation required: browser PDF.js end-to-end regression and then a small consented corpus of real anonymized offers. Scanned image-only PDFs remain explicitly unsupported until OCR is implemented.

## Safety principle

When evidence is ambiguous, the audit must prefer **Unklar** over **Enthalten**. A false included classification can hide a real customer cost and is therefore treated as the most severe error direction.
