'use client'

import Select from '@/components/shared/Select'
import SiteWidth from '@/components/shared/SiteWidth'
import {
  ArtistsGroupedByRole,
  FilterFormatOption,
  FilterRoleOption,
} from '@/lib/projectFilters'
import { useProjectsStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { useMemo } from 'react'
import SiteGrid from '../shared/SiteGrid'

export default function Filters({
  formatOptions,
  roleOptions,
  artistsByRole,
  artistVideoCounts,
}: {
  formatOptions: FilterFormatOption[]
  roleOptions: FilterRoleOption[]
  artistsByRole: ArtistsGroupedByRole[]
  artistVideoCounts: Record<string, number>
}) {
  const {
    selectedFormatId,
    selectedRoleId,
    selectedArtistId,
    setSelectedFormatId,
    setSelectedRoleId,
    selectArtistFilter,
  } = useProjectsStore()

  const roleSelectOptions = useMemo(
    () => roleOptions.map((r) => ({ value: r.id, label: r.title })),
    [roleOptions]
  )

  const formatSelectOptions = useMemo(
    () => formatOptions.map((f) => ({ value: f.id, label: f.title })),
    [formatOptions]
  )

  return (
    <div className="pt-header pb-gut">
      <SiteWidth>
        <SiteGrid className="gap-y-gut-150">
          <div className="col-span-8 md:col-span-12 lg:col-span-3 lg:pr-gut-200 flex flex-col gap-gut">
            <div className="flex flex-col md:flex-row lg:flex-col gap-gut">
              <Select
                label="Role"
                value={selectedRoleId}
                onValueChange={setSelectedRoleId}
                options={roleSelectOptions}
              />
              <Select
                label="Format"
                value={selectedFormatId}
                onValueChange={setSelectedFormatId}
                options={formatSelectOptions}
              />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-9 grid grid-cols-2 gap-gut">
            {artistsByRole.map(({ role, artists }) => (
              <div
                className={cn(
                  'col-span-2',
                  artists.length < 4 && 'md:col-span-1'
                )}
                key={role.id}
              >
                <p className="ts-h6 text-body-subtle mb-gut-50">
                  {role.plural || role.title}
                </p>
                <div className="grid grid-cols-2 gap-x-gut gap-y-gut-50">
                  {artists.map((a) => {
                    const count = artistVideoCounts[a.id] ?? 0
                    const active = selectedArtistId === a.id
                    return (
                      <div
                        className={cn(
                          'col-span-2',
                          artists.length > 3 && 'md:col-span-1'
                        )}
                        key={a.id + role.id}
                      >
                        <button
                          type="button"
                          onClick={() => selectArtistFilter(a.id)}
                          className={cn(
                            'flex w-fit items-center gap-6 relative z-1 hover:scale-105 transition-all'
                          )}
                        >
                          <span
                            className={cn(
                              'count transition-all',
                              !active && 'hidden'
                            )}
                            aria-hidden="true"
                          >
                            ×
                          </span>
                          <span className="ts-h3-caps">{a.name}</span>
                          <span
                            className={cn(
                              'ts-count p-2 min-w-[2.6em] rounded-full border',
                              count === 0 && 'opacity-30'
                            )}
                          >
                            {count}
                          </span>
                          <div
                            className={cn(
                              'absolute -inset-y-gut-25 -inset-x-gut-50 rounded-full bg-bg-subtle -z-1 transition-all',
                              !active && 'opacity-0'
                            )}
                          ></div>
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </SiteGrid>
      </SiteWidth>
    </div>
  )
}
