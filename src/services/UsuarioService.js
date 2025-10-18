import http from "../common/http-common";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "usuario/";

const findById = (id) => {
  return http.mainInstance.get(`${API_URL}findById/${id}`);
};

const signIn = async (email, senha) => {
  const response = await http.mainInstance.post(API_URL + "login", {
    email,
    senha,
  });
  if (response.data) {
    await AsyncStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const logout = async () => {
  await AsyncStorage.removeItem("user");
};

const save = (data) => {
  return http.mainInstance.post(`${API_URL}save`, data);
};

const alterarSenha = (id, data) => {
  return http.mainInstance.put(`${API_URL}alterarSenha/${id}`, data);
};

const inativar = (id) => {
  return http.multipartInstance.put(`${API_URL}inativar/${id}`);
};

const usuarioService = {
  findById,
  signIn,
  logout,
  save,
  alterarSenha,
  inativar,
};

export default usuarioService;
