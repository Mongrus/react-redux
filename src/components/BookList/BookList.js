import { useSelector } from 'react-redux/es/hooks/useSelector';
import { BsBookmarkStarFill, BsBookmarkStar } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import {
  selectBooks,
  setDeleteBook,
  setToggleFavorite,
} from '../../redux/slices/filterBooks';
import {
  selectTitleFilter,
  selectAuthorFilter,
  selectOnlyFavoriteFilter,
} from '../../redux/slices/filterSlice';
import './BookList.css';

const BookList = () => {
  const books = useSelector(selectBooks);
  const titleFilter = useSelector(selectTitleFilter);
  const authorFilter = useSelector(selectAuthorFilter);
  const onlyFavoriteFilter = useSelector(selectOnlyFavoriteFilter);

  const dispatch = useDispatch();

  const handleDeleteBook = (id) => {
    dispatch(setDeleteBook(id));
  };
  const handleToggleBook = (id) => {
    dispatch(setToggleFavorite(id));
  };

  const filteredBooks = books.filter((book) => {
    const mathesTitle = book.title
      .toLowerCase()
      .includes(titleFilter.toLowerCase());
    const mathesAuthor = book.author
      .toLowerCase()
      .includes(authorFilter.toLowerCase());
    const mathesFavorite = onlyFavoriteFilter ? book.isFavorite : true;
    return mathesTitle && mathesAuthor && mathesFavorite;
  });

  const highlightMatch = (text, filter) => {
    if (!filter) return text;
    const regex = new RegExp(`(${filter})`, 'gi');
    return text.split(regex).map((substring, i) => {
      if (substring.toLowerCase() === filter.toLowerCase()) {
        return (
          <span key={i} className="highlight">
            {substring}
          </span>
        );
      }
      return substring;
    });
  };

  return (
    <div className={'app-block book-list'}>
      <h2>Book List</h2>
      {books.length === 0 ? (
        <p>No books available</p>
      ) : (
        <ul>
          {filteredBooks.map((book, i) => (
            <li key={book.id}>
              <div className="book-info">
                {++i}. {highlightMatch(book.title, titleFilter)} by{' '}
                <strong>{highlightMatch(book.author, titleFilter)}</strong> (
                {book.source})
              </div>
              <div className="book-action">
                <span onClick={() => handleToggleBook(book.id)}>
                  {book.isFavorite ? (
                    <BsBookmarkStarFill className="star-icon" />
                  ) : (
                    <BsBookmarkStar className="star-icon" />
                  )}
                </span>
                <button onClick={() => handleDeleteBook(book.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookList;
