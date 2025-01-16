import axiosInstance from './api';

export const fetchTracks = async (query) => {
  try {
    const response = await axiosInstance.get(`/search?q=${query}`);
    return response.data.data; // Return the track data
  } catch (error) {
    console.error('Error fetching tracks:', error);
    throw error;
  }
};
