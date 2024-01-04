import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  SectionList,
  Text,
  View,
} from 'react-native';
import {MovieState} from '../data/types';
import {Card} from './Card';
import {fetchSearchMovies} from '../services/api';

type SearchListProps = {
  initialSearchMovies: Array<MovieState>;
  query: string;
};

export const SearchList: React.FC<SearchListProps> = ({
  initialSearchMovies,
  query,
}) => {
  const [searchMovies, setSearchMovies] =
    useState<Array<MovieState>>(initialSearchMovies);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchSearchMovies(query, page)
      .then(resp => {
        setSearchMovies([...searchMovies, ...resp]);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page]);

  const handleEndReached = () => {
    if (!loading) {
      setPage(prev => prev + 1);
    }
  };

  const renderItemCallback = useCallback(
    ({item}: {item: MovieState}) => <Card {...item} />,
    [],
  );

  return (
    <>
      <View style={{marginVertical: 10}}>
        <Text
          style={{
            color: 'white',
            fontSize: 30,
          }}>{`Search Results: `}</Text>
      </View>
      <FlatList
        numColumns={2}
        horizontal={false}
        data={searchMovies}
        renderItem={renderItemCallback}
        keyExtractor={item =>
          item.id.toString() + (Math.random() * 100).toString()
        }
        onEndReached={handleEndReached}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
        }
        columnWrapperStyle={{justifyContent: 'space-between'}}
        removeClippedSubviews={true}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
      />
    </>
  );
};
