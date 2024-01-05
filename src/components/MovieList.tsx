import React, {useEffect, useState, memo, useCallback} from 'react';
import {ActivityIndicator, SectionList, Text, View} from 'react-native';
import {fetchMovies} from '../services/api';
import {Card} from './Card';
import {MovieState} from '../data/types';

export type MovieSection = {
  sectionTitle: string;
  data: Array<MovieState>;
};
const MovieList = ({genreIds}: {genreIds: Array<string>}) => {
  const [movies, setMovies] = useState<Array<MovieSection>>([]);
  const [prevYear, setPrevYear] = useState<number>(2012);
  const [nextYear, setNextYear] = useState<number>(2012);
  const [loading, setLoading] = useState<boolean>(false);
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (prevYear !== 2012) {
      setIsRefreshing(true);
      fetchMovies(prevYear.toString(), genreIds)
        .then(resp => {
          if (resp.length !== 0) {
            setMovies(prevMovies => [
              {sectionTitle: prevYear.toString(), data: resp},
              ...prevMovies,
            ]);
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          setIsRefreshing(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevYear]);

  useEffect(() => {
    if (nextYear !== 2012) {
      setLoading(true);
      fetchMovies(nextYear.toString(), genreIds)
        .then(resp => {
          if (resp.length !== 0) {
            setMovies(prevMovies => [
              ...prevMovies,
              {sectionTitle: nextYear.toString(), data: resp},
            ]);
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextYear]);

  useEffect(() => {
    // console.log('here')
    setMovies([]);
    setNextYear(2012);
    setPrevYear(2012);
    setListLoading(true);
    fetchMovies('2012', genreIds)
      .then(resp => {
        if (resp.length !== 0) {
          setMovies([{sectionTitle: '2012', data: resp}]);
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setListLoading(false);
      });
  }, [genreIds]);

  const handleEndReached = () => {
    if (nextYear < 2024 && !loading && !listLoading) {
      setNextYear(prev => prev + 1);
    }
  };

  const handleRefresh = () => {
    if (prevYear > 2000) {
      setPrevYear(prev => prev - 1);
    }
  };

  const renderItemRow = useCallback(
    ({section, index}: {section: MovieSection; index: number}) => {
      if (index % 2 !== 0) {
        return null;
      }

      const item = section.data[index];
      const nextItem = section.data[index + 1];
      return (
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Card {...item} />
          {nextItem ? <Card {...nextItem}></Card> : <View style={{flex: 1}} />}
        </View>
      );
    },
    [],
  );

  //To reduce performance cost, calculate item sizes
  // const getItemLayout = sectionListGetItemLayout({
  //   getItemHeight: () => (350 + 0.04 * windowWidth) / 2,
  //   getSectionHeaderHeight: () => 45,
  // });

  return (
    <SectionList
      sections={movies}
      keyExtractor={(item, index) =>
        item.id.toString() + (Math.random() * 100).toString() + index.toString()
      }
      renderItem={renderItemRow}
      renderSectionHeader={({section: {sectionTitle}}) => (
        <View style={{marginTop: 15, height: 45}}>
          <Text style={{color: 'white', fontSize: 30}}>{sectionTitle}</Text>
        </View>
      )}
      onRefresh={handleRefresh}
      refreshing={isRefreshing}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.1}
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
            movies.length === 0 &&
            nextYear >= 2024 && (
              <Text style={{color: 'white', fontSize: 50}}>
                No Results Found
              </Text>
            )
          )}
        </View>
      }
      ListFooterComponent={
        loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
      }
      removeClippedSubviews={true}
      initialNumToRender={6}
      maxToRenderPerBatch={6}
      // getItemLayout={getItemLayout}
    />
  );
};

export default memo(MovieList);
