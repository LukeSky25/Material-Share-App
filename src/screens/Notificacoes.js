import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import mensagemService from "../services/MensagemService";
import dayjs from "dayjs";

// --- Constantes de Estilo ---
const PRIMARY_BLUE = "#007BFF";
const ACCENT_TEXT = "#333333";
const LIGHT_BG = "#F0F5F9";
const CARD_BG = "#FFFFFF";
const SHADOW_COLOR = "rgba(0, 0, 0, 0.1)";

// --- Componentes ---
const AppHeader = () => (
  <View style={styles.header}>
    <MaterialCommunityIcons
      name="bell-ring-outline"
      size={26}
      color={PRIMARY_BLUE}
    />
    <Text style={styles.headerTitle}>Minhas Notificações</Text>
  </View>
);

const MessageCard = ({ mensagem, onOpenWhatsApp }) => {
  const dataFormatada = dayjs(mensagem.dataMensagem).format(
    "DD [de] MMMM [de] YYYY"
  );

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          Interesse em: {mensagem.doacao.nome}
        </Text>
        <Text style={styles.cardDate}>{dataFormatada}</Text>
      </View>
      <Text style={styles.cardBody}>
        O usuário{" "}
        <Text style={{ fontWeight: "bold" }}>{mensagem.pessoa.nome}</Text>{" "}
        demonstrou interesse na sua doação.
      </Text>
      <TouchableOpacity style={styles.whatsappButton} onPress={onOpenWhatsApp}>
        <MaterialCommunityIcons name="whatsapp" size={20} color="#fff" />
        <Text style={styles.whatsappButtonText}>INICIAR CONVERSA</Text>
      </TouchableOpacity>
    </View>
  );
};

// --- Tela Principal ---
export default function Notificacoes({ navigation }) {
  const [mensagens, setMensagens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarMensagens = async () => {
      setIsLoading(true);
      try {
        const userString = await AsyncStorage.getItem("user");
        if (!userString) throw new Error("Usuário não encontrado");

        const userData = JSON.parse(userString);
        const response = await mensagemService.findByDoadorId(userData.id);
        setMensagens(response.data);
      } catch (error) {
        console.error("Erro ao buscar mensagens:", error);
        Alert.alert("Erro", "Não foi possível carregar sua caixa de entrada.");
      } finally {
        setIsLoading(false);
      }
    };

    carregarMensagens();
  }, []);

  const gerarLinkWhatsApp = (celular, nomeDoacao) => {
    if (!celular) {
      Alert.alert(
        "Contato Indisponível",
        "O beneficiário não forneceu um número de contato."
      );
      return;
    }
    const numeroLimpo = celular.replace(/\D/g, "");
    const numeroWhatsapp = `${
      numeroLimpo.length <= 11 ? "55" : ""
    }${numeroLimpo}`;
    const mensagem = `Olá! Vi seu anúncio da doação do item "${nomeDoacao}" no Material Share e tenho interesse.`;
    const mensagemCodificada = encodeURIComponent(mensagem);
    const url = `https://wa.me/${numeroWhatsapp}?text=${mensagemCodificada}`;

    Linking.openURL(url).catch(() => {
      Alert.alert(
        "Erro",
        "Não foi possível abrir o WhatsApp. Verifique se o aplicativo está instalado."
      );
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={PRIMARY_BLUE} />
        <Text style={styles.loadingText}>Carregando notificações...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader />
      {mensagens.length > 0 ? (
        <FlatList
          data={mensagens}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MessageCard
              mensagem={item}
              onOpenWhatsApp={() =>
                gerarLinkWhatsApp(item.pessoa.celular, item.doacao.nome)
              }
            />
          )}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.centerContainer}>
          <Feather name="inbox" size={60} color="#bdc3c7" />
          <Text style={styles.emptyText}>
            Você não tem nenhuma nova notificação.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: LIGHT_BG },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  listContainer: { padding: 20 },
  loadingText: { marginTop: 10, fontSize: 16, color: ACCENT_TEXT },
  emptyText: {
    marginTop: 20,
    fontSize: 18,
    color: "#7f8c8d",
    textAlign: "center",
  },
  header: {
    width: "100%",
    backgroundColor: CARD_BG,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: ACCENT_TEXT,
    letterSpacing: 0.5,
    marginLeft: 8,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: PRIMARY_BLUE,
    flex: 1,
    marginRight: 10,
  },
  cardDate: {
    fontSize: 12,
    color: "#777",
  },
  cardBody: {
    fontSize: 15,
    lineHeight: 22,
    color: ACCENT_TEXT,
    marginBottom: 15,
  },
  whatsappButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#25D366",
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
  },
  whatsappButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 10,
    letterSpacing: 0.5,
  },
});
