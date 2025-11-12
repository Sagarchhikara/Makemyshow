const API_KEY = '48e8311bc75552ff9f831b9c52e76a2d';
const API_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const IMAGE_BASE_URL_ORIGINAL = 'https://image.tmdb.org/t/p/original';


export const fetchMovies = async (endpoint) => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}?api_key=${API_KEY}&language=en-US&page=1`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};
