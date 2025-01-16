import React, { useState, useEffect } from 'react';
import { useStore } from '../store';

const LyricsDisplay = () => {
  const { currentTrack, audio } = useStore();
  const [lyrics, setLyrics] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  useEffect(() => {
    if (currentTrack) {
      fetchLyrics(currentTrack.id);
    }
  }, [currentTrack]);

  const fetchLyrics = async (trackId) => {
    try {
      // Replace with your actual lyrics API call
      const response = await fetch(`https://example-lyrics-api.com/lyrics/${trackId}`);
      const data = await response.json();
      setLyrics(data.lyrics); // Assuming lyrics come as [{ timestamp: 5, line: "Some lyric" }]
      setCurrentLineIndex(0);
    } catch (error) {
      console.error('Error fetching lyrics:', error);
      setLyrics([]);
    }
  };

  useEffect(() => {
    if (audio) {
      const updateCurrentLyric = () => {
        const currentTime = audio.currentTime;
        const index = lyrics.findIndex(
          (lyric, idx) =>
            currentTime >= lyric.timestamp &&
            (idx === lyrics.length - 1 || currentTime < lyrics[idx + 1].timestamp)
        );
        if (index !== -1) {
          setCurrentLineIndex(index);
        }
      };

      audio.addEventListener('timeupdate', updateCurrentLyric);

      return () => {
        audio.removeEventListener('timeupdate', updateCurrentLyric);
      };
    }
  }, [audio, lyrics]);

  if (!lyrics.length) {
    return <p className="text-center text-gray-500">Lyrics not available for this track.</p>;
  }

  return (
    <div className="p-4 text-center bg-black text-white">
      {lyrics.map((lyric, index) => (
        <p
          key={index}
          className={`transition-all duration-300 ${
            index === currentLineIndex ? 'text-xl font-bold text-blue-400' : 'text-lg text-gray-400'
          }`}
        >
          {lyric.line}
        </p>
      ))}
    </div>
  );
};

export default LyricsDisplay;
