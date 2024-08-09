import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface SearchState {
  searchQuery: string;
  searchResults: SearchResult[];
  selectedResult: SearchResult | null;
  limit: number;
  offset: number;
  sort: { column: string; order: 'asc' | 'desc' };
}

const initialState: SearchState = {
  searchQuery: '',
  searchResults: [],
  selectedResult: null,
  limit: 10,
  offset: 0,
  sort: { column: 'name', order: 'asc' },
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setSearchResults(state, action: PayloadAction<SearchResult[]>) {
      state.searchResults = action.payload;
    },
    setSelectedResult(state, action: PayloadAction<SearchResult | null>) {
      state.selectedResult = action.payload;
    },
    setLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload;
    },
    setOffset(state, action: PayloadAction<number>) {
      state.offset = action.payload;
    },
    setSort(state, action: PayloadAction<{ column: string; order: 'asc' | 'desc' }>) {
      state.sort = action.payload;
    },
  },
});

export const {
  setSearchQuery,
  setSearchResults,
  setSelectedResult,
  setLimit,
  setOffset,
  setSort,
} = searchSlice.actions;

export default searchSlice.reducer;