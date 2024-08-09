import React, { useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchQuery, setSearchResults, setSelectedResult, setLimit, setOffset, setSort } from './searchSlice';
import { Box, Button, InputAdornment, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Pagination, TableSortLabel } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchResult {
  id: number;
  name: string;
  language: string;
  forks: number;
  stars: number;
  updatedAt: string;
  description: string;
  license: string;
}

const SearchBar = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector((state) => state.search.searchQuery);
  const searchResults = useSelector((state) => state.search.searchResults);
  const selectedResult = useSelector((state) => state.search.selectedResult);
  const limit = useSelector((state) => state.search.limit);
  const offset = useSelector((state) => state.search.offset);
  const sort = useSelector((state) => state.search.sort);

  const handleSearch = async () => {
    const response = await fetch(`https://api.github.com/search/repositories?q=${searchQuery}&per_page=${limit}&page=${offset / limit + 1}`);
    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    const results: SearchResult[] = data.items.map((item) => ({
      id: item.id,
      name: item.name,
      language: item.language,
      forks: item.forks,
      stars: item.stargazers_count,
      updatedAt: item.updated_at,
      description: item.description,
      license: item.license?.name,
    }));
    dispatch(setSearchResults(results));
    dispatch(setSearchQuery(''));
  };

  const handleRowClick = (result: SearchResult) => {
    dispatch(setSelectedResult(result));
  };


  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    dispatch(setOffset((value - 1) * limit));
  };

  const handleSortChange = (column: string) => {
    if (!['name', 'language', 'forks', 'stars', 'updatedAt'].includes(column)) {
      throw new Error(`Недопустимый столбец для сортировки: ${column}`);
    }
    const newSort = { ...sort };
    if (newSort.column === column) {
      newSort.order = newSort.order === 'asc' ? 'desc' : 'asc';
    } else {
      newSort.column = column;
      newSort.order = 'asc';
    }
    dispatch(setSort(newSort));
  };

  const sortedResults = useMemo(() => {
    if (searchResults.length === 0) {
      return [];
    }
    const sortedArray = [...searchResults];
    if (sort.column === 'name') {
      sortedArray.sort((a, b) => {
        if (sort.order === 'asc') {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      });
    } else if (sort.column === 'language') {
      sortedArray.sort((a, b) => {
        if (sort.order === 'asc') {
          return a.language.localeCompare(b.language);
        } else {
          return b.language.localeCompare(a.language);
        }
      });
    } else if (sort.column === 'forks') {
      sortedArray.sort((a, b) => {
        if (sort.order === 'asc') {
          return a.forks - b.forks;
        } else {
          return b.forks - a.forks;
        }
      });
    } else if (sort.column === 'stars') {
      sortedArray.sort((a, b) => {
        if (sort.order === 'asc') {
          return a.stars - b.stars;
        } else {
          return b.stars - a.stars;
        }
      });
    } else if (sort.column === 'updatedAt') {
      sortedArray.sort((a, b) => {
        if (sort.order === 'asc') {
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        } else {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
      });
    }
    return sortedArray;
  }, [searchResults, sort]);

  const pageCount = sortedResults.length > 0 ? Math.ceil(sortedResults.length / limit) : 1;
  const currentPage = offset >= 0 ? Math.floor(offset / limit) + 1 : 1;

  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: 'auto auto',
      gap: 2,
      width: '100%',
    }}>
      <Box sx={{
        gridRow: 1,
        gridColumn: 1,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#00838F',
        padding: 2,
        borderRadius: 4,
        width: '100%',
        margin: 0,
      }}>
        <TextField
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          label="Поиск"
          placeholder='Введите поисковый запрос'
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: '100%', marginRight: 2 }}
        />
        <Button variant="contained" onClick={handleSearch}>
          ИСКАТЬ
        </Button>
      </Box>
      {searchResults.length > 0 && (
        <Box sx={{
          gridRow: 2,
          gridColumn: 1,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            Результаты поиска
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={sort.column === 'name'}
                      direction={sort.order}
                      onClick={() => handleSortChange('name')}
                    >
                      Название
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sort.column === 'language'}
                      direction={sort.order}
                      onClick={() => handleSortChange('language')}
                    >
                      Язык
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sort.column === 'forks'}
                      direction={sort.order}
                      onClick={() => handleSortChange('forks')}
                    >
                      Число форков
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sort.column === 'stars'}
                      direction={sort.order}
                      onClick={() => handleSortChange('stars')}
                    >
                      Число звёзд
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sort.column === 'updatedAt'}
                      direction={sort.order}
                      onClick={() => handleSortChange('updatedAt')}
                    >
                      Дата обновления
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              {sortedResults.length > 0 && (
              <TableBody>
                {sortedResults.slice((currentPage - 1) * limit, currentPage * limit).map((result) => (
                  <TableRow key={result.id} onClick={() => handleRowClick(result)}>
                    <TableCell>{result.name}</TableCell>
                    <TableCell>{result.language}</TableCell>
                    <TableCell>{result.forks}</TableCell>
                    <TableCell>{result.stars}</TableCell>
                    <TableCell>{result.updatedAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>)}
            </Table>
          </TableContainer>
          <Pagination
            count={pageCount}
            page={currentPage}
            onChange={handlePageChange}
            disabled={sortedResults.length === 0}
          />
        </Box>
      )}
      {selectedResult && (
        <Box sx={{
          gridRow: 2,
          gridColumn: 2,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <h2>Подробности</h2>
          <p>{selectedResult.name}</p>
          <p>Описание: {selectedResult.description}</p>
          <p>Лицензия: {selectedResult.license}</p>
        </Box>
      )}
    </Box>
  );
};

export default SearchBar;