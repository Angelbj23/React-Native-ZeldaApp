import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Text, Image, ScrollView, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import { images } from '../../data/images';
import {NavigationHelpersContext, ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  data: Game[];
}

const Games = () => {
  const [gamesData, setGamesData] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    navigation.navigate('Login');
    console.log('Logout successful');
  };

  useEffect(() => {
    axios
      .get<ApiResponse>('https://zelda.fanapis.com/api/games')
      .then((response) => {
        setGamesData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const handleCardPress = (id: string) => {
    navigation.navigate('SingleGame', { id });
  };

  const filteredGames = gamesData.filter((game) =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContentContainer}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Games by name"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      {filteredGames.map((game) => {
        const image = images.find((img) => img.id === game.id)?.url;
        return (
          <TouchableOpacity
            key={game.id}
            style={styles.cardContainer}
            onPress={() => handleCardPress(game.id)}
          >
            <Text style={styles.title}>{game.name}</Text>
            {image && <Image source={{ uri: image }} style={styles.image} />}
            <Text style={styles.developer}>Developer: {game.developer}</Text>
            <Text style={styles.publisher}>Publisher: {game.publisher}</Text>
            <Text style={styles.releaseDate}>Release Date: {game.released_date}</Text>
          </TouchableOpacity>
        );
      })}
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
  searchInput: {
    width: '80%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor:'white'
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
  logoutButton: {
    alignSelf:'flex-end',
    marginTop:10,
    marginRight:5,
    backgroundColor: 'black',
    borderRadius: 5,
    padding: 10,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
  }
});

export default Games;
