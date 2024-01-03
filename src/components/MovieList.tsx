import React, {useEffect, useState, memo} from 'react';
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);

  useEffect(() => {
    if (prevYear !== 2012) {
      setIsRefreshing(true);
      fetchMovies(prevYear.toString(), genreIds)
        .then(resp => {
          if (resp.length !== 0) {
            setMovies([
              {sectionTitle: prevYear.toString(), data: resp},
              ...movies,
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
            setMovies([
              ...movies,
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
    setScreenLoading(true);
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
        setScreenLoading(false);
      });
  }, [genreIds]);

  const handleEndReached = () => {
    if (nextYear < 2024 && !screenLoading && !loading) {
      setNextYear(prev => prev + 1);
    }
  };

  const handleRefresh = () => {
    if (prevYear > 2000) {
      setPrevYear(prev => prev - 1);
    }
  };

  const renderItemRow = ({
    section,
    index,
  }: {
    section: MovieSection;
    index: number;
  }) => {
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
  };

  return (
    <SectionList
      sections={movies}
      keyExtractor={item =>
        item.id.toString() + (Math.random() * 100).toString()
      }
      renderItem={renderItemRow}
      renderSectionHeader={({section: {sectionTitle}}) => (
        <View style={{marginTop: 15}}>
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
          {screenLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            movies.length === 0 && (
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
    />
  );
};

export default memo(MovieList);
