import { React, useState, useEffect } from "react";
import { Text,ScrollView, View, TouchableOpacity, FlatList, Image } from "react-native";
import { Card } from "react-native-elements";
import { useNavigation,useRoute  } from "@react-navigation/native";
import {
  collection,
  query,
  getDocs,
  orderBy,
  startAfter,
  limit,
  where
} from "firebase/firestore";
import { db } from "../config/firebase";

function HomeScreen() {
  
  const route = useRoute();
  const navigation = useNavigation();
  const { categoriaId } = route.params;
  const [produtos, setProdutos] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [produto, setProduto] = useState(null);

  const fetchProdutos = async (afterDoc) => {
    console.log("Buscando produtos...");
    let produtosQuery = query(
      collection(db, "produtos"),
      where("categoria", "==", categoriaId),
      orderBy("nome"),
      limit(30)
    );
    if (afterDoc) {
      produtosQuery = query(
        collection(db, "produtos"),
        where("categoria", "==", categoriaId),
        orderBy("nome"),
        startAfter(afterDoc),
        limit(30)
      );
    }
    const produtosSnapshot = await getDocs(produtosQuery);
    const lastVisible = produtosSnapshot.docs[produtosSnapshot.docs.length - 1];
    if (lastVisible !== undefined) {
      const produtosSalvos = produtosSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProdutos((prevProdutos) => [...prevProdutos, ...produtosSalvos]);
      setProduto((prevProdutos) => [produtosSalvos[0]]);
    }
    setLastDoc(lastVisible);
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const handleLoadMore = () => {
    fetchProdutos(lastDoc);
  };

  return (
    <ScrollView style={{ flex: 1, background: 'black' }}>
      <FlatList
        style={{ marginTop: 10 }}
        data={produtos}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        renderItem={({ item: produto, index }) => (
          <TouchableOpacity
            style={{ width: "45%", height: 200, margin: 5 }} // Ajuste a largura e a margem para acomodar duas colunas
            onPress={() =>
              navigation.navigate("ProdutoScreen", {
                productId: produto.id,
              })
            }
          >
            {produto.fotos && produto.fotos.length > 0 && (
              <View>
                <Image
                  source={{ uri: produto.fotos[0] }}
                  style={{ width: "150px", height: "200px", borderRadius: 10 }}
                />
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
}

export default HomeScreen;
