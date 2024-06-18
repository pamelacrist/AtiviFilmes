import React, { useState, useEffect, useCallback } from "react";
import { Text,ScrollView, View, TouchableOpacity, FlatList, Image } from "react-native";
import { Card } from "react-native-elements";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
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
  const [produtos, setProdutos] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [produto, setProduto] = useState(null);
  const [produtosCategoriaAction, setProdutosCategoriaAction] = useState([]);
  const [produtosCategoriaCrime, setProdutosCategoriaCrime] = useState([]);
  const navigation = useNavigation();
  
  const fetchProdutosPorCategoria = async (categoriaId, afterDoc, setState) => {
    console.log(`Buscando produtos da categoria ${categoriaId}...`);
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
    console.log("Produtos encontrados:", produtosSnapshot.docs);
    const lastVisible = produtosSnapshot.docs[produtosSnapshot.docs.length - 1];
    if (lastVisible !== undefined) {
      const produtosSalvos = produtosSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setState((prevProdutos) => [...prevProdutos, ...produtosSalvos]);
    }
    setLastDoc(lastVisible);
  };
  const fetchProdutos = async (afterDoc) => {
    console.log("Buscando produtos...");
    let produtosQuery = query(
      collection(db, "produtos"),
      orderBy("nome"),
      limit(30)
    );
    if (afterDoc) {
      produtosQuery = query(
        collection(db, "produtos"),
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

  useFocusEffect(
    useCallback(() => {
      setProdutos([]);
      setProdutosCategoriaAction([]);
      setProdutosCategoriaCrime([]);
      fetchProdutos();
      fetchProdutosPorCategoria('Action',null, setProdutosCategoriaAction);
      fetchProdutosPorCategoria('Crime', null, setProdutosCategoriaCrime);
    }, [])
  );
  return (
    <ScrollView style={{ flex: 1, background: 'black' }}>
      <FlatList
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
        style={{ marginTop: 10 }}
        data={produto}
        keyExtractor={(item, index) => index.toString()}
        horizontal={true} // Faz a lista ser horizontal
        pagingEnabled={true} // Habilita a paginação
        renderItem={({ item: _produto, index }) => (
          <TouchableOpacity
            style={{ width: 300, height: 350, margin: 10 }} // Adiciona margem
            onPress={() =>
              navigation.navigate("ProdutoScreen", { productId: _produto.id })
            }
          >
            {_produto.fotos && _produto.fotos.length > 0 && (
              <View>
                <Image
                  source={{ uri: _produto.fotos[0] }}
                  style={{ width: "100%", height: "350px", borderRadius: 10 }}
                />
              </View>
            )}
          </TouchableOpacity>
        )}
      />
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10, marginTop: 10, color:'white' }}>Lançamentos</Text>
      <FlatList
        style={{ marginTop: 10 }}
        data={produtos}
        keyExtractor={(item, index) => index.toString()}
        horizontal={true}
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
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10, marginTop: 10, color:'white' }}>Ação</Text>
      <FlatList
        style={{ marginTop: 10 }}
        data={produtosCategoriaAction}
        keyExtractor={(item, index) => index.toString()}
        horizontal={true}
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
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10, marginTop: 10, color:'white' }}>Crime</Text>
       <FlatList
        style={{ marginTop: 10 }}
        data={produtosCategoriaCrime}
        keyExtractor={(item, index) => index.toString()}
        horizontal={true}
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
