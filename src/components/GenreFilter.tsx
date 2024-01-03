import React from 'react';
import {Button, ScrollView, View} from 'react-native';
import {Genre} from '../data/types';

interface GenreFilterProps {
  genres: Array<Genre>;
  handlePress: (id: number) => void;
}

export const GenreFilter: React.FC<GenreFilterProps> = ({
  genres,
  handlePress,
}) => {
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      {genres.map(genre => (
        <View style={{marginRight: 10}} key={genre.id}>
          <Button
            color={genre.isSelected ? '#F0283C' : '#484848'}
            title={genre.name}
            onPress={() => handlePress(genre.id)}
          />
        </View>
      ))}
    </ScrollView>
  );
};
