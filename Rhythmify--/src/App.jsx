import React, { useState, useEffect } from "react";
import axios from "axios";
import create from "zustand";
import "tailwindcss/tailwind.css";
import LyricsDisplay from './components/LyricsDisplay';
import PlaylistCard from "./components/Playlist";
import PodcastCard from "./components/Podcast";
import SearchBar from './components/SearchBar';
import TrackCard from './components/TrackCard';
import MusicPlayer from './components/MusicPlayer';
import { useHistory } from 'react-router-dom';
import { useStore } from "zustand";

function App() {
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('deezer_access_token'));
  const history = useHistory();

  useEffect(() => {
    if (accessToken) {
      fetchUserInfo();
    }
  }, [accessToken]);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`https://api.deezer.com/user/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

 // Function to fetch music tracks based on search query
 const searchTracks = async (query) => {
  setLoading(true);
  try {
    const response = await axios.get(`https://api.deezer.com/search?q=${query}`);
    setTracks(response.data.data);
  } catch (error) {
    console.error('Error fetching tracks:', error);
  } finally {
    setLoading(false);
  }

  const loginWithDeezer = () => {
    const deezerAuthUrl = `https://connect.deezer.com/oauth/auth.php?app_id=YOUR_APP_ID&redirect_uri=http://localhost:3000/callback&response_type=code&scope=basic_access,email,offline_access`;
    window.location.href = deezerAuthUrl; // Redirect to Deezer OAuth login page
  };

  const handleDeezerCallback = async (code) => {
    try {
      const response = await axios.post('https://connect.deezer.com/oauth/access_token.php', null, {
        params: {
          app_id: 'YOUR_APP_ID',
          secret: 'YOUR_APP_SECRET',
          code: code,
          redirect_uri: 'http://localhost:3000/callback',
        },
      });

      const accessToken = response.data.access_token;
      localStorage.setItem('deezer_access_token', accessToken); // Store token
      setAccessToken(accessToken);
    } catch (error) {
      console.error('Error during Deezer callback:', error);
    }
  };

const App = () => {
  const { playlists, podcasts ,tracks ,currentTrack, currentView , setCurrentView} = useStore();
  
  const handleBackToTracks = () => setCurrentView("tracks");

  useEffect(() => {
    fetchPlaylists();
    fetchPodcasts();
  }, []);
};

// Zustand store for global state management
const useStore = create((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  tracks: [],
  setTracks: (tracks) => set({ tracks }),
  currentTrack: null,
  setCurrentTrack: (track) => set({ currentTrack: track }),
  isPlaying: false,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  audio: null,
  setAudio: (audio) => set({ audio }),
  error: null,
  setError: (error) => set({ error }),
}));

const DEEZER_API_URL = "https://api.deezer.com/search";

const SearchBar = () => {
  const { searchQuery, setSearchQuery, setTracks, setError } = useStore();

  const fetchTracks = async (query) => {
    try {
      setError(null); // Reset errors before a new request
      const response = await axios.get(`${DEEZER_API_URL}?q=${query}`);
      if (response.data && response.data.data.length > 0) {
        setTracks(response.data.data);
      } else {
        setTracks([]);
        setError("No tracks found. Try searching for something else.");
      }
    } catch (error) {
      console.error("Error fetching tracks:", error);
      setError("Failed to fetch tracks. Please check your internet connection and try again.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      fetchTracks(searchQuery);
    }
  };
}
 };

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-4 px-4 py-2 bg-blue-900 rounded-md shadow-md">
      <input
        type="text"
        placeholder="Search for a track, artist, or album..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-grow px-4 py-2 text-gray-200 bg-blue-800 border border-blue-700 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
      >
        Search
      </button>
    </form>
  );
};

const TrackCard = ({ track }) => {
  const { setCurrentTrack, setAudio, setIsPlaying, audio } = useStore();

  const playTrack = (track) => {
    if (audio) {
      audio.pause();
    }
    const newAudio = new Audio(track.preview);
    setAudio(newAudio);
    setCurrentTrack(track);
    setIsPlaying(true);
    newAudio.play();
  };

  return (
    <div>

      <img src={track.album.cover_small} alt={track.album.title} className="w-16 h-16 rounded-md" />
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold text-white">{track.title}</h3>
        <p className="text-sm text-gray-300">{track.artist.name}</p>
        <p className="text-sm text-gray-400">{track.album.title}</p>
      </div>
    </div>
  );
};

const MusicPlayer = () => {
  const { currentTrack, isPlaying, setIsPlaying, audio } = useStore();

  const togglePlayPause = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!currentTrack) return null;

  return (
    <section className="fixed bottom-0 left-0 right-0 flex items-center justify-between p-4 bg-blue-900 text-white">
      <div className="flex items-center gap-4">
        <img
          src={currentTrack.album.cover_medium}
          alt={currentTrack.album.title}
          className="w-16 h-16 rounded-md"
        />
        <div>
          <h3 className="text-lg font-semibold">{currentTrack.title}</h3>
          <p className="text-sm text-gray-400">{currentTrack.artist.name}</p>
        </div>
      </div>
      <button
        onClick={togglePlayPause}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
    </section>
  );
};




  return (

    <><div className="container mx-auto p-4">
      {currentView !== "tracks" && (
        <button
          onClick={handleBackToTracks}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Back to Tracks
        </button>
      )}

      {currentView === "tracks" && (
        <section>
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Tracks</h2>
          {/* Display tracks */}
        </section>
      )}

      {currentView === "playlists" && (
        <section>
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Playlists</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </section>
      )}

      {currentView === "podcasts" && (
        <section>
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Podcasts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {podcasts.map((podcast) => (
              <PodcastCard key={podcast.id} podcast={podcast} />
            ))}
          </div>
        </section>
      )}
    </div><div className="flex flex-col min-h-screen bg-black">
        <header className="py-4 bg-blue-800 text-white">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl font-bold">Music Player</h1>
          </div>
          <div className="container mx-auto px-4">
            <SearchBar />
          </div>
        </header>

        <main className="container flex-grow mx-auto px-4 py-6">
          {error && <p className="mb-4 text-center text-red-500">{error}</p>}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.length > 0 ? (
              tracks.map((track) => <TrackCard key={track.id} track={track} />)
            ) : (
              !error && <p className="text-center text-gray-500">No tracks found. Try searching for something else.</p>
            )}
          </section>
        </main>
        <div className="container mx-auto p-4">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Playlists</h2>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </section>

          <h2 className="text-2xl font-bold text-blue-600 mt-8 mb-4">Podcasts</h2>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {podcasts.map((podcast) => (
              <PodcastCard key={podcast.id} podcast={podcast} />
            ))}
          </section>
        </div>


        <MusicPlayer />
        <LyricsDisplay />
      </div></>
  );


export default App
