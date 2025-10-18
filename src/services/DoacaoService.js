import http from "../common/http-common";

const API_URL = "doacao/";

const findById = (id) => {
  return http.mainInstance.get(`${API_URL}findById/${id}`);
};

const findByDoador = (pessoaId) => {
  return http.mainInstance.get(`${API_URL}findByDoador/${pessoaId}`);
};

const findSolicitadasByBeneficiario = (pessoaId) => {
  return http.mainInstance.get(
    `${API_URL}findSolicitadasByBeneficiario/${pessoaId}`
  );
};

const editar = (id, formData) => {
  return http.multipartInstance.put(`/doacao/editar/${id}`, formData);
};

const inativar = (id, novoStatus) => {
  return http.multipartInstance.put(`${API_URL}inativar/${id}/${novoStatus}`);
};

const doacaoService = {
  findById,
  findByDoador,
  findSolicitadasByBeneficiario,
  editar,
  inativar,
};

export default doacaoService;
