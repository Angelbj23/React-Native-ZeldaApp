import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { images } from '../../data/images';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';


interface Game {
  name: string;
  description: string;
  developer: string;
  publisher: string;
  released_date: string;
  id: string;
  image: string;
}

interface ApiResponse {
  success: boolean;
  count: number;
  data: Game;
}

interface SingleGameProps {
  route: {
    params: {
      id: string;
    };
  };
}

const SingleGame: React.FC<SingleGameProps> = ({ route }) => {  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { id } = route.params;
  const [gameData, setGameData] = useState<Game | null>(null);
  const [isInFavorites, setIsInFavorites] = useState<boolean>(false);
  const [addMessage, setAddMessage] = useState<string>('');
  const [removeMessage, setRemoveMessage] = useState<string>('');
  

  const handleGoToFavorites = () => {
    navigation.navigate('Favorites');
  };

  useEffect(() => {
    axios
      .get<ApiResponse>(`https://zelda.fanapis.com/api/games/${id}`)
      .then((response) => {
        const game = response.data.data;
        setGameData(game);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  useEffect(() => {
    const checkIfGameIsInFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
        const isInFavorites = favorites.some((game: Game) => game.id === id);
        setIsInFavorites(isInFavorites);
      } catch (error) {
        console.log(error);
      }
    };

    checkIfGameIsInFavorites();
  }, [id]);

  const handleAddToFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

      if (isInFavorites) {
        setAddMessage('Already There!');
        setRemoveMessage('');
      } else {
        const gameToAdd = gameData;
        if (gameToAdd) {
          const updatedFavorites = [...favorites, gameToAdd];
          await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
          setIsInFavorites(true);
          setAddMessage('Added Successfully');
          setRemoveMessage('');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveFromFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

      if (isInFavorites) {
        const updatedFavorites = favorites.filter((game: Game) => game.id !== id);
        await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setIsInFavorites(false);
        setAddMessage('');
        setRemoveMessage('Removed Successfully');
      } else {
        setAddMessage('');
        setRemoveMessage('Not there yet!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getGameImage = (id: string) => {
    const image = images.find((img) => img.id === id);
    return image ? image.url : '';
  };

  return (
    <View style={styles.container}>
      {gameData ? (
        <>
          <View style={styles.cardContainer}>
            <Text style={styles.title}>{gameData.name}</Text>
            <Image source={{ uri: getGameImage(gameData.id) }} style={styles.image} />
            <Text style={styles.developer}>Developer: {gameData.developer}</Text>
            <Text style={styles.publisher}>Publisher: {gameData.publisher}</Text>
            <Text style={styles.releaseDate}>Release Date: {gameData.released_date}</Text>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={ [styles.button, styles.addButton]}
                onPress={handleAddToFavorites}
              >
                <Text style={styles.buttonText}>Add to favorites</Text>
              </TouchableOpacity>
              {addMessage !== '' && (
                <Text style={styles.successMessage}>{addMessage}</Text>
              )}

              <TouchableOpacity
                style={ [styles.button, styles.removeButton]}
                onPress={handleRemoveFromFavorites}
              >
                <Text style={styles.buttonText}>Remove from Favorites</Text>
              </TouchableOpacity>
              {removeMessage !== '' && (
                <Text style={styles.errorMessage}>{removeMessage}</Text>
              )}
            </View>

            <TouchableOpacity style={ [styles.button, styles.addButton ]} onPress={handleGoToFavorites}>
              <Text style={styles.buttonText}>Favorites</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style = { styles.loading }>Please Wait... Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#008f39',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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
  buttonsContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  button: {
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    minWidth: '60%',
  },
  addButton: {
    backgroundColor: '#008f39'
  },
  removeButton: {
    backgroundColor: 'red'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loading: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 22
  },
  successMessage: {
    color: 'green',
    marginTop: 5,
    textAlign: 'center',
  },
  errorMessage: {
    color: 'red',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default SingleGame;