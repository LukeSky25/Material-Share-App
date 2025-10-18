import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const PRIMARY_BLUE = "#007BFF";
const DARK_BLUE = "#1D4ED8";
const LIGHT_BG = "#F0F5F9";
const CARD_BG = "#FFFFFF";
const ACCENT_TEXT = "#333333";
const SHADOW_COLOR = "rgba(0, 0, 0, 0.1)";

const SERVICES_DATA = [
  {
    id: "1",
    icon: "message-circle",
    title: "Captação e Divulgação",
    description:
      "Identificamos e cadastramos doadores (pessoas físicas e empresas) que possuem materiais de construção excedentes ou sem uso, como sobras de obras, itens de mostruário ou estoque parado.",
  },
  {
    id: "2",
    icon: "link",
    title: "A Ponte Solidária (Intermediação)",
    description:
      "Nosso trabalho é fazer a conexão. Analisamos as doações disponíveis e as cruzamos com as solicitações de beneficiários previamente cadastrados e verificados, como famílias de baixa renda e outras ONGs.",
  },
  {
    id: "3",
    icon: "truck",
    title: "Destinação e Logística",
    description:
      "Auxiliamos na coordenação da retirada e entrega dos materiais, buscando a solução mais viável para que os itens cheguem ao seu destino final e promovam a transformação necessária.",
  },
  {
    id: "4",
    icon: "home",
    title: "Conexão com o Beneficiário",
    description:
      "Facilitamos o contato e a logística para que o material certo chegue a quem realmente precisa, transformando o que seria descartado em lares mais seguros e sonhos realizados.",
  },
];

const AppHeader = ({ navigation }) => (
  <View style={headerStyles.header}>
    <View style={headerStyles.logoContainer}>
      <MaterialCommunityIcons
        name="screw-machine-flat-top"
        size={26}
        color={PRIMARY_BLUE}
      />
      <Text style={headerStyles.headerTitle}>Material Share</Text>
    </View>

    <View style={headerStyles.iconesDireita}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Carrinho")}
        style={headerStyles.iconButton}
      >
        <Feather name="shopping-cart" size={22} color={PRIMARY_BLUE} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Usuario")}
        style={headerStyles.iconButton}
      >
        <Feather name="user" size={22} color={PRIMARY_BLUE} />
      </TouchableOpacity>
    </View>
  </View>
);

const ServiceCard = ({ item }) => (
  <View style={aboutStyles.serviceCard}>
    <View style={aboutStyles.serviceIconContainer}>
      <Feather name={item.icon} size={28} color={PRIMARY_BLUE} />
    </View>
    <Text style={aboutStyles.cardTitle}>{item.title}</Text>
    <Text style={aboutStyles.cardDescription}>{item.description}</Text>
  </View>
);

const WebsiteAccessCard = () => {
  const websiteURL = "https://www.materialshare.com.br/operacoes";

  const handlePress = () => {
    console.log(`Abrindo o site para operações: ${websiteURL}`);
  };

  return (
    <View style={aboutStyles.websiteCard}>
      <Feather name="external-link" size={30} color={DARK_BLUE} />
      <View style={{ flex: 1, marginLeft: 15 }}>
        <Text style={aboutStyles.websiteCardTitle}>
          Realize Doações e Solicitações
        </Text>
        <Text style={aboutStyles.websiteCardDescription}>
          Para iniciar operações de doação, recebimento, cadastro de projetos e
          acompanhamento, acesse nosso portal exclusivo pelo site.
        </Text>
      </View>
      <TouchableOpacity
        style={aboutStyles.websiteCardButton}
        onPress={handlePress}
      >
        <Text style={aboutStyles.websiteCardButtonText}>Acessar Site</Text>
        <Feather
          name="arrow-right"
          size={16}
          color={CARD_BG}
          style={{ marginLeft: 5 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default function AboutScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: LIGHT_BG }}>
      <AppHeader navigation={navigation} />

      <ScrollView contentContainerStyle={aboutStyles.scrollContainer}>
        <Text style={aboutStyles.mainTitle}>Nossos Serviços</Text>

        <View style={aboutStyles.missionContainer}>
          <Text style={aboutStyles.missionText}>
            Na Material Share, nosso principal serviço é atuar como uma ponte.
            Conectamos a generosidade de quem doa com a necessidade de quem
            constrói, garantindo que os materiais de construção encontrem seu
            destino certo.
          </Text>
        </View>

        <View style={aboutStyles.servicesContainer}>
          {SERVICES_DATA.map((service) => (
            <ServiceCard key={service.id} item={service} />
          ))}
        </View>

        <WebsiteAccessCard />
      </ScrollView>
    </SafeAreaView>
  );
}

const headerStyles = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: CARD_BG,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: ACCENT_TEXT,
    letterSpacing: 0.5,
    marginLeft: 8,
  },

  iconesDireita: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconButton: {
    padding: 5,
    marginLeft: 15,
  },
});

const aboutStyles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: LIGHT_BG,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: DARK_BLUE,
    textAlign: "center",
    marginBottom: 30,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  missionContainer: {
    width: "100%",
    maxWidth: 600,
    backgroundColor: CARD_BG,
    padding: 25,
    borderRadius: 10,
    marginBottom: 40,

    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  missionText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    lineHeight: 25,
  },
  servicesContainer: {
    width: "100%",
    maxWidth: 700,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  serviceCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 25,
    width: width > 600 ? "45%" : "95%",
    minWidth: 280,
    marginBottom: 25,

    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    alignItems: "flex-start",
  },
  serviceIconContainer: {
    alignSelf: "flex-start",
    marginBottom: 15,
    padding: 15,
    borderRadius: 50,
    backgroundColor: "#EBF5FF",
    borderWidth: 2,
    borderColor: PRIMARY_BLUE + "20",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: ACCENT_TEXT,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  cardDescription: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },

  websiteCard: {
    width: "100%",
    maxWidth: 700,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD_BG,
    padding: 25,
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    borderLeftWidth: 5,
    borderLeftColor: PRIMARY_BLUE,
  },
  websiteCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: DARK_BLUE,
    marginBottom: 5,
  },
  websiteCardDescription: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginRight: 10,
  },
  websiteCardButton: {
    backgroundColor: PRIMARY_BLUE,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  websiteCardButtonText: {
    color: CARD_BG,
    fontWeight: "600",
    fontSize: 14,
  },
});
