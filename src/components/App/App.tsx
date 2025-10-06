import { useEffect, useState } from 'react';

import toast, { Toaster } from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
import fetchMovies, { type FetchMoviesParams } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import SearchBar from '../SearchBar/SearchBar';

import css from './App.module.css';

const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState<FetchMoviesParams | null>(null);

  const fetchData = async (params: FetchMoviesParams) => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchMovies(params);

      if (data.results.length === 0) {
        toast('No movies found for your request.', {
          icon: '😢',
          style: {
            borderRadius: '10px',
            background: '#ff9797ff',
            color: '#000000ff',
          },
        });
        setMovies([]);
      } else {
        setMovies(data.results);
        setTotalPages(data.total_pages);
        setCurrentPage(data.page);
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams) {
      fetchData({ ...searchParams, page: currentPage });
    }
  }, [currentPage, searchParams]);

  const handleSearch = (params: FetchMoviesParams) => {
    setSearchParams(params);
    setCurrentPage(1);
    fetchData({ ...params, page: 1 });
  };

  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  return (
    <>
      <Toaster position="bottom-left" reverseOrder={false} />
      <SearchBar onSubmit={handleSearch} />

      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {loading && <Loader />}
      {error && <ErrorMessage />}
      <MovieGrid movies={movies} onSelect={handleSelect} />

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
    </>
  );
};

export default App;
