import type { AllProjectsQueryResult } from '@/sanity.types'

export type VideoProjectRow = AllProjectsQueryResult[number]

export type FilterRoleOption = {
  id: string
  title: string
  plural: string | null
  priority: number
}

export type FilterArtistOption = {
  id: string
  name: string
}

export type FilterFormatOption = {
  id: string
  title: string
  priority: number
}

export type ArtistsGroupedByRole = {
  role: FilterRoleOption
  artists: FilterArtistOption[]
}

export type ProjectFilterState = {
  formatId: string | null
  roleId: string | null
  artistId: string | null
}

/** Unique formats and roles/artists grouped by role; roles sorted by priority (desc). */
export function buildFilterOptions(projects: VideoProjectRow[]) {
  const formatsMap = new Map<string, FilterFormatOption>()
  const rolesMap = new Map<string, FilterRoleOption>()
  const artistsByRoleId = new Map<string, Map<string, FilterArtistOption>>()

  for (const p of projects) {
    for (const fmt of p.formats) {
      if (!formatsMap.has(fmt._id)) {
        formatsMap.set(fmt._id, {
          id: fmt._id,
          title: fmt.title,
          priority: fmt.priority,
        })
      }
    }

    for (const a of p.artists) {
      const r = a.role
      if (a._id && a.name && r?._id && r.title) {
        if (!rolesMap.has(r._id)) {
          rolesMap.set(r._id, {
            id: r._id,
            title: r.title,
            plural: r.plural,
            priority: r.priority,
          })
        }
        let bucket = artistsByRoleId.get(r._id)
        if (!bucket) {
          bucket = new Map()
          artistsByRoleId.set(r._id, bucket)
        }
        if (!bucket.has(a._id)) {
          bucket.set(a._id, { id: a._id, name: a.name })
        }
      }
    }
  }

  const formatOptions = [...formatsMap.values()].sort(
    (a, b) => b.priority - a.priority || a.title.localeCompare(b.title)
  )

  const roleOptions = [...rolesMap.values()].sort(
    (a, b) => b.priority - a.priority || a.title.localeCompare(b.title)
  )

  const artistsByRole: ArtistsGroupedByRole[] = roleOptions.map((role) => {
    const bucket = artistsByRoleId.get(role.id)
    const artists = bucket
      ? [...bucket.values()].sort((x, y) => x.name.localeCompare(y.name))
      : []
    return { role, artists }
  })

  return { formatOptions, roleOptions, artistsByRole }
}

function projectMatchesFilters(
  project: VideoProjectRow,
  f: ProjectFilterState
): boolean {
  if (f.formatId) {
    if (!project.formats.some((fmt) => fmt._id === f.formatId)) {
      return false
    }
  }
  if (f.roleId) {
    if (
      !project.artists.some(
        (a) => a.role?._id && a.role._id === f.roleId
      )
    ) {
      return false
    }
  }
  if (f.artistId) {
    if (!project.artists.some((a) => a._id === f.artistId)) {
      return false
    }
  }
  return true
}

/** Apply format, role, and artist filters (AND). */
export function filterProjects(
  projects: VideoProjectRow[],
  f: ProjectFilterState
): VideoProjectRow[] {
  if (!f.formatId && !f.roleId && !f.artistId) {
    return projects
  }

  return projects.filter((p) => projectMatchesFilters(p, f))
}

/** How many videos each artist appears on (at most once per video). */
export function countVideosByArtist(
  projects: VideoProjectRow[]
): Record<string, number> {
  const counts: Record<string, number> = {}

  for (const p of projects) {
    const seen = new Set<string>()
    for (const a of p.artists) {
      if (a._id && !seen.has(a._id)) {
        seen.add(a._id)
        counts[a._id] = (counts[a._id] ?? 0) + 1
      }
    }
  }

  return counts
}
