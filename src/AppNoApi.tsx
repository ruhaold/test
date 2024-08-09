import React, { useState, useMemo } from 'react';
import { Box, Button, InputAdornment, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Pagination, TableSortLabel } from '@mui/material'
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [sort, setSort] = useState<{ column: string; order: 'asc' | 'desc' }>({ column: 'name', order: 'asc' });

  const handleSearch = () => {
    // Имитация запроса)
    const results: SearchResult[] = [
      { id: 1, name: 'Репозиторий 1', language: 'JavaScript', forks: 10, stars: 50, updatedAt: '2022-01-01', description: 'Тестовое описание', license: 'MIT' },
      { id: 2, name: 'Репозиторий 2', language: 'Python', forks: 5, stars: 20, updatedAt: '2022-02-01', description: 'Тестовое описание', license: 'Apache-2.0' },
      { id: 3, name: 'Репозиторий 3', language: 'Java', forks: 15, stars: 30, updatedAt: '2022-03-01', description: 'Тестовое описание подлинне', license: 'GPL-3.0' },
      { id: 4, name: 'Репозиторий 4', language: 'C++', forks: 20, stars: 40, updatedAt: '2022-04-01', description: 'Тестовое описание', license: 'MIT' },
      { id: 5, name: 'Репозиторий 5', language: 'Ruby', forks: 10, stars: 10, updatedAt: '2022-05-01', description: 'Тестовое описание', license: 'Apache-2.0' },
      { id: 6, name: 'Репозиторий 6', language: 'Swift', forks: 15, stars: 25, updatedAt: '2022-06-01', description: 'Тестовое описание подлинне', license: 'GPL-3.0' },
      { id: 7, name: 'Репозиторий 1', language: 'JavaScript', forks: 10, stars: 50, updatedAt: '2022-01-01', description: 'Тестовое описание', license: 'MIT' },
      { id: 8, name: 'Репозиторий 2', language: 'Python', forks: 5, stars: 20, updatedAt: '2022-02-01', description: 'Тестовое описание', license: 'Apache-2.0' },
      { id: 9, name: 'Репозиторий 3', language: 'Java', forks: 15, stars: 30, updatedAt: '2022-03-01', description: 'Тестовое описание подлинне', license: 'GPL-3.0' },
      { id: 10, name: 'Репозиторий 4', language: 'C++', forks: 20, stars: 40, updatedAt: '2022-04-01', description: 'Тестовое описание', license: 'MIT' },
      { id: 11, name: 'Репозиторий 5', language: 'Ruby', forks: 10, stars: 10, updatedAt: '2022-05-01', description: 'Тестовое описание', license: 'Apache-2.0' },
      { id: 12, name: 'Репозиторий 6', language: 'Swift', forks: 15, stars: 25, updatedAt: '2022-06-01', description: 'Тестовое описание подлинне', license: 'GPL-3.0' },
      { id: 13, name: 'Репозиторий 1', language: 'JavaScript', forks: 10, stars: 50, updatedAt: '2022-01-01', description: 'Тестовое описание', license: 'MIT' },
      { id: 14, name: 'Репозиторий 2', language: 'Python', forks: 5, stars: 20, updatedAt: '2022-02-01', description: 'Тестовое описание', license: 'Apache-2.0' },
      { id: 15, name: 'Репозиторий 3', language: 'Java', forks: 15, stars: 30, updatedAt: '2022-03-01', description: 'Тестовое описание подлинне', license: 'GPL-3.0' },
      { id: 16, name: 'Репозиторий 4', language: 'C++', forks: 20, stars: 40, updatedAt: '2022-04-01', description: 'Тестовое описание', license: 'MIT' },
      { id: 17, name: 'Репозиторий 5', language: 'Ruby', forks: 10, stars: 10, updatedAt: '2022-05-01', description: 'Тестовое описание', license: 'Apache-2.0' },
      { id: 18, name: 'Репозиторий 6', language: 'Swift', forks: 15, stars: 25, updatedAt: '2022-06-01', description: 'Тестовое описание подлинне', license: 'GPL-3.0' },
      { id: 19, name: 'Репозиторий 1', language: 'JavaScript', forks: 10, stars: 50, updatedAt: '2022-01-01', description: 'Тестовое описание', license: 'MIT' },
      { id: 20, name: 'Репозиторий 2', language: 'Python', forks: 5, stars: 20, updatedAt: '2022-02-01', description: 'Тестовое описание', license: 'Apache-2.0' },
      { id: 21, name: 'Репозиторий 3', language: 'Java', forks: 15, stars: 30, updatedAt: '2022-03-01', description: 'Тестовое описание подлинне', license: 'GPL-3.0' },
      { id: 22, name: 'Репозиторий 4', language: 'C++', forks: 20, stars: 40, updatedAt: '2022-04-01', description: 'Тестовое описание', license: 'MIT' },
      { id: 23, name: 'Репозиторий 5', language: 'Ruby', forks: 10, stars: 10, updatedAt: '2022-05-01', description: 'Тестовое описание', license: 'Apache-2.0' },
      { id: 24, name: 'Репозиторий 6', language: 'Swift', forks: 15, stars: 25, updatedAt: '2022-06-01', description: 'Тестовое описание подлинне', license: 'GPL-3.0' },
    ];
    setSearchResults(results);
  };

  const handleRowClick = (result: SearchResult) => {
    setSelectedResult(result);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setOffset((value - 1) * limit);
  };

  const handleSortChange = (column: string) => {
    const newSort = { ...sort };
    if (newSort.column === column) {
      newSort.order = newSort.order === 'asc' ? 'desc' : 'asc';
    } else {
      newSort.column = column;
      newSort.order = 'asc';
    }
    setSort(newSort);
  };

  const sortedResults = useMemo(() => {
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
          onChange={(e) => setSearchQuery(e.target.value)}
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
              <TableBody>
                {sortedResults.slice(offset, offset + limit).map((result) => (
                  <TableRow key={result.id} onClick={() => handleRowClick(result)}>
                    <TableCell>{result.name}</TableCell>
                    <TableCell>{result.language}</TableCell>
                    <TableCell>{result.forks}</TableCell>
                    <TableCell>{result.stars}</TableCell>
                    <TableCell>{result.updatedAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            count={Math.ceil(searchResults.length / limit)}
            page={offset / limit + 1}
            onChange={handlePageChange}
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
          <p>Язык: {selectedResult.license}</p>
        </Box>
      )}
    </Box>
  );
};

export default SearchBar;