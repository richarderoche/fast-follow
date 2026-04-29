'use client'

import VideoOverlay from '@/components/home/VideoOverlay'
import VideoProject from '@/components/home/VideoProject'
import {
  buildFilterOptions,
  countVideosByArtist,
  filterProjects,
  ProjectFilterState,
} from '@/lib/projectFilters'
import { useProjectsStore } from '@/lib/store'
import type { AllProjectsQueryResult } from '@/sanity.types'
import { useMemo, useState } from 'react'
import SiteWidth from '../shared/SiteWidth'
import FeedControls from './FeedControls'
import Filters from './Filters'
import FiltersOverlay from './FiltersOverlay'

export default function VideoFeed({
  projects,
}: {
  projects: AllProjectsQueryResult
}) {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [overlayProject, setOverlayProject] = useState<
    AllProjectsQueryResult[number] | null
  >(null)
  const { selectedFormatId, selectedRoleId, selectedArtistId } =
    useProjectsStore()

  const filterState: ProjectFilterState = useMemo(
    () => ({
      formatId: selectedFormatId,
      roleId: selectedRoleId,
      artistId: selectedArtistId,
    }),
    [selectedFormatId, selectedRoleId, selectedArtistId]
  )

  const { formatOptions, roleOptions, artistsByRole } = useMemo(
    () => buildFilterOptions(projects),
    [projects]
  )

  const filteredProjects = useMemo(
    () => filterProjects(projects, filterState),
    [projects, filterState]
  )

  /** Counts match the visible feed: with an artist selected, others only count shared credits. */
  const artistVideoCounts = useMemo(
    () => countVideosByArtist(filteredProjects),
    [filteredProjects]
  )

  const filtersProps = {
    formatOptions,
    roleOptions,
    artistsByRole,
    artistVideoCounts,
  }

  return (
    <>
      <VideoOverlay
        project={overlayProject}
        onClose={() => setOverlayProject(null)}
      />
      <FiltersOverlay
        filtersOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      >
        <Filters {...filtersProps} />
      </FiltersOverlay>

      <Filters {...filtersProps} />
      <FeedControls onToggleFilters={() => setFiltersOpen((o) => !o)} />
      <SiteWidth>
        {filteredProjects.length === 0 ? (
          <p className="text-body-subtle py-gut-200">No projects match.</p>
        ) : (
          <div className="grid grid-cols-6 gap-x-gut gap-y-gut-200">
            {filteredProjects.map((project, index) => (
              <VideoProject
                key={project._id}
                project={project}
                index={index}
                onOpen={() => setOverlayProject(project)}
              />
            ))}
          </div>
        )}
      </SiteWidth>
    </>
  )
}
