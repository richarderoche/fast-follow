#!/usr/bin/env node
/**
 * Convert video project CSV rows to Sanity NDJSON (videoProject documents only).
 *
 * Usage:
 *   node scripts/csv-to-video-projects-ndjson.mjs --csv imports-batch-2.csv --out video-projects-batch-2.ndjson
 *
 * Options:
 *   --csv <path>       Input CSV (required)
 *   --out <path>       Output NDJSON (default: video-projects.ndjson)
 *   --artists <path>   artists.json (default: repo root)
 *   --formats <path>   videoFormats.json (default: repo root)
 *   --validate-only    Validate existing NDJSON against JSON maps
 *
 * _id convention: videoProject-{artist-slug}-{title-slug} (stable for --replace re-imports)
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')

const DEFAULTS = {
  out: join(REPO_ROOT, 'video-projects.ndjson'),
  artists: join(REPO_ROOT, 'artists.json'),
  formats: join(REPO_ROOT, 'videoFormats.json'),
}

const EXPECTED_COLUMNS = ['releaseDate', 'title', 'artists', 'brand', 'formats']

/** @param {string} text */
function parseCsv(text) {
  /** @type {string[][]} */
  const rows = []
  /** @type {string[]} */
  let row = []
  let field = ''
  let i = 0
  let inQuotes = false

  while (i < text.length) {
    const c = text[i]

    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i += 2
          continue
        }
        inQuotes = false
        i++
        continue
      }
      field += c
      i++
      continue
    }

    if (c === '"') {
      inQuotes = true
      i++
      continue
    }
    if (c === ',') {
      row.push(field)
      field = ''
      i++
      continue
    }
    if (c === '\n' || (c === '\r' && text[i + 1] === '\n')) {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
      if (c === '\r') i++
      i++
      continue
    }
    if (c === '\r') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
      i++
      continue
    }

    field += c
    i++
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  return rows
}

/** @param {string} value */
function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/** @param {string} artistName @param {string} title */
function videoProjectId(artistName, title) {
  const artistSlug = slugify(artistName)
  const titleSlug = slugify(title)
  if (!artistSlug) {
    throw new Error(`Cannot build _id from artist: "${artistName}"`)
  }
  if (!titleSlug) {
    throw new Error(`Cannot build _id from title: "${title}"`)
  }
  return `videoProject-${artistSlug}-${titleSlug}`
}

/** @param {string} cell */
function parseFormatSegments(cell) {
  if (!cell?.trim()) return []
  return cell.split(',').map((s) => s.trim()).filter(Boolean)
}

/** @param {string} path */
function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

/**
 * @param {Array<{ _id: string, firstName: string, lastName: string }>} artists
 */
function buildArtistMap(artists) {
  /** @type {Map<string, string>} */
  const byFullName = new Map()
  for (const artist of artists) {
    const key = `${artist.firstName} ${artist.lastName}`
    if (byFullName.has(key)) {
      throw new Error(`Duplicate artist in artists.json: "${key}"`)
    }
    byFullName.set(key, artist._id)
  }
  return byFullName
}

/**
 * @param {Array<{ _id: string, title: string }>} formats
 */
function buildFormatMap(formats) {
  /** @type {Map<string, string>} */
  const byTitle = new Map()
  for (const format of formats) {
    if (byTitle.has(format.title)) {
      throw new Error(`Duplicate format title in videoFormats.json: "${format.title}"`)
    }
    byTitle.set(format.title, format._id)
  }
  return byTitle
}

/**
 * @param {Record<string, string>} row
 * @param {Map<string, string>} artistMap
 * @param {Map<string, string>} formatMap
 */
function rowToDocument(row, artistMap, formatMap) {
  const artistName = row.artists?.trim()
  if (!artistName) {
    throw new Error(`Row "${row.title}": missing artists`)
  }

  const artistId = artistMap.get(artistName)
  if (!artistId) {
    throw new Error(`Row "${row.title}": artist "${artistName}" not found in artists.json`)
  }

  const formatSegments = parseFormatSegments(row.formats)

  /** @type {string[]} */
  const formatIds = []
  for (const segment of formatSegments) {
    const formatId = formatMap.get(segment)
    if (!formatId) {
      throw new Error(
        `Row "${row.title}": unknown format "${segment}" (from "${row.formats}")`
      )
    }
    formatIds.push(formatId)
  }

  /** @type {Record<string, unknown>} */
  const doc = {
    _id: videoProjectId(artistName, row.title),
    _type: 'videoProject',
    title: row.title,
    releaseDate: row.releaseDate,
    artists: [{ _type: 'reference', _ref: artistId }],
  }

  if (formatIds.length > 0) {
    doc.formats = formatIds.map((id) => ({ _type: 'reference', _ref: id }))
  }

  const brand = row.brand?.trim()
  if (brand) {
    doc.brand = brand
  }

  return doc
}

/**
 * @param {string} csvPath
 * @param {Map<string, string>} artistMap
 * @param {Map<string, string>} formatMap
 */
function csvToDocuments(csvPath, artistMap, formatMap) {
  const text = readFileSync(csvPath, 'utf8').replace(/^\uFEFF/, '')
  const table = parseCsv(text)
  if (table.length < 2) {
    throw new Error(`CSV has no data rows: ${csvPath}`)
  }

  const [header, ...dataRows] = table
  if (header.join(',') !== EXPECTED_COLUMNS.join(',')) {
    throw new Error(
      `Unexpected CSV header.\n  Expected: ${EXPECTED_COLUMNS.join(',')}\n  Got:      ${header.join(',')}`
    )
  }

  /** @type {Record<string, string>[]} */
  const records = dataRows.map((cells, index) => {
    if (cells.length !== EXPECTED_COLUMNS.length) {
      throw new Error(
        `Row ${index + 2}: expected ${EXPECTED_COLUMNS.length} columns, got ${cells.length}`
      )
    }
    /** @type {Record<string, string>} */
    const row = {}
    EXPECTED_COLUMNS.forEach((col, i) => {
      row[col] = cells[i] ?? ''
    })
    return row
  })

  /** @type {Map<string, string>} */
  const idToLabel = new Map()
  /** @type {Record<string, unknown>[]} */
  const documents = []

  for (const row of records) {
    if (!row.title?.trim()) {
      throw new Error(`Row missing title (releaseDate=${row.releaseDate})`)
    }
    if (!row.releaseDate?.trim()) {
      throw new Error(`Row "${row.title}": missing releaseDate`)
    }

    const doc = rowToDocument(row, artistMap, formatMap)
    const id = /** @type {string} */ (doc._id)
    const label = `${row.artists} — ${row.title}`

    if (idToLabel.has(id)) {
      throw new Error(
        `_id collision "${id}": "${idToLabel.get(id)}" and "${label}"`
      )
    }
    idToLabel.set(id, label)

    documents.push(doc)
  }

  /** @type {Set<string>} */
  const artistTitleKeys = new Set()
  for (const row of records) {
    const key = `${row.artists?.trim()}::${row.title?.trim()}`
    if (artistTitleKeys.has(key)) {
      throw new Error(`Duplicate artist + title in CSV: ${row.artists} — ${row.title}`)
    }
    artistTitleKeys.add(key)
  }

  return { documents, rowCount: records.length }
}

/**
 * @param {Record<string, unknown>[]} documents
 * @param {number} expectedRowCount
 * @param {Set<string>} artistIds
 * @param {Set<string>} formatIds
 */
function validateDocuments(documents, expectedRowCount, artistIds, formatIds) {
  const errors = []

  if (documents.length !== expectedRowCount) {
    errors.push(
      `Document count ${documents.length} !== CSV data row count ${expectedRowCount}`
    )
  }

  /** @type {Set<string>} */
  const seenIds = new Set()
  for (const doc of documents) {
    const id = /** @type {string} */ (doc._id)
    if (seenIds.has(id)) {
      errors.push(`Duplicate _id in output: ${id}`)
    }
    seenIds.add(id)

    if (doc._type !== 'videoProject') {
      errors.push(`${id}: _type must be videoProject`)
    }

    const formats = /** @type {{ _ref: string }[] | undefined} */ (doc.formats)
    if (formats?.length) {
      for (const ref of formats) {
        if (!formatIds.has(ref._ref)) {
          errors.push(`${id}: format _ref "${ref._ref}" not in videoFormats.json`)
        }
      }
    }

    const artists = /** @type {{ _ref: string }[] | undefined} */ (doc.artists)
    if (!artists?.length) {
      errors.push(`${id}: artists must not be empty`)
    } else {
      for (const ref of artists) {
        if (!artistIds.has(ref._ref)) {
          errors.push(`${id}: artist _ref "${ref._ref}" not in artists.json`)
        }
      }
    }

    if (typeof doc.title !== 'string' || !doc.title) {
      errors.push(`${id}: missing title`)
    }
    if (typeof doc.releaseDate !== 'string' || !doc.releaseDate) {
      errors.push(`${id}: missing releaseDate`)
    }
  }

  if (errors.length > 0) {
    throw new Error(`Validation failed:\n${errors.map((e) => `  - ${e}`).join('\n')}`)
  }
}

/** @param {Record<string, unknown>[]} documents */
function writeNdjson(documents, outPath) {
  const lines = documents.map((doc) => JSON.stringify(doc))
  writeFileSync(outPath, `${lines.join('\n')}\n`, 'utf8')
}

function parseArgs(argv) {
  /** @type {Record<string, string | boolean>} */
  const opts = { ...DEFAULTS, validateOnly: false, csv: '' }

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--validate-only') {
      opts.validateOnly = true
      continue
    }
    if (arg === '--csv' && argv[i + 1]) {
      opts.csv = resolve(argv[++i])
      continue
    }
    if (arg === '--out' && argv[i + 1]) {
      opts.out = resolve(argv[++i])
      continue
    }
    if (arg === '--artists' && argv[i + 1]) {
      opts.artists = resolve(argv[++i])
      continue
    }
    if (arg === '--formats' && argv[i + 1]) {
      opts.formats = resolve(argv[++i])
      continue
    }
    throw new Error(`Unknown argument: ${arg}`)
  }

  return opts
}

function main() {
  const opts = parseArgs(process.argv)
  const artists = loadJson(opts.artists)
  const formats = loadJson(opts.formats)
  const artistMap = buildArtistMap(artists)
  const formatMap = buildFormatMap(formats)
  const artistIds = new Set(artists.map((a) => a._id))
  const formatIds = new Set(formats.map((f) => f._id))

  if (opts.validateOnly) {
    const lines = readFileSync(opts.out, 'utf8').trim().split('\n').filter(Boolean)
    const documents = lines.map((line, i) => {
      try {
        return JSON.parse(line)
      } catch {
        throw new Error(`Invalid JSON on line ${i + 1} of ${opts.out}`)
      }
    })
    validateDocuments(documents, documents.length, artistIds, formatIds)
    console.log(`Validated ${documents.length} documents in ${opts.out}`)
    return
  }

  if (!opts.csv) {
    throw new Error('--csv is required (e.g. --csv imports-batch-2.csv)')
  }

  const { documents, rowCount } = csvToDocuments(opts.csv, artistMap, formatMap)
  validateDocuments(documents, rowCount, artistIds, formatIds)
  writeNdjson(documents, opts.out)

  console.log(`Wrote ${documents.length} videoProject documents to ${opts.out}`)
  console.log(`  CSV: ${opts.csv}`)
  console.log(`  Maps: ${opts.artists}, ${opts.formats}`)
}

try {
  main()
} catch (err) {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
}
