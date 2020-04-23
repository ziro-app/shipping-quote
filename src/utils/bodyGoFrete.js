const goFrete = require('../utils/axiosConfigGoFrete')

module.exports = ({
    Produtos:[{
      peso: 10,
      altura: 400,
      largura: 340,
      comprimento: 600,
      valor: 10
    }],
    Origem: {
      logradouro: "",
      numero: "7",
      complemento: "",
      bairro: "",
      referencia: "",
      cep: "01123010"
    },
    Destino: {
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      referencia: "",
      cep: "59950971"
    },
    Token: goFrete
  })