import create from 'zustand';

const useStore = create((set) => ({
    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
    tracks: [],
    setTracks: (tracks) => set({ tracks }),
    currentTrack: null,
    setCurrentTrack: (track) => set({ currentTrack: track }),
    isPlaying: false,
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    playlists: [],
    setPlaylists: (playlists) => set({ playlists }),
    podcasts: [],
    setPodcasts: (podcasts) => set({ podcasts }),
}));
  
export default useStore;
