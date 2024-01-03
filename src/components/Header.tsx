import React, {PropsWithChildren} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {windowWidth} from '../data/constants';

export const Header: React.FC<PropsWithChildren> = ({children}) => {
  return (
    <View style={styles.container}>
      <Image
        resizeMode="contain"
        style={styles.image}
        source={require('../assets/AppLogo.png')}
      />
      <View style={styles.filterContainer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#242424',
    paddingHorizontal: windowWidth * 0.05,
  },
  image: {
    marginTop: 5,
    marginBottom: 20,
    height: 50,
  },
  filterContainer: {
    marginBottom: 15,
  },
});
