import toast, { Toaster } from 'react-hot-toast';
import type { FetchMoviesParams } from '../../services/movieService';
import './SearchBar.module.css';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSubmit: (params: FetchMoviesParams) => void;
}

const SearchBar = ({ onSubmit }: SearchBarProps) => {
  const handleSubmit = (formData: FormData) => {
    const query = formData.get('query') as string;

    if (query === '') {
      toast('Please enter your search query.', {
        icon: '🥺',
        style: {
          borderRadius: '10px',
          background: '#3f3f3fff',
          color: '#fff',
        },
      });
      return;
    }

    onSubmit({ query });
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <a
            className={styles.link}
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by TMDB
          </a>
          <form action={handleSubmit} className={styles.form}>
            <input
              className={styles.input}
              type="text"
              name="query"
              autoComplete="off"
              placeholder="Search movies..."
              autoFocus
            />
            <button className={styles.button} type="submit">
              Search
            </button>
          </form>
        </div>
      </header>
      <Toaster position="bottom-left" reverseOrder={false} />
    </>
  );
};

export default SearchBar;
