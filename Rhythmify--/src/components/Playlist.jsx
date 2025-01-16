import React from "react";

const PlaylistCard = ({ playlist, onSelect }) => (
  <div
    className="flex flex-col items-center p-4 bg-white rounded-md shadow-md cursor-pointer hover:bg-gray-100"
    onClick={() => onSelect(playlist)}
  >
    <img
      src={playlist.picture_medium}
      alt={playlist.title}
      className="w-full h-40 rounded-md object-cover"
    />
    <h3 className="mt-2 text-lg font-semibold text-gray-800">{playlist.title}</h3>
  </div>
);

export default PlaylistCard;
