import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
  Dimensions,
  Button,
} from "react-native";
import { Card } from "react-native-elements";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  collection,
  query,
  getDocs,
  orderBy,
  startAfter,
  limit,
} from "firebase/firestore";
import { db } from "../config/firebase";

const FilmesScreen = () => {
  const [filmes, setFilmes] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const navigation = useNavigation();
  const windowWidth = Dimensions.get("window").width;
  const fetchFilmes = async (afterDoc) => {
    console.log("Buscando filmes...");
    let filmesQuery = query(
      collection(db, "produtos"),
      orderBy("nome"),
      limit(30)
    );
    if (afterDoc) {
      filmesQuery = query(
        collection(db, "produtos"),
        orderBy("nome"),
        startAfter(afterDoc),
        limit(30)
      );
    }
    const filmesSnapshot = await getDocs(filmesQuery);
    const lastVisible = filmesSnapshot.docs[filmesSnapshot.docs.length - 1];
    if (lastVisible !== undefined) {
      const filmesSalvos = filmesSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log("Filmes encontrados:", filmesSalvos);
      console.log("Last visible:", lastVisible);
      setFilmes((prevFilmes) => [...prevFilmes, ...filmesSalvos]);
    }
    setLastDoc(lastVisible);
  };
  useFocusEffect(
    useCallback(() => {
      setFilmes([]);
      setLastDoc(null);
      fetchFilmes();
    }, [])
  );

  const handleLoadMore = () => {
    fetchFilmes(lastDoc);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <FlatList
        style={{ marginTop: 10 }}
        data={filmes}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2} // Adicione esta linha
        renderItem={({ item: filme, index }) => (
          <TouchableOpacity
            style={{ width: "45%", height: 200, margin: 5 }} // Ajuste a largura e a margem para acomodar duas colunas
            onPress={() =>
              navigation.navigate("CadastroItemScreen", {
                productId: filme.id,
              })
            }
          >
            {filme.fotos && filme.fotos.length > 0 && (
              <View>
                <Image
                  source={{ uri: filme.fotos[0] }}
                  style={{ width: "100%", height: "300%", borderRadius: 10 }}
                />
                <View
                  style={{
                    width: "100%",
                    padding: 10,
                  }}
                >
                  <Text style={{ fontWeight: "bold", color:'white' }}>
                    {" "}
                    {filme.nome} 
                  </Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={{
          position: "absolute", // Posiciona o botão absolutamente
          bottom: 20, // 20 pixels do fundo da tela
          right: 20, // 20 pixels da direita da tela
          backgroundColor: "green", // Fundo verde
          padding: 10, // Espaçamento interno de 10 pixels
          borderRadius: 5, // Bordas arredondadas
        }}
        onPress={() => navigation.navigate("CadastroItemScreen")}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Adicionar Filme
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FilmesScreen;
