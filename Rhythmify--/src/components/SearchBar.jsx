import React, { useState } from 'react';
import axiosInstance from './services/api';

    const handleSearch = async (query) => {
        try {
          const response = await axiosInstance.get(`/search?q=${query}`);
          const data = response.data.data;
          if (data) {
            if (currentView === "playlists") setPlaylists(data);
            else if (currentView === "podcasts") setPodcasts(data);
            else setTracks(data);
          }
        } catch (error) {
          console.error("Search error:", error);
        }
      };
      

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useState([]);

  const fetchTracks = async (query) => {
    try {
      const response = await axiosInstance.get(`/search?q=${query}`);
      if (response.data && response.data.data.length>0){
      setTracks(response.data.data); // Assuming response.data.data contains the tracks
    } else {
        setTracks([]);
        setError('No tracks found. Try searching for something else.');
      }
    } catch (error) {
      console.error('Error fetching tracks:', error);
      setError('Failed to fetch tracks. Please check your internet connection and try again.');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchTracks(searchQuery);
    }
  };

  const useStore = create((set) => ({
    recentlyPlayed: [],
    addToRecentlyPlayed: (item) => set((state) => ({
      recentlyPlayed: [item, ...state.recentlyPlayed.filter((i) => i.id !== item.id)].slice(0, 10),
    })),
  }));
  

  return (
    <form onSubmit={handleSearch}
    className="flex items-center gap-4 px-4 py-2 bg-gray-100 rounded-md shadow-md"
    >
    
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for a track, artist, playlists,podcasts or album..."
        className="flex-grow px-4 py-2 text-gray-700 bg-white border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
    
     />
      <button type="submit"
        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
      >Search</button>
    </form>

  );
};

export default SearchBar
