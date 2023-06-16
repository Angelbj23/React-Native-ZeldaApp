import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { images } from '../../data/images';

interface Game {
  name: string;
  description: string;
  developer: string;
  publisher: string;
  released_date: string;
  id: string;
  image: string;
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<Game[]>([]);

  const getFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        const parsedFavorites: Game[] = JSON.parse(storedFavorites);
        setFavorites(parsedFavorites);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
   (async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          const parsedFavorites: Game[] = JSON.parse(storedFavorites);
          setFavorites(parsedFavorites);
        }
      } catch (error) {
        console.log(error);
      }
    })()
  }, []);

  const getGameImage = (id: string) => {
    const image = images.find((img) => img.id === id)?.url;
    return image ?? '';
  };

  const removeFromFavorites = async (gameId: string) => {
    try {
      const updatedFavorites = favorites.filter((game) => game.id !== gameId);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    } catch (error) {
      console.log(error);
    }
  };

  const removeAllFavorites = async () => {
    try {
      await AsyncStorage.removeItem('favorites');
      setFavorites([]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContentContainer}>
      {favorites.length > 0 ? (
        favorites.map((game) => (
          <View key={game.id} style={styles.cardContainer}>
            <Text style={styles.title}>{game.name}</Text>
            <Image source={{ uri: getGameImage(game.id) }} style={styles.image} />
            <Text style={styles.developer}>Developer: {game.developer}</Text>
            <Text style={styles.publisher}>Publisher: {game.publisher}</Text>
            <Text style={styles.releaseDate}>Release Date: {game.released_date}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => removeFromFavorites(game.id)}
            >
              <Text style={styles.buttonText}>Remove from Favorites</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noFavoritesText}>No items added to favorites yet.</Text>
      )}
      {favorites.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={removeAllFavorites}>
          <Text style={styles.clearButtonText}>Clear All Favorites</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContentContainer: {
    backgroundColor: '#008f39',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    width: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 5,
    marginBottom: 10,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 10,
    borderRadius: 5,
  },
  developer: {
    fontSize: 16,
    color: 'black',
    marginBottom: 5,
  },
  publisher: {
    fontSize: 16,
    color: 'black',
    marginBottom: 5,
  },
  releaseDate: {
    fontSize: 16,
    color: 'black',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#ff4c4c',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noFavoritesText: {
    fontSize: 18,
    color: 'white',
    marginTop: 20,
  },
  clearButton: {
    backgroundColor: '#ff4c4c',
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Favorites;
