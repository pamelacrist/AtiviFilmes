import React, { useState, useEffect } from 'react';
import { Text, ScrollView, View, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

function CategoryScreen() {
  const [categorias, setCategorias] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCategorias = async () => {
      const response = await axios.get('https://raw.githubusercontent.com/prust/wikipedia-movie-data/master/genres.json');
      setCategorias(response.data);
    };

    fetchCategorias();
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'black' }}>
      <FlatList
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
        style={{ marginTop: 10 }}
        data={categorias}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item: categoria, index }) => (
          <TouchableOpacity
            style={{ width: '100%', height: 50, margin: 5 }}
            onPress={() =>
              navigation.navigate('CategoriaItemScreen', {
                categoriaId: categoria,
              })
            }
          >
            <View>
              <Text style={{ fontSize: 18, color: '#fff' }}>{categoria}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
}

export default CategoryScreen;