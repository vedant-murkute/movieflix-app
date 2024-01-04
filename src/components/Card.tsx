import React from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import {IMAGE_BASE_URL, windowWidth} from '../data/constants';

export type CardProps = {
  posterPath?: string;
  title?: string;
  ratings?: number;
};

export const Card: React.FC<CardProps> = ({posterPath, title, ratings}) => {
  const image = {uri: IMAGE_BASE_URL + 'w500/' + posterPath};

  return (
    <View style={styles.imageContainer}>
      <ImageBackground style={styles.image} source={image} resizeMode="cover">
        <View style={styles.captionContainer}>
          <Text style={styles.caption}>{title}</Text>
          <Text style={styles.caption}>{`${ratings} ⭐`}</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    height: 350,
    width: windowWidth * 0.43,
    marginVertical: 0.02 * windowWidth,
  },
  image: {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
  },
  captionContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 3,
  },
  caption: {
    color: 'white',
    fontSize: 18,
  },
});
