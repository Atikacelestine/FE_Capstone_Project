import React from "react";

const PodcastCard = ({ podcast, onSelect }) => (
  <div
    className="flex flex-col items-center p-4 bg-white rounded-md shadow-md cursor-pointer hover:bg-gray-100"
    onClick={() => onSelect(podcast)}
  >
    <img
      src={podcast.picture_medium}
      alt={podcast.title}
      className="w-full h-40 rounded-md object-cover"
    />
    <h3 className="mt-2 text-lg font-semibold text-gray-800">{podcast.title}</h3>
    <p className="mt-1 text-sm text-gray-600">{podcast.description.slice(0, 100)}...</p>
  </div>
);

export default PodcastCard;
