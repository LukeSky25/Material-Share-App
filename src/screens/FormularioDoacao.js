import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import doacaoService from "../services/DoacaoService.js";
import categoriaService from "../services/CategoriaService.js";
import { formatCEP } from "../utils/formHelpers";

const { width } = Dimensions.get("window");
const PRIMARY_BLUE = "#007BFF";
const ACCENT_TEXT = "#333333";
const LIGHT_BG = "#F0F5F9";
const CARD_BG = "#FFFFFF";
const SHADOW_COLOR = "rgba(0, 0, 0, 0.1)";

const AppHeader = ({ title }) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>{title}</Text>
  </View>
);
const CustomInput = ({
  label,
  value,
  onChangeText,
  multiline = false,
  ...props
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && styles.multilineInput]}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      placeholderTextColor="#A0A0A0"
      cursorColor={PRIMARY_BLUE}
      {...props}
    />
  </View>
);
const CategoryPickerModal = ({ isVisible, categories, onSelect, onClose }) => (
  <Modal
    visible={isVisible}
    transparent={true}
    animationType="slide"
    onRequestClose={onClose}
  >
    <TouchableOpacity
      style={styles.modalOverlay}
      activeOpacity={1}
      onPress={onClose}
    >
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Selecione uma Categoria</Text>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => onSelect(item.id)}
            >
              <Text style={styles.modalItemText}>{item.nome}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
          <Text style={styles.modalCloseButtonText}>CANCELAR</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  </Modal>
);

export default function FormularioDoacaoScreen({ navigation, route }) {
  const { id } = route.params || {};
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    quantidade: "",
    cep: "",
    numeroResidencia: "",
    complemento: "",
    categoriaId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [categorias, setCategorias] = useState([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      const userString = await AsyncStorage.getItem("user");
      if (userString) {
        setUsuarioLogado(JSON.parse(userString));
      } else {
        Alert.alert("Erro", "Sessão inválida. Faça login novamente.");
        navigation.replace("Login");
        return;
      }
      try {
        const response = await categoriaService.findAll();
        const categoriasAtivas = response.data.filter(
          (cat) => cat.statusCategoria === "ATIVO"
        );
        setCategorias(categoriasAtivas);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
        Alert.alert("Erro", "Não foi possível carregar as categorias.");
      } finally {
        setLoadingCategorias(false);
      }
    };
    bootstrap();
  }, [navigation]);

  useEffect(() => {
    if (isEditMode && id) {
      const fetchDonationData = async () => {
        setIsLoading(true);
        try {
          const response = await doacaoService.findById(id);
          const {
            nome,
            descricao,
            quantidade,
            cep,
            numeroResidencia,
            complemento,
            categoria,
          } = response.data;
          setFormData({
            nome,
            descricao: descricao || "",
            quantidade: String(quantidade),
            cep: cep ? formatCEP(cep) : "",
            numeroResidencia: numeroResidencia || "",
            complemento: complemento || "",
            categoriaId: categoria.id,
          });
        } catch (err) {
          Alert.alert(
            "Erro",
            "Doação não encontrada ou você não tem permissão para editá-la."
          );
          navigation.goBack();
        } finally {
          setIsLoading(false);
        }
      };
      fetchDonationData();
    }
  }, [id, isEditMode, navigation]);

  const handleFormChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async () => {
    if (!usuarioLogado?.id) {
      Alert.alert("Erro", "Sessão inválida. Faça login novamente.");
      return;
    }
    if (
      !formData.nome ||
      !formData.descricao ||
      !formData.quantidade ||
      !formData.categoriaId ||
      !formData.cep ||
      !formData.numeroResidencia
    ) {
      Alert.alert(
        "Atenção",
        "Por favor, preencha todos os campos obrigatórios (*)."
      );
      return;
    }
    setIsSubmitting(true);

    try {
      if (isEditMode) {
        const formDataObject = new FormData();

        formDataObject.append("nome", formData.nome);
        formDataObject.append("descricao", formData.descricao);
        formDataObject.append("quantidade", formData.quantidade);
        formDataObject.append("cep", formData.cep.replace(/\D/g, ""));
        formDataObject.append("numeroResidencia", formData.numeroResidencia);
        formDataObject.append("complemento", formData.complemento || "");
        formDataObject.append("statusDoacao", "ATIVO");

        formDataObject.append("categoria.id", formData.categoriaId);

        await doacaoService.editar(id, formDataObject);
        Alert.alert("Sucesso", "Doação atualizada com sucesso!");
      } else {
        Alert.alert("Sucesso", "Doação cadastrada com sucesso!");
      }
      navigation.goBack();
    } catch (error) {
      console.error(
        "Erro ao salvar doação:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Erro",
        "Não foi possível salvar a doação. Verifique os dados."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={PRIMARY_BLUE} />
        <Text>Carregando dados da doação...</Text>
      </View>
    );
  }

  const selectedCategoryName =
    categorias.find((c) => c.id === formData.categoriaId)?.nome ||
    "Selecione...";

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader title={isEditMode ? "Editar Doação" : "Cadastrar Doação"} />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
          <CustomInput
            label="Nome do Material *"
            value={formData.nome}
            onChangeText={(text) => handleFormChange("nome", text)}
            placeholder="Ex: Tinta Branca 1L"
          />
          <CustomInput
            label="Descrição *"
            value={formData.descricao}
            onChangeText={(text) => handleFormChange("descricao", text)}
            multiline
            placeholder="Descreva o estado, marca, etc."
          />
          <CustomInput
            label="Quantidade *"
            value={formData.quantidade}
            onChangeText={(text) => handleFormChange("quantidade", text)}
            keyboardType="numeric"
            placeholder="Ex: 5"
          />
          <Text style={styles.label}>Categoria *</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setCategoryModalVisible(true)}
            disabled={loadingCategorias}
          >
            <Text style={styles.pickerText}>
              {loadingCategorias ? "Carregando..." : selectedCategoryName}
            </Text>
            <Feather name="chevron-down" size={20} color="#777" />
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>Endereço de Retirada</Text>
          <CustomInput
            label="CEP *"
            value={formData.cep}
            onChangeText={(text) => handleFormChange("cep", formatCEP(text))}
            keyboardType="numeric"
            maxLength={9}
            placeholder="00000-000"
          />
          <CustomInput
            label="Número *"
            value={formData.numeroResidencia}
            onChangeText={(text) => handleFormChange("numeroResidencia", text)}
            keyboardType="numeric"
            placeholder="Ex: 123"
          />
          <CustomInput
            label="Complemento"
            value={formData.complemento}
            onChangeText={(text) => handleFormChange("complemento", text)}
            placeholder="Ex: Apto 42"
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isEditMode ? "SALVAR ALTERAÇÕES" : "CADASTRAR DOAÇÃO"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      <CategoryPickerModal
        isVisible={isCategoryModalVisible}
        categories={categorias}
        onClose={() => setCategoryModalVisible(false)}
        onSelect={(categoryId) => {
          handleFormChange("categoriaId", categoryId);
          setCategoryModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: LIGHT_BG },
  scrollContainer: { padding: 20 },
  header: {
    padding: 20,
    backgroundColor: CARD_BG,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    alignItems: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: ACCENT_TEXT },
  formCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 20,
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputGroup: { marginBottom: 15 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },
  input: {
    backgroundColor: LIGHT_BG,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 16,
    color: ACCENT_TEXT,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  pickerButton: {
    backgroundColor: LIGHT_BG,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  pickerText: {
    fontSize: 16,
    color: ACCENT_TEXT,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: PRIMARY_BLUE,
    marginTop: 20,
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 20,
  },
  submitButton: {
    backgroundColor: PRIMARY_BLUE,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
    elevation: 3,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: CARD_BG,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "60%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: ACCENT_TEXT,
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalItemText: {
    fontSize: 16,
    textAlign: "center",
    color: PRIMARY_BLUE,
  },
  modalCloseButton: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: ACCENT_TEXT,
  },
});
