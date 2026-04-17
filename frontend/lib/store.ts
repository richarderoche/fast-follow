import { create } from 'zustand'

type AppStore = {
  enablePageTransition: boolean
  setEnablePageTransition: (value: boolean) => void
  isMobileNavOpen: boolean
  setIsMobileNavOpen: (value: boolean) => void
  pauseLenis: boolean
  setPauseLenis: (value: boolean) => void
}

type ProjectsStore = {
  thumbnailsPerRow: number
  selectedFormatId: string | null
  selectedRoleId: string | null
  selectedArtistId: string | null
  setThumbnailsPerRow: (value: number) => void
  setSelectedFormatId: (id: string | null) => void
  setSelectedRoleId: (id: string | null) => void
  selectArtistFilter: (id: string) => void
}

export const useAppStore = create<AppStore>((set) => ({
  enablePageTransition: false,
  setEnablePageTransition: (value: boolean) =>
    set({ enablePageTransition: value }),
  isMobileNavOpen: false,
  setIsMobileNavOpen: (value: boolean) => set({ isMobileNavOpen: value }),
  pauseLenis: false,
  setPauseLenis: (value: boolean) => set({ pauseLenis: value }),
}))

export const useProjectsStore = create<ProjectsStore>((set) => ({
  thumbnailsPerRow: 2,
  selectedFormatId: null,
  selectedRoleId: null,
  selectedArtistId: null,
  setThumbnailsPerRow: (value: number) => set({ thumbnailsPerRow: value }),
  setSelectedFormatId: (id: string | null) => set({ selectedFormatId: id }),
  setSelectedRoleId: (id: string | null) => set({ selectedRoleId: id }),
  selectArtistFilter: (id: string) =>
    set((s) => ({
      selectedArtistId: s.selectedArtistId === id ? null : id,
    })),
}))
