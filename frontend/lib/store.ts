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
  setThumbnailsPerRow: (value: number) => void
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
  setThumbnailsPerRow: (value: number) => set({ thumbnailsPerRow: value }),
}))
