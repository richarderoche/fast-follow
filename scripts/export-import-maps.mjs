#!/usr/bin/env node
/**
 * Refresh artists.json and videoFormats.json from Sanity (for CSV import).
 *
 * Usage (from repo root):
 *   node scripts/export-import-maps.mjs
 *   node scripts/export-import-maps.mjs --dataset production
 */

import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')
const STUDIO_DIR = join(REPO_ROOT, 'studio')

function parseArgs(argv) {
  let dataset = 'production'
  for (let i = 2; i < argv.length; i++) {
    if ((argv[i] === '--dataset' || argv[i] === '-d') && argv[i + 1]) {
      dataset = argv[++i]
    }
  }
  return { dataset }
}

function query(groq, dataset) {
  const out = execSync(
    `npx sanity documents query ${JSON.stringify(groq)} --dataset ${dataset}`,
    { cwd: STUDIO_DIR, encoding: 'utf8' }
  )
  const jsonStart = out.indexOf('[')
  if (jsonStart === -1) throw new Error(`No JSON in query output:\n${out}`)
  return JSON.parse(out.slice(jsonStart))
}

function main() {
  const { dataset } = parseArgs(process.argv)

  const artists = query(
    '*[_type == "artist"]{ _id, firstName, lastName } | order(firstName asc, lastName asc)',
    dataset
  )
  const formats = query(
    '*[_type == "videoFormat"]{ _id, title } | order(title asc)',
    dataset
  )

  writeFileSync(join(REPO_ROOT, 'artists.json'), `${JSON.stringify(artists, null, 2)}\n`)
  writeFileSync(join(REPO_ROOT, 'videoFormats.json'), `${JSON.stringify(formats, null, 2)}\n`)

  console.log(`Wrote ${artists.length} artists and ${formats.length} formats (${dataset})`)
}

main()
