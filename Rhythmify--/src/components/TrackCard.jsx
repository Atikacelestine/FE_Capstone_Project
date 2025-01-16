import React from 'react';
import { useStore } from '../store';

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
    <div
      className="flex items-center gap-4 p-4 bg-white rounded-md shadow-md cursor-pointer hover:bg-gray-100"
      onClick={() => playTrack(track)}
    >
      <img
        src={track.album.cover_small}
        alt={track.album.title}
        className="w-16 h-16 rounded-md"
      />
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800">{track.title}</h3>
        <p className="text-sm text-gray-600">{track.artist.name}</p>
        <p className="text-sm text-gray-500">{track.album.title}</p>
      </div>
    </div>
  );
};

export default TrackCard;
