import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import fetchMovies, { type FetchMoviesParams } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import SearchBar from '../SearchBar/SearchBar';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import ReactPaginate from 'react-paginate';

import css from './App.module.css';

const App = () => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchParams, setSearchParams] = useState<FetchMoviesParams>({
    query: '',
    page: 1,
  });
  console.log('🚀 | searchParams:', searchParams.page);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['movies', searchParams],
    queryFn: () => fetchMovies(searchParams),
    enabled: !!searchParams.query,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data?.results.length === 0) {
      toast('No movies found for your request.', {
        icon: '😢',
        style: {
          borderRadius: '10px',
          background: '#ff9797ff',
          color: '#000000ff',
        },
      });
    }
  }, [data]);

  const { results = [], total_pages = 1 } = data ?? {};

  const handleSearch = (params: FetchMoviesParams) => {
    setSearchParams({ ...params, page: 1 });
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setSearchParams((prev) => ({ ...prev, page: selected + 1 }));
  };

  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  return (
    <>
      <Toaster position="bottom-left" reverseOrder={false} />
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {isSuccess && (
        <>
          {total_pages > 1 && (
            <ReactPaginate
              pageCount={total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={handlePageChange}
              forcePage={(searchParams.page as number) - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}

          <MovieGrid movies={results} onSelect={handleSelect} />
        </>
      )}

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
    </>
  );
};

export default App;
