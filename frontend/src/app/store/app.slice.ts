import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'app/axios';
import type { RootState } from 'app/store';
import { RATING_STATE } from 'app/helpers/constants';

type TAppState = {
  address: string;
  score: number;
  option: RATING_STATE;
  cofirmed: boolean;
  price: number;
  rating: RATING_STATE;
};

export const fetchBTCPrice = createAsyncThunk<
  { price: number; deal: boolean },
  boolean,
  { state: RootState }
>('app/fetchBTCPrice', async (deal, thunkAPI) => {
  const { price, option } = thunkAPI.getState().app;
  const res = await axios.get(
    'https://api.coindesk.com/v1/bpi/currentprice.json',
  );
  const newPrice = res.data.bpi.USD.rate_float;

  if (deal && option !== RATING_STATE.none) {
    const rating = Math.sign(newPrice - price) + 1;

    if (rating === option) {
      thunkAPI.dispatch(plusScore());
    } else {
      thunkAPI.dispatch(minusScore());
    }
  }

  return { price: newPrice, deal };
});

export const fetchScore = createAsyncThunk<
  { score: number },
  void,
  { state: RootState }
>('app/fetchScore', async (_, thunkAPI) => {
  const { address } = thunkAPI.getState().app;

  if (!!address) {
    const res = await axios.get('/users/get-score', {
      params: { address },
    });

    return res.data;
  } else {
    return { score: null! };
  }
});

export const plusScore = createAsyncThunk<
  { success: boolean },
  void,
  { state: RootState }
>('app/plusScore', async (_, thunkAPI) => {
  const { address } = thunkAPI.getState().app;
  const res = await axios.get('/users/plus-score', {
    params: { address },
  });

  return res.data;
});

export const minusScore = createAsyncThunk<
  { success: boolean },
  void,
  { state: RootState }
>('app/minusScore', async (_, thunkAPI) => {
  const { address } = thunkAPI.getState().app;
  const res = await axios.get('/users/minus-score', {
    params: { address },
  });

  return res.data;
});

const appSlice = createSlice({
  name: 'app',
  initialState: {
    address: '',
    score: null!,
    option: RATING_STATE.none,
    cofirmed: false,
    price: 0.0,
    rating: RATING_STATE.none,
  } as TAppState,
  reducers: {
    setAddress: (state, action) => ({
      ...state,
      address: action.payload,
      score: null!,
    }),
    confirmOption: (state) => ({
      ...state,
      cofirmed: true,
    }),
    takeUpOption: (state) => ({
      ...state,
      option: RATING_STATE.up,
    }),
    takeDownOption: (state) => ({
      ...state,
      option: RATING_STATE.down,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBTCPrice.fulfilled, (state, action) => {
      const { price, deal } = action.payload;

      state.rating = deal
        ? Math.sign(price - state.price) + 1
        : RATING_STATE.none;
      state.price = price;
      state.option = RATING_STATE.none;
      state.cofirmed = false;
    });

    builder.addCase(fetchScore.fulfilled, (state, action) => {
      state.score = action.payload.score;
    });

    builder.addCase(plusScore.fulfilled, (state, action) => {
      const { success } = action.payload;

      if (success) {
        state.score++;
      }
    });

    builder.addCase(minusScore.fulfilled, (state, action) => {
      const { success } = action.payload;

      if (success) {
        state.score--;
      }
    });
  },
});

export const { setAddress, confirmOption, takeUpOption, takeDownOption } =
  appSlice.actions;

export default appSlice.reducer;
