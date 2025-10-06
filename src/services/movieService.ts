import axios from 'axios';
import type { Movie } from '../types/movie';

const VITE_TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export interface FetchMoviesParams {
  query?: string;
  page?: number;
  language?: string;
  include_adult?: boolean;
}

export interface ApiResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const fetchMovies = async ({
  query,
  page,
  language,
  include_adult,
}: FetchMoviesParams): Promise<ApiResponse> => {
  const { data } = await axios.get<ApiResponse>('https://api.themoviedb.org/3/search/movie', {
    params: {
      query,
      include_adult,
      language,
      page,
    },
    headers: {
      Authorization: `Bearer ${VITE_TMDB_TOKEN}`,
    },
  });

  return data;
};

export default fetchMovies;
