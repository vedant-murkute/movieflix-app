import React, {memo, useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import {MovieState} from '../data/types';
import {Card} from './Card';
import {fetchSearchMovies} from '../services/api';

type SearchListProps = {
  query: string;
  triggerSearch: boolean;
};

const SearchList: React.FC<SearchListProps> = ({query, triggerSearch}) => {
  const [searchMovies, setSearchMovies] = useState<Array<MovieState>>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [listLoading, setListLoading] = useState<boolean>(false);

  useEffect(() => {
    if (query !== '' && page !== 1) {
      setLoading(true);
      fetchSearchMovies(query, page)
        .then(resp => {
          setSearchMovies(prevSearchMovies => [
            ...prevSearchMovies,
            ...resp.movies,
          ]);
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (query) {
      setPage(1);
      setListLoading(true);
      fetchSearchMovies(query, page)
        .then(resp => {
          setTotalResults(resp.totalResults);
          setSearchMovies([...resp.movies]);
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          setListLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerSearch]);

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
        keyExtractor={(item, index) =>
          item.id.toString() +
          (Math.random() * 100).toString() +
          index.toString()
        }
        columnWrapperStyle={{justifyContent: 'space-between'}}
        onEndReached={handleEndReached}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
        }
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              backgroundColor: 'black',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {listLoading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              totalResults === 0 && (
                <Text style={{color: 'white', fontSize: 50}}>
                  No Results Found
                </Text>
              )
            )}
          </View>
        }
        removeClippedSubviews={true}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
      />
    </>
  );
};

export default memo(SearchList);
