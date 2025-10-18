import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import PessoaService from "../services/PessoaService";
import UsuarioService from "../services/UsuarioService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  formatCpfCnpj,
  formatCEP,
  formatCelular,
  formatDateInput,
} from "../utils/formHelpers";

dayjs.extend(customParseFormat);

const { width } = Dimensions.get("window");
const PRIMARY_BLUE = "#007BFF";
const ACCENT_TEXT = "#333333";
const LIGHT_BG = "#F0F5F9";
const CARD_BG = "#FFFFFF";
const SHADOW_COLOR = "rgba(0, 0, 0, 0.1)";
const DARK_BLUE = "#1D4ED8";

const AppHeader = ({ isEditing, onEditSave }) => (
  <View style={profileStyles.header}>
    <View style={profileStyles.headerButton} />

    <Text style={profileStyles.headerTitle}>Meu Perfil</Text>

    <TouchableOpacity onPress={onEditSave} style={profileStyles.headerButton}>
      <Feather
        name={isEditing ? "check" : "edit-3"}
        size={24}
        color={CARD_BG}
      />
    </TouchableOpacity>
  </View>
);

const CustomProfileInput = ({
  label,
  iconName,
  value,
  onChangeText,
  editable,
  ...props
}) => {
  const isFocused = editable;

  return (
    <View style={profileStyles.inputGroup}>
      <Text
        style={[
          profileStyles.label,
          { color: isFocused ? PRIMARY_BLUE : "#777" },
        ]}
      >
        {label}
      </Text>
      <View
        style={[
          profileStyles.inputWrapper,
          {
            borderColor: isFocused ? PRIMARY_BLUE : "#E0E0E0",
            shadowColor: isFocused ? PRIMARY_BLUE : "transparent",
            shadowOpacity: isFocused ? 0.2 : 0,
            backgroundColor: editable ? "#FFF" : LIGHT_BG,
          },
        ]}
      >
        <Feather
          name={iconName}
          size={20}
          color={isFocused ? PRIMARY_BLUE : "#A0A0A0"}
          style={profileStyles.inputIcon}
        />
        <TextInput
          style={profileStyles.input}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          cursorColor={PRIMARY_BLUE}
          placeholderTextColor="#A0A0A0"
          {...props}
        />
      </View>
    </View>
  );
};

const UserTypeSelector = ({ userType, setUserType, isEditing }) => (
  <View style={profileStyles.inputGroup}>
    <Text
      style={[
        profileStyles.label,
        { color: isEditing ? PRIMARY_BLUE : "#777" },
      ]}
    >
      Tipo de Usuário
    </Text>
    <View
      style={[
        profileStyles.userTypeContainer,
        { borderColor: isEditing ? PRIMARY_BLUE : "#E0E0E0" },
      ]}
    >
      {["Doador", "Recebedor"].map((type, index) => (
        <TouchableOpacity
          key={type}
          style={[
            profileStyles.typeOption,
            userType === type && profileStyles.typeOptionActive,
            !isEditing && profileStyles.typeOptionInactive,

            index === 0 && {
              borderRightWidth: StyleSheet.hairlineWidth,
              borderRightColor: "#E0E0E0",
            },
          ]}
          onPress={() => isEditing && setUserType(type)}
          activeOpacity={isEditing ? 0.7 : 1}
          disabled={!isEditing}
        >
          <Text
            style={[
              profileStyles.typeText,
              userType === type && profileStyles.typeTextActive,

              !isEditing && userType !== type && { color: "#A0A0A0" },

              !isEditing && userType === type && { color: ACCENT_TEXT },
            ]}
          >
            {type}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default function ProfileScreen({ navigation }) {
  const [pessoa, setPessoa] = useState(null);
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [celular, setCelular] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [cep, setCep] = useState("");
  const [email, setEmail] = useState("");
  const [numeroResidencia, setNumeroResidencia] = useState("");
  const [complemento, setComplemento] = useState("");
  const [userType, setUserType] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (!userString) {
          Alert.alert(
            "Erro",
            "Sessão não encontrada. Por favor, faça login novamente."
          );
          navigation.replace("Login");
          return;
        }

        const userData = JSON.parse(userString);
        setPessoa(userData);

        setNome(userData.nome || "");
        setEmail(userData.usuario?.email || "");
        setDataNascimento(
          userData.dataNascimento
            ? dayjs(userData.dataNascimento).format("DD/MM/YYYY")
            : ""
        );
        setCelular(userData.celular ? formatCelular(userData.celular) : "");
        setCpfCnpj(userData.cpf_cnpj ? formatCpfCnpj(userData.cpf_cnpj) : "");
        setCep(userData.cep ? formatCEP(userData.cep) : "");
        setNumeroResidencia(userData.numeroResidencia || "");
        setComplemento(userData.complemento || "");
        setUserType(userData.tipo === "DOADOR" ? "Doador" : "Beneficiado");
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        Alert.alert("Erro", "Não foi possível carregar seus dados.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [navigation]);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const dadosAtualizados = {
        nome,
        dataNascimento: dayjs(dataNascimento, "DD/MM/YYYY").format(
          "YYYY-MM-DD"
        ),
        celular: celular.replace(/\D/g, ""),
        cpf_cnpj: cpfCnpj.replace(/\D/g, ""),
        cep: cep.replace(/\D/g, ""),
        numeroResidencia,
        complemento,
        usuario: { email },
      };

      await PessoaService.editar(pessoa.id, dadosAtualizados);

      const updatedPessoa = {
        ...pessoa,
        ...dadosAtualizados,
        usuario: { ...pessoa.usuario, email },
      };
      await AsyncStorage.setItem("user", JSON.stringify(updatedPessoa));

      Alert.alert("Sucesso", "Suas informações foram salvas!");
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      Alert.alert(
        "Erro",
        "Não foi possível salvar as alterações. Verifique os dados."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    Alert.alert("Navegação", "Simular navegação de volta ou para a tela Home.");
  };

  const handleLogout = async () => {
    Alert.alert("Sair da Conta", "Tem certeza que deseja fazer logout?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await UsuarioService.logout();
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        },
      },
    ]);
  };

  const handleInactivateAccount = () => {
    Alert.alert(
      "Inativar Conta",
      "Esta ação é permanente e não pode ser desfeita. Você será desconectado. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Inativar",
          style: "destructive",
          onPress: async () => {
            try {
              await UsuarioService.inativar(pessoa.usuario.id);
              await UsuarioService.logout();
              Alert.alert(
                "Conta Inativada",
                "Sua conta foi inativada com sucesso."
              );
              navigation.reset({ index: 0, routes: [{ name: "Login" }] });
            } catch (error) {
              console.log(error);
              Alert.alert("Erro", "Não foi possível inativar sua conta.");
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: LIGHT_BG,
        }}
      >
        <ActivityIndicator size="large" color={PRIMARY_BLUE} />
        <Text style={{ marginTop: 10 }}>Carregando seu perfil...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: LIGHT_BG }}>
      <AppHeader
        navigation={navigation}
        isEditing={isEditing}
        onEditSave={() => (isEditing ? handleSave() : setIsEditing(true))}
        onGoBack={handleGoBack}
      />

      <ScrollView contentContainerStyle={profileStyles.scrollContainer}>
        <View style={profileStyles.profileCard}>
          <View style={profileStyles.iconCircle}>
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={50}
              color={PRIMARY_BLUE}
            />
          </View>

          <Text style={profileStyles.title}>Meus Dados</Text>
          <Text style={profileStyles.subtitle}>
            Gerencie suas informações pessoais e de contato.
          </Text>

          <CustomProfileInput
            label="Nome Completo"
            iconName="user"
            value={nome}
            onChangeText={setNome}
            editable={isEditing}
            autoCapitalize="words"
          />
          <CustomProfileInput
            label="Email"
            iconName="mail"
            value={email}
            onChangeText={setEmail}
            editable={isEditing}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <CustomProfileInput
            label="Telefone"
            iconName="phone"
            value={celular}
            onChangeText={(text) => setCelular(formatCelular(text))}
            editable={isEditing}
            keyboardType="phone-pad"
            maxLength={15}
          />
          <CustomProfileInput
            label="CPF / CNPJ"
            iconName="credit-card"
            value={cpfCnpj}
            onChangeText={(text) => setCpfCnpj(formatCpfCnpj(text))}
            editable={isEditing}
            keyboardType="numeric"
            maxLength={18}
          />
          <CustomProfileInput
            label="Data de Nascimento"
            iconName="calendar"
            value={dataNascimento}
            onChangeText={(text) => setDataNascimento(formatDateInput(text))}
            editable={isEditing}
            keyboardType="numeric"
            placeholder="dd/mm/aaaa"
            maxLength={10}
          />
          <CustomProfileInput
            label="CEP"
            iconName="map"
            value={cep}
            onChangeText={(text) => setCep(formatCEP(text))}
            editable={isEditing}
            keyboardType="numeric"
            maxLength={9}
          />
          <CustomProfileInput
            label="Número da Residência"
            iconName="hash"
            value={numeroResidencia}
            onChangeText={setNumeroResidencia}
            editable={isEditing}
            keyboardType="numeric"
          />
          <CustomProfileInput
            label="Complemento"
            iconName="info"
            value={complemento}
            onChangeText={setComplemento}
            editable={isEditing}
          />
        </View>

        <TouchableOpacity
          style={profileStyles.actionButton}
          onPress={() => navigation.navigate("Notificacoes")}
          activeOpacity={0.8}
        >
          <Feather
            name="bell"
            size={18}
            color={CARD_BG}
            style={{ marginRight: 10 }}
          />
          <Text style={profileStyles.actionButtonText}>
            MINHAS NOTIFICAÇÕES
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={profileStyles.actionButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Feather
            name="log-out"
            size={18}
            color={CARD_BG}
            style={{ marginRight: 10 }}
          />
          <Text style={profileStyles.actionButtonText}>SAIR DA CONTA</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[profileStyles.actionButton, profileStyles.dangerButton]}
          onPress={handleInactivateAccount}
          activeOpacity={0.8}
        >
          <Feather
            name="alert-triangle"
            size={18}
            color={CARD_BG}
            style={{ marginRight: 10 }}
          />
          <Text style={profileStyles.actionButtonText}>INATIVAR CONTA</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const profileStyles = StyleSheet.create({
  header: {
    backgroundColor: PRIMARY_BLUE,
    paddingHorizontal: 15,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 5,
    shadowColor: DARK_BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: CARD_BG,
    letterSpacing: 0.5,
  },
  headerButton: {
    padding: 5,
    minWidth: 34,
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: LIGHT_BG,
  },

  profileCard: {
    width: width * 0.9,
    maxWidth: 500,
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 35,
    marginBottom: 30,
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  iconCircle: {
    alignSelf: "center",
    marginBottom: 20,
    padding: 15,
    borderRadius: 50,
    backgroundColor: "#EBF5FF",
    borderWidth: 2,
    borderColor: PRIMARY_BLUE + "20",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: ACCENT_TEXT,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: "#777",
    textAlign: "center",
    marginBottom: 35,
    fontSize: 15,
  },

  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 15,
    minHeight: 52,
    backgroundColor: "#F9F9F9",
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
    shadowColor: SHADOW_COLOR,
    shadowOpacity: 0.1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: ACCENT_TEXT,
    paddingVertical: 10,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: 10,
    paddingBottom: 10,
  },

  userTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    backgroundColor: CARD_BG,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: CARD_BG,
  },
  typeOptionActive: {
    backgroundColor: PRIMARY_BLUE,
  },
  typeOptionInactive: {
    backgroundColor: LIGHT_BG,
  },
  typeText: {
    fontSize: 16,
    fontWeight: "600",
    color: PRIMARY_BLUE,
  },
  typeTextActive: {
    color: CARD_BG,
  },

  actionButton: {
    width: "100%",
    maxWidth: 500,
    height: 52,
    backgroundColor: DARK_BLUE,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: DARK_BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 8,
    marginTop: 10,
  },
  dangerButton: {
    backgroundColor: "#C0392B",
    shadowColor: "#C0392B",
  },
  actionButtonText: {
    color: CARD_BG,
    fontSize: 17,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },

  logoutButton: {
    width: "100%",
    maxWidth: 500,
    height: 52,
    backgroundColor: "#C0392B",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#C0392B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 15,
    marginTop: 10,
  },
  logoutText: {
    color: CARD_BG,
    fontSize: 17,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
});
