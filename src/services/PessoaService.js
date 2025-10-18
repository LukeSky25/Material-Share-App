import http from "../common/http-common";

const API_URL = "pessoa/";

const findById = (id) => {
  return http.mainInstance.get(`${API_URL}findById/${id}`);
};

const findByUsuarioId = (usuarioId) => {
  return http.mainInstance.get(`${API_URL}findByUsuarioId/${usuarioId}`);
};

const save = (data) => {
  return http.mainInstance.post(`${API_URL}save`, data);
};

const editar = (id, data) => {
  return http.mainInstance.put(API_URL + `editar/${id}`, data);
};

const pessoaService = {
  findById,
  findByUsuarioId,
  save,
  editar,
};

export default pessoaService;
