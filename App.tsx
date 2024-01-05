/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the Redux TypeScript template
 * https://github.com/rahsheen/react-native-template-redux-typescript
 *
 * @format
 */

import React, {useEffect, useMemo, useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import {Header} from './src/components/Header';
import MovieList from './src/components/MovieList';
import {Genre} from './src/data/types';
import {fetchGenres} from './src/services/api';
import {GenreFilter} from './src/components/GenreFilter';
import {SearchInput} from './src/components/SearchInput';
import SearchList from './src/components/SearchList';
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
  const [triggerSearch, setTriggerSearch] = useState(true);
  const [showSearchList, setShowSearchList] = useState(false);

  useEffect(() => {
    fetchGenres()
      .then(resp => {
        setGenres(prevGenres => [...prevGenres, ...resp]);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const handleGenrePress = (genreId: number) => {
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
    setQuery('');
    setShowSearchList(false);
  };

  const handleChange = (text: string) => {
    setQuery(text);
  };

  const handeleSearch = () => {
    if (query) {
      setTriggerSearch(prev => !prev);
      setShowSearchList(true);
    } else {
      setShowSearchList(false);
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
          <SearchList triggerSearch={triggerSearch} query={query} />
        ) : (
          <MovieList genreIds={selectedGenreIds} />
        )}
      </View>
    </SafeAreaView>
  );
};

export default App;
