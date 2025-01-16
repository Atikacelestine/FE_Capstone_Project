import React from 'react';
import { useStore } from '../store';
import WaveSurfer from 'wavesurfer.js';
import React, { useRef, useEffect} from "react";

const MusicPlayer = () => {
  const { currentTrack, isPlaying, setIsPlaying, audio } = useStore();
  const waveformRef = useRef();
  

  useEffect(() => {
    if (audio && waveformRef.current) {
      const waveSurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "white",
        progressColor: "blue",
        height: 50,
        responsive: true,
      });
      waveSurfer.load(audio.src);
    }
  }, [audio]);

  if (!currentTrack) return null;



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

  const handleSelectPlaylist = async (playlist) => {
    try {
      const response = await axiosInstance.get(`/playlist/${playlist.id}`);
      const tracks = response.data.tracks.data;
      useStore.getState().setTracks(tracks);
    } catch (error) {
      console.error('Error fetching playlist tracks:', error);
    }
  };
  
  const handleSelectPodcast = async (podcast) => {
    try {
      const response = await axiosInstance.get(`/podcast/${podcast.id}`);
      const episodes = response.data.data;
      useStore.getState().setTracks(episodes); // Assuming episodes have a `preview` URL
    } catch (error) {
      console.error('Error fetching podcast episodes:', error);
    }
  };
  
  const playTrack = (track) => {
    if (audio) {
      audio.pause();
    }
    const newAudio = new Audio(track.preview);
    setAudio(newAudio);
    setCurrentTrack(track);
    setIsPlaying(true);
    newAudio.play();
    addToRecentlyPlayed(track); // Update recently played
  };
  


  return (

    <section className="fixed bottom-0 left-0 right-0 flex items-center justify-between p-4 bg-gray-900 text-white">
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 text-white"></div>
      <div className="flex items-center gap-4">
      <div className="waveform" ref={waveformRef}></div>
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
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </section>
  );
};

export default MusicPlayer;
