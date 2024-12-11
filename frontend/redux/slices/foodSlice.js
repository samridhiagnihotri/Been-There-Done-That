import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  categorizedData: {},
  loading: false,
  error: null
};

const foodSlice = createSlice({
  name: 'food',
  initialState,
  reducers: {
    setFoods: (state, action) => {
      console.log('Setting foods in Redux:', {
        currentState: { ...state },
        newData: action.payload,
        dataLength: action.payload?.length
      });
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCategorizedFoods: (state, action) => {
      console.log('Redux setCategorizedFoods:', {
        categories: Object.keys(action.payload || {}),
        itemCounts: Object.entries(action.payload || {}).map(([k, v]) => `${k}: ${v.length}`)
      });
      state.categorizedData = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const { setFoods, setCategorizedFoods, setLoading, setError } = foodSlice.actions;
export default foodSlice.reducer;
