import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Keyboard,
  ActivityIndicator,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs from "dayjs";

import usuarioService from "../services/UsuarioService";
import pessoaService from "../services/PessoaService";

import {
  formatCpfCnpj,
  formatCEP,
  formatCelular,
  validateSignUpForm,
  formatDateInput,
} from "../utils/formHelpers";

const { width } = Dimensions.get("window");
const PRIMARY_BLUE = "#007BFF";
const ACCENT_TEXT = "#333333";
const LIGHT_BG = "#F0F5F9";
const CARD_BG = "#FFFFFF";
const SHADOW_COLOR = "rgba(0, 0, 0, 0.1)";

const AppHeader = () => (
  <View style={styles.header}>
    <MaterialCommunityIcons name="tools" size={26} color={PRIMARY_BLUE} />
    <Text style={styles.headerTitle}>Material Share</Text>
  </View>
);

const CustomInput = ({
  label,
  iconName,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  placeholder,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.inputGroup}>
      <Text
        style={[styles.label, { color: isFocused ? PRIMARY_BLUE : "#777" }]}
      >
        {label}
      </Text>
      <View
        style={[
          styles.inputWrapper,
          {
            borderColor: isFocused ? PRIMARY_BLUE : "#E0E0E0",
            shadowColor: isFocused ? PRIMARY_BLUE : "transparent",
            shadowOpacity: isFocused ? 0.25 : 0,
          },
        ]}
      >
        <Feather
          name={iconName}
          size={20}
          color={isFocused ? PRIMARY_BLUE : "#A0A0A0"}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#A0A0A0"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          cursorColor={PRIMARY_BLUE}
          {...props}
        />
      </View>
    </View>
  );
};

const CustomPicker = ({ label, selectedValue, onOpenPicker }) => {
  const displayValue = selectedValue || "Selecione uma opção...";
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.inputWrapper, styles.pickerWrapper]}
        onPress={onOpenPicker}
        activeOpacity={0.7}
      >
        <Feather
          name="users"
          size={20}
          color={PRIMARY_BLUE}
          style={styles.inputIcon}
        />
        <Text
          style={[
            styles.pickerText,
            { color: selectedValue ? ACCENT_TEXT : "#A0A0A0" },
          ]}
        >
          {displayValue}
        </Text>
        <Feather name="chevron-down" size={20} color="#A0A0A0" />
      </TouchableOpacity>
    </View>
  );
};

const FeedbackMessage = ({ feedback }) => {
  if (!feedback.message) return null;

  let colorMap = {
    error: {
      bgColor: "#FEE2E2",
      textColor: "#991B1B",
      borderColor: "#EF4444",
      icon: "alert-triangle",
    },
    success: {
      bgColor: "#D1FAE5",
      textColor: "#047857",
      borderColor: "#10B981",
      icon: "check-circle",
    },
    info: {
      bgColor: "#DBEAFE",
      textColor: "#1D4ED8",
      borderColor: "#3B82F6",
      icon: "info",
    },
  };

  const { bgColor, textColor, borderColor, icon } =
    colorMap[feedback.type] || colorMap.info;

  return (
    <View
      style={[
        styles.feedbackContainer,
        { backgroundColor: bgColor, borderLeftColor: borderColor },
      ]}
    >
      <Feather
        name={icon}
        size={18}
        color={textColor}
        style={{ marginRight: 10 }}
      />
      <Text style={{ color: textColor, fontSize: 14, flexShrink: 1 }}>
        {feedback.message}
      </Text>
    </View>
  );
};

export default function SignUpScreen({ navigation }) {
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [celular, setCelular] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [cep, setCep] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [t_user, setT_user] = useState("");

  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    Keyboard.dismiss();
    const formData = {
      nome,
      dataNascimento,
      celular,
      cpfCnpj,
      cep,
      email,
      senha,
      t_user,
    };

    const validationError = await validateSignUpForm(formData);
    if (validationError) {
      setFeedback({ message: `🚨 ${validationError}`, type: "error" });
      return;
    }

    setIsLoading(true);
    setFeedback({ message: "Criando sua conta...", type: "info" });

    try {
      const dadosUsuario = { nome, email, senha };
      const respostaUsuario = await usuarioService.save(dadosUsuario);

      if (!respostaUsuario?.data?.id) {
        throw new Error("Falha ao obter o ID do novo usuário após o cadastro.");
      }
      const novoUsuarioId = respostaUsuario.data.id;

      const dadosPessoa = {
        nome,
        cpf_cnpj: cpfCnpj.replace(/\D/g, ""),
        tipo: t_user,
        usuario: { id: novoUsuarioId },
      };

      if (dataNascimento) {
        dadosPessoa.dataNascimento = dayjs(dataNascimento, "DD/MM/YYYY").format(
          "YYYY-MM-DD"
        );
      }
      if (celular) {
        dadosPessoa.celular = celular.replace(/\D/g, "");
      }
      if (cep) {
        dadosPessoa.cep = cep.replace(/\D/g, "");
      }

      await pessoaService.save(dadosPessoa);

      setFeedback({
        message: `✅ Bem-vindo(a), ${nome}! Conta criada. Faça o login para continuar.`,
        type: "success",
      });
      setTimeout(() => {
        navigation.replace("Login", { userEmail: email });
      }, 2500);
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      if (error.response) {
        console.error("Detalhes do erro do servidor:", error.response.data);
      }
      const errorMessage =
        error.response?.data?.message ||
        "Não foi possível criar a conta. O e-mail ou CPF/CNPJ já pode estar em uso.";
      setFeedback({ message: `❌ ${errorMessage}`, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenPicker = () => {
    Alert.alert(
      "Tipo de Usuário",
      "Como você gostaria de usar o Material Share?",
      [
        { text: "Quero Doar", onPress: () => setT_user("DOADOR") },
        {
          text: "Quero Receber Doações",
          onPress: () => setT_user("BENEFICIADO"),
        },
        { text: "Cancelar", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const handleLoginRedirect = () => {
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: LIGHT_BG }}>
      <AppHeader />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <MaterialCommunityIcons
            name="account-plus-outline"
            size={50}
            color={PRIMARY_BLUE}
            style={styles.cardIcon}
          />

          <Text style={styles.title}>Crie Sua Conta</Text>
          <Text style={styles.subtitle}>
            Preencha seus dados para começar a usar.
          </Text>

          <CustomInput
            label="Nome Completo *"
            iconName="user"
            placeholder="Seu nome completo"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
          />
          <CustomInput
            label="CPF ou CNPJ *"
            iconName="credit-card"
            placeholder="000.000.000-00"
            value={cpfCnpj}
            onChangeText={(text) => setCpfCnpj(formatCpfCnpj(text))}
            keyboardType="numeric"
            maxLength={18}
          />
          <CustomInput
            label="Email *"
            iconName="mail"
            placeholder="seu.email@dominio.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <CustomInput
            label="Senha *"
            iconName="lock"
            placeholder="Mínimo 6 caracteres"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />
          <CustomPicker
            label="Tipo de Usuário *"
            selectedValue={
              t_user === "DOADOR"
                ? "Doador"
                : t_user === "BENEFICIADO"
                ? "Beneficiado"
                : ""
            }
            onOpenPicker={handleOpenPicker}
          />

          <View style={styles.sectionDivider} />
          <Text style={styles.optionalTitle}>Dados Opcionais</Text>

          <CustomInput
            label="Data de Nascimento"
            iconName="calendar"
            placeholder="AAAA-MM-DD"
            value={dataNascimento}
            onChangeText={(text) => setDataNascimento(formatDateInput(text))}
            keyboardType="numeric"
            maxLength={10}
          />
          <CustomInput
            label="Celular"
            iconName="phone"
            placeholder="(99) 99999-9999"
            value={celular}
            onChangeText={(text) => setCelular(formatCelular(text))}
            keyboardType="phone-pad"
            maxLength={15}
          />
          <CustomInput
            label="CEP"
            iconName="map-pin"
            placeholder="99999-999"
            value={cep}
            onChangeText={(text) => setCep(formatCEP(text))}
            keyboardType="numeric"
            maxLength={9}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSignUp}
            activeOpacity={0.7}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={CARD_BG} />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>CADASTRAR CONTA</Text>
                <Feather
                  name="arrow-right-circle"
                  size={18}
                  color={CARD_BG}
                  style={{ marginLeft: 10 }}
                />
              </View>
            )}
          </TouchableOpacity>

          <FeedbackMessage feedback={feedback} />

          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>Já tem uma conta?</Text>
            <TouchableOpacity onPress={handleLoginRedirect}>
              <Text style={styles.loginLink}>Acesse agora</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: LIGHT_BG,
  },
  card: {
    width: width * 0.9,
    maxWidth: 450,
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 35,

    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  cardIcon: {
    alignSelf: "center",
    marginBottom: 15,
    padding: 15,
    borderRadius: 50,
    backgroundColor: "#EBF5FF",
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
  optionalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: PRIMARY_BLUE,
    marginBottom: 15,
    marginTop: 15,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
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
    color: "#777",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 52,
    backgroundColor: "#F9F9F9",
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
    shadowColor: SHADOW_COLOR,
    shadowOpacity: 0.1,
    borderColor: "#E0E0E0",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: ACCENT_TEXT,
    paddingVertical: 0,
  },

  pickerWrapper: {
    justifyContent: "space-between",
  },
  pickerText: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    marginRight: 10,
  },

  button: {
    height: 52,
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    shadowColor: PRIMARY_BLUE,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 15,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: CARD_BG,
    fontSize: 17,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },

  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 35,
    flexWrap: "wrap",
  },
  loginText: {
    fontSize: 14,
    color: "#7f8c8d",
    marginRight: 5,
  },
  loginLink: {
    fontSize: 14,
    color: PRIMARY_BLUE,
    fontWeight: "bold",
    textDecorationLine: "underline",
    letterSpacing: 0.3,
  },

  feedbackContainer: {
    marginTop: 25,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 5,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});
