import { useDispatch, useSelector } from 'react-redux';
import {
  setAddBook,
  fetchBook,
  selectIsLoadingVieAPI,
} from '../../redux/slices/filterBooks';
import { FaSpinner } from 'react-icons/fa';
import { setError } from '../../redux/slices/errorSlice';
import { useState } from 'react';
import createBookWithId from '../../utils/creatBookWithId';
import booksData from '../../data/books.json';
import './BookForm.css';

const BookForm = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const isLoadingVieAPI = useSelector(selectIsLoadingVieAPI);
  const dispatch = useDispatch();

  const handleAddRandomBook = () => {
    const randomIndex = Math.floor(Math.random() * booksData.length);
    const randomBook = booksData[randomIndex];
    dispatch(setAddBook(createBookWithId(randomBook, 'random')));
  };

  const handleSumbit = (e) => {
    e.preventDefault();
    if (title && author) {
      dispatch(setAddBook(createBookWithId({ title, author }, 'manual')));
      setTitle('');
      setAuthor('');
    } else {
      dispatch(setError('You must fill title and author!'));
    }
  };

  // Это родительская функция, в которую вложенна функция thunkFunction
  const handleAddRandomBookViaAPI = () => {
    dispatch(fetchBook('http://localhost:4000/random-book-delayed'));
  };
  return (
    <div className={'app-block book-form'}>
      <h2>Add a New Book</h2>
      <form onSubmit={handleSumbit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <button type="submit">Add Book</button>
        <button type="button" onClick={handleAddRandomBook}>
          Add Random
        </button>

        <button
          tupe="button"
          onClick={handleAddRandomBookViaAPI}
          disabled={isLoadingVieAPI}
        >
          {isLoadingVieAPI ? (
            <>
              <span>Loading book...</span>
              <FaSpinner className="spinner" />
            </>
          ) : (
            'Add random via API'
          )}
        </button>
      </form>
    </div>
  );
};

export default BookForm;
