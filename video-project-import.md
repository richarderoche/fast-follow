# Video project CSV import

Import `videoProject` documents from a CSV into Sanity production (or another dataset). Artists and video formats must already exist in the target dataset — this flow only creates/updates projects.

## Files

| File | Purpose |
|------|---------|
| `imports-batch-2.csv` (or your CSV) | Source data |
| `artists.json` | Artist name → `_id` lookup (refresh from Sanity when needed) |
| `videoFormats.json` | Format title → `_id` lookup |
| `scripts/export-import-maps.mjs` | Re-export the two JSON files from Sanity |
| `scripts/csv-to-video-projects-ndjson.mjs` | CSV → NDJSON converter |
| `video-projects-batch-2.ndjson` | Generated import file (one JSON object per line) |

## CSV columns

```
releaseDate,title,artists,brand,formats
```

| Column | Notes |
|--------|-------|
| `releaseDate` | `YYYY-MM-DD` |
| `title` | Project title |
| `artists` | One full name, must match Studio exactly (e.g. `Christian O'Kefee`) |
| `brand` | Optional; empty cell is omitted on import |
| `formats` | One title or comma-separated (e.g. `PSA, Broadcast`); empty is allowed |

**Not imported:** `videoAsset` (Mux), directors, agencies, manual credits — attach Mux in Studio after import.

## Document IDs (repeatable)

Each row gets a stable `_id` derived from **artist + title**:

```
videoProject-{artist-slug}-{title-slug}
```

Example: `Christian O'Kefee` + `Heart of Gold Samba` → `videoProject-christian-o-kefee-heart-of-gold-samba`

Re-running the converter and importing with `--replace` updates the same document when artist and title are unchanged. Changing artist or title in the CSV creates a new document (delete the old one in Studio if needed).

## Step 1 — Refresh lookup maps (optional)

Run this if artists or formats changed in Studio since the JSON files were last exported:

```bash
node scripts/export-import-maps.mjs --dataset production
```

Requires Sanity CLI auth (`npx sanity login` from `studio/` if needed).

## Step 2 — Convert CSV to NDJSON

From the repo root:

```bash
node scripts/csv-to-video-projects-ndjson.mjs \
  --csv imports-batch-2.csv \
  --out video-projects-batch-2.ndjson
```

The script fails loudly on unknown artists/formats, duplicate artist+title pairs, or `_id` collisions. Fix the CSV and re-run.

Optional — validate an existing NDJSON file without converting:

```bash
node scripts/csv-to-video-projects-ndjson.mjs \
  --validate-only \
  --out video-projects-batch-2.ndjson
```

## Step 3 — Import into Sanity

From the `studio` directory:

```bash
cd studio

npx sanity datasets import ../video-projects-batch-2.ndjson --dataset production --replace
```

| Flag | Meaning |
|------|---------|
| `--dataset production` | Target dataset (match `SANITY_STUDIO_DATASET` in `studio/.env`) |
| `--replace` | Overwrite documents with the same `_id` (use for corrections and re-imports) |
| `--missing` | Only create new docs; skip existing `_id`s |

If not logged in:

```bash
npx sanity login
```

## Step 4 — After import

1. Open Studio → **Video Projects** and confirm the new entries.
2. Upload **Mux** (`videoAsset`) per project — the site hides projects without a playback ID until then.
3. List order follows `releaseDate` (newest first) per schema.

## Quick reference (full flow)

```bash
# Repo root
node scripts/export-import-maps.mjs --dataset production   # if maps may be stale

node scripts/csv-to-video-projects-ndjson.mjs \
  --csv imports-batch-2.csv \
  --out video-projects-batch-2.ndjson

# Studio
cd studio
npx sanity datasets import ../video-projects-batch-2.ndjson --dataset production --replace
```

## Corrections

1. Edit the CSV.
2. Re-run Step 2 (convert).
3. Re-run Step 3 with `--replace`.

Fields you can fix without changing `_id`: `releaseDate`, `brand`, `artists`, `formats`.

## Notes

- CLI import does not run Studio validation rules; broken references may import but show errors when opened in Studio.
- Consider pausing heavy webhooks during bulk import.
- Test on a non-production dataset first if you prefer: use `--dataset development` (or your staging dataset) in both export and import commands.
