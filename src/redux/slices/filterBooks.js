import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import creatBookWithId from '../../utils/creatBookWithId';
import { setError } from './errorSlice';

const initialState = {
  books: [],
  isLoadingVieAPI: false,
};

//Второй вариант функции
export const fetchBook = createAsyncThunk(
  'filterBook/fetchBook',
  async (url, thunkAPI) => {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (error) {
      thunkAPI.dispatch(setError(error.message));
      // Вариант 1
      return thunkAPI.rejectWithValue(error);
      // Вариант 2
      // throw error
    }
  }
);

const booksReducer = createSlice({
  name: 'filterBook',
  initialState,
  reducers: {
    setAddBook: (state, action) => {
      state.books.push(action.payload);
    },
    setDeleteBook: (state, action) => {
      return {
        ...state,
        books: state.filter((book) => book.id !== action.payload),
      };
    },
    setToggleFavorite: (state, action) => {
      return state.books.forEach((book) => {
        if (book.id === action.payload) {
          book.isFavorite = !book.isFavorite;
        }
      });
    },
  },
  //Третий вариант
  extraReducers: {
    [fetchBook.pending]: (state) => {
      state.isLoadingVieAPI = true;
    },
    [fetchBook.fulfilled]: (state, action) => {
      state.isLoadingVieAPI = false;
      if (action.payload.title && action.payload.author) {
        state.books.push(creatBookWithId(action.payload, 'API'));
      }
    },
    [fetchBook.rejected]: (state) => {
      state.isLoadingVieAPI = false;
    },
  },
  // Второй вариант функции и создания нового reducers для нее
  //   extraReducers: (builder) => {
  //     builder.addCase(fetchBook.pending, (state) => {
  //       state.isLoadingVieAPI = true;
  //     });
  //     builder.addCase(fetchBook.fulfilled, (state, action) => {
  //       if (action.payload.title && action.payload.author) {
  //         state.books.push(creatBookWithId(action.payload, 'API'));
  //       }
  //     });
  //     builder.addCase(fetchBook.rejected, (state) => {
  //       state.isLoadingVieAPI = false;
  //     });
  //   },
});

export const { setAddBook, setDeleteBook, setToggleFavorite } =
  booksReducer.actions;

// Так создается асинхронная функция для хранения ее состояния в Reduxs
// dispath - отправка состояния; getState - чтение состояния;
// export const thunkFunction = async (dispatch, getState) => {
//   try {
//     const res = await axios.get('http://localhost:4000/random-book');
//     if (res?.data?.title && res?.data?.author) {
//       dispatch(setAddBook(creatBookWithId(res.data, 'API')));
//     }
//   } catch (error) {
//     console.log('Error fetching random book', error);
//   }
//   К примеру такой запрос
//   console.log(getState().books);
// };

export const selectBooks = (state) => state.books.books;
export const selectIsLoadingVieAPI = (state) => state.books.isLoadingVieAPI;

export default booksReducer.reducer;
