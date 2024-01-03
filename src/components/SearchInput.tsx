import React from 'react';
import {Button, StyleSheet, TextInput, View} from 'react-native';

export const SearchInput = ({query, handleChange, handleSearch}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={query}
        onChangeText={handleChange}
      />
      <Button onPress={handleSearch} color={'#484848'} title="Search" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    flexDirection: 'row',
    columnGap: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInput: {
    color: 'white',
    flex: 1,
    borderColor: '#484848',
    borderWidth: 1,
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
