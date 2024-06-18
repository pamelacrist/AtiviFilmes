import { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { View, Text, Image, Button, TouchableOpacity } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import ParallaxHeader from "react-native-parallax-header";
const ProdutoScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { productId } = route.params;
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };
  const [produto, setProduto] = useState(null);
  const [quantidade, setQuantidade] = useState(1); // Mova esta linha para aqui

  useEffect(() => {
    const fetchProduto = async () => {
      const produtoDocument = await getDoc(doc(db, "produtos", productId));
      const produto = produtoDocument.data();
      setProduto(produto);
    };

    fetchProduto();
  }, [productId]);

  if (!produto) {
    return <Text>Carregando...</Text>;
  }

  const content = (
    <View style={{ height: 250, background: 'black'  }}>
      <Text style={{ color: "white" , fontWeight: "bold" }}>{produto.nome}</Text>
      <Text  style={{ color: "white"}}>{produto.descricao}</Text>
    </View>
  );

    return (
    <View style={{ flex: 1, backgroundColor: 'black'}}>
      <View>
        <video height="280" controls onLoadedData={handleVideoLoad}>
          <source src={produto.valor} type="video/mp4"/>
        </video>
        {content}
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
          backgroundColor: "#333",
          borderTopWidth: 1, // Adiciona a linha horizontal
          borderTopColor: "#000", // Define a cor da linha
        }}
      >
        <View>
          <Button
            title={`Assistir`}
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
    </View>
  );
};

export default ProdutoScreen;
