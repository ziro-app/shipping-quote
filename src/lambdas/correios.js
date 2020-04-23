const middy = require('@middy/core');
const httpJsonBodyParser = require('@middy/http-json-body-parser');
const httpUrlencodeBodyParser = require('@middy/http-urlencode-body-parser');
const httpErrorHandler = require('@middy/http-error-handler');
const createError = require('http-errors');
const axios = require('axios');
//const bodyCorreios = require('../utils/bodyCorreios');
const axiosConfigCorreios = require('../utils/axiosConfigCorreios');
const AxiosPlugin = require('vue-axios-cors');
const convert = require('xml-js')
require('dotenv').config()




const correios = async event => {

	try {
		if (
			event.httpMethod === 'OPTIONS'
		) {
			return {
				statusCode: 200,
				headers: {
					'access-control-allow-origin': '*',
					'Access-Control-Allow-Headers': '*'
				},
				body: 'ok'
			}
		}
		const dadosHtml = JSON.parse(event.body);
		const newBodyCorreios = {

			nCdEmpresa: " ",
			sDsSenha: " ",
			nCdServico: "04014",
			sCepOrigem: '01123010',
			sCepDestino: dadosHtml.cepDestino,
			nVlPeso: dadosHtml.peso,
			nCdFormato: "3",
			nVlComprimento: dadosHtml.comprimento,
			nVlAltura: dadosHtml.altura,
			nVlLargura: dadosHtml.largura,
			nVlDiametro: "2",
			sCdMaoPropria: "S",
			nVlValorDeclarado: dadosHtml.valorDeclarado,
			sCdAvisoRecebimento: "S"

		}
	

		const frete = await axios.post(`http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx/CalcPrecoPrazo`,
			newBodyCorreios, axiosConfigCorreios)
		const correios = convert.xml2json(frete.data, { compact: true, spaces: 4 });
		module.exports ={correios}

		return {
			statusCode: 200,
			headers: {
				'access-control-allow-origin': '*',
				'Access-Control-Allow-Headers': '*',
				'Content-Type': 'application/json'
			},
			body: correios,

		}
	} catch (error) {
		console.log(error)
		throw createError(500, error)
	}
}

const handler = middy(correios)
	.use(httpJsonBodyParser())
	.use(httpUrlencodeBodyParser())
	.use(httpErrorHandler())

module.exports = { handler }