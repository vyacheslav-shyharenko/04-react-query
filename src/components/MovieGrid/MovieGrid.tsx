import type { Movie } from '../../types/movie';
import './MovieGrid.module.css';
import css from './MovieGrid.module.css';

interface MovieGridProps {
  onSelect: (movie: Movie) => void;
  movies: Movie[];
}

const MovieGrid = ({ movies, onSelect }: MovieGridProps) => {
  return (
    <>
      <ul className={css.grid}>
        {movies.length > 0 &&
          movies.map((movie) => {
            const { id, poster_path, title } = movie;
            return (
              <li
                onClick={() => {
                  onSelect(movie);
                }}
                key={id}
              >
                <div className={css.card}>
                  <img
                    className={css.image}
                    src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
                    alt="movie title"
                    loading="lazy"
                  />
                  <h2 className={css.title}>{title}</h2>
                </div>
              </li>
            );
          })}
      </ul>
    </>
  );
};

export default MovieGrid;
