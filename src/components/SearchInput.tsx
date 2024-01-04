import React, {useState} from 'react';
import {Button, StyleSheet, TextInput, View} from 'react-native';

export const SearchInput = ({query, handleChange, handleSearch}) => {
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = isFocused ? 'white' : '#484848';

  return (
    <View style={styles.container}>
      <TextInput
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        placeholder="Enter movie title"
        placeholderTextColor={'rgba(255,255,255,0.5)'}
        style={{...styles.textInput, borderColor: borderColor}}
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
    borderWidth: 1,
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
