import type { AllProjectsQueryResult } from '@/sanity.types'

export type ProjectCreditLine = {
  label: string
  labelPlural?: string
  names: string[]
}

export function getAllCredits(
  project: AllProjectsQueryResult[number]
): ProjectCreditLine[] {
  const { artists, directors, agencies, brand, manualCredits } = project

  const artistsByRole = artists.reduce<
    Record<string, { names: string[]; labelPlural?: string }>
  >((acc, artist) => {
    const role = artist.role
    if (!role || !artist.name) return acc
    if (!acc[role]) {
      acc[role] = {
        names: [],
        labelPlural: artist.rolePlural || undefined,
      }
    }
    acc[role].names.push(artist.name)
    return acc
  }, {})

  return [
    ...Object.entries(artistsByRole).map(([label, { names, labelPlural }]) => ({
      label,
      labelPlural,
      names,
    })),
    { label: 'Director', labelPlural: 'Directors', names: directors },
    { label: 'Agency', labelPlural: 'Agencies', names: agencies },
    { label: 'Brand', names: brand ? [brand] : [] },
    ...(manualCredits || [])
      .filter((c) => c.role)
      .map((credit) => ({
        label: credit.role as string,
        names: credit.names,
      })),
  ].filter(
    (credit): credit is ProjectCreditLine =>
      Boolean(credit.names?.length)
  )
}
