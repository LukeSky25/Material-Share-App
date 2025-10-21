import { isEmail } from "validator";
import { validate as validarCnpj } from "cnpj";
import validarCpf from "validar-cpf";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const formatCpfCnpj = (value) => {
  const cleanedValue = value.replace(/\D/g, "");
  if (cleanedValue.length <= 11) {
    return cleanedValue
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .slice(0, 14);
  } else {
    return cleanedValue
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})/, "$1-$2")
      .slice(0, 18);
  }
};

export const formatCEP = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);
};

export const formatCelular = (value) => {
  const cleanedValue = value.replace(/\D/g, "");
  if (cleanedValue.length <= 10) {
    return cleanedValue
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 14);
  }
  return cleanedValue
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15);
};

export const formatDateInput = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .slice(0, 10);
};

export const validateSignUpForm = async (formData) => {
  const { nome, dataNascimento, celular, cpfCnpj, cep, email, senha, t_user } =
    formData;

  const cleanedDoc = (cpfCnpj || "").replace(/\D/g, "");
  const cleanedCelular = (celular || "").replace(/\D/g, "");
  const cleanedCep = (cep || "").replace(/\D/g, "");

  if (!nome.trim()) return "O nome completo é obrigatório.";

  if (dataNascimento) {
    const dataNascimentoObj = dayjs(dataNascimento, "DD/MM/YYYY");
    if (!dataNascimentoObj.isValid() || dataNascimentoObj.isAfter(dayjs())) {
      return "Data de Nascimento inválida ou futura.";
    }
  }

  if (celular && (cleanedCelular.length < 10 || cleanedCelular.length > 11)) {
    return "O número de celular está incompleto.";
  }

  if (cep && cleanedCep.length !== 8) {
    return "O CEP deve conter 8 dígitos.";
  }

  if (cep) {
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanedCep}/json/`
      );
      const data = await response.json();
      if (data.erro) return "CEP não encontrado.";
    } catch (error) {
      return "Erro ao validar o CEP. Verifique sua conexão.";
    }
  }

  let isDocValid = false;
  if (cleanedDoc.length === 11) isDocValid = validarCpf(cleanedDoc);
  else if (cleanedDoc.length === 14) isDocValid = validarCnpj(cleanedDoc);
  if (!isDocValid) return "O CPF ou CNPJ informado é inválido.";

  if (!isEmail(email)) return "O e-mail é inválido.";
  if (senha.length < 6 || senha.length > 100)
    return "A senha deve ter entre 6 e 100 caracteres.";
  if (!t_user) return "Por favor, selecione um tipo de usuário.";

  return null;
};
