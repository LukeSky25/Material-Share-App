import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Linking,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import doacaoService from "../services/DoacaoService";

const { width } = Dimensions.get("window");
const PRIMARY_BLUE = "#007BFF";
const ACCENT_TEXT = "#333333";
const LIGHT_BG = "#F0F5F9";
const CARD_BG = "#FFFFFF";
const SHADOW_COLOR = "rgba(0, 0, 0, 0.1)";
const ACCENT_RED = "#DC3545";
const ACCENT_GREEN = "#28A745";
const ACCENT_YELLOW = "#FFC107";

const AppHeader = () => (
  <View style={styles.header}>
    <MaterialCommunityIcons name="hand-heart" size={26} color={PRIMARY_BLUE} />
    <Text style={styles.headerTitle}>Minha Área de Doações</Text>
  </View>
);

const DonationCard = ({ doacao, onPress, isDoadorTab, onEdit, onDelete }) => {
  const statusMap = {
    ATIVO: { text: "Disponível", color: ACCENT_GREEN },
    SOLICITADO: { text: "Solicitado", color: ACCENT_YELLOW },
    DOADO: { text: "Doado", color: "#777" },
    INATIVO: { text: "Inativo", color: ACCENT_RED },
  };
  const statusInfo = statusMap[doacao.statusDoacao] || {
    text: doacao.statusDoacao,
    color: "#777",
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{doacao.nome}</Text>
        <Text style={styles.cardStatus}>
          Status:{" "}
          <Text style={{ color: statusInfo.color, fontWeight: "bold" }}>
            {statusInfo.text}
          </Text>
        </Text>
      </View>
      {isDoadorTab && doacao.statusDoacao !== "DOADO" && (
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity onPress={onEdit} style={styles.iconButton}>
            <Feather name="edit-3" size={20} color={PRIMARY_BLUE} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDelete}
            style={[styles.iconButton, { marginLeft: 15 }]}
          >
            <Feather name="trash-2" size={20} color={ACCENT_RED} />
          </TouchableOpacity>
        </View>
      )}
      {!isDoadorTab && (
        <Feather name="chevron-right" size={24} color={PRIMARY_BLUE} />
      )}
    </TouchableOpacity>
  );
};

const DonationDetailModal = ({
  donation,
  onClose,
  onConfirmRetirada,
  onOpenWhatsApp,
}) => {
  const isRetirado = donation.statusDoacao === "DOADO";

  const addressParts = [
    donation.logradouro,
    donation.numeroResidencia ? `Nº ${donation.numeroResidencia}` : null,
    donation.bairro,
    donation.complemento,
  ].filter(Boolean);

  const fullAddress = addressParts.join(", ");
  const cityState = donation.localidade
    ? `${donation.localidade} - ${donation.uf}`
    : "Localidade não informada";

  const statusMap = {
    SOLICITADO: { text: "PENDENTE", color: ACCENT_YELLOW, icon: "clock" },
    DOADO: { text: "CONFIRMADO", color: ACCENT_GREEN, icon: "check-circle" },
  };
  const statusInfo = statusMap[donation.statusDoacao] || {
    text: donation.statusDoacao,
    color: "#777",
    icon: "help-circle",
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{donation.nome}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={24} color={ACCENT_TEXT} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <Text style={styles.detailLabel}>Doador:</Text>
          <Text style={styles.detailValue}>{donation.pessoa.nome}</Text>

          <Text style={styles.detailLabel}>Endereço para Retirada:</Text>
          <Text style={styles.detailValue}>{fullAddress}</Text>
          <Text style={styles.detailValueCity}>{cityState}</Text>

          <Text style={styles.detailLabel}>Descrição:</Text>
          <Text style={styles.detailValue}>{donation.descricao}</Text>

          <Text style={styles.detailLabel}>Contato do Doador:</Text>
          <TouchableOpacity
            style={styles.whatsappButton}
            onPress={onOpenWhatsApp}
          >
            <MaterialCommunityIcons name="whatsapp" size={20} color="#fff" />
            <Text style={styles.whatsappButtonText}>Entrar em contato</Text>
          </TouchableOpacity>

          <View style={styles.statusBox}>
            <Text style={styles.detailLabel}>Status da Retirada:</Text>
            <View
              style={[
                styles.statusTag,
                { backgroundColor: statusInfo.color + "20" },
              ]}
            >
              <Feather
                name={statusInfo.icon}
                size={14}
                color={statusInfo.color}
                style={{ marginRight: 5 }}
              />
              <Text style={{ ...styles.statusText, color: statusInfo.color }}>
                {statusInfo.text}
              </Text>
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity
          style={[
            styles.actionButton,
            isRetirado ? styles.buttonDisabled : styles.buttonPrimary,
          ]}
          onPress={onConfirmRetirada}
          disabled={isRetirado}
        >
          <Text style={styles.actionButtonText}>
            {isRetirado ? "✅ RETIRADA CONFIRMADA" : "CONFIRMAR RETIRADA"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function MinhasDoacoesScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("feitas");
  const [doacoesFeitas, setDoacoesFeitas] = useState([]);
  const [doacoesSolicitadas, setDoacoesSolicitadas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState(null);

  const enrichDonationsWithAddress = async (donations) => {
    return Promise.all(
      donations.map(async (doacao) => {
        if (doacao.cep) {
          const cepLimpo = doacao.cep.replace(/\D/g, "");
          if (cepLimpo.length === 8) {
            try {
              const response = await fetch(
                `https://viacep.com.br/ws/${cepLimpo}/json/`
              );
              const endereco = await response.json();
              if (!endereco.erro) {
                return { ...doacao, ...endereco };
              }
            } catch (error) {
              console.warn(`Falha ao buscar CEP ${cepLimpo}:`, error);
              return doacao;
            }
          }
        }
        return doacao;
      })
    );
  };

  const carregarDoacoes = async () => {
    setIsLoading(true);
    try {
      const userString = await AsyncStorage.getItem("user");
      if (!userString) throw new Error("Usuário não encontrado");
      const userData = JSON.parse(userString);

      const [feitasRes, solicitadasRes] = await Promise.all([
        doacaoService.findByDoador(userData.id),
        doacaoService.findSolicitadasByBeneficiario(userData.id),
      ]);

      const doacoesFeitasComEndereco = await enrichDonationsWithAddress(
        feitasRes.data
      );
      const doacoesSolicitadasComEndereco = await enrichDonationsWithAddress(
        solicitadasRes.data
      );

      setDoacoesFeitas(doacoesFeitasComEndereco);
      setDoacoesSolicitadas(doacoesSolicitadasComEndereco);
    } catch (error) {
      console.error("Erro ao carregar doações:", error);
      Alert.alert("Erro", "Não foi possível carregar suas doações.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      carregarDoacoes();
    });
    return unsubscribe;
  }, [navigation]);

  const handleEdit = (doacaoId) => {
    navigation.navigate("FormularioDoacao", { id: doacaoId });
  };

  const handleDelete = (doacao) => {
    Alert.alert(
      "Apagar Doação",
      `Tem certeza que deseja apagar a doação "${doacao.nome}"? Ela será marcada como inativa.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: async () => {
            try {
              await doacaoService.inativar(doacao.id, "INATIVO");
              setDoacoesFeitas((prev) =>
                prev.filter((d) => d.id !== doacao.id)
              );
              Alert.alert("Sucesso", "Doação apagada com sucesso!");
            } catch (error) {
              Alert.alert("Erro", "Não foi possível apagar a doação.");
            }
          },
        },
      ]
    );
  };

  const handleConfirmRetirada = (doacao) => {
    Alert.alert(
      "Confirmar Retirada",
      `Você confirma que o produto "${doacao.nome}" foi retirado?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              await doacaoService.inativar(doacao.id, "DOADO");
              setDoacoesSolicitadas((prev) =>
                prev.map((d) =>
                  d.id === doacao.id ? { ...d, statusDoacao: "DOADO" } : d
                )
              );
              setSelectedDonation(null);
              Alert.alert("Sucesso 🎉", "Status de retirada atualizado!");
            } catch (error) {
              Alert.alert("Erro", "Não foi possível confirmar a retirada.");
            }
          },
        },
      ]
    );
  };

  const openWhatsApp = (celular) => {
    if (!celular) {
      Alert.alert(
        "Contato Indisponível",
        "O doador não forneceu um número de contato."
      );
      return;
    }
    const numeroLimpo = celular.replace(/\D/g, "");
    const numeroWhatsapp = `${
      numeroLimpo.length <= 11 ? "55" : ""
    }${numeroLimpo}`;
    const url = `whatsapp://send?phone=${numeroWhatsapp}`;
    Linking.openURL(url).catch(() => {
      Alert.alert(
        "Erro",
        "Não foi possível abrir o WhatsApp. Verifique se o aplicativo está instalado."
      );
    });
  };

  const itemsPendentes = doacoesSolicitadas.filter(
    (d) => d.statusDoacao === "SOLICITADO"
  ).length;

  const renderList = () => {
    const data = activeTab === "feitas" ? doacoesFeitas : doacoesSolicitadas;
    if (isLoading && !doacoesFeitas.length && !doacoesSolicitadas.length) {
      return (
        <ActivityIndicator
          size="large"
          color={PRIMARY_BLUE}
          style={{ marginTop: 50 }}
        />
      );
    }
    if (data.length === 0) {
      return (
        <Text style={styles.emptyText}>Nenhuma doação encontrada aqui.</Text>
      );
    }
    return data.map((doacao) => (
      <DonationCard
        key={doacao.id}
        doacao={doacao}
        isDoadorTab={activeTab === "feitas"}
        onPress={() =>
          activeTab === "solicitadas" && setSelectedDonation(doacao)
        }
        onEdit={() => handleEdit(doacao.id)}
        onDelete={() => handleDelete(doacao)}
      />
    ));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader />
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "feitas" && styles.tabActive]}
          onPress={() => setActiveTab("feitas")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "feitas" && styles.tabTextActive,
            ]}
          >
            Minhas Doações
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "solicitadas" && styles.tabActive]}
          onPress={() => setActiveTab("solicitadas")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "solicitadas" && styles.tabTextActive,
            ]}
          >
            Minhas Solicitações
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={carregarDoacoes}
            colors={[PRIMARY_BLUE]}
            tintColor={PRIMARY_BLUE}
          />
        }
      >
        {renderList()}
      </ScrollView>

      {activeTab === "solicitadas" && (
        <View style={styles.checkoutBox}>
          <Text style={styles.totalLabel}>Retiradas Pendentes:</Text>
          <Text style={styles.totalValue}>
            {itemsPendentes} {itemsPendentes === 1 ? "Item" : "Itens"}
          </Text>
        </View>
      )}

      {selectedDonation && (
        <DonationDetailModal
          donation={selectedDonation}
          onClose={() => setSelectedDonation(null)}
          onConfirmRetirada={() => handleConfirmRetirada(selectedDonation)}
          onOpenWhatsApp={() => openWhatsApp(selectedDonation.pessoa.celular)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: LIGHT_BG },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 100,
    paddingHorizontal: 20,
    flexGrow: 1,
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
  tabContainer: {
    flexDirection: "row",
    backgroundColor: CARD_BG,
    marginHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    elevation: 3,
    shadowColor: SHADOW_COLOR,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  tab: { flex: 1, paddingVertical: 15, alignItems: "center" },
  tabActive: { backgroundColor: PRIMARY_BLUE, borderRadius: 10 },
  tabText: { fontSize: 16, fontWeight: "600", color: PRIMARY_BLUE },
  tabTextActive: { color: CARD_BG },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD_BG,
    borderRadius: 10,
    padding: 18,
    marginBottom: 15,
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  cardContent: { flex: 1 },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: ACCENT_TEXT,
    marginBottom: 4,
  },
  cardStatus: {
    fontSize: 14,
    color: "#777",
  },
  actionButtonsContainer: { flexDirection: "row", alignItems: "center" },
  iconButton: { padding: 5 },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#777",
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.9,
    maxWidth: 450,
    maxHeight: "85%",
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 25,
    elevation: 15,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: PRIMARY_BLUE,
    flexShrink: 1,
    marginRight: 15,
  },
  closeButton: { padding: 5 },
  detailLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: PRIMARY_BLUE,
    marginTop: 15,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  detailValue: {
    fontSize: 16,
    color: ACCENT_TEXT,
    lineHeight: 22,
  },
  detailValueCity: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 5,
  },
  whatsappButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#25D366",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 5,
    elevation: 2,
  },
  whatsappButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  statusBox: {
    marginTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#DDD",
    paddingTop: 15,
  },
  statusTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 5,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  actionButton: {
    height: 52,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonPrimary: {
    backgroundColor: ACCENT_GREEN,
    shadowColor: ACCENT_GREEN,
  },
  buttonDisabled: {
    backgroundColor: "#A0A0A0",
  },
  actionButtonText: {
    color: CARD_BG,
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
  checkoutBox: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#DDD",
    backgroundColor: CARD_BG,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 25,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: ACCENT_TEXT,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: PRIMARY_BLUE,
  },
});
