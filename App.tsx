/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the Redux TypeScript template
 * https://github.com/rahsheen/react-native-template-redux-typescript
 *
 * @format
 */

import React, {memo, useEffect, useMemo, useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import {Header} from './src/components/Header';
import MovieList from './src/components/MovieList';
import {Genre, MovieState} from './src/data/types';
import {fetchGenres, fetchSearchMovies} from './src/services/api';
import {GenreFilter} from './src/components/GenreFilter';
import {SearchInput} from './src/components/SearchInput';
import {SearchList} from './src/components/SearchList';
import {windowWidth} from './src/data/constants';

const App = () => {
  const [genres, setGenres] = useState<Array<Genre>>([
    {
      id: 0,
      name: 'ALL',
      isSelected: true,
    },
  ]);
  const [query, setQuery] = useState<string>('');
  const [showSearchList, setShowSearchList] = useState(false);
  const [initialSearchMovies, setInitialSearchMovies] = useState<
    Array<MovieState>
  >([]);

  useEffect(() => {
    fetchGenres()
      .then(resp => {
        setGenres([...genres, ...resp]);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const handleGenrePress = (genreId: number) => {
    setQuery('');
    if (genreId === 0) {
      const updatedGenres = genres.map((genre: Genre) => {
        if (genre.id === 0) {
          return {
            ...genre,
            isSelected: true,
          };
        }
        return {...genre, isSelected: false};
      });
      setGenres(updatedGenres);
      setShowSearchList(false);
    } else {
      const updatedGenres = genres.map((genre: Genre) => {
        if (genre.id === genreId) {
          return {...genre, isSelected: !genre.isSelected};
        } else if (genre.id === 0) {
          return {...genre, isSelected: false};
        }
        return genre;
      });
      setGenres(updatedGenres);
    }
  };

  const handleChange = (text: string) => {
    setQuery(text);
  };

  const handeleSearch = () => {
    if (query) {
      console.log(query);
      fetchSearchMovies(query, 1)
        .then(resp => {
          setInitialSearchMovies(resp);
          setShowSearchList(true);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  const selectedGenreIds = useMemo(() => {
    return genres
      .filter(genre => genre.isSelected)
      .map(genre => genre.id.toString());
  }, [genres]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: 'black',
        flex: 1,
      }}>
      <Header>
        <GenreFilter genres={genres} handlePress={handleGenrePress} />
        <SearchInput
          query={query}
          handleChange={handleChange}
          handleSearch={handeleSearch}
        />
      </Header>
      <View
        style={{
          paddingHorizontal: windowWidth * 0.05,
          paddingVertical: 10,
          flex: 1,
        }}>
        {showSearchList ? (
          <SearchList query={query} initialSearchMovies={initialSearchMovies} />
        ) : (
          <MovieList genreIds={selectedGenreIds} />
        )}
      </View>
    </SafeAreaView>
  );
};

export default App;
